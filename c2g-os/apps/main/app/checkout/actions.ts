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

export type SupplierFreightGroup = {
  sellerName: string;
  displayName: string; // Truncated for UI
  items: any[];
  freightCny: number;
  freightGhs: number;
  freightFailed: boolean;
  isSuspicious: boolean;
  itemSubtotalGhs: number;
  errorMessage?: string;
};

export async function getCartFreightEstimate(items: any[]) {
  try {
    const supabase = await createClient();
    const { data: warehouseData } = await supabase
      .from('warehouse_addresses')
      .select('name, phone, address, province, city, district')
      .eq('is_default', true)
      .single();

    // Fetch exchange rate and min local delivery fee
    const { data: settings } = await supabase
      .from('settings')
      .select('exchange_rate_ghs_to_cny, minimum_local_delivery_fee')
      .single();
    const exchangeRate = settings?.exchange_rate_ghs_to_cny || 0.52;
    const minLocalDeliveryFee = settings?.minimum_local_delivery_fee ? parseFloat(settings.minimum_local_delivery_fee) : 7;

    if (!items || items.length === 0) return { success: true, supplierGroups: [], totalFreightGhs: 0, totalFreightCny: 0 };

    const { estimateFreight, getProductDetail } = await import('@/lib/hiobuy');
    
    const sellerGroups: Record<string, { items: any[], lines: any[] }> = {};
    
    // Use Promise.all to fetch missing seller names concurrently (it hits Next.js cache so it's fast)
    await Promise.all(items.map(async (i) => {
      let sellerName = i.sellerName;
      
      // Fallback: If it's an old cart item missing the sellerName, fetch it (this is cached!)
      if (!sellerName) {
        try {
          const detail = await getProductDetail({ channel: (i.channel || "1688") as any, id: i.productId });
          if (detail?.product?.seller_name) {
            sellerName = detail.product.seller_name;
          }
        } catch (e) {
          console.warn(`Could not fetch seller for product ${i.productId}`);
        }
      }
      
      // Ultimate fallback if API fails or doesn't have it
      if (!sellerName) {
        sellerName = `Supplier_${i.productId.substring(0, 6)}`;
      }

      const finalSellerName = sellerName as string;

      if (!sellerGroups[finalSellerName]) {
        sellerGroups[finalSellerName] = { items: [], lines: [] };
      }
      
      sellerGroups[finalSellerName].items.push(i);
      sellerGroups[finalSellerName].lines.push({
        id: i.productId,
        quantity: i.quantity,
        ...(i.variantId && i.variantId !== 'default' ? { spec_id: String(i.variantId) } : {})
      });
    }));

    const receiver = {
      name: warehouseData?.name || "C2G Warehouse",
      mobile: warehouseData?.phone || "13800138000",
      address: warehouseData?.address || "白云区",
      province: warehouseData?.province || "广东省",
      city: warehouseData?.city || "广州市",
      district: warehouseData?.district || "白云区"
    };

    // Calculate freight for each seller's group sequentially to avoid hitting rate limits or ECONNRESET
    const supplierGroups: SupplierFreightGroup[] = [];
    
    for (const [sellerName, group] of Object.entries(sellerGroups)) {
      // Calculate item subtotal in GHS for this group
      const itemSubtotalGhs = group.items.reduce((sum: number, item: any) => sum + (item.priceGhs * item.quantity), 0);

      // Clean up seller name for display (remove Supplier_ prefix if we want, or just format it nicely)
      const displaySeller = sellerName.replace('Supplier_', 'Supplier ');
      const displayName = displaySeller.length > 15 ? displaySeller.slice(0, 15) + '...' : displaySeller;

      try {
        const res = await estimateFreight({
          channel: group.items[0]?.channel || "1688",
          receiver,
          lines: group.lines
        });

        if (res.estimate?.freight?.amount !== undefined) {
          let freightCny = res.estimate.freight.amount;
          
          // CNY_minor normalization: HioBuy returns cents, divide by 100 to get Yuan
          if (res.monetary_unit === 'CNY_minor' || freightCny >= 100) {
            freightCny = freightCny / 100;
          }

          // Convert to GHS with 5% buffer, floored to minLocalDeliveryFee
          const rawFreightGhs = (freightCny / exchangeRate) * 1.05;
          const freightGhs = Math.max(rawFreightGhs, minLocalDeliveryFee);

          // Bait-and-switch detection: shipping > 50% of item value, BUT ignore if it's just the minimum fee
          const isSuspicious = freightGhs > minLocalDeliveryFee && freightGhs > itemSubtotalGhs * 0.5;

          supplierGroups.push({
            sellerName,
            displayName,
            items: group.items,
            freightCny,
            freightGhs,
            freightFailed: false,
            isSuspicious,
            itemSubtotalGhs,
          });
        } else {
          // API returned but no shipping data
          supplierGroups.push({
            sellerName,
            displayName,
            items: group.items,
            freightCny: 0,
            freightGhs: 0,
            freightFailed: true,
            isSuspicious: false,
            itemSubtotalGhs,
          });
        }
      } catch (err: any) {
        console.error(`Freight estimate failed for seller ${sellerName}:`, err);
        supplierGroups.push({
          sellerName,
          displayName,
          items: group.items,
          freightCny: 0,
          freightGhs: minLocalDeliveryFee,
          freightFailed: false,
          isSuspicious: false,
          itemSubtotalGhs,
          errorMessage: err.message || String(err),
        });
      }
    }

    const totalFreightGhs = supplierGroups.reduce((sum, g) => sum + g.freightGhs, 0);
    const totalFreightCny = supplierGroups.reduce((sum, g) => sum + g.freightCny, 0);
    const hasFailures = supplierGroups.some(g => g.freightFailed);

    return { 
      success: !hasFailures, 
      supplierGroups, 
      totalFreightGhs, 
      totalFreightCny,
      ...(hasFailures ? { error: "Failed to estimate freight for some suppliers" } : {})
    };
    
  } catch (error: any) {
    console.error("Freight estimate error:", error);
    return { success: false, supplierGroups: [], totalFreightGhs: 0, totalFreightCny: 0, error: "Error calculating freight estimate" };
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
  const supplierGroups = validatedData.supplierGroups || [];

  // If no supplier groups provided, fall back to single-order mode (backwards compatibility)
  if (!supplierGroups.length) {
    // Build a single group from flat items
    supplierGroups.push({
      sellerName: 'default',
      items: validatedData.items,
      shippingCost: validatedData.shippingCost || 0,
    });
  }

  const checkoutGroupId = crypto.randomUUID();
  const reference = validatedData.reference || `C2G_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const paymentGateway = validatedData.paymentGateway || 'hubtel';
  const isPaidByWallet = paymentGateway === 'wallet';

  // Calculate the grand total across all supplier groups
  let grandSubtotal = 0;
  let grandTotalCostCny = 0;
  let grandShipping = 0;
  let grandServiceFee = validatedData.serviceFee || 0;

  const orderPayloads: any[] = [];

  for (const group of supplierGroups) {
    let groupSubtotal = 0;
    let groupCostCny = 0;

    const items = (group.items || []).map((item: any) => {
      groupSubtotal += (item.priceGhs * item.quantity);
      groupCostCny += (item.priceCny * item.quantity);

      return {
        name: item.name,
        price: item.priceGhs,
        price_cny: item.priceCny,
        cost_price_ghs: item.priceCny / exchangeRate,
        variant_id: 0,
        spec_id: item.variantId,
        product_id: item.productId,
        image_url: item.imageUrl,
        selectedOptions: item.combination,
        quantity: item.quantity,
        channel: item.channel || '1688',
      };
    });

    const groupCostGhs = groupCostCny / exchangeRate;
    const groupShipping = group.shippingCost || 0;
    
    // Distribute service fee proportionally based on subtotal share
    const totalItemsSubtotal = supplierGroups.reduce((sum: number, g: any) => {
      return sum + (g.items || []).reduce((s: number, i: any) => s + (i.priceGhs * i.quantity), 0);
    }, 0);
    const groupServiceFee = totalItemsSubtotal > 0 
      ? grandServiceFee * (groupSubtotal / totalItemsSubtotal) 
      : 0;

    const groupTotal = groupSubtotal + groupShipping + groupServiceFee;
    const groupProfit = (groupSubtotal - groupCostGhs) + groupServiceFee;

    grandSubtotal += groupSubtotal;
    grandTotalCostCny += groupCostCny;
    grandShipping += groupShipping;

    orderPayloads.push({
      customer_id: userId,
      customer_name: validatedData.shippingName,
      customer_phone: validatedData.shippingPhone,
      customer_email: userEmail,
      shipping_address: validatedData.shippingAddress,
      shipping_notes: validatedData.shippingNotes || "",
      shipping_method: validatedData.shippingMethod || "pending",
      items: items,
      subtotal: groupSubtotal,
      service_fee: groupServiceFee,
      shipping_cost: groupShipping,
      total_amount: groupTotal,
      total_cost_ghs: groupCostGhs,
      total_profit_ghs: groupProfit,
      importer_id: null,
      rate_at_purchase: exchangeRate,
      snapshot_price_usd: groupCostCny,
      snapshot_exchange_rate: exchangeRate,
      payment_status: isPaidByWallet ? 'paid' : 'pending',
      order_status: isPaidByWallet ? 'processing' : 'pending_payment',
      payment_reference: reference,
      payment_gateway: paymentGateway,
      checkout_group_id: supplierGroups.length > 1 ? checkoutGroupId : null,
      seller_name: group.sellerName || null,
    });
  }

  const grandTotal = validatedData.totalAmount || (grandSubtotal + grandShipping + grandServiceFee);

  // Deduct from wallet ONCE for the grand total (before creating orders, so we can abort if insufficient)
  if (isPaidByWallet) {
    const deductRes = await deductFromWallet(grandTotal, 'mall_order', `Payment for Mall Order (${supplierGroups.length} supplier${supplierGroups.length > 1 ? 's' : ''})`, undefined);
    
    if (!deductRes.success) {
      return { success: false, error: deductRes.error || "Wallet deduction failed" };
    }
  }

  // Create all orders in the database
  const createdOrders: Array<{ id: string, orderIdFormatted: string, items: any[] }> = [];

  for (const payload of orderPayloads) {
    const { data: ecomOrder, error } = await supabase
      .from("ecom_orders")
      .insert([payload])
      .select("id")
      .single();

    if (error) {
      secureLog("Error creating ecom order", { error: error.message, payload });
      // If we already deducted wallet, this is a critical failure
      // The orders that did succeed will still exist. Admin can handle manually.
      continue;
    }
    
    const createdOrderId = ecomOrder.id;
    const idStr = String(createdOrderId).replace(/-/g, '');
    const last4 = idStr.slice(-4);
    const orderIdFormatted = `MALL-${last4.toUpperCase()}`;
    
    await supabase
      .from("ecom_orders")
      .update({ order_id: orderIdFormatted })
      .eq("id", createdOrderId);

    createdOrders.push({ id: createdOrderId, orderIdFormatted, items: payload.items });

    // Queue procurement job
    if (isPaidByWallet) {
      const { error: jobError } = await supabase.from('procurement_jobs').insert({
        ecom_order_id: createdOrderId,
        status: 'pending_approval'
      });
      if (jobError) {
        console.error("Failed to insert procurement job:", jobError);
      }
    }
  }

  if (createdOrders.length === 0) {
    return { success: false, error: "Failed to create any orders. Please contact support." };
  }

  // Fire off HioBuy order creation for each supplier order (if wallet-paid)
  if (isPaidByWallet) {
    const { data: warehouseData } = await supabase
      .from('warehouse_addresses')
      .select('name, address, phone')
      .eq('is_default', true)
      .single();

    for (const order of createdOrders) {
      try {
        const lines = order.items.map((i: any) => {
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
          channel: (order.items[0] as any)?.channel || "1688",
          external_order_id: order.orderIdFormatted,
          receiver: {
            name: warehouseData?.name || "C2G Warehouse",
            mobile: warehouseData?.phone || "13800138000",
            province: "Guangdong",
            city: "Guangzhou",
            district: "Baiyun District",
            address: warehouseData?.address || "Guangzhou Baiyun"
          },
          lines: lines
        });
        
        secureLog("Hiobuy order created via API", hiobuyOrderRes);
        
        if (hiobuyOrderRes?.order_id) {
          await supabase.from('procurement_jobs')
            .update({
              outer_purchase_id: hiobuyOrderRes.order_id,
              status: 'pending_payment'
            })
            .eq('ecom_order_id', order.id);
        }
      } catch (err) {
        console.error(`Failed to create Hiobuy order for ${order.orderIdFormatted}:`, err);
      }
    }
  }

  // Create notification(s)
  try {
    const { createNotification } = await import('@/utils/notifications');
    const orderIds = createdOrders.map(o => o.orderIdFormatted).join(', ');
    await createNotification({
      userId: userId,
      title: createdOrders.length > 1 ? 'Orders Placed Successfully' : 'Order Placed Successfully',
      message: isPaidByWallet 
        ? `Your mall order${createdOrders.length > 1 ? 's' : ''} ${orderIds} ${createdOrders.length > 1 ? 'have' : 'has'} been placed and paid successfully.` 
        : `Your mall order${createdOrders.length > 1 ? 's' : ''} ${orderIds} ${createdOrders.length > 1 ? 'have' : 'has'} been placed and ${createdOrders.length > 1 ? 'are' : 'is'} pending payment.`,
      type: 'ecom_order_created',
      priority: isPaidByWallet ? 'important' : 'info',
      link: createdOrders.length === 1 ? `/dashboard/orders/mall/${createdOrders[0]?.id}` : `/dashboard/mall-orders`
    });
  } catch(e) {
    console.warn('Failed to dispatch notification:', e);
  }

  return { 
    success: true, 
    orderId: createdOrders[0]?.orderIdFormatted, 
    id: createdOrders[0]?.id,
    allOrders: createdOrders.map(o => ({ id: o.id, orderId: o.orderIdFormatted })),
    orderCount: createdOrders.length,
  };
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
