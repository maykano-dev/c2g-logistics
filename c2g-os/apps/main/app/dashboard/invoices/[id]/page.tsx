import { getInvoiceDetail } from "../actions";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import InvoiceDetailClient from "./invoice-detail-client";

export const metadata: Metadata = {
  title: "Invoice Details | C2G Logistics",
};

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const invoice = await getInvoiceDetail(params.id);

  if (!invoice) {
    redirect("/dashboard/invoices");
  }

  // Fetch company settings for invoice header
  const companyInfo = {
    name: "C2G Logistics",
    address: "123 Logistics Way, Accra, Ghana",
    email: "billing@c2g-logistics.com",
    phone: "+233 55 123 4567"
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-24">
      <InvoiceDetailClient invoice={invoice} companyInfo={companyInfo} />
    </div>
  );
}
