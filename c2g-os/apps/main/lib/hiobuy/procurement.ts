import { hiobuyFetch } from "./client";
import type { ProductChannel } from "./types";

export interface OrderPreviewLine {
  id: string;
  spec_id: string;
  quantity: number;
}

export interface OrderReceiver {
  name: string;
  mobile: string;
  province: string;
  city: string;
  district?: string;
  address: string;
}

export interface OrderPreviewInput {
  channel: ProductChannel;
  receiver: OrderReceiver;
  lines: OrderPreviewLine[];
}

export interface StandardOrderPreviewResult {
  channel: string;
  success: boolean;
  total: {
    payment: { amount: number; currency: string };
    shipping: { amount: number; currency: string };
  };
  unavailable_lines: any[];
  sellers: any[];
  request_id?: string;
}

export async function previewOrder(
  input: OrderPreviewInput
): Promise<StandardOrderPreviewResult> {
  return hiobuyFetch<StandardOrderPreviewResult>("/v1/orders/preview", {
    channel: input.channel,
    receiver: input.receiver,
    lines: input.lines,
  });
}

export interface OrderCreateInput extends OrderPreviewInput {
  external_order_id: string;
  buyer_message?: string;
  trade_type?: string;
}

export interface StandardOrderCreateResult {
  order_id: string;
  total: {
    payment: { amount: number; currency: string };
  };
  order_list: any[];
  failed_offers: any[];
  outer_purchase_id?: string;
  payment_url?: string;
  request_id?: string;
}

export async function createOrder(
  input: OrderCreateInput
): Promise<StandardOrderCreateResult> {
  return hiobuyFetch<StandardOrderCreateResult>("/v1/orders/create", {
    channel: input.channel,
    receiver: input.receiver,
    lines: input.lines,
    external_order_id: input.external_order_id,
    buyer_message: input.buyer_message,
    trade_type: input.trade_type,
  });
}

export async function payOrder(input: {
  channel: ProductChannel;
  order_id: string;
  pay_channel?: string;
}): Promise<any> {
  return hiobuyFetch<any>("/v1/orders/pay", {
    channel: input.channel,
    order_id: input.order_id,
    ...(input.pay_channel ? { pay_channel: input.pay_channel } : {}),
  });
}

export async function getOrderDetail(input: {
  channel: ProductChannel;
  order_id: string;
}): Promise<any> {
  return hiobuyFetch<any>("/v1/orders/detail", {
    channel: input.channel,
    order_id: input.order_id,
  });
}

export async function getOrderList(input: Record<string, unknown>): Promise<any> {
  return hiobuyFetch<any>("/v1/orders/list", input);
}

export async function cancelOrder(input: {
  channel: ProductChannel;
  order_id: string;
  cancel_reason?: string;
  sub_order_ids?: string[];
}): Promise<any> {
  return hiobuyFetch<any>("/v1/orders/cancel", {
    channel: input.channel,
    order_id: input.order_id,
    ...(input.cancel_reason ? { cancel_reason: input.cancel_reason } : {}),
    ...(input.sub_order_ids ? { sub_order_ids: input.sub_order_ids } : {}),
  });
}

export async function getLogisticsTrace(input: {
  channel: ProductChannel;
  order_id: string;
  logistics_id?: string;
}): Promise<any> {
  return hiobuyFetch<any>("/v1/orders/logistics/trace", {
    channel: input.channel,
    order_id: input.order_id,
    ...(input.logistics_id ? { logistics_id: input.logistics_id } : {}),
  });
}

export async function queryPurchase(input: Record<string, unknown>): Promise<any> {
  return hiobuyFetch<any>("/v1/orders/purchase/query", {
    channel: "taobao",
    ...input,
  });
}
