import Link from "next/link";
import Image from "next/image";
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 space-y-10 md:space-y-16">
        
        {/* ── GALLERY HERO ── */}
        <section className="relative pt-24 lg:pt-32 pb-8 flex flex-col lg:flex-row items-center gap-10 lg:gap-12 animate-fade-in justify-center">

          {/* ── Left: Text Content ── */}
          <div className="flex-1 space-y-8 text-center lg:text-left z-10 relative">
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
              Whether you're shopping, importing for yourself, or running a WhatsApp business, C2G handles procurement, warehousing, consolidation, and delivery to Ghana.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/shop" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-13 px-8 shadow-lg shadow-primary/30 hover:scale-[1.02] transition-all">
                <ShoppingCart className="w-5 h-5" /> Shop on C2G Mall
              </Link>
              <Link href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full text-base font-semibold border border-input glass hover:bg-secondary h-13 px-8 transition-all">
                Start Importing <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground flex items-center justify-center lg:justify-start gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" /> Trusted by importers across Ghana.
            </p>
          </div>

          {/* ── Right: Gallery Columns ── */}
          <div className="absolute inset-0 sm:relative flex-1 w-full h-full sm:h-[520px] lg:h-[640px] overflow-hidden sm:rounded-3xl opacity-30 sm:opacity-100 pointer-events-none sm:pointer-events-auto z-0 sm:z-10">
            {/* Gradient overlays to blend edges */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 sm:from-background/70 via-transparent to-background/50 sm:to-background/20 z-20 pointer-events-none" />

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

        {/* PLATFORMS MARQUEE */}
        <section className="w-full overflow-hidden bg-transparent py-4 relative group">
          {/* Fading Edges */}
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />
          
          <div className="flex w-max items-center group-hover:[animation-play-state:paused]" style={{ animation: 'marquee 30s linear infinite' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-4 pr-4 py-2">
                {[
                  { name: "1688", color: "bg-[#ea580c]", glow: "bg-[#ea580c]/40" },
                  { name: "Taobao", color: "bg-[#f97316]", glow: "bg-[#f97316]/40" },
                  { name: "Pinduoduo", color: "bg-[#ec4899]", glow: "bg-[#ec4899]/40" },
                  { name: "Alibaba", color: "bg-[#3b82f6]", glow: "bg-[#3b82f6]/40" },
                  { name: "AliExpress", color: "bg-[#ef4444]", glow: "bg-[#ef4444]/40" },
                  { name: "Xianyu", color: "bg-[#eab308]", glow: "bg-[#eab308]/40" },
                  { name: "JD.com", color: "bg-[#dc2626]", glow: "bg-[#dc2626]/40" }
                ].map((platform, j) => (
                  <div key={j} className="flex-shrink-0 flex items-center gap-3 pl-2.5 pr-6 py-2 rounded-[2rem] bg-[#141414]/90 backdrop-blur-xl border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.3)] relative overflow-hidden inline-flex">
                    <div className={`absolute left-[-5%] top-1/2 -translate-y-1/2 w-16 h-16 rounded-full ${platform.glow} blur-[12px] z-0 pointer-events-none`} />
                    <div className={`w-3.5 h-3.5 rounded-full ${platform.color} animate-pulse z-10 flex-shrink-0 shadow-lg border border-black/20`} />
                    <span className="font-bold text-[15px] text-white/95 leading-none z-10">{platform.name}</span>
                  </div>
                ))}
              </div>
            ))}
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
            <div className="flex-1 w-full relative h-[300px] md:h-[400px] flex items-center justify-center transform transition-transform hover:-translate-y-2 duration-500">
              <Image 
                src="/images/shop-from-china.png" 
                alt="Shop Products From China" 
                fill 
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
              />
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
        <section className="glass-panel p-8 md:p-12 border-l-4 border-l-accent relative overflow-hidden mt-12">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent z-0" />
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Left Column: Text & Features */}
            <div className="flex-1 space-y-8 w-full">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent text-accent-foreground border border-accent/50 text-sm font-black uppercase tracking-widest mb-2 shadow-[0_0_20px_rgba(var(--accent),0.5)]">
                  Now Available
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                  Built For WhatsApp Sellers & Mini Importers
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  Turn your WhatsApp import business into a fully managed operation. List products, receive customer orders, track profits, and let C2G handle procurement, warehousing, and shipping while you focus on growing your customer base.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Manage products from one dashboard",
                  "Receive customer orders automatically",
                  "Track profits in real time",
                  "List products on C2G Mall",
                  "Monitor shipment progress",
                  "Scale business without operational stress"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-secondary/30 p-3.5 rounded-xl border border-border/50 hover:border-blue-500/50 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <span className="text-sm font-medium leading-tight">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-2 relative">
                {/* Background glow to emphasize pulse */}
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-[pulse_3s_ease-in-out_infinite]" />
                <Link href="/importers" className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-primary px-10 py-4 text-base font-extrabold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] gap-3 border border-blue-400/30 animate-[pulse_3s_ease-in-out_infinite]">
                  Launch Your Store <ArrowRight className="w-5 h-5 animate-pulse" />
                </Link>
              </div>
            </div>

            {/* Right Column: Staggered Image Gallery */}
            <div className="flex-1 w-full relative min-h-[340px] sm:min-h-[400px] lg:min-h-[600px] flex items-center justify-center mt-2 lg:mt-0 mb-[-2rem] sm:mb-0">
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/20 blur-[100px] rounded-full z-0 pointer-events-none" />
              
              <div className="relative z-10 w-full max-w-[600px] aspect-square flex items-center justify-center">
                {/* Back Image (Left) */}
                <div className="absolute top-[0%] left-[0%] w-[70%] sm:top-[10%] sm:left-[5%] sm:w-[55%] aspect-square rounded-3xl overflow-hidden border border-white/20 shadow-[0_8px_32px_rgba(255,255,255,0.1)] z-10 bg-white/5 backdrop-blur-xl transform -rotate-6 transition-all hover:opacity-100 hover:rotate-0 hover:z-50 hover:scale-110 duration-500 cursor-pointer p-0.5">
                  <Image src="/images/sellers/img2.png" alt="Dashboard 2" fill className="object-contain drop-shadow-2xl" />
                </div>

                {/* Back Image (Right) */}
                <div className="absolute top-[5%] right-[0%] w-[70%] sm:top-[15%] sm:right-[5%] sm:w-[55%] aspect-square rounded-3xl overflow-hidden border border-white/20 shadow-[0_8px_32px_rgba(255,255,255,0.1)] z-10 bg-white/5 backdrop-blur-xl transform rotate-6 transition-all hover:opacity-100 hover:rotate-0 hover:z-50 hover:scale-110 duration-500 cursor-pointer p-0.5">
                  <Image src="/images/sellers/img3.png" alt="Dashboard 3" fill className="object-contain drop-shadow-2xl" />
                </div>
                
                {/* Main Image (Center) */}
                <div className="absolute top-[15%] left-[15%] w-[70%] sm:top-[20%] sm:left-[22.5%] sm:w-[55%] aspect-square rounded-3xl overflow-hidden border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-20 bg-white/10 backdrop-blur-2xl transform transition-all hover:z-50 hover:scale-110 hover:-translate-y-4 duration-500 cursor-pointer p-0.5">
                  <Image src="/images/sellers/img1.png" alt="Dashboard 1" fill className="object-contain drop-shadow-2xl" />
                </div>
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
        <section className="relative rounded-[2rem] p-8 md:p-16 text-center overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-secondary/40 backdrop-blur-3xl my-12">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 z-0" />
           <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-[0.15] mix-blend-overlay z-0" />
           <div className="relative z-10 space-y-12">
             <div>
               <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">Why Choose C2G Logistics?</h2>
               <p className="text-muted-foreground text-lg">Trusted by thousands for seamless China-Ghana logistics.</p>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               <div className="space-y-3">
                 <div className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 drop-shadow-sm">450+</div>
                 <div className="text-primary font-bold uppercase tracking-widest text-xs">Happy Customers</div>
               </div>
               <div className="space-y-3">
                 <div className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 drop-shadow-sm">2k+</div>
                 <div className="text-primary font-bold uppercase tracking-widest text-xs">Orders Delivered</div>
               </div>
               <div className="space-y-3">
                 <div className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 drop-shadow-sm">99%</div>
                 <div className="text-primary font-bold uppercase tracking-widest text-xs">Success Rate</div>
               </div>
               <div className="space-y-3">
                 <div className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 drop-shadow-sm">24/7</div>
                 <div className="text-primary font-bold uppercase tracking-widest text-xs">Support</div>
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

        {/* CORE PILLARS & TRACKING */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Our Core Pillars</h2>
              <p className="text-muted-foreground text-lg max-w-lg">The foundational principles driving our commitment to your business.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Transparency", desc: "Track orders from purchase to delivery.", icon: Globe, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
                { title: "Secure Payments", desc: "Verified purchasing from trusted suppliers.", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
                { title: "Consolidation", desc: "Combine packages and save on shipping.", icon: PackageCheck, color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
                { title: "Reliable Shipping", desc: "Regular air and sea shipments to Ghana.", icon: Ship, color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
                { title: "Customer Support", desc: "Our team assists you at every step.", icon: MessageCircle, color: "text-pink-400", bg: "bg-pink-400/10 border-pink-400/20" },
                { title: "Built For Ghana", desc: "Designed specifically for Ghanaian importers.", icon: MapPin, color: "text-primary", bg: "bg-primary/10 border-primary/20" }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="group relative p-5 rounded-2xl bg-secondary/30 border border-white/5 hover:bg-secondary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${item.bg}`}>
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="glass-panel p-8 relative overflow-hidden group border-white/10 shadow-2xl bg-[#0f111a]/80">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-colors" />
            <h3 className="text-2xl font-bold mb-2 relative z-10 text-white">Know Where Your Goods Are</h3>
            <p className="text-muted-foreground mb-8 relative z-10">No more guessing. No more endless follow-ups.</p>
            
            <div className="space-y-0 relative z-10 mt-6">
              {[
                { status: "Purchased", date: "Oct 12, 09:41 AM", state: "done" },
                { status: "Received At Warehouse", date: "Oct 14, 02:15 PM", state: "done" },
                { status: "Consolidated", date: "Oct 15, 11:30 AM", state: "done" },
                { status: "Shipped", date: "Oct 16, 08:00 PM", state: "done" },
                { status: "In Transit", date: "Estimated 14 Days", state: "current" },
                { status: "Arrived Ghana", date: "Pending", state: "pending" },
                { status: "Clearance", date: "Pending", state: "pending" },
                { status: "Ready For Pickup", date: "Pending", state: "pending" }
              ].map((step, i, arr) => (
                <div key={i} className="flex gap-5 relative group cursor-default">
                  {/* Continuous Line */}
                  {i < arr.length - 1 && (
                    <div className={`absolute top-6 left-[11px] bottom-[-16px] w-[2px] ${step.state === 'done' ? 'bg-[#3b82f6]' : 'bg-white/10'}`} />
                  )}
                  
                  {/* Indicator */}
                  <div className="relative mt-1 flex-shrink-0 z-10">
                    {step.state === 'done' ? (
                      <div className="w-6 h-6 rounded-full bg-[#3b82f6] flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.6)]">
                         <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    ) : step.state === 'current' ? (
                      <div className="w-6 h-6 rounded-full border-[2px] border-[#3b82f6] bg-[#0f111a] flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                         <div className="w-2.5 h-2.5 bg-[#3b82f6] rounded-full animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-[2px] border-white/20 bg-[#0f111a] flex items-center justify-center" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className={`pb-6 ${step.state === 'pending' ? 'opacity-40' : 'opacity-100'}`}>
                    <p className={`font-bold text-base ${step.state === 'current' ? 'text-[#3b82f6]' : 'text-white'}`}>{step.status}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.date}</p>
                  </div>
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
              <Link href="/get-quote" className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input glass hover:bg-accent hover:text-accent-foreground h-12 px-8">
                Get Shipping Quote
              </Link>
            </div>
            <Link href="/contact" className="pt-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors block mx-auto w-fit">
              Contact Us
            </Link>
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
