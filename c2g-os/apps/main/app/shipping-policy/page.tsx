import { PolicyLayout, PolicyArticle, PolicyContactCard, PolicyCallout } from "../../components/policy-layout";
import { SiteNav } from "../../components/site-nav";

export const metadata = {
  title: "Shipping Policy - C2G Logistics",
  description: "C2G Logistics shipping policy: air and sea freight timelines, tracking, delivery in Ghana, and how we handle delays.",
};

export default function ShippingPolicyPage() {
  const toc = [
    { id: "section-1", label: "Shipping Overview" },
    { id: "section-2", label: "Processing Time" },
    { id: "section-3", label: "Shipping Methods & Timelines" },
    { id: "section-4", label: "Warehouse Handling" },
    { id: "section-5", label: "Delays" },
    { id: "section-6", label: "Tracking" },
    { id: "section-7", label: "Delivery in Ghana" },
    { id: "section-8", label: "Customer Responsibility" },
    { id: "section-9", label: "Lost or Delayed Shipments" },
    { id: "section-10", label: "Contact" },
  ];

  const relatedLinks = [
    { href: "/terms-and-conditions", icon: "fa-file-contract", label: "Terms & Conditions", sub: "Rules for using C2G" },
    { href: "/refund-policy", icon: "fa-rotate-left", label: "Refund Policy", sub: "When & how we issue refunds" },
    { href: "/privacy-policy", icon: "fa-shield-halved", label: "Privacy Policy", sub: "How we handle your data" },
  ];

  return (
    <>
      <SiteNav />
      <PolicyLayout
        crumbIcon="fa-truck-fast"
        title="Shipping Policy"
        subtitle="Everything you need to know about how C2G moves your orders from China to Ghana: our shipping methods, timelines, tracking, and what to expect on delivery."
        effectiveDate="April 16, 2026"
        toc={toc}
        relatedLinks={relatedLinks}
      >
        <div className="p-5 rounded-xl bg-primary/5 border-l-4 border-primary text-sm leading-relaxed space-y-2 text-foreground/80">
          <p><strong className="text-foreground">C2G Logistics</strong> ships products from China to Ghana using both air and sea freight. This policy explains how the process works so there are no surprises between your checkout and your doorstep.</p>
          <p>For general rules about our services, see our <a href="/terms-and-conditions" className="text-primary font-medium hover:underline">Terms & Conditions</a>.</p>
        </div>

        <PolicyArticle id="section-1" num={1} title="Shipping Overview">
          <p>C2G ships products from China to Ghana using <strong className="text-foreground">air</strong> and <strong className="text-foreground">sea freight</strong> options. You can choose the method that best fits your timeline and budget when placing an order or requesting a quote.</p>
        </PolicyArticle>

        <PolicyArticle id="section-2" num={2} title="Processing Time">
          <ul className="space-y-1.5 pl-4">
            {["Orders are processed only after payment confirmation"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
            <li className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">Processing may take <strong className="text-foreground">1 to 5 days</strong> before items leave the supplier</li>
          </ul>
        </PolicyArticle>

        <PolicyArticle id="section-3" num={3} title="Shipping Methods & Timelines">
          <p>We offer two standard shipping methods between China and Ghana:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="flex gap-4 p-5 rounded-xl border border-border bg-card">
              <span className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <i className="fas fa-plane" />
              </span>
              <div>
                <h4 className="font-bold text-foreground mb-1">Air Freight</h4>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 border border-green-500/20 mb-2 inline-block">5 to 10 days</span>
                <p className="text-sm">Faster delivery for smaller, time-sensitive orders and lightweight items.</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-xl border border-border bg-card">
              <span className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <i className="fas fa-ship" />
              </span>
              <div>
                <h4 className="font-bold text-foreground mb-1">Sea Freight</h4>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-500 border border-blue-500/20 mb-2 inline-block">50 to 60 days</span>
                <p className="text-sm">More economical for large or heavy shipments where timing is flexible.</p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm italic">Delivery times are estimates and may vary depending on supplier, customs, and logistics conditions.</p>
        </PolicyArticle>

        <PolicyArticle id="section-4" num={4} title="Warehouse Handling">
          <ul className="space-y-1.5 pl-4">
            {["Items are received at our China warehouse from suppliers", "Consolidation may be done before shipping so multiple items travel together"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
        </PolicyArticle>

        <PolicyArticle id="section-5" num={5} title="Delays">
          <p>Delays may occur due to:</p>
          <ul className="space-y-1.5 pl-4">
            {["Chinese holidays (e.g., Chinese New Year)", "Customs clearance", "Weather conditions", "Logistics disruptions"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
          <PolicyCallout type="info">
            We'll always keep you informed when a delay affects your shipment. Timelines beyond our control are not grounds for a refund. See our <a href="/refund-policy" className="text-primary font-medium hover:underline">Refund Policy</a> for details.
          </PolicyCallout>
        </PolicyArticle>

        <PolicyArticle id="section-6" num={6} title="Tracking">
          <p>C2G provides estimated tracking updates based on shipment progress. Updates are available through your dashboard and, where possible, WhatsApp notifications.</p>
        </PolicyArticle>

        <PolicyArticle id="section-7" num={7} title="Delivery in Ghana">
          <ul className="space-y-1.5 pl-4">
            {["Items are delivered locally or sent via public transport depending on destination", "Customers will be notified upon arrival in Ghana"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
        </PolicyArticle>

        <PolicyArticle id="section-8" num={8} title="Customer Responsibility">
          <p>Customers must:</p>
          <ul className="space-y-1.5 pl-4">
            {["Provide accurate delivery details", "Pay any outstanding fees before delivery"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
        </PolicyArticle>

        <PolicyArticle id="section-9" num={9} title="Lost or Delayed Shipments">
          <p>C2G will assist in resolving any issues with lost or significantly delayed shipments, but is <strong className="text-foreground">not liable for delays beyond our control</strong>, including carrier, customs, or weather-related disruptions.</p>
        </PolicyArticle>

        <PolicyArticle id="section-10" num={10} title="Contact">
          <p>Have a question about a shipment or this policy? Reach out to our team:</p>
          <PolicyContactCard />
        </PolicyArticle>
      </PolicyLayout>
    </>
  );
}
