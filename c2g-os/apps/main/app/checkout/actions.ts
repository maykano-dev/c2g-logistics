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
  
  // Format items for the DB
  const items = orderData.items.map((item: any) => ({
    ...item,
    price: item.priceGhs,
    price_cny: item.priceCny,
    variant_id: item.variantId,
    product_id: item.productId,
    image_url: item.imageUrl,
    selectedOptions: item.combination,
  }));

  const orderPayload = {
    customer_id: userId,
    customer_name: orderData.shippingName,
    customer_phone: orderData.shippingPhone,
    customer_email: userEmail,
    shipping_address: orderData.shippingAddress,
    shipping_notes: orderData.shippingNotes || "",
    shipping_method: orderData.shippingMethod || "sea",
    items: items,
    subtotal: orderData.subtotal,
    service_fee: orderData.serviceFee || 0,
    shipping_cost: orderData.shippingCost || 0,
    total_amount: orderData.totalAmount,
    rate_at_purchase: orderData.exchangeRate,
    payment_status: 'pending',
    order_status: 'pending_payment',
    payment_reference: orderData.reference,
    payment_gateway: orderData.paymentGateway || 'paystack'
  };

  const { data, error } = await supabase
    .from("ecom_orders")
    .insert([orderPayload])
    .select("id")
    .single();

  if (error) {
    console.error("Error creating ecom order:", error);
    return { success: false, error: error.message };
  }

  // Generate order ID formatted (MALL-XXXX)
  const orderId = data.id;
  const idStr = String(orderId).replace(/-/g, '');
  const last4 = idStr.slice(-4);
  const orderIdFormatted = `MALL-${last4.toUpperCase()}`;

  await supabase
    .from("ecom_orders")
    .update({ order_id: orderIdFormatted })
    .eq("id", orderId);

  // Attempt to decrement stock (ignore errors if it fails to not block checkout)
  for (const item of items) {
    if (item.variant_id) {
      await supabase.rpc('decrement_variant_stock', {
        variant_id_to_update: item.variant_id,
        decrement_qty: item.quantity
      });
    } else {
      await supabase.rpc('decrement_product_stock', {
        product_id_to_update: item.product_id,
        decrement_qty: item.quantity
      });
    }
  }

  return { success: true, orderId: orderIdFormatted, id: orderId };
}
