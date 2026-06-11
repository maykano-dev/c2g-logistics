import Link from "next/link";
import { SiteNav } from "../components/site-nav";
import { 
  ShoppingCart, 
  Globe, 
  PackageCheck, 
  Ship, 
  Plane, 
  MessageCircle, 
  ShieldCheck,
  TrendingUp,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Link as LinkIcon
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans">
      {/* Global Background Effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[150px] rounded-full animate-pulse delay-1000 -z-10" />

      <SiteNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 space-y-32">
        
        {/* ── GALLERY HERO ── */}
        <section className="relative pt-12 lg:pt-20 pb-8 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 animate-fade-in">

          {/* ── Left: Text Content ── */}
          <div className="flex-1 space-y-8 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border text-sm font-medium">
              <Globe className="w-4 h-4 text-primary" /> Simplified Logistics &amp; Sourcing
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-balance">
              Shop, Import &amp; Sell From China.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Simplified.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Whether you're shopping, importing for yourself, or running a WhatsApp business — C2G handles procurement, warehousing, consolidation, and delivery to Ghana.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-13 px-8 shadow-lg shadow-primary/30 hover:scale-[1.02] transition-all">
                <ShoppingCart className="w-5 h-5" /> Shop on C2G Mall
              </button>
              <Link href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl text-base font-semibold border border-input glass hover:bg-secondary h-13 px-8 transition-all">
                Start Importing <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground flex items-center justify-center lg:justify-start gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" /> Trusted by importers across Ghana.
            </p>
          </div>

          {/* ── Right: Gallery Columns ── */}
          <div className="flex-1 w-full relative h-[520px] lg:h-[640px] overflow-hidden rounded-3xl hidden sm:block">
            {/* Gradient overlays to blend edges */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/20 z-20 pointer-events-none" />

            <div className="flex gap-3 h-full">
              {/* Column 1 — scroll up */}
              <div className="flex-1 flex flex-col gap-3" style={{ animation: "galleryUp 20s linear infinite" }}>
                {["https://images.unsplash.com/photo-1586528116311-ad8ed7c663c0?w=400&q=80",
                  "https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&q=80",
                  "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&q=80",
                  "https://images.unsplash.com/photo-1586528116311-ad8ed7c663c0?w=400&q=80",
                  "https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&q=80",
                ].map((src, i) => (
                  <img key={i} src={src} alt="" className="w-full h-52 object-cover rounded-2xl border border-white/10 shadow-md flex-shrink-0" />
                ))}
              </div>

              {/* Column 2 — scroll down, offset start */}
              <div className="flex-1 flex flex-col gap-3 -translate-y-16" style={{ animation: "galleryDown 25s linear infinite" }}>
                {["https://images.unsplash.com/photo-1491897554428-130a60dd4757?w=400&q=80",
                  "https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?w=400&q=80",
                  "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&q=80",
                  "https://images.unsplash.com/photo-1491897554428-130a60dd4757?w=400&q=80",
                  "https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?w=400&q=80",
                ].map((src, i) => (
                  <img key={i} src={src} alt="" className="w-full h-60 object-cover rounded-2xl border border-white/10 shadow-md flex-shrink-0" />
                ))}
              </div>

              {/* Column 3 — scroll up, offset start (hidden on md, visible lg) */}
              <div className="flex-1 hidden lg:flex flex-col gap-3 translate-y-8" style={{ animation: "galleryUp 30s linear infinite" }}>
                {["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
                  "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80",
                  "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400&q=80",
                  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
                  "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80",
                ].map((src, i) => (
                  <img key={i} src={src} alt="" className="w-full h-56 object-cover rounded-2xl border border-white/10 shadow-md flex-shrink-0" />
                ))}
              </div>
            </div>

            {/* Floating stat pill — top right */}
            <div className="absolute top-5 right-5 z-30 glass-panel px-4 py-3 flex items-center gap-3 shadow-2xl !rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium leading-none mb-0.5">Trusted by</p>
                <p className="text-sm font-bold leading-none">450+ Customers</p>
              </div>
            </div>

            {/* Floating stat pill — bottom right */}
            <div className="absolute bottom-5 right-5 z-30 glass-panel px-4 py-3 flex items-center gap-3 shadow-2xl !rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Ship className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium leading-none mb-0.5">Fast Freight</p>
                <p className="text-sm font-bold leading-none">Air &amp; Sea Shipping</p>
              </div>
            </div>
          </div>
        </section>

        {/* C2G MALL */}
        <section className="glass-panel p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Shop Products From China <br/>Without The Stress</h2>
              <p className="text-lg text-muted-foreground">
                C2G Mall gives you access to products sourced directly from China by trusted importers and suppliers. Browse products, place your order, and let C2G handle procurement, shipping, and delivery to Ghana.
              </p>
              <ul className="space-y-3 pt-2">
                {['Access products from China', 'Secure ordering and payments', 'No sourcing or shipping headaches', 'Delivered straight to Ghana'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full relative h-[400px] rounded-2xl border border-border bg-black/40 overflow-hidden shadow-2xl flex items-center justify-center">
              <ShoppingCart className="w-32 h-32 text-primary/20" />
            </div>
          </div>
        </section>

        {/* HOW C2G WORKS */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need To Import From China</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">A seamless four-step process designed to remove the friction from international procurement and shipping.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Buy Products", desc: "Purchase directly from 1688, Taobao, Pinduoduo, Alibaba, and other Chinese marketplaces.", icon: ShoppingCart },
              { title: "Send To Our Warehouse", desc: "Use your unique C2G warehouse address and have your items delivered safely to our warehouse in China.", icon: MapPin },
              { title: "We Consolidate & Ship", desc: "We receive, inspect, consolidate, and ship your goods to Ghana via air or sea freight.", icon: PackageCheck },
              { title: "Receive In Ghana", desc: "Track your shipment every step of the way and collect your goods once they arrive.", icon: Home }
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="glass-panel p-6 hover:border-primary/50 transition-colors relative">
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center font-bold text-primary shadow-lg">{i + 1}</div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* OUR SERVICES */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-8 group hover:border-primary/30 transition-colors">
              <LinkIcon className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-4">Buy For Me</h3>
              <p className="text-muted-foreground">Don't have a Chinese account or payment method? Simply send us the product link and we'll purchase the item on your behalf, receive it at our warehouse, and ship it to Ghana.</p>
            </div>
            <div className="glass-panel p-8 group hover:border-primary/30 transition-colors">
              <MapPin className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-4">Warehouse Address</h3>
              <p className="text-muted-foreground">Get your personal China warehouse address. Shop from any Chinese marketplace and have your items delivered to us for consolidation and shipping.</p>
            </div>
            <div className="glass-panel p-8 group hover:border-primary/30 transition-colors">
              <Plane className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-4">Air Freight</h3>
              <p className="text-muted-foreground">Fast delivery for urgent shipments. Ideal for electronics, samples, small packages, and time-sensitive goods.</p>
            </div>
            <div className="glass-panel p-8 group hover:border-primary/30 transition-colors">
              <Ship className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-4">Sea Freight</h3>
              <p className="text-muted-foreground">Affordable shipping for bulk purchases and business imports. Perfect for wholesalers, retailers, and frequent importers.</p>
            </div>
          </div>
        </section>

        {/* FOR MINI IMPORTERS */}
        <section className="glass-panel p-8 md:p-12 border-l-4 border-l-accent relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent z-0" />
          <div className="relative z-10 flex flex-col md:flex-row gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/30 text-xs font-bold uppercase tracking-wider mb-2">
                Coming Soon
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built For WhatsApp Sellers & Mini Importers</h2>
              <p className="text-lg text-muted-foreground">
                Turn your WhatsApp import business into a fully managed operation. List products, receive customer orders, track profits, and let C2G handle procurement, warehousing, and shipping while you focus on growing your customer base.
              </p>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Manage products from one dashboard",
                  "Receive customer orders automatically",
                  "Track profits in real time",
                  "List products on C2G Mall",
                  "Monitor shipment progress",
                  "Request payouts easily",
                  "Scale business without operational stress"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-background/50 p-3 rounded-lg border border-border/50">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SHOP LOCAL (Your China Address) */}
        <section className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border text-sm font-bold mb-2">
              Your China Address
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Shop Like a Local</h2>
            <p className="text-lg text-muted-foreground">
              Get your own warehouse address in China. Shop directly from Taobao, 1688, Tmall, and other local Chinese websites, and have your items shipped to our warehouse.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Get Your Address</h4>
                  <p className="text-sm text-muted-foreground">Instant access upon signup</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Shop Anywhere</h4>
                  <p className="text-sm text-muted-foreground">Taobao, 1688, Tmall & more</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Plane className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">We Ship to You</h4>
                  <p className="text-sm text-muted-foreground">Consolidated shipping to Ghana</p>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <Link href="/signup" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-bold transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 shadow-lg shadow-primary/25 hover:scale-[1.02]">
                Get My Address <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full bg-gradient-to-br from-secondary to-background border border-border rounded-2xl h-[500px] p-8 relative overflow-hidden shadow-2xl flex items-center justify-center">
             <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
             <MapPin className="w-48 h-48 text-primary/20 absolute -right-10 -bottom-10" />
             <div className="glass-panel p-6 w-full max-w-sm space-y-4 shadow-xl z-10 relative border-primary/20">
               <div className="flex justify-between items-center border-b border-border/50 pb-3">
                 <span className="font-bold text-muted-foreground text-sm uppercase tracking-wider">Your Warehouse</span>
                 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-500 border border-green-500/30">Active</span>
               </div>
               <div>
                 <p className="text-xs text-muted-foreground mb-1">Receiver Name</p>
                 <p className="font-mono font-bold text-foreground">C2G-Kwadwo</p>
               </div>
               <div>
                 <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                 <p className="font-mono font-bold text-foreground">18588889999</p>
               </div>
               <div>
                 <p className="text-xs text-muted-foreground mb-1">Address</p>
                 <p className="font-medium text-foreground text-sm">Guangdong Province, Guangzhou City, Baiyun District...</p>
               </div>
             </div>
          </div>
        </section>

        {/* STATISTICS */}
        <section className="bg-primary rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
           <div className="relative z-10 space-y-12">
             <div>
               <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground mb-2">Why Choose C2G Logistics?</h2>
               <p className="text-primary-foreground/80 text-lg">Trusted by thousands for seamless China-Ghana logistics.</p>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               <div className="space-y-2">
                 <div className="text-4xl md:text-5xl font-black text-white">450+</div>
                 <div className="text-primary-foreground/80 font-medium">Happy Customers</div>
               </div>
               <div className="space-y-2">
                 <div className="text-4xl md:text-5xl font-black text-white">2k+</div>
                 <div className="text-primary-foreground/80 font-medium">Orders Delivered</div>
               </div>
               <div className="space-y-2">
                 <div className="text-4xl md:text-5xl font-black text-white">99%</div>
                 <div className="text-primary-foreground/80 font-medium">Success Rate</div>
               </div>
               <div className="space-y-2">
                 <div className="text-4xl md:text-5xl font-black text-white">24/7</div>
                 <div className="text-primary-foreground/80 font-medium">Support</div>
               </div>
             </div>
           </div>
        </section>

        {/* THE C2G ADVANTAGE */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
             <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border text-sm font-bold mb-2">
              Why Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">The C2G Advantage</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We make importing simple, secure, and affordable.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "E-commerce Excellence", desc: "Curated products, quality checks, and seamless shopping experience.", icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-500/10" },
              { title: "Fast Logistics", desc: "10-day shipping cycles. Quick customs clearance and delivery.", icon: Plane, color: "text-green-500", bg: "bg-green-500/10" },
              { title: "Secure Transactions", desc: "Pay securely with Mobile Money or Card via Paystack.", icon: ShieldCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
              { title: "24/7 Support", desc: "Always here to help via WhatsApp, Email, or Phone.", icon: MessageCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
              { title: "Dedicated Warehouse", desc: "Your personal space in China for consolidation.", icon: MapPin, color: "text-red-500", bg: "bg-red-500/10" },
              { title: "Transparent Pricing", desc: "No hidden fees. Know exactly what you're paying for.", icon: TrendingUp, color: "text-teal-500", bg: "bg-teal-500/10" }
            ].map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div key={i} className="glass-panel p-8 hover:border-primary/50 transition-all hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${benefit.bg}`}>
                    <Icon className={`w-6 h-6 ${benefit.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* WHY CHOOSE C2G & TRACKING */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Why Choose C2G</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Transparency", desc: "Track your orders and shipments from purchase to delivery." },
                { title: "Secure Payments", desc: "Safe and verified purchasing from trusted Chinese suppliers." },
                { title: "Consolidation", desc: "Combine multiple packages into a single shipment and save." },
                { title: "Reliable Shipping", desc: "Regular air and sea shipments from China to Ghana." },
                { title: "Customer Support", desc: "Our team is available to assist you throughout the import process." },
                { title: "Built For Ghana", desc: "Designed specifically for Ghanaian importers, businesses, and resellers." }
              ].map((item, i) => (
                <div key={i}>
                  <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-8">
            <h3 className="text-2xl font-bold mb-2">Know Where Your Goods Are</h3>
            <p className="text-muted-foreground mb-8">No more guessing. No more endless follow-ups.</p>
            <div className="relative pl-6 space-y-6">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-secondary"></div>
              {[
                "Purchased", "Received At Warehouse", "Consolidated", 
                "Shipped", "In Transit", "Arrived Ghana", "Clearance", "Ready For Pickup"
              ].map((status, i) => (
                <div key={i} className="relative flex items-center gap-4">
                  <div className="absolute -left-6 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                  <span className="font-medium">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="glass-panel p-12 text-center relative overflow-hidden border-primary/30">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ready To Shop, Import, Or Grow Your Business?</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of customers, importers, and businesses using C2G to access products from China and manage their imports with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:scale-[1.02]">
                Create Free Account
              </Link>
              <button className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input glass hover:bg-accent hover:text-accent-foreground h-12 px-8">
                Get Shipping Quote
              </button>
            </div>
            <p className="pt-4 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Contact Us
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}

// Simple Home Icon for the works section
function Home(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
