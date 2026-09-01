import { createClient } from "@/utils/supabase/server";
import { alibabaRequest } from "./client";
import { secureLog } from "@/utils/logger";
import { createBuyNowOrder } from "./api";

export async function procureOrder(jobId: string) {
  const supabase = await createClient();

  // 1. Fetch the Job and related Order
  const { data: job, error: jobError } = await supabase
    .from("procurement_jobs")
    .select("*, ecom_orders(*)")
    .eq("id", jobId)
    .single();

  if (jobError || !job) {
    return { success: false, error: "Procurement job not found" };
  }

  const order = job.ecom_orders;
  if (!order) {
    return { success: false, error: "Associated order not found" };
  }

  // 2. Map Items to Alibaba Product List
  // We expect order.items to be the JSONB array we saved during checkout
  const productList = (order.items || []).map((item: any) => ({
    product_id: item.product_id,
    sku_id: item.spec_id || (item.variant_id && item.variant_id !== 0 ? item.variant_id : undefined),
    quantity: item.quantity
  }));

  // 3. Map Shipping Address to Alibaba Logistics Detail
  // Extract details from string or assume it's pre-formatted.
  // In a real production app, address parsing might be needed if it's a single string.
  const logisticsDetail = {
    address: order.shipping_address,
    city: "Accra", // Defaulting for C2G if not parsed
    country: "GH",
    contact_person: order.customer_name,
    mobile: order.customer_phone
  };

  const payload = {
    channel_refer_id: order.id,
    product_list: productList,
    logistics_detail: logisticsDetail,
    remark: `C2G Mall Order: ${order.order_id}`,
    properties: "C2G Logistics"
  };

  try {
    // 4. Create the Dropshipping BuyNow order using the new SDK wrapper
    const response = await createBuyNowOrder({
      channel_refer_id: payload.channel_refer_id,
      product_list: payload.product_list,
      logistics_detail: payload.logistics_detail,
      remark: payload.remark,
      properties: payload.properties
    });

    // 5. Handle Response
    if (response?.result?.value?.order_id) {
      const alibabaOrderId = response.result.value.order_id;
      
      // Update Job
      await supabase
        .from("procurement_jobs")
        .update({ status: 'procured', error_log: null })
        .eq("id", jobId);
      
      // Update Order
      await supabase
        .from("ecom_orders")
        .update({ 
          alibaba_trade_id: alibabaOrderId, 
          alibaba_pay_status: 'unpaid',
          order_status: 'procuring'
        })
        .eq("id", order.id);

      return { success: true, alibabaOrderId };
    } else {
      const errorMsg = response?.result?.error_msg || "Unknown API Error";
      await supabase
        .from("procurement_jobs")
        .update({ 
          status: 'failed', 
          error_log: errorMsg,
          attempts: job.attempts + 1 
        })
        .eq("id", jobId);

      return { success: false, error: errorMsg };
    }
  } catch (error: any) {
    secureLog("Procurement Execution Failed", { error: error.message, jobId });
    
    await supabase
      .from("procurement_jobs")
      .update({ 
        status: 'failed', 
        error_log: error.message,
        attempts: job.attempts + 1 
      })
      .eq("id", jobId);

    return { success: false, error: error.message };
  }
}
