import { PolicyLayout, PolicyArticle, PolicyContactCard } from "../../components/policy-layout";
import { SiteNav } from "../../components/site-nav";

export const metadata = {
  title: "Privacy Policy - C2G Logistics",
  description: "Learn how C2G Logistics collects, uses, and protects your personal information when you use our China-to-Ghana logistics services.",
};

export default function PrivacyPolicyPage() {
  const toc = [
    { id: "section-1", label: "Information We Collect" },
    { id: "section-2", label: "How We Use Your Information" },
    { id: "section-3", label: "How We Share Your Information" },
    { id: "section-4", label: "Data Security" },
    { id: "section-5", label: "Data Retention" },
    { id: "section-6", label: "Your Rights" },
    { id: "section-7", label: "Cookies & Tracking" },
    { id: "section-8", label: "Third-Party Links" },
    { id: "section-9", label: "International Data Transfers" },
    { id: "section-10", label: "Children's Privacy" },
    { id: "section-11", label: "Changes to This Policy" },
    { id: "section-12", label: "Contact Us" },
  ];

  return (
    <>
      <SiteNav />
      <PolicyLayout
        crumbIcon="fa-shield-alt"
        title="Privacy Policy"
        subtitle="Your privacy is important to us. This policy explains what information C2G Logistics collects, how we use it, and the rights you have over your personal data."
        effectiveDate="April 16, 2026"
        toc={toc}
      >
        {/* Intro */}
        <div className="p-5 rounded-xl bg-primary/5 border-l-4 border-primary text-sm leading-relaxed space-y-2 text-foreground/80">
          <p>Welcome to <strong className="text-foreground">C2G Logistics</strong>. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.</p>
          <p>By using our platform, you agree to the terms of this Privacy Policy.</p>
        </div>

        <PolicyArticle id="section-1" num={1} title="Information We Collect">
          <p>We may collect the following types of information:</p>
          <h3 className="text-base font-bold text-foreground mt-4 mb-2">a. Personal Information</h3>
          <ul className="space-y-1.5 pl-4">
            {["Full name", "Phone number", "Email address", "Delivery address", "Payment details (processed securely via third parties)"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
          <h3 className="text-base font-bold text-foreground mt-4 mb-2">b. Order Information</h3>
          <ul className="space-y-1.5 pl-4">
            {["Product links and descriptions", "Order history", "Shipping details", "Transaction records"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
          <h3 className="text-base font-bold text-foreground mt-4 mb-2">c. Technical Information</h3>
          <ul className="space-y-1.5 pl-4">
            {["IP address", "Device type", "Browser type", "Pages visited", "Usage data"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
        </PolicyArticle>

        <PolicyArticle id="section-2" num={2} title="How We Use Your Information">
          <p>We use your information to:</p>
          <ul className="space-y-1.5 pl-4">
            {["Process and fulfill your orders", "Communicate with you about orders and updates", "Provide customer support", "Improve our platform and services", "Prevent fraud and ensure security", "Comply with legal obligations"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
        </PolicyArticle>

        <PolicyArticle id="section-3" num={3} title="How We Share Your Information">
          <p>We may share your information with:</p>
          <h3 className="text-base font-bold text-foreground mt-4 mb-1">a. Suppliers and Partners</h3>
          <p>To complete purchases and shipping processes.</p>
          <h3 className="text-base font-bold text-foreground mt-4 mb-1">b. Logistics Providers</h3>
          <p>To deliver your items from China to Ghana.</p>
          <h3 className="text-base font-bold text-foreground mt-4 mb-1">c. Payment Providers</h3>
          <p>To securely process transactions.</p>
          <h3 className="text-base font-bold text-foreground mt-4 mb-1">d. Legal Authorities</h3>
          <p>If required by law or to protect our rights.</p>
          <p className="mt-4"><strong className="text-foreground">We do not sell your personal information to third parties.</strong></p>
        </PolicyArticle>

        <PolicyArticle id="section-4" num={4} title="Data Security">
          <p>We implement appropriate security measures to protect your information. However, no system is completely secure, and we cannot guarantee absolute security.</p>
        </PolicyArticle>

        <PolicyArticle id="section-5" num={5} title="Data Retention">
          <p>We retain your information only as long as necessary to:</p>
          <ul className="space-y-1.5 pl-4">
            {["Provide our services", "Maintain records", "Comply with legal requirements"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
        </PolicyArticle>

        <PolicyArticle id="section-6" num={6} title="Your Rights">
          <p>You have the right to:</p>
          <ul className="space-y-1.5 pl-4">
            {["Access your personal data", "Request corrections", "Request deletion of your data", "Object to certain uses of your data"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
          <p className="mt-2">To exercise these rights, contact us using the details in <a href="#section-12" className="text-primary font-medium hover:underline">Section 12</a>.</p>
        </PolicyArticle>

        <PolicyArticle id="section-7" num={7} title="Cookies and Tracking Technologies">
          <p>We may use cookies to:</p>
          <ul className="space-y-1.5 pl-4">
            {["Improve user experience", "Analyze platform usage", "Remember user preferences"].map(item => (
              <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/70">{item}</li>
            ))}
          </ul>
          <p className="mt-2">You can disable cookies in your browser settings.</p>
        </PolicyArticle>

        <PolicyArticle id="section-8" num={8} title="Third-Party Links">
          <p>Our platform may contain links to third-party websites (e.g., Taobao, 1688). We are not responsible for their privacy practices.</p>
        </PolicyArticle>

        <PolicyArticle id="section-9" num={9} title="International Data Transfers">
          <p>Your information may be transferred to and processed in countries outside Ghana, including China, as part of our service operations.</p>
        </PolicyArticle>

        <PolicyArticle id="section-10" num={10} title="Children's Privacy">
          <p>Our services are not intended for individuals under the age of 18. We do not knowingly collect data from children.</p>
        </PolicyArticle>

        <PolicyArticle id="section-11" num={11} title="Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised effective date.</p>
        </PolicyArticle>

        <PolicyArticle id="section-12" num={12} title="Contact Us">
          <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
          <PolicyContactCard />
        </PolicyArticle>
      </PolicyLayout>
    </>
  );
}
