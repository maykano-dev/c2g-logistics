import { alibabaRequest } from "./client";
import { 
  AdvancedFreightCalculateRequest, 
  AdvancedFreightCalculateResponse, 
  BuyNowOrderRequest, 
  BuyNowOrderResponse, 
  ProductSearchRequest, 
  ProductSearchResponse 
} from "@/types/alibaba";

/**
 * Product Discovery & Sourcing
 */

export async function searchProducts(params: ProductSearchRequest): Promise<ProductSearchResponse> {
  return await alibabaRequest({
    apiMethod: '/eco/buyer/product/search',
    httpMethod: 'GET',
    params: params as Record<string, any>
  });
}

export async function getProductDescription(productId: string): Promise<any> {
  return await alibabaRequest({
    apiMethod: '/eco/buyer/product/description',
    httpMethod: 'GET',
    params: { product_id: productId }
  });
}

export async function getProductKeyAttributes(productId: string): Promise<any> {
  return await alibabaRequest({
    apiMethod: '/eco/buyer/product/keyattributes',
    httpMethod: 'GET',
    params: { product_id: productId }
  });
}

/**
 * Freight & Logistics
 */

export async function calculateBasicFreight(params: any): Promise<any> {
  return await alibabaRequest({
    apiMethod: '/shipping/freight/calculate',
    params
  });
}

export async function calculateAdvancedFreight(params: AdvancedFreightCalculateRequest): Promise<AdvancedFreightCalculateResponse> {
  return await alibabaRequest({
    apiMethod: '/order/freight/calculate',
    // The IOP API client requires nested objects to be stringified JSON
    params: {
      ...params,
      logistics_product_list: JSON.stringify(params.logistics_product_list),
      address: params.address ? JSON.stringify(params.address) : undefined,
    }
  });
}

export async function getLogisticsTracking(tradeId: string): Promise<any> {
  return await alibabaRequest({
    apiMethod: '/order/logistics/tracking/get',
    params: { trade_id: tradeId }
  });
}

/**
 * Order Fulfillment
 */

export async function createBuyNowOrder(params: BuyNowOrderRequest): Promise<BuyNowOrderResponse> {
  return await alibabaRequest({
    apiMethod: '/buynow/order/create',
    params: {
      channel_refer_id: params.channel_refer_id,
      product_list: JSON.stringify(params.product_list),
      logistics_detail: JSON.stringify(params.logistics_detail),
      remark: params.remark,
      properties: params.properties
    }
  });
}

export async function payDropshippingOrder(tradeId: string): Promise<any> {
  return await alibabaRequest({
    apiMethod: '/alibaba/dropshipping/order/pay',
    params: { trade_id: tradeId }
  });
}

export async function getOrderDetails(tradeId: string): Promise<any> {
  return await alibabaRequest({
    apiMethod: '/alibaba/order/get',
    params: { trade_id: tradeId }
  });
}

export async function cancelOrder(tradeId: string): Promise<any> {
  return await alibabaRequest({
    apiMethod: '/alibaba/order/cancel',
    params: { trade_id: tradeId }
  });
}
