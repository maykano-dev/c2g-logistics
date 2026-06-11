import { PolicyLayout, PolicyArticle, PolicyContactCard, PolicyCallout } from "../../components/policy-layout";
import { SiteNav } from "../../components/site-nav";

export const metadata = {
  title: "Terms & Conditions - C2G Logistics",
  description: "The Terms & Conditions that govern your use of C2G Logistics sourcing and shipping services from China to Ghana.",
};

export default function TermsPage() {
  const toc = [
    { id: "section-1", label: "Services Overview" },
    { id: "section-2", label: "User Responsibilities" },
    { id: "section-3", label: "Orders & Payments" },
    { id: "section-4", label: "Shipping & Delivery" },
    { id: "section-5", label: "Refunds & Cancellations" },
    { id: "section-6", label: "Product Quality" },
    { id: "section-7", label: "Prohibited Items" },
    { id: "section-8", label: "Limitation of Liability" },
    { id: "section-9", label: "Account Suspension" },
    { id: "section-10", label: "Changes to Terms" },
    { id: "section-11", label: "Contact" },
  ];

  const relatedLinks = [
    { href: "/privacy-policy", icon: "fa-shield-halved", label: "Privacy Policy", sub: "How we handle your data" },
    { href: "/refund-policy", icon: "fa-rotate-left", label: "Refund Policy", sub: "When & how we issue refunds" },
    { href: "/shipping-policy", icon: "fa-truck-fast", label: "Shipping Policy", sub: "Timelines & delivery details" },
  ];

  return (
    <>
      <SiteNav />
      <PolicyLayout
        crumbIcon="fa-file-contract"
        title="Terms & Conditions"
        subtitle="By using C2G Logistics you agree to the terms below. They explain what we do, what we expect from you, and the rules that govern every order placed on our platform."
        effectiveDate="April 16, 2026"
        toc={toc}
        relatedLinks={relatedLinks}
      >
        <div className="p-5 rounded-xl bg-primary/5 border-l-4 border-primary text-sm leading-relaxed space-y-2 text-foreground/80">
          <p>Welcome to <strong className="text-foreground">C2G Logistics</strong>. By accessing or using our website, services, or placing any order through our platform, you agree to be bound by these Terms & Conditions.</p>
          <p>Please read them carefully before continuing to use our services.</p>
        </div>

        <PolicyArticle id="section-1" num={1} title="Services Overview">
          <p>C2G provides a sourcing and logistics service that enables customers to purchase products from Chinese marketplaces and have them shipped to Ghana.</p>
          <p>We act as an <strong className="text-foreground">intermediary</strong> between customers and suppliers.</p>
        </PolicyArticle>

        <PolicyArticle id="section-2" num={2} title="User Responsibilities">
          <p>By using C2G, you agree to:</p>
          <ul className="space-y-1.5 pl-4">
            {["Provide accurate information", "Review product details before ordering", "Ensure correct pricing when submitting link orders", "Comply with all applicable laws"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
        </PolicyArticle>

        <PolicyArticle id="section-3" num={3} title="Orders & Payments">
          <ul className="space-y-1.5 pl-4">
            {["All orders must be fully paid before processing", "Prices may vary depending on supplier specifications (size, color, etc.)", "Customers must confirm final item price before placing link orders", "Additional charges may apply if incorrect pricing is submitted"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
        </PolicyArticle>

        <PolicyArticle id="section-4" num={4} title="Shipping & Delivery">
          <ul className="space-y-1.5 pl-4">
            {["Delivery timelines are estimates and may vary", "Delays may occur due to customs, holidays, or logistics issues", "C2G is not responsible for delays beyond our control"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
          <p className="mt-2">See our <a href="/shipping-policy" className="text-primary font-medium hover:underline">Shipping Policy</a> for full timelines and conditions.</p>
        </PolicyArticle>

        <PolicyArticle id="section-5" num={5} title="Refunds & Cancellations">
          <ul className="space-y-1.5 pl-4">
            {["Orders cannot be cancelled once processing has begun"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
            <li className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">Refunds are subject to our <a href="/refund-policy" className="text-primary font-medium hover:underline">Refund Policy</a></li>
            <li className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">Shipping fees and service charges may not be refundable</li>
          </ul>
        </PolicyArticle>

        <PolicyArticle id="section-6" num={6} title="Product Quality">
          <ul className="space-y-1.5 pl-4">
            {["C2G does not manufacture products", "Product quality depends on the supplier", "Optional inspection services may be provided"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
        </PolicyArticle>

        <PolicyArticle id="section-7" num={7} title="Prohibited Items">
          <p>Customers must not order:</p>
          <ul className="space-y-1.5 pl-4">
            {["Illegal or restricted items", "Dangerous goods", "Counterfeit or prohibited products"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
          <PolicyCallout type="warning">
            <strong>C2G reserves the right to reject such orders</strong> at any stage, without refund of service charges already incurred.
          </PolicyCallout>
        </PolicyArticle>

        <PolicyArticle id="section-8" num={8} title="Limitation of Liability">
          <p>C2G is not liable for:</p>
          <ul className="space-y-1.5 pl-4">
            {["Supplier defects", "Shipping delays beyond control", "Customs-related issues"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
        </PolicyArticle>

        <PolicyArticle id="section-9" num={9} title="Account Suspension">
          <p>We reserve the right to suspend or terminate accounts that:</p>
          <ul className="space-y-1.5 pl-4">
            {["Violate policies", "Engage in fraud", "Misuse the platform"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
        </PolicyArticle>

        <PolicyArticle id="section-10" num={10} title="Changes to Terms">
          <p>We may update these terms at any time. Continued use of the platform means acceptance of updates.</p>
        </PolicyArticle>

        <PolicyArticle id="section-11" num={11} title="Contact">
          <p>Questions about these Terms? Reach out and we'll be glad to help:</p>
          <PolicyContactCard />
        </PolicyArticle>
      </PolicyLayout>
    </>
  );
}
