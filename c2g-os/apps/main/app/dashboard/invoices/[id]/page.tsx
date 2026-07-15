import { getInvoiceDetail } from "../actions";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import InvoiceDetailClient from "./invoice-detail-client";

import { getCachedSettings } from "@/utils/cache";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Invoice Details | C2G Logistics",
};

export default async function InvoiceDetailPage(props: any) {
  const params = await props.params;
  const invoiceId = params?.id;
  const invoice = await getInvoiceDetail(invoiceId);

  if (!invoice) {
    redirect("/dashboard/invoices");
  }

  // Fetch company settings for invoice header
  const settings = await getCachedSettings();
  const companyInfo = {
    name: "C2G Logistics",
    address: "Accra, Ghana",
    email: "c2glogisticsgh@gmail.com",
    phone: settings?.support_number || "+233 55 123 4567"
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-24">
      <InvoiceDetailClient invoice={invoice} companyInfo={companyInfo} />
    </div>
  );
}
