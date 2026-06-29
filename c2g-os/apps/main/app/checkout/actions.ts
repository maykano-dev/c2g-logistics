"use server";

import { createClient } from "@/utils/supabase/server";
import { CheckoutSchema } from "@/utils/security-schemas";
import { secureLog } from "@/utils/logger";
import { deductFromWallet } from "../dashboard/wallet/actions";

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
  
  // 1. Fetch fresh product data to get cost and importer info
  const productIds = validatedData.items.map((item: any) => item.productId);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, importer_id, cost_price_cny, selling_price_ghs")
    .in("id", productIds);

  if (productsError) {
    secureLog("Error fetching products", { error: productsError, productIds });
  }

  const productMap = new Map();
  products?.forEach(p => productMap.set(String(p.id), p));

  const variantIds = validatedData.items.filter((i: any) => i.variantId).map((i: any) => i.variantId);
  const { data: variants, error: variantsError } = variantIds.length > 0 ? await supabase
    .from("product_variants")
    .select("id, cost_price_cny, selling_price_ghs")
    .in("id", variantIds) : { data: [], error: null };
    
  if (variantsError) {
    secureLog("Error fetching variants", { error: variantsError, variantIds });
  }
    
  const variantMap = new Map();
  variants?.forEach(v => variantMap.set(String(v.id), v));

  // 2. Group items by importer_id
  const itemsByImporter = new Map<string | null, any[]>();
  
  for (const item of validatedData.items) {
    const productInfo = productMap.get(String(item.productId));
    if (!productInfo) {
      return { success: false, error: `One or more items in your cart (ID: ${item.productId}) are no longer available in the store. Please remove them from your cart to proceed.` };
    }
    
    const importerId = productInfo.importer_id || null;
    
    // Server-side pricing enforcement
    let trueSellingPriceGhs = productInfo.selling_price_ghs || item.priceGhs || 0;
    let trueCostPriceCny = productInfo.cost_price_cny || item.priceCny || 0;

    if (item.variantId) {
      const variantInfo = variantMap.get(String(item.variantId));
      if (variantInfo) {
        if (variantInfo.selling_price_ghs) trueSellingPriceGhs = variantInfo.selling_price_ghs;
        if (variantInfo.cost_price_cny) trueCostPriceCny = variantInfo.cost_price_cny;
      }
    }

    const exchangeRate = validatedData.exchangeRate || 1;
    const costPriceGhs = trueCostPriceCny / exchangeRate;
    
    const enrichedItem = {
      ...item,
      price: trueSellingPriceGhs,
      price_cny: trueCostPriceCny,
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
    // Recalculate totals for this specific group securely
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalCostGhs = items.reduce((sum, item) => sum + (item.cost_price_ghs * item.quantity), 0);
    const totalProfitGhs = subtotal - totalCostGhs;

    // Prorate shipping/service fee
    const splitRatio = validatedData.subtotal ? (subtotal / validatedData.subtotal) : 1;
    const proratedShipping = (validatedData.shippingCost || 0) * splitRatio;
    const proratedService = (validatedData.serviceFee || 0) * splitRatio;
    const totalAmount = subtotal + proratedShipping + proratedService;

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
      service_fee: proratedService,
      shipping_cost: proratedShipping,
      total_amount: totalAmount,
      total_cost_ghs: totalCostGhs,
      total_profit_ghs: totalProfitGhs,
      importer_id: importerId,
      rate_at_purchase: validatedData.exchangeRate,
      payment_status: validatedData.paymentGateway === 'wallet' ? 'paid' : 'pending',
      order_status: validatedData.paymentGateway === 'wallet' ? 'processing' : 'pending_payment',
      payment_reference: validatedData.reference,
      payment_gateway: validatedData.paymentGateway || 'hubtel'
    };

    const { data, error } = await supabase
      .from("ecom_orders")
      .insert([orderPayload])
      .select("id")
      .single();

    if (error) {
      secureLog("Error creating ecom order split", { error: error.message, payload: orderPayload });
      return { success: false, error: error.message };
    }
    
    createdOrderIds.push(data.id);
  }

  // 4. Deduct from wallet if using wallet
  if (validatedData.paymentGateway === 'wallet') {
    const sumTotalAmount = (validatedData.subtotal || 0) + (validatedData.shippingCost || 0) + (validatedData.serviceFee || 0);
    const deductRes = await deductFromWallet(sumTotalAmount, 'mall_order', `Payment for Mall Order ${validatedData.reference}`, createdOrderIds[0]);
    
    if (!deductRes.success) {
      // Revert orders if deduction failed
      for (const pid of createdOrderIds) {
        await supabase.from("ecom_orders").delete().eq("id", pid);
      }
      return { success: false, error: deductRes.error || "Wallet deduction failed" };
    }
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
  for (const item of validatedData.items) {
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

  // Create notification reliably
  try {
    const { createNotification } = await import('@/utils/notifications');
    const isWallet = validatedData.paymentGateway === 'wallet';
    await createNotification({
      userId: userId,
      title: 'Order Placed successfully',
      message: isWallet 
        ? `Your mall order #${primaryOrderIdFormatted} has been placed and paid successfully from your wallet.` 
        : `Your mall order #${primaryOrderIdFormatted} has been placed and is pending payment.`,
      type: 'ecom_order_created',
      priority: isWallet ? 'important' : 'info',
      link: `/dashboard/orders/mall/${primaryId}`
    });
  } catch(e) {
    console.warn('Failed to dispatch notification:', e);
  }

  return { success: true, orderId: primaryOrderIdFormatted, id: primaryId };
}
