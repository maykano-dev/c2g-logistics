import { createClient } from "@/utils/supabase/server";
import { aliexpressRequest } from "./client";
import { secureLog } from "@/utils/logger";

/**
 * Procures an order on AliExpress Dropshipping.
 *
 * Maps from a C2G procurement job → aliexpress.ds.order.create API call.
 * Reference: https://openservice.aliexpress.com (AE-Dropshipper category)
 */
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

  // 2. Build AE DS product list from order items
  // AliExpress DS uses: product_count (quantity), sku_attr (variant attributes string)
  const productItems = (order.items || []).map((item: any) => ({
    product_id:    item.product_id,
    product_count: item.quantity,
    sku_attr:      item.variant_id || undefined, // e.g. "14:350852#Black;5:100014064#XL"
  }));

  // 3. Build logistics address
  // AliExpress DS requires Latin characters for shipping addresses
  const logisticsAddress = {
    contact_person:   order.customer_name,
    mobile_no:        order.customer_phone,
    address:          order.shipping_address,
    city:             "Accra",
    province:         "Greater Accra",
    country:          "GH",
    zip:              "00233",
  };

  try {
    // aliexpress.ds.order.create — AE Dropshipper order creation API
    // Required params: logistics_address (JSON), product_items_list (JSON), channel_refer_id
    const response = await aliexpressRequest({
      apiMethod: 'aliexpress.ds.order.create',
      params: {
        channel_refer_id:    String(order.id),
        product_items_list:  JSON.stringify(productItems),
        logistics_address:   JSON.stringify(logisticsAddress),
        remark:              `C2G Mall Order: ${order.order_id || order.id}`,
      }
    });

    // AE DS response shape: aliexpress_ds_order_create_response.result
    const result = response?.aliexpress_ds_order_create_response?.result;

    if (result?.is_success) {
      const aeOrderId = result.ae_order_id;

      // Update Job
      await supabase
        .from("procurement_jobs")
        .update({ status: 'procured', error_log: null })
        .eq("id", jobId);

      // Update Order — renamed column from alibaba_trade_id → ae_order_id in schema
      await supabase
        .from("ecom_orders")
        .update({
          alibaba_trade_id:  aeOrderId,    // Reusing existing column
          alibaba_pay_status: 'unpaid',
          order_status:       'procuring'
        })
        .eq("id", order.id);

      return { success: true, aeOrderId };
    } else {
      const errorMsg = result?.error_msg || "Unknown AliExpress API Error";
      await supabase
        .from("procurement_jobs")
        .update({
          status:    'failed',
          error_log: errorMsg,
          attempts:  job.attempts + 1
        })
        .eq("id", jobId);

      return { success: false, error: errorMsg };
    }
  } catch (error: any) {
    secureLog("AE Procurement Execution Failed", { error: error.message, jobId });

    await supabase
      .from("procurement_jobs")
      .update({
        status:    'failed',
        error_log: error.message,
        attempts:  job.attempts + 1
      })
      .eq("id", jobId);

    return { success: false, error: error.message };
  }
}

/**
 * Fetches tracking info for an AliExpress DS order.
 */
export async function getAEOrderTracking(aeOrderId: string) {
  try {
    const response = await aliexpressRequest({
      apiMethod: 'aliexpress.ds.order.tracking.get',
      params: {
        out_ref_id:   aeOrderId,
        // service_name is optional (AE standard shipping if omitted)
      }
    });

    // Response shape: aliexpress_ds_order_tracking_get_response.result
    const result = response?.aliexpress_ds_order_tracking_get_response?.result;
    return { success: true, tracking: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
