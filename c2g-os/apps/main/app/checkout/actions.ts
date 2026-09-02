"use server";

import { createClient } from "@/utils/supabase/server";
import { CheckoutSchema } from "@/utils/security-schemas";
import { secureLog } from "@/utils/logger";
import { deductFromWallet } from "../dashboard/wallet/actions";
import { getProductDetail } from "@/lib/hiobuy";
import { createOrder } from "@/lib/hiobuy/procurement";

export async function verifyCartInventory(items: any[]) {
  // Check live inventory on Alibaba for each item in parallel
  try {
    const checks = items.map(async (item) => {
      if (!item.productId) return { item, inStock: false };
      
      const res = await getProductDetail({
        channel: "1688",
        id: item.productId
      }).catch(() => null);
      
      const rawProduct = res?.product;
      if (!rawProduct) return { item, inStock: false };

      // If variant was selected, check variant stock via SKU list
      if (item.variantId && item.variantId !== "default") {
        const skus = rawProduct.variants || [];
        const sku = skus.find((s: any) => String(s.sku_id) === String(item.variantId));
        return { item, inStock: !!sku && (sku.stock === undefined || sku.stock > 0) };
      }
      
      return { item, inStock: true };
    });

    const results = await Promise.all(checks);
    const outOfStock = results.filter(r => !r.inStock).map(r => r.item.name);
    
    if (outOfStock.length > 0) {
      return { success: false, outOfStock };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Live inventory check failed:", error);
    return { success: false, error: "Failed to verify live inventory. Please try again." };
  }
}

export async function getCartFreightEstimate(items: any[]) {
  try {
    const supabase = await createClient();
    const { data: warehouseData } = await supabase
      .from('warehouse_addresses')
      .select('name, phone, address, province, city, district')
      .eq('is_default', true)
      .single();

    // Fetch exchange rate to convert CNY to GHS for the frontend
    const { data: settings } = await supabase
      .from('settings')
      .select('exchange_rate_ghs_to_cny')
      .single();
    const exchangeRate = settings?.exchange_rate_ghs_to_cny || 0.52;

    const lines = items.map(i => ({
      id: i.productId,
      quantity: i.quantity,
      ...(i.variantId && i.variantId !== 'default' ? { spec_id: String(i.variantId) } : {})
    }));

    if (lines.length === 0) return { success: true, freightCny: 0 };

    const { estimateFreight } = await import('@/lib/hiobuy');
    const res = await estimateFreight({
      channel: "1688",
      receiver: {
        name: warehouseData?.name || "C2G Warehouse",
        mobile: warehouseData?.phone || "13800138000",
        address: warehouseData?.address || "Guangzhou Baiyun",
        province: warehouseData?.province || "Guangdong",
        city: warehouseData?.city || "Guangzhou",
        district: warehouseData?.district || "Baiyun District"
      },
      lines
    });

    if (res.success && res.total?.shipping?.amount !== undefined) {
      // Apply the 5% buffer as requested
      const bufferedFreightCny = res.total.shipping.amount * 1.05;
      const freightGhs = bufferedFreightCny / exchangeRate;
      return { success: true, freightCny: bufferedFreightCny, freightGhs };
    }

    return { success: false, error: "Failed to fetch freight estimate from HioBuy" };
  } catch (error: any) {
    console.error("Freight estimate error:", error);
    return { success: false, error: "Error calculating freight estimate" };
  }
}

export async function createEcomOrder(orderData: any) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, error: "You must be logged in to place an order." };
  }

  const userId = userData.user.id;
  const userEmail = userData.user.email;
  
  const validation = CheckoutSchema.safeParse(orderData);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || 'Validation failed' };
  }

  const validatedData = validation.data;
  const exchangeRate = validatedData.exchangeRate || 1;

  // 1. Map items exactly as they came from cart
  // (We rely on Admin Manual Procurement verification to catch client price tampering)
  let subtotal = 0;
  let totalCostUsd = 0;

  const items = validatedData.items.map((item: any) => {
    // Security: Recalculate totals based on item payload
    subtotal += (item.priceGhs * item.quantity);
    totalCostUsd += (item.priceCny * item.quantity); // priceCny stores the USD price for Alibaba items

    return {
      name: item.name,        // Snapshot the product name permanently
      price: item.priceGhs,
      price_cny: item.priceCny,
      cost_price_ghs: item.priceCny * exchangeRate,
      variant_id: 0, // Passed as integer to satisfy legacy database triggers on ecom_orders
      spec_id: item.variantId, // Actual MD5 hash or string variant ID stored here
      product_id: item.productId,
      image_url: item.imageUrl,  // Snapshot the image permanently
      selectedOptions: item.combination,
      quantity: item.quantity,
    };
  });

  const totalCostGhs = totalCostUsd * exchangeRate;
  
  console.log("=== CREATING ECOM ORDER ===");
  console.log("Items payload:", JSON.stringify(items, null, 2));
  
  const totalProfitGhs = (subtotal - totalCostGhs) + (validatedData.serviceFee || 0);


  const totalAmount = subtotal + (validatedData.shippingCost || 0) + (validatedData.serviceFee || 0);

  const orderPayload = {
    customer_id: userId,
    customer_name: validatedData.shippingName,
    customer_phone: validatedData.shippingPhone,
    customer_email: userEmail,
    shipping_address: validatedData.shippingAddress,
    shipping_notes: validatedData.shippingNotes || "",
    shipping_method: validatedData.shippingMethod || "sea",
    items: items,
    subtotal: subtotal,
    service_fee: validatedData.serviceFee || 0,
    shipping_cost: validatedData.shippingCost || 0,
    total_amount: totalAmount,
    total_cost_ghs: totalCostGhs,
    total_profit_ghs: totalProfitGhs,
    importer_id: null, // C2G is the importer for Alibaba Gateway
    rate_at_purchase: exchangeRate,
    snapshot_price_usd: totalCostUsd, // Save the snapshot
    snapshot_exchange_rate: exchangeRate,
    payment_status: validatedData.paymentGateway === 'wallet' ? 'paid' : 'pending',
    order_status: validatedData.paymentGateway === 'wallet' ? 'processing' : 'pending_payment',
    payment_reference: validatedData.reference,
    payment_gateway: validatedData.paymentGateway || 'hubtel'
  };

  const { data: ecomOrder, error } = await supabase
    .from("ecom_orders")
    .insert([orderPayload])
    .select("id")
    .single();

  if (error) {
    secureLog("Error creating ecom order", { error: error.message, payload: orderPayload });
    return { success: false, error: error.message };
  }
  
  const createdOrderId = ecomOrder.id;

  // 2. Format human readable ID
  const idStr = String(createdOrderId).replace(/-/g, '');
  const last4 = idStr.slice(-4);
  const orderIdFormatted = `MALL-${last4.toUpperCase()}`;
  
  await supabase
    .from("ecom_orders")
    .update({ order_id: orderIdFormatted })
    .eq("id", createdOrderId);

  // 3. Queue the Procurement Job! (The Safety Net)
  if (validatedData.paymentGateway === 'wallet') {
    // If paid by wallet, it's instantly ready for admin approval
    const { error: jobError } = await supabase.from('procurement_jobs').insert({
      ecom_order_id: createdOrderId,
      status: 'pending_approval'
    });
    if (jobError) {
      console.error("Failed to insert procurement job:", jobError);
    }
  }
  // (If paid by Hubtel, the webhook will insert the procurement_job when payment succeeds)

  // 4. Deduct from wallet if using wallet
  if (validatedData.paymentGateway === 'wallet') {
    const deductRes = await deductFromWallet(totalAmount, 'mall_order', `Payment for Mall Order ${orderIdFormatted}`, createdOrderId);
    
    if (!deductRes.success) {
      await supabase.from("ecom_orders").delete().eq("id", createdOrderId);
      return { success: false, error: deductRes.error || "Wallet deduction failed" };
    }

    // 5. Automated Hiobuy Order Creation (Awaiting Payment state on 1688)
    try {
      const { data: warehouseData } = await supabase
        .from('warehouse_addresses')
        .select('name, address, phone')
        .eq('is_default', true)
        .single();

      const lines = items.map((i: any) => {
        const line: any = {
          id: i.product_id,
          quantity: i.quantity
        };
        if (i.spec_id && i.spec_id !== 'default' && i.spec_id !== 0) {
          line.spec_id = String(i.spec_id);
        }
        return line;
      });

      const hiobuyOrderRes = await createOrder({
        channel: (items[0] as any)?.channel || "1688",
        external_order_id: orderIdFormatted,
        receiver: {
          name: warehouseData?.name || "C2G Warehouse",
          mobile: warehouseData?.phone || "13800138000",
          province: "Guangdong",
          city: "Guangzhou",
          district: "Baiyun District", // Added: Required by HioBuy API when address_id is omitted
          address: warehouseData?.address || "Guangzhou Baiyun"
        },
        lines: lines
      });
      
      secureLog("Hiobuy order created via API", hiobuyOrderRes);
      
      // Update procurement job with outer_purchase_id if available
      if (hiobuyOrderRes?.order_id) {
        await supabase.from('procurement_jobs')
          .update({
            outer_purchase_id: hiobuyOrderRes.order_id,
            status: 'pending_payment' // Automatically moves it past 'pending_approval' if API succeeded
          })
          .eq('ecom_order_id', createdOrderId);
      }
    } catch (err) {
      console.error("Failed to automatically create Hiobuy order:", err);
      // Safe failure: The order is still in C2G DB and admin can retry from dashboard
    }
  }

  // Create notification
  try {
    const { createNotification } = await import('@/utils/notifications');
    const isWallet = validatedData.paymentGateway === 'wallet';
    await createNotification({
      userId: userId,
      title: 'Order Placed successfully',
      message: isWallet 
        ? `Your mall order #${orderIdFormatted} has been placed and paid successfully.` 
        : `Your mall order #${orderIdFormatted} has been placed and is pending payment.`,
      type: 'ecom_order_created',
      priority: isWallet ? 'important' : 'info',
      link: `/dashboard/orders/mall/${createdOrderId}`
    });
  } catch(e) {
    console.warn('Failed to dispatch notification:', e);
  }

  return { success: true, orderId: orderIdFormatted, id: createdOrderId };
}

export async function saveCheckoutAddress(addressData: { street_address: string; city: string; region: string; phone?: string; name?: string }) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { success: false, error: "Unauthorized" };

  const customerId = userData.user.id;

  // Check how many addresses exist
  const { data: existing, error: fetchError } = await supabase
    .from("customer_addresses")
    .select("id, is_primary")
    .eq("customer_id", customerId);

  if (fetchError) return { success: false, error: "Database error" };

  if (existing && existing.length >= 3) {
    return { success: false, error: "You can only save up to 3 addresses. Please delete one first." };
  }

  // Fetch customer details for required name/phone
  const { data: profile } = await supabase
    .from("customers")
    .select("name, phone, email")
    .eq("id", customerId)
    .single();

  const isFirst = !existing || existing.length === 0;

  // Insert new address
  const { error } = await supabase.from("customer_addresses").insert({
    customer_id: customerId,
    street_address: addressData.street_address,
    city: addressData.city,
    region: addressData.region,
    is_primary: isFirst, // Auto-primary if it's the first one
    name: addressData.name || profile?.name || userData.user.user_metadata?.full_name || "Customer",
    phone: addressData.phone || profile?.phone || userData.user.phone || "0000000000",
    email: profile?.email || userData.user.email
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateCheckoutAddress(id: string, addressData: { street_address: string; city: string; region: string; phone?: string; name?: string }) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { success: false, error: "Unauthorized" };

  const customerId = userData.user.id;

  const { error } = await supabase
    .from("customer_addresses")
    .update({
      street_address: addressData.street_address,
      city: addressData.city,
      region: addressData.region,
      name: addressData.name,
      phone: addressData.phone,
    })
    .eq("id", id)
    .eq("customer_id", customerId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function setPrimaryAddress(addressId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { success: false, error: "Unauthorized" };

  const customerId = userData.user.id;

  // Set all to false first
  await supabase
    .from("customer_addresses")
    .update({ is_primary: false })
    .eq("customer_id", customerId);

  // Set target to true
  const { error } = await supabase
    .from("customer_addresses")
    .update({ is_primary: true })
    .eq("id", addressId)
    .eq("customer_id", customerId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteAddress(addressId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase
    .from("customer_addresses")
    .delete()
    .eq("id", addressId)
    .eq("customer_id", userData.user.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
