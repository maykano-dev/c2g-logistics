import { aliexpressRequest } from "./client";

export interface AliExpressCategory {
  category_id: number;
  category_name: string;
  parent_category_id?: number;
}

/**
 * Fetches the entire category tree from AliExpress Dropshipping API
 */
export async function getAliExpressCategories(): Promise<AliExpressCategory[]> {
  try {
    const res = await aliexpressRequest({
      apiMethod: "aliexpress.ds.category.get",
      params: {
        target_currency: "USD",
        target_language: "EN",
      },
    });

    const categories = res?.aliexpress_ds_category_get_response?.resp_result?.result?.ae_category_info;
    
    if (Array.isArray(categories)) {
      return categories as AliExpressCategory[];
    }
    
    // Fallback if shape is different
    if (Array.isArray(res?.resp_result?.result?.ae_category_info)) {
        return res.resp_result.result.ae_category_info as AliExpressCategory[];
    }

    console.warn("Unexpected category format from AliExpress", JSON.stringify(res).substring(0, 500));
    return [];
  } catch (error) {
    console.error("Failed to fetch AliExpress categories:", error);
    return [];
  }
}
