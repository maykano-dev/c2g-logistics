"use server";

import { createClient } from "@/utils/supabase/server";
import { CheckoutSchema } from "@/utils/security-schemas";
import { secureLog } from "@/utils/logger";
import { deductFromWallet } from "../dashboard/wallet/actions";
import { alibabaRequest } from "@/lib/alibaba/client";

export async function verifyCartInventory(items: any[]) {
  // Check live inventory on Alibaba for each item in parallel
  try {
    const checks = items.map(async (item) => {
      if (!item.productId) return { item, inStock: false };
      
      const payload = JSON.stringify({ product_id: item.productId });
      const res = await alibabaRequest({
        apiPath: '/eco/buyer/product/description',
        params: { query_req: payload }
      });
      
      const rawProduct = res?.result?.result_data;
      if (!rawProduct) return { item, inStock: false };

      // If variant was selected, check variant stock
      if (item.variantId) {
        const sku = (rawProduct.skus || []).find((s: any) => String(s.sku_id) === String(item.variantId));
        return { item, inStock: !!sku }; // Dropshipping usually means unlimited stock if SKU exists
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
      ...item,
      price: item.priceGhs,
      price_cny: item.priceCny,
      cost_price_ghs: item.priceCny * exchangeRate,
      variant_id: item.variantId,
      product_id: item.productId,
      image_url: item.imageUrl,
      selectedOptions: item.combination,
    };
  });

  const totalCostGhs = totalCostUsd * exchangeRate;
  const totalProfitGhs = subtotal - totalCostGhs;

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
