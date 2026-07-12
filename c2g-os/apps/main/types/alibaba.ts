/**
 * Type definitions for Alibaba Buyer Sourcing Solution / Dropshipping APIs
 */

export interface ProductSearchRequest {
  keyword?: string;
  category_id?: string;
  page_size?: number;
  page_index?: number;
  ship_to_country?: string;
  currency?: string;
  // Many other filters available...
}

export interface ProductSearchResponse {
  result: {
    product_list?: any[];
    total_count?: number;
    // ...
  };
}

export interface AdvancedFreightCalculateRequest {
  e_company_id: string;
  destination_country: string;
  logistics_product_list: Array<{
    product_id: string;
    sku_id?: string;
    quantity: number;
  }>;
  address?: Record<string, any>;
  dispatch_location?: string;
  enable_distribution_waybill?: boolean;
}

export interface AdvancedFreightCalculateResponse {
  result: {
    value?: Array<{
      logistics_company?: string;
      freight_cost?: number;
      currency?: string;
      estimated_delivery_time?: string;
      // ...
    }>;
  };
}

export interface BuyNowOrderRequest {
  channel_refer_id: string;
  product_list: Array<{
    product_id: string;
    sku_id?: string;
    quantity: number;
  }>;
  logistics_detail: {
    address?: string;
    city?: string;
    country?: string;
    contact_person?: string;
    mobile?: string;
    [key: string]: any;
  };
  remark?: string;
  properties?: string;
}

export interface BuyNowOrderResponse {
  result: {
    value?: {
      order_id: string; // The official trade ID
    };
    error_msg?: string;
  };
}
