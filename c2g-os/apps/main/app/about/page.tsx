import { SiteNav } from "../../components/site-nav";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingCart, Globe, ShieldCheck, MapPin, Search, CreditCard, PackageCheck, Truck, TrendingUp, Briefcase, UserCheck, Ship } from "lucide-react";

export const metadata = {
  title: "About Us | C2G Logistics | Your Gateway to China, Delivered to Ghana",
  description: "C2G is building a bridge between China's supply ecosystem and Ghanaian consumers and businesses, combining technology, sourcing, payments, logistics, and local support into one experience.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SiteNav />

      {/* 1. HERO SECTION */}
      <section className="relative py-28 md:py-40 bg-gradient-to-br from-[#020817] via-primary/20 to-[#020817] overflow-hidden pt-36">
        <div className="absolute inset-0 opacity-20 bg-[url('/noise.png')] mix-blend-overlay pointer-events-none" />
        <div className="absolute -top-1/2 -right-1/4 w-[60%] h-[200%] rounded-full bg-primary/10 blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary/80 text-secondary-foreground border border-border text-sm font-bold tracking-wide uppercase shadow-sm backdrop-blur-md">
            About C2G
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-balance">
            Connecting Ghana to the world's <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">largest marketplace.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto text-balance">
            C2G Logistics is a Ghanaian logistics and commerce company built to make buying from China simpler, safer, and more accessible.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto text-balance">
            From sourcing products and paying suppliers to international shipping and local delivery, we help individuals, entrepreneurs, and businesses move products from China to Ghana with confidence.
          </p>
        </div>
      </section>

      {/* 2. MORE THAN LOGISTICS */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                More Than Logistics.
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  China is home to an enormous ecosystem of manufacturers, wholesalers, suppliers, and marketplaces. But for many Ghanaians, accessing that ecosystem can be complicated.
                </p>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-foreground font-medium pt-2">
                {[
                  "Language barriers.",
                  "Payment restrictions.",
                  "Supplier communication.",
                  "International shipping.",
                  "Currency conversion.",
                  "Uncertainty about suppliers."
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {item}
                  </li>
                ))}
              </ul>
              <div className="p-6 rounded-2xl bg-secondary/30 border border-border relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />
                <p className="text-xl font-bold text-foreground">
                  C2G was built to simplify that entire journey.
                </p>
                <p className="text-muted-foreground mt-2">
                  We are building a bridge between China's supply ecosystem and Ghanaian consumers and businesses, combining technology, sourcing, payments, logistics, and local support into one experience.
                </p>
              </div>
            </div>
            
            <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-secondary/10 flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0" />
              <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700">
                <Image src="/logo.png" alt="C2G Logistics Logo" fill className="object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-0 pointer-events-none" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center justify-between bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-primary" />
                    <span className="font-bold">Global Supply</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-green-500" />
                    <span className="font-bold">Local Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BIG SECTION: C2G MALL */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="relative order-2 lg:order-1 flex justify-center mt-12 lg:mt-0">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
              {/* iPhone Mockup Container */}
              <div className="relative w-[360px] sm:w-[420px] lg:w-[480px] aspect-[9/19] z-10 drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)] hover:-translate-y-2 transition-transform duration-700">
                <Image 
                  src="/images/c2gmall-mockup.png" 
                  alt="C2G Mall Mobile App Mockup" 
                  fill 
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* Floating badges around mockup */}
              <div className="absolute top-20 -left-6 lg:-left-12 glass-panel px-4 py-2 rounded-xl text-sm font-bold shadow-xl flex items-center gap-2 animate-[bounce_3s_infinite]">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> ₵140.50
              </div>
              <div className="absolute bottom-32 -right-6 lg:-right-12 glass-panel px-4 py-2 rounded-xl text-sm font-bold shadow-xl flex items-center gap-2 animate-[bounce_4s_infinite_1s]">
                <ShoppingCart className="w-4 h-4 text-primary" /> Cart (3)
              </div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-bold tracking-wide shadow-sm">
                Introducing C2G Mall
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-balance leading-none">
                The 1688 experience, made for Ghana. 🇬🇭
              </h2>
              <p className="text-xl font-medium text-foreground">
                C2G Mall is our vision for a new way to shop from China.
              </p>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Instead of navigating unfamiliar Chinese marketplaces, dealing with language barriers, figuring out international payments, and arranging shipping yourself, C2G Mall brings the experience closer to home.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4">
                {['Search', 'Discover', 'Order', 'Track', 'Receive'].map((word, i) => (
                  <span key={i} className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                    {word}
                  </span>
                ))}
              </div>
              <p className="text-xl font-bold pt-2">All from one platform.</p>
              
              <div className="pt-6 border-t border-border/50">
                <p className="text-muted-foreground">
                  From electronics and fashion to beauty, home products, gadgets, accessories, tools, and more, our goal is to make discovering products from China as easy as shopping locally.
                </p>
              </div>
              
              <Link href="/shop" className="inline-flex items-center justify-center gap-2 rounded-xl text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 shadow-lg shadow-primary/30 hover:scale-[1.02] transition-all">
                Explore C2G Mall <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
          </div>
        </div>
      </section>

      {/* 4 & 5. WHY WE BUILT C2G MALL + VISUAL COMPARISON */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6 mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">Why We Built C2G Mall</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              For years, accessing Chinese marketplaces has largely required customers to figure everything out themselves. We believe it shouldn't be that complicated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 relative">
            {/* Divider line on desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border/50 -translate-x-1/2" />
            
            {/* The Old Way */}
            <div className="space-y-8 relative">
              <div className="inline-flex items-center px-4 py-1.5 rounded-md bg-destructive/10 text-destructive border border-destructive/20 text-sm font-bold tracking-widest uppercase">
                The Old Way
              </div>
              
              <div className="space-y-0 opacity-60 grayscale relative pl-6 border-l-2 border-destructive/30">
                {[
                  "Chinese marketplace",
                  "Language barriers",
                  "Supplier communication",
                  "Payment challenges",
                  "Shipping arrangements",
                  "Tracking",
                  "Ghana delivery"
                ].map((step, i, arr) => (
                  <div key={i} className="relative py-4">
                    <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-destructive/50" />
                    <p className="text-lg font-medium">{step}</p>
                    {i < arr.length - 1 && (
                      <div className="text-destructive/50 text-xs mt-3 ml-2">↓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* The C2G Way */}
            <div className="space-y-8 relative">
              <div className="inline-flex items-center px-4 py-1.5 rounded-md bg-primary/20 text-primary border border-primary/30 text-sm font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                The C2G Way
              </div>
              
              <div className="space-y-8 relative pl-8 border-l-4 border-primary">
                
                <div className="relative bg-secondary/50 p-6 rounded-2xl border border-border shadow-lg">
                  <div className="absolute -left-[42px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.6)]">
                    <Search className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-bold text-primary mb-1">SEARCH</h4>
                  <p className="text-muted-foreground font-medium">Find products</p>
                </div>
                
                <div className="text-primary text-xl ml-4 font-black">↓</div>

                <div className="relative bg-secondary/50 p-6 rounded-2xl border border-border shadow-lg">
                  <div className="absolute -left-[42px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.6)]">
                    <CreditCard className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-bold text-primary mb-1">ORDER</h4>
                  <p className="text-muted-foreground font-medium">Pay in a familiar way (GHS)</p>
                </div>
                
                <div className="text-primary text-xl ml-4 font-black">↓</div>

                <div className="relative bg-primary/10 p-6 rounded-2xl border border-primary/20 shadow-lg group hover:bg-primary/20 transition-colors">
                  <div className="absolute -left-[42px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.6)]">
                    <PackageCheck className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-1">C2G HANDLES THE JOURNEY</h4>
                  <p className="text-primary font-medium">Procurement + shipping + logistics</p>
                </div>

                <div className="text-primary text-xl ml-4 font-black">↓</div>

                <div className="relative bg-secondary/50 p-6 rounded-2xl border border-border shadow-lg">
                  <div className="absolute -left-[42px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.6)]">
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-green-500 mb-1">RECEIVE</h4>
                  <p className="text-muted-foreground font-medium">Get your order in Ghana 🇬🇭</p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. WHO IS C2G FOR? */}
      <section className="py-24 bg-secondary/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Built for Everyone Who Wants to Buy From China</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-panel p-8 rounded-3xl hover:-translate-y-1 transition-transform border-white/5 shadow-xl bg-background/50">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-6">
                <ShoppingCart className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Everyday Shoppers</h3>
              <p className="text-muted-foreground leading-relaxed">Discover products that may not be readily available locally. Shop direct for personal use.</p>
            </div>
            
            <div className="glass-panel p-8 rounded-3xl hover:-translate-y-1 transition-transform border-white/5 shadow-xl bg-background/50">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Entrepreneurs</h3>
              <p className="text-muted-foreground leading-relaxed">Source products for your business without having to travel to China or navigate complex platforms.</p>
            </div>
            
            <div className="glass-panel p-8 rounded-3xl hover:-translate-y-1 transition-transform border-white/5 shadow-xl bg-background/50">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-6">
                <Briefcase className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Retailers</h3>
              <p className="text-muted-foreground leading-relaxed">Find products and suppliers to expand your inventory with better margins.</p>
            </div>
            
            <div className="glass-panel p-8 rounded-3xl hover:-translate-y-1 transition-transform border-white/5 shadow-xl bg-background/50 lg:col-span-2">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                <Ship className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Importers</h3>
              <p className="text-muted-foreground leading-relaxed">Use C2G's sourcing and logistics infrastructure to simplify your imports. We handle the heavy lifting while you focus on sales.</p>
            </div>
            
            <div className="glass-panel p-8 rounded-3xl hover:-translate-y-1 transition-transform border-white/5 shadow-xl bg-background/50">
              <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center mb-6">
                <UserCheck className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">First-Time Importers</h3>
              <p className="text-muted-foreground leading-relaxed">Never imported from China before? C2G holds your hand and helps you navigate the entire process securely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MORE THAN A MARKETPLACE */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">More Than a Marketplace</h2>
              <p className="text-xl text-muted-foreground">
                C2G Mall isn't just about displaying products. Behind every order is an infrastructure designed to help move products from China to Ghana.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
              {[
                { num: "01", title: "Sourcing", desc: "We help customers access products from China's extensive supplier ecosystem." },
                { num: "02", title: "Procurement", desc: "Need us to purchase on your behalf? We handle the transaction directly with suppliers." },
                { num: "03", title: "Consolidation", desc: "Multiple purchases can be managed through our China-side logistics network." },
                { num: "04", title: "Int. Shipping", desc: "Choose the air or sea shipping option that perfectly fits your budget and timeline needs." },
                { num: "05", title: "Tracking", desc: "Follow your order throughout its journey with transparent, real-time updates." },
                { num: "06", title: "Ghana Delivery", desc: "Your order completes its journey right here in Ghana, delivered to your door or ready for pickup." }
              ].map((step, i) => (
                <div key={i} className="space-y-3">
                  <div className="text-4xl font-black text-border">{step.num}</div>
                  <h4 className="text-xl font-bold">{step.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. WHERE WE'RE GOING */}
      <section className="py-24 bg-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Where We're Going</h2>
          <p className="text-2xl font-bold text-foreground">
            We're building more than a logistics company.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our long-term vision is to build a technology-driven bridge between Chinese commerce and African markets, starting with Ghana.
            C2G is evolving from a logistics service into a platform where people can discover, purchase, import, and receive products from China through one connected ecosystem.
          </p>
          <div className="glass-panel p-8 rounded-3xl inline-block text-left w-full max-w-2xl mx-auto border-primary/20 shadow-xl bg-background/80">
            <p className="text-xl font-bold mb-4">Today, that starts with C2G Mall.</p>
            <p className="text-muted-foreground mb-6">Tomorrow, it can extend far beyond products:</p>
            <div className="flex flex-wrap gap-3">
              {['Vehicles', 'Business supplies', 'Wholesale sourcing', 'Manufacturing connections', 'Trade services'].map((item, i) => (
                <span key={i} className="px-4 py-2 rounded-full bg-secondary text-foreground font-medium text-sm border border-border">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9 & 10 & 11. PHILOSOPHY, MISSION & VISION */}
      <section className="py-32 relative overflow-hidden bg-[#020817] text-white border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-4xl mx-auto mb-32">
            <div className="space-y-4">
              <div className="text-5xl mb-4">🇨🇳</div>
              <h4 className="text-xl font-bold text-white">China has the supply.</h4>
              <p className="text-white/60">Millions of manufacturers, wholesalers, products, and businesses.</p>
            </div>
            <div className="space-y-4 relative flex flex-col justify-center">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent -translate-y-1/2 -z-10" />
              <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.6)]">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-primary">C2G builds the bridge.</h4>
              <p className="text-white/60 text-sm">Technology + sourcing + payments + logistics.</p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl mb-4">🇬🇭</div>
              <h4 className="text-xl font-bold text-white">Ghana gets access.</h4>
              <p className="text-white/60">Products delivered to customers and businesses across Ghana.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            <div className="space-y-6">
              <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Our Mission</h3>
              <p className="text-xl font-medium leading-relaxed">
                To make global commerce accessible to everyone in Ghana.
              </p>
              <p className="text-white/70 leading-relaxed">
                We believe where you live shouldn't determine what you can buy, build, or sell. C2G exists to reduce the barriers between Ghanaian customers and the global supply chains that power modern commerce.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Our Vision</h3>
              <p className="text-xl font-medium leading-relaxed">
                To become Africa's most trusted gateway to Chinese commerce.
              </p>
              <p className="text-white/70 leading-relaxed">
                Starting with Ghana, we envision a future where buying from China is as simple as shopping locally, empowering a new generation of consumers and businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FINAL CTA */}
      <section className="py-24 text-center px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Ready to discover what's possible?</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Whether you're buying one product or sourcing inventory for your business, C2G is here to help you get from China to Ghana.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/shop" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 shadow-lg shadow-primary/30 hover:scale-[1.02] transition-all">
              <ShoppingCart className="w-5 h-5" /> Explore C2G Mall
            </Link>
            <Link href="/get-quote" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl text-base font-bold border border-input bg-transparent hover:bg-secondary h-14 px-10 transition-all">
              <Truck className="w-5 h-5" /> Get Shipping Quote
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
