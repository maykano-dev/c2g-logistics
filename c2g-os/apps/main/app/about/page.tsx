import { SiteNav } from "../../components/site-nav";
import Link from "next/link";

export const metadata = {
  title: "About Us | C2G Logistics | Your Gateway to China, Delivered to Ghana",
  description: "Learn about C2G Logistics | Ghana's trusted bridge for China-to-Ghana shipping, procurement, and logistics solutions.",
};

export default function AboutPage() {
  const values = [
    { icon: "fa-shield-alt", title: "Trust & Reliability", desc: "We understand that trust is earned through consistent, reliable service. Every package is handled with the utmost care, and every promise is kept." },
    { icon: "fa-eye", title: "Transparency", desc: "No hidden fees, no surprises. We believe in complete transparency in our pricing, processes, and communication with our customers." },
    { icon: "fa-rocket", title: "Innovation", desc: "We continuously improve our services and embrace new technologies to make cross-border shopping easier and more efficient." },
    { icon: "fa-users", title: "Customer First", desc: "Our customers are at the heart of everything we do. Their success is our success, and their satisfaction is our top priority." },
    { icon: "fa-clock", title: "Speed & Efficiency", desc: "Time is valuable. We optimize every step of our process to ensure fast, efficient service without compromising on quality." },
    { icon: "fa-handshake", title: "Partnership", desc: "We see ourselves as partners in our customers' success, providing support and guidance beyond just shipping services." },
  ];

  const journey = [
    { year: "2020", title: "The Beginning", desc: "Started as a small operation helping friends and family purchase items from Chinese platforms." },
    { year: "2021", title: "First Milestone", desc: "Served our first 100 customers and established our China warehouse partnership." },
    { year: "2023", title: "Rapid Growth", desc: "Expanded our services and reached 1,000+ successful deliveries across Ghana." },
    { year: "2025", title: "Leading the Way", desc: "Now serving 450+ happy customers with 99.8% delivery success rate and 24/7 support." },
  ];

  const stats = [
    { icon: "fa-users", number: "450+", label: "Happy Customers" },
    { icon: "fa-box", number: "2,000+", label: "Completed Orders" },
    { icon: "fa-truck", number: "99.8%", label: "Delivery Success Rate" },
    { icon: "fa-headset", number: "24/7", label: "Customer Support" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <SiteNav />

      {/* Hero */}
      <section className="relative py-28 pt-36 bg-gradient-to-br from-primary via-blue-700 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-1/2 -right-1/4 w-[60%] h-[200%] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[50%] h-[150%] rounded-full bg-white/8 blur-3xl" />
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 80% 30%, rgba(255,255,255,0.1) 0%, transparent 40%)" }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-5" style={{ letterSpacing: "-0.02em" }}>About C2G Logistics</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Bridging the gap between Ghana and China through innovative logistics solutions. We're more than just a shipping company, we're your trusted partner in global commerce.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-5">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ letterSpacing: "-0.015em" }}>Our Story</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Founded with a vision to simplify cross-border commerce between Ghana and China, C2G Logistics emerged from the real challenges faced by Ghanaian entrepreneurs and businesses trying to access the vast Chinese marketplace.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                What started as a small operation helping friends and family purchase items from Chinese platforms has grown into a comprehensive logistics solution serving hundreds of satisfied customers across Ghana.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, we pride ourselves on being the most reliable, transparent, and customer-focused logistics partner for anyone looking to buy from China and ship to Ghana.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-secondary to-background h-80 lg:h-[420px] flex items-center justify-center shadow-2xl">
                <div className="text-center p-8 space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
                    <i className="fas fa-globe text-3xl text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">China → Ghana</p>
                  <p className="text-muted-foreground">Trusted Logistics Partner</p>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 glass-panel p-4 shadow-xl border-primary/20">
                <p className="text-sm font-bold text-foreground">2,000+ Orders</p>
                <p className="text-xs text-muted-foreground">Successfully delivered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The principles that guide everything we do and shape our commitment to excellence.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="glass-panel p-7 hover:border-primary/40 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 text-xl">
                  <i className={`fas ${v.icon}`} />
                </div>
                <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-20 bg-gradient-to-br from-primary to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15), transparent 40%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold">Our Journey</h2>
            <p className="text-white/80 max-w-xl mx-auto">From humble beginnings to becoming Ghana's trusted China logistics partner.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {journey.map((item, i) => (
              <div key={i} className="rounded-2xl bg-white/10 border border-white/15 p-6 backdrop-blur-sm">
                <div className="text-3xl font-black text-white mb-3">{item.year}</div>
                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-white/75 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Our Impact in Numbers</h2>
            <p className="text-white/80 max-w-xl mx-auto">Real results that demonstrate our commitment to excellence and customer satisfaction.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center space-y-2">
                <i className={`fas ${s.icon} text-2xl text-white/70 mb-3 block`} />
                <div className="text-5xl font-black text-white">{s.number}</div>
                <div className="text-white/80 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ready to Start Your Journey?</h2>
          <p className="text-muted-foreground text-lg">
            Join hundreds of satisfied customers who trust C2G Logistics for their China-to-Ghana shipping needs. Experience the difference of working with a truly customer-focused logistics partner.
          </p>
          <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-base h-13 px-10 shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] transition-all py-4">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
