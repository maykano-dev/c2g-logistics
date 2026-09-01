import { hiobuyFetch } from "./client";

export interface ShipmentReceiver {
  name: string;
  mobile: string;
  country_code: string;
  province: string;
  city: string;
  district?: string;
  postal_code?: string;
  address_line1: string;
  address_line2?: string;
  personal_code?: string;
}

export interface CreateShipmentInput {
  tracking_numbers: string[];
  receiver: ShipmentReceiver;
  shipping_channel_code: string;
  external_shipment_id?: string;
  remark?: string;
}

export async function createShipment(input: CreateShipmentInput): Promise<any> {
  return hiobuyFetch<any>("/v1/fulfillment/shipments/create", input as any);
}

export async function payShipment(input: { shipment_id: string }): Promise<any> {
  return hiobuyFetch<any>(`/v1/fulfillment/shipments/${input.shipment_id}/pay`, {});
}

export async function cancelShipment(input: { shipment_id: string; cancel_reason: string }): Promise<any> {
  return hiobuyFetch<any>(`/v1/fulfillment/shipments/${input.shipment_id}/cancel`, {
    cancel_reason: input.cancel_reason,
  });
}

export async function interceptShipment(input: { shipment_id: string; reason: string; remark?: string }): Promise<any> {
  return hiobuyFetch<any>(`/v1/fulfillment/shipments/${input.shipment_id}/intercept`, {
    reason: input.reason,
    ...(input.remark ? { remark: input.remark } : {}),
  });
}

export interface GetShipmentListInput {
  status?: string;
  created_from?: string;
  created_to?: string;
  page?: number;
  page_size?: number;
}

export async function getShipmentList(input: GetShipmentListInput): Promise<any> {
  return hiobuyFetch<any>("/v1/fulfillment/shipments", input as Record<string, unknown>, "GET");
}

export async function getShipmentDetail(input: { shipment_id: string; language?: string }): Promise<any> {
  const query = input.language ? { language: input.language } : undefined;
  return hiobuyFetch<any>(`/v1/fulfillment/shipments/${input.shipment_id}`, query, "GET");
}
