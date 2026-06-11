import { PolicyLayout, PolicyArticle, PolicyContactCard, PolicyCallout } from "../../components/policy-layout";
import { SiteNav } from "../../components/site-nav";

export const metadata = {
  title: "Refund Policy - C2G Logistics",
  description: "C2G Logistics refund policy: when refunds are eligible, what is non-refundable, and how long processing takes.",
};

export default function RefundPolicyPage() {
  const toc = [
    { id: "section-1", label: "General Policy" },
    { id: "section-2", label: "Eligible Refunds" },
    { id: "section-3", label: "Non-Refundable Cases" },
    { id: "section-4", label: "Partial Refunds" },
    { id: "section-5", label: "Processing Time" },
    { id: "section-6", label: "Shipping & Service Fees" },
    { id: "section-7", label: "Damaged or Wrong Items" },
    { id: "section-8", label: "Contact" },
  ];

  const relatedLinks = [
    { href: "/terms-and-conditions", icon: "fa-file-contract", label: "Terms & Conditions", sub: "Rules for using C2G" },
    { href: "/shipping-policy", icon: "fa-truck-fast", label: "Shipping Policy", sub: "Timelines & delivery details" },
    { href: "/privacy-policy", icon: "fa-shield-halved", label: "Privacy Policy", sub: "How we handle your data" },
  ];

  return (
    <>
      <SiteNav />
      <PolicyLayout
        crumbIcon="fa-rotate-left"
        title="Refund Policy"
        subtitle="We understand things don't always go to plan. This policy explains when refunds are issued, what falls outside refund coverage, and how long you can expect the process to take."
        effectiveDate="April 16, 2026"
        toc={toc}
        relatedLinks={relatedLinks}
      >
        <div className="p-5 rounded-xl bg-primary/5 border-l-4 border-primary text-sm leading-relaxed space-y-2 text-foreground/80">
          <p>At <strong className="text-foreground">C2G Logistics</strong>, refunds are handled fairly and based on order status. This policy should be read alongside our <a href="/terms-and-conditions" className="text-primary font-medium hover:underline">Terms & Conditions</a>.</p>
          <p>If you believe your order qualifies for a refund, please contact us as soon as possible with your order ID.</p>
        </div>

        <PolicyArticle id="section-1" num={1} title="General Policy">
          <p>C2G processes orders based on customer instructions. Refunds are handled based on the current status of the order at the time the request is submitted.</p>
        </PolicyArticle>

        <PolicyArticle id="section-2" num={2} title="Eligible Refunds">
          <p>Refunds may be issued if:</p>
          <ul className="space-y-1.5 pl-4">
            {["Item is out of stock", "Supplier fails to deliver", "Order cannot be fulfilled"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
          <PolicyCallout type="info">
            <strong>Tip:</strong> Contact our team the moment you're aware of an issue. The earlier we know, the more options we have to resolve it quickly.
          </PolicyCallout>
        </PolicyArticle>

        <PolicyArticle id="section-3" num={3} title="Non-Refundable Cases">
          <p>Refunds will <strong className="text-foreground">not</strong> be issued for:</p>
          <ul className="space-y-1.5 pl-4">
            {["Change of mind after order is placed", "Incorrect item selection by customer", "Delays caused by shipping or customs", "Items that match supplier description"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
        </PolicyArticle>

        <PolicyArticle id="section-4" num={4} title="Partial Refunds">
          <p>Partial refunds may apply for:</p>
          <ul className="space-y-1.5 pl-4">
            {["Price differences", "Supplier adjustments"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
        </PolicyArticle>

        <PolicyArticle id="section-5" num={5} title="Processing Time">
          <p>Approved refunds are typically processed within <strong className="text-foreground">3 to 10 business days</strong>, depending on the payment method used. Bank transfers may take slightly longer than mobile money.</p>
        </PolicyArticle>

        <PolicyArticle id="section-6" num={6} title="Shipping & Service Fees">
          <ul className="space-y-1.5 pl-4">
            {["Service fees are non-refundable", "Shipping fees may not be refundable once shipment has started"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
        </PolicyArticle>

        <PolicyArticle id="section-7" num={7} title="Damaged or Wrong Items">
          <p>Customers must report any issue <strong className="text-foreground">within 48 hours</strong> of receiving the item, with clear evidence (photos or videos of the damage or incorrect item).</p>
          <PolicyCallout type="warning">
            Claims submitted after the <strong>48-hour window</strong> cannot be processed. Please inspect your package promptly on arrival.
          </PolicyCallout>
        </PolicyArticle>

        <PolicyArticle id="section-8" num={8} title="Contact">
          <p>To request a refund or ask a question about this policy, get in touch:</p>
          <PolicyContactCard />
        </PolicyArticle>
      </PolicyLayout>
    </>
  );
}
