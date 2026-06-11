"use client";

import { SiteNav } from "../../components/site-nav";
import { useState } from "react";
import Link from "next/link";

const faqs = [
  { q: "How long does shipping from China to Ghana take?", a: "Air freight takes 5-10 business days. Sea freight takes 50-60 days. Timelines may vary depending on customs and logistics conditions." },
  { q: "How do I place a 'Buy For Me' order?", a: "Simply paste the product link from Taobao, 1688, or any Chinese site into our link order form. We'll purchase the item and ship it to you." },
  { q: "How is shipping cost calculated?", a: "Air freight is charged per kg. Sea freight is charged per CBM. Your final shipping cost is communicated via WhatsApp once items are received at our warehouse." },
  { q: "How do I get a warehouse address in China?", a: "After creating an account and logging in, go to the 'Warehouse Address' section in your dashboard to get your unique China warehouse address." },
  { q: "Can I track my shipment?", a: "Yes. You can track all your shipments in real-time from your customer dashboard." },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate form submit
    await new Promise(r => setTimeout(r, 1500));
    setFormStatus("success");
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <SiteNav />

      {/* Hero */}
      <section className="relative py-28 pt-36 bg-gradient-to-br from-primary via-blue-700 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-1/2 -right-1/4 w-[60%] h-[200%] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[50%] h-[150%] rounded-full bg-white/8 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-5" style={{ letterSpacing: "-0.02em" }}>Contact Us</h1>
          <p className="text-xl text-white/90 max-w-xl mx-auto">Get in touch with our friendly team for any questions about our services.</p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact blocks */}
            <div className="lg:col-span-2 space-y-5">
              {[
                { icon: "fa-envelope", title: "Chat to us", sub: "Our friendly team is here to help", link: "mailto:C2glogisticsgh@gmail.com", linkText: "C2glogisticsgh@gmail.com" },
                { icon: "fa-phone-alt", title: "Call us", sub: "Toll-free call", link: "tel:+233241465282", linkText: "+233 24 146 5282" },
                { icon: "fa-map-marker-alt", title: "Visit us", sub: "Come say hello at our office", link: "https://www.google.com/maps", linkText: "Accra, Ghana", external: true },
                { icon: "fa-clock", title: "Hours", sub: "Monday–Friday 9am–5pm", extra: "Weekend support available" },
              ].map((block, i) => (
                <div key={i} className="glass-panel p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <i className={`fas ${block.icon}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-0.5">{block.title}</h4>
                      <p className="text-muted-foreground text-sm mb-1">{block.sub}</p>
                      {block.link && (
                        <a href={block.link} target={block.external ? "_blank" : undefined} rel={block.external ? "noopener" : undefined}
                          className="text-primary font-medium text-sm hover:underline">{block.linkText}</a>
                      )}
                      {block.extra && <p className="text-muted-foreground text-sm mt-0.5">{block.extra}</p>}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* WhatsApp CTA */}
              <a href="https://wa.me/233241465282" target="_blank" rel="noopener"
                className="flex items-center gap-3 w-full p-5 rounded-2xl bg-green-600 text-white hover:bg-green-700 transition-colors shadow-lg shadow-green-600/25">
                <i className="fab fa-whatsapp text-2xl" />
                <div>
                  <div className="font-bold">Chat on WhatsApp</div>
                  <div className="text-sm text-white/80">Get a faster response</div>
                </div>
              </a>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="glass-panel p-8 md:p-10">
                <h3 className="text-2xl font-bold mb-8">Send us a message</h3>
                {formStatus === "success" ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-green-500/15 text-green-500 flex items-center justify-center mx-auto text-2xl">
                      <i className="fas fa-check" />
                    </div>
                    <h4 className="text-xl font-bold">Message Sent!</h4>
                    <p className="text-muted-foreground">We'll get back to you within 24 hours. You can also reach us on WhatsApp for a faster response.</p>
                    <button onClick={() => setFormStatus(null)} className="text-primary font-medium hover:underline">Send another message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Full Name <span className="text-red-500">*</span></label>
                        <input required type="text" placeholder="John Doe" className="w-full h-11 bg-background/50 border border-input rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Email <span className="text-red-500">*</span></label>
                        <input required type="email" placeholder="john.doe@example.com" className="w-full h-11 bg-background/50 border border-input rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone (Optional)</label>
                      <input type="tel" placeholder="+233 XX XXX XXXX" className="w-full h-11 bg-background/50 border border-input rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Subject <span className="text-red-500">*</span></label>
                      <input required type="text" placeholder="Question about my order" className="w-full h-11 bg-background/50 border border-input rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Your Message <span className="text-red-500">*</span></label>
                      <textarea required rows={5} placeholder="Type your message here..." className="w-full bg-background/50 border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" />
                    </div>
                    <button type="submit" disabled={submitting} className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 hover:scale-[1.01] transition-all shadow-lg shadow-primary/25 disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2">
                      {submitting ? (
                        <><i className="fas fa-spinner fa-spin" /> Sending...</>
                      ) : (
                        <><i className="fas fa-paper-plane" /> Send Message</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Find answers to common questions about our services</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-panel overflow-hidden">
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <h4 className="font-semibold text-foreground">{faq.q}</h4>
                  <i className={`fas fa-chevron-down text-primary transition-transform shrink-0 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border/50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Immediate CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-8 md:p-10 text-center space-y-5 border-primary/20">
            <h3 className="text-2xl font-bold">Need Immediate Assistance?</h3>
            <p className="text-muted-foreground">For urgent inquiries or direct support, contact us immediately through any of these channels.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a href="tel:+233241465282" className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all font-medium">
                <i className="fas fa-phone-alt text-primary" /> +233 24 146 5282
              </a>
              <a href="mailto:C2glogisticsgh@gmail.com" className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all font-medium">
                <i className="fas fa-envelope text-primary" /> C2glogisticsgh@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
