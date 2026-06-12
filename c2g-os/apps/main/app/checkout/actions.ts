"use server";

import { createClient } from "@/utils/supabase/server";

export async function createEcomOrder(orderData: any) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, error: "You must be logged in to place an order." };
  }

  const userId = userData.user.id;
  const userEmail = userData.user.email;
  
  // 1. Fetch fresh product data to get cost and importer info
  const productIds = orderData.items.map((item: any) => item.productId);
  const { data: products } = await supabase
    .from("products")
    .select("id, importer_id, cost_price_cny")
    .in("id", productIds);

  const productMap = new Map();
  products?.forEach(p => productMap.set(p.id, p));

  // 2. Group items by importer_id
  const itemsByImporter = new Map<string | null, any[]>();
  
  for (const item of orderData.items) {
    const productInfo = productMap.get(item.productId) || {};
    const importerId = productInfo.importer_id || null;
    
    // Calculate costs dynamically to prevent client spoofing
    const costPriceCny = productInfo.cost_price_cny || item.priceCny;
    const costPriceGhs = costPriceCny / orderData.exchangeRate;
    
    const enrichedItem = {
      ...item,
      price: item.priceGhs,
      price_cny: item.priceCny,
      cost_price_ghs: costPriceGhs,
      variant_id: item.variantId,
      product_id: item.productId,
      image_url: item.imageUrl,
      selectedOptions: item.combination,
    };

    if (!itemsByImporter.has(importerId)) itemsByImporter.set(importerId, []);
    itemsByImporter.get(importerId)?.push(enrichedItem);
  }

  const createdOrderIds = [];

  // 3. Create an order per importer
  for (const [importerId, items] of Array.from(itemsByImporter.entries())) {
    // Recalculate totals for this specific group
    const subtotal = items.reduce((sum, item) => sum + (item.priceGhs * item.quantity), 0);
    const totalCostGhs = items.reduce((sum, item) => sum + (item.cost_price_ghs * item.quantity), 0);
    const totalProfitGhs = subtotal - totalCostGhs;

    // Prorate shipping/service fee (simple split for now if multiple orders)
    const splitRatio = subtotal / orderData.subtotal;
    const proratedShipping = (orderData.shippingCost || 0) * splitRatio;
    const proratedService = (orderData.serviceFee || 0) * splitRatio;
    const totalAmount = subtotal + proratedShipping + proratedService;

    const orderPayload = {
      customer_id: userId,
      customer_name: orderData.shippingName,
      customer_phone: orderData.shippingPhone,
      customer_email: userEmail,
      shipping_address: orderData.shippingAddress,
      shipping_notes: orderData.shippingNotes || "",
      shipping_method: orderData.shippingMethod || "sea",
      items: items,
      subtotal: subtotal,
      service_fee: proratedService,
      shipping_cost: proratedShipping,
      total_amount: totalAmount,
      total_cost_ghs: totalCostGhs,
      total_profit_ghs: totalProfitGhs,
      importer_id: importerId,
      rate_at_purchase: orderData.exchangeRate,
      payment_status: 'pending',
      order_status: 'pending_payment',
      payment_reference: orderData.reference,
      payment_gateway: orderData.paymentGateway || 'hubtel'
    };

    const { data, error } = await supabase
      .from("ecom_orders")
      .insert([orderPayload])
      .select("id")
      .single();

    if (error) {
      console.error("Error creating ecom order split:", error);
      return { success: false, error: error.message };
    }
    
    createdOrderIds.push(data.id);
  }

  // We return the primary created ID (or a combined string if we want)
  // For the payment reference, the webhook will update ALL orders with this reference.
  for (const pid of createdOrderIds) {
    const idStr = String(pid).replace(/-/g, '');
    const last4 = idStr.slice(-4);
    const orderIdFormatted = `MALL-${last4.toUpperCase()}`;
    await supabase
      .from("ecom_orders")
      .update({ order_id: orderIdFormatted })
      .eq("id", pid);
  }

  // Attempt to decrement stock (ignore errors if it fails to not block checkout)
  for (const item of orderData.items) {
    if (item.variantId) {
      await supabase.rpc('decrement_variant_stock', {
        variant_id_to_update: item.variantId,
        decrement_qty: item.quantity
      });
    } else {
      await supabase.rpc('decrement_product_stock', {
        product_id_to_update: item.productId,
        decrement_qty: item.quantity
      });
    }
  }

  const primaryId = createdOrderIds[0];
  const primaryIdStr = String(primaryId).replace(/-/g, '');
  const primaryOrderIdFormatted = `MALL-${primaryIdStr.slice(-4).toUpperCase()}`;

  return { success: true, orderId: primaryOrderIdFormatted, id: primaryId };
}
