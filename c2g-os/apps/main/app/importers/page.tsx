import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { 
  ArrowRight, CheckCircle2, XCircle, Store, TrendingUp, Package, 
  CreditCard, Truck, BarChart, Users, Clock, ShieldCheck, 
  Globe, Smartphone, ShoppingBag, MapPin, Search, Wallet, Ship
} from "lucide-react";

export const metadata: Metadata = {
  title: "C2G Importer Platform | Run Your WhatsApp Business",
  description: "Stop manually collecting orders. Let C2G handle procurement, logistics, and operations while you focus on growing your customer base.",
};

export default function ImportersLandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      {/* ── STICKY NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative flex items-center justify-center transition-transform group-hover:scale-105">
              <Image src="/logo.png" alt="C2G Logistics Logo" fill className="object-contain" />
            </div>
            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-red-500">
              C2G Importers
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/importers/login" className="hidden sm:block text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              Log In
            </Link>
            <Link href="/importers/register" className="h-10 px-5 bg-primary text-primary-foreground font-bold text-sm rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Apply As Importer
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="pt-40 pb-20 px-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white/90 font-bold text-sm mb-8 animate-fade-in-up shadow-xl">
            <Ship className="w-4 h-4 text-blue-400" /> The future of mini importation in Ghana
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-balance mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Turn Your WhatsApp Import Business Into A Real Business
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 text-balance leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Stop manually collecting orders, counting quantities, calculating profits, and managing spreadsheets. Let C2G handle procurement, logistics, and operations while you focus on growing your customer base.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up mb-16" style={{ animationDelay: '300ms' }}>
            <Link href="/importers/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-primary hover:to-blue-500 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all hover:scale-105 flex items-center justify-center gap-2">
              Apply As An Importer <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-foreground font-bold text-lg rounded-2xl transition-all flex items-center justify-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center pl-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </span>
              Watch How It Works
            </button>
          </div>

          <div className="relative w-full max-w-4xl mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <Image 
              src="/images/sellers/hero-illustration.png" 
              alt="Importer Dashboard Illustration" 
              width={1200}
              height={800}
              className="w-full h-auto object-cover" 
            />
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="py-24 px-4 bg-red-950/20 border-y border-red-900/30 relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-900/10 to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance mb-4">Sound Familiar?</h2>
            <p className="text-xl text-red-200/60 font-medium">You spend hours every week:</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-lg font-medium text-red-100/90 max-w-2xl mx-auto mb-12">
            {[
              "Collecting orders in WhatsApp",
              "Counting quantities manually",
              "Tracking payments",
              "Calculating profits",
              "Organizing customer lists",
              "Purchasing products yourself",
              "Answering the same questions repeatedly"
            ].map((problem, i) => (
              <div key={i} className="flex items-center gap-3 bg-red-950/40 p-4 rounded-xl border border-red-900/30">
                <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                <span>{problem}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-block bg-red-950/50 border border-red-900/50 text-red-200 px-6 py-4 rounded-2xl font-bold text-xl text-balance shadow-2xl">
              The more customers you get, the harder your business becomes to manage.
            </div>
          </div>
        </div>
      </section>

      {/* ── THE SOLUTION ── */}
      <section className="py-24 px-4 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl mb-8 transform -rotate-6 shadow-blue-500/20">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Meet The C2G Importer Platform
          </h2>
          <p className="text-2xl text-primary font-bold mb-4">
            A complete operating system for Ghanaian mini importers.
          </p>
          <p className="text-xl text-muted-foreground">
            Upload your products once and let C2G handle the rest.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 bg-secondary/30 border-y border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                step: "1", title: "Upload Products", icon: Package,
                desc: "List products from 1688, Taobao, Pinduoduo, Alibaba and more.",
                bullets: ["Product images", "Cost price", "Selling price", "Variants"],
                extra: "We'll generate product codes automatically."
              },
              {
                step: "2", title: "Share With Customers", icon: Smartphone,
                desc: "Post your products in your preferred channels just like you do today.",
                bullets: ["WhatsApp Groups", "WhatsApp Status", "Facebook", "TikTok", "Instagram"]
              },
              {
                step: "3", title: "Customers Order", icon: ShoppingBag,
                desc: "Instead of sending you messages, customers do it all through the platform.",
                bullets: ["Create C2G accounts", "Select products", "Make payments"],
                extra: "Orders automatically appear in your dashboard."
              },
              {
                step: "4", title: "We Purchase Everything", icon: CreditCard,
                desc: "At the end of your sales cycle, C2G purchases all products from suppliers in China.",
                bullets: ["No buying products", "No managing suppliers", "No tracking supplier orders"],
                isNegativeBullets: true
              },
              {
                step: "5", title: "You Get Paid", icon: Wallet,
                desc: "The system tracks everything in real-time. Request payouts directly from your dashboard.",
                bullets: ["Sales", "Costs", "Profits"]
              },
              {
                step: "6", title: "We Ship To Ghana", icon: Truck,
                desc: "Our dedicated team takes over the entire logistics chain.",
                bullets: ["Receives products", "Consolidates shipments", "Ships to Ghana", "Handles logistics"],
                extra: "You simply track progress."
              }
            ].map((item, i) => (
              <div key={i} className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
                <div className="absolute -right-4 -top-4 text-[120px] font-black text-white/[0.03] leading-none pointer-events-none group-hover:text-white/[0.05] transition-colors">{item.step}</div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.step}. {item.title}</h3>
                <p className="text-muted-foreground mb-6">{item.desc}</p>
                <ul className="space-y-2 mb-6">
                  {item.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm font-medium">
                      {item.isNegativeBullets ? <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />}
                      {b}
                    </li>
                  ))}
                </ul>
                {item.extra && (
                  <div className="pt-4 border-t border-white/10 text-sm font-bold text-primary/80">
                    {item.extra}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EARN MORE SALES (DUAL VISIBILITY) ── */}
      <section className="py-24 px-4 bg-background relative">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Earn More Sales</h2>
            <p className="text-xl text-muted-foreground font-medium">Your Products Appear In Two Places</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-blue-900/20 to-background border border-blue-500/20 relative overflow-hidden">
              <Store className="w-12 h-12 text-blue-500 mb-6" />
              <h3 className="text-3xl font-bold mb-4">Your Store</h3>
              <p className="text-lg text-muted-foreground">Customers from your WhatsApp groups buy directly through your dedicated storefront.</p>
            </div>
            
            <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-purple-900/20 to-background border border-purple-500/20 relative overflow-hidden">
              <Search className="w-12 h-12 text-purple-500 mb-6" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs uppercase tracking-wider mb-4 border border-purple-500/30">
                Massive Exposure
              </div>
              <h3 className="text-3xl font-bold mb-4">C2G Mall</h3>
              <p className="text-lg text-muted-foreground">Your products can also be discovered by thousands of customers organically browsing C2G Mall.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6 text-center text-xl font-bold">
            <span className="flex items-center justify-center gap-2 text-green-400 bg-green-500/10 px-6 py-3 rounded-2xl"><CheckCircle2 className="w-6 h-6" /> More visibility</span>
            <span className="flex items-center justify-center gap-2 text-green-400 bg-green-500/10 px-6 py-3 rounded-2xl"><CheckCircle2 className="w-6 h-6" /> More orders</span>
            <span className="flex items-center justify-center gap-2 text-green-400 bg-green-500/10 px-6 py-3 rounded-2xl"><CheckCircle2 className="w-6 h-6" /> More revenue</span>
          </div>
        </div>
      </section>

      {/* ── FEATURE DEEP DIVES ── */}
      <section className="py-24 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-6xl space-y-24">
          
          {/* Feature 1: Your Own Store */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full md:w-1/2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/20 mb-6 border border-blue-500/30">
                <Store className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Your Own Store</h2>
              <p className="text-lg text-muted-foreground mb-8">Every importer gets a dedicated, branded storefront link to share with customers.</p>
              
              <div className="bg-background/80 backdrop-blur-xl p-4 rounded-xl border border-white/10 font-mono text-sm text-primary mb-8 shadow-inner inline-block">
                c2g-logistics.com/store/<span className="text-white font-bold">abena-imports</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {["Logo", "Banner", "Products", "Categories", "Order Management"].map(i => (
                  <div key={i} className="flex items-center gap-2 font-medium text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> {i}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2 relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
              <div className="aspect-[4/3] rounded-3xl border border-white/10 bg-background/50 backdrop-blur-3xl shadow-2xl overflow-hidden relative flex flex-col">
                {/* Mockup Browser Header */}
                <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                {/* Mockup Body */}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="h-24 w-full bg-blue-900/30 rounded-xl mb-4 relative overflow-hidden">
                    <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-full bg-blue-600 border-4 border-background" />
                  </div>
                  <div className="h-6 w-1/3 bg-white/10 rounded-md mt-6 mb-2" />
                  <div className="h-4 w-1/4 bg-white/5 rounded-md mb-8" />
                  <div className="grid grid-cols-3 gap-4 flex-1">
                    {[1,2,3].map(i => (
                      <div key={i} className="bg-white/5 rounded-xl flex flex-col p-2">
                        <div className="flex-1 bg-white/5 rounded-lg mb-2" />
                        <div className="h-3 w-3/4 bg-white/10 rounded mb-1" />
                        <div className="h-3 w-1/2 bg-blue-500/50 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Track Profits */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
            <div className="w-full md:w-1/2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/20 mb-6 border border-green-500/30">
                <BarChart className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Track Profits Automatically</h2>
              <p className="text-lg text-muted-foreground mb-8">Stop using calculators and spreadsheets. See exactly how much your business is generating in real-time.</p>
              
              <div className="space-y-4">
                {[
                  "Revenue", "Cost Price", "Profit Per Product", "Total Profit", "Monthly Performance"
                ].map(i => (
                  <div key={i} className="flex items-center gap-3 bg-background/50 p-4 rounded-xl border border-white/5">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="font-bold">{i}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2 relative">
              <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full" />
              <div className="aspect-square sm:aspect-[4/3] rounded-3xl border border-white/10 bg-background/50 backdrop-blur-3xl shadow-2xl p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
                    <div className="text-2xl font-black">₵24,500.00</div>
                  </div>
                  <div className="bg-green-500/10 p-4 rounded-2xl border border-green-500/20">
                    <div className="text-sm text-green-400 mb-1">Net Profit</div>
                    <div className="text-2xl font-black text-green-500">₵8,250.00</div>
                  </div>
                </div>
                <div className="flex-1 bg-white/5 rounded-2xl border border-white/5 p-4 flex items-end gap-2">
                  {[40, 60, 35, 80, 50, 90, 70].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t-sm opacity-80" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: Shipment Tracking */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full md:w-1/2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/20 mb-6 border border-orange-500/30">
                <MapPin className="w-8 h-8 text-orange-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Shipment Tracking</h2>
              <p className="text-lg text-muted-foreground mb-8">Know exactly where your goods are at every stage of the journey.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  "Purchased", "Warehouse", "Consolidated", "Shipped",
                  "In Transit", "Arrived Ghana", "Clearance", "Ready For Pickup"
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-3 rounded-xl bg-background/50 border border-white/5 text-xs font-bold">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center mb-2 text-orange-500">{i+1}</div>
                    {step}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2 relative">
              <div className="absolute inset-0 bg-orange-500/20 blur-[100px] rounded-full" />
              <div className="aspect-[4/3] rounded-3xl border border-white/10 bg-background/50 backdrop-blur-3xl shadow-2xl p-8 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-10">
                  <Globe className="w-96 h-96" />
                </div>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4 opacity-50">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                    <span className="font-bold">Purchased in China</span>
                  </div>
                  <div className="flex items-center gap-4 opacity-50">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                    <span className="font-bold">Shipped via Air Freight</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                    <div className="relative flex items-center justify-center w-4 h-4">
                      <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-75" />
                      <div className="relative w-3 h-3 rounded-full bg-orange-500" />
                    </div>
                    <div>
                      <span className="font-bold text-orange-400 block">In Transit</span>
                      <span className="text-xs text-muted-foreground">Arriving in Accra in 2 days</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 opacity-30">
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <span className="font-bold">Ready for Pickup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── WHO IS THIS FOR / WHY THEY LOVE IT ── */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16">
            
            <div>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 mb-6 border border-white/10">
                <Users className="w-6 h-6 text-foreground" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-8">Who Is This For?</h2>
              
              <div className="space-y-4">
                {[
                  "WhatsApp Sellers", "Mini Importers", "Fashion Importers", 
                  "Beauty Product Sellers", "Electronics Sellers", 
                  "Business Owners", "Anyone Importing From China"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-lg font-medium p-4 rounded-2xl bg-secondary/30 border border-transparent hover:border-white/10 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-8 md:p-12 rounded-[2.5rem]">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">Why Importers Love C2G</h2>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Save Time</h3>
                    <p className="text-muted-foreground">Spend less time managing operations and spreadsheets.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Grow Faster</h3>
                    <p className="text-muted-foreground">Handle exponentially more customers without extra administrative work.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
                    <Globe className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Reach More Buyers</h3>
                    <p className="text-muted-foreground">Get massive organic exposure through C2G Mall.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                    <ShieldCheck className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Zero Stress</h3>
                    <p className="text-muted-foreground">We handle purchasing and shipping. You track profits and relax.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-8">Apply Today</h2>
          <p className="text-2xl text-white/80 font-medium mb-12 text-balance">
            The future of mini importation in Ghana starts here. Apply today and be among the first importers to access the platform.
          </p>
          <Link href="/importers/register" className="inline-flex items-center justify-center px-10 py-5 bg-white text-primary hover:bg-white/90 font-black text-xl rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105 gap-3">
            Apply As An Importer <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
      
    </div>
  );
}
