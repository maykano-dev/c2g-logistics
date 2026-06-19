import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Mail, Phone } from "lucide-react";

export function Footer({ hideCta = false }: { hideCta?: boolean }) {
  return (
    <footer className="w-full bg-secondary border-t border-border mt-auto">
      {/* Footer CTA */}
      {!hideCta && (
        <div className="bg-primary relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="absolute -top-[50%] -right-[10%] w-[50%] h-[200%] bg-white/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 py-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">Ready to ship from China to Ghana?</h3>
            <p className="text-primary-foreground/80 font-medium text-lg">Get a free quote in minutes. No signup required.</p>
          </div>
          <Link 
            href="/get-quote" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold transition-colors bg-background text-foreground hover:bg-background/90 h-12 px-8 gap-2 shadow-xl shadow-black/10 hover:scale-[1.02] shrink-0"
          >
            Get a Quote <ArrowRight className="w-4 h-4" />
          </Link>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 relative flex items-center justify-center">
                <Image src="/logo.png" alt="C2G Logistics Logo" fill className="object-contain" />
              </div>
              <span className="font-bold text-xl tracking-tight">C2G Logistics</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Your trusted bridge between China's marketplaces and your doorstep in Ghana. We handle procurement, shipping, and delivery end to end.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://wa.me/233241465282" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Phone className="w-4 h-4" />
              </a>
              <a href="mailto:c2glogisticsgh@gmail.com" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="font-bold mb-6 text-foreground">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Contact Us</Link></li>
              <li><Link href="/#process" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">How It Works</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="font-bold mb-6 text-foreground">Services</h4>
            <ul className="space-y-4">
              <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">C2G Mall</Link></li>
              <li><Link href="/#buy-for-me" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Buy For Me</Link></li>
              <li><Link href="/get-quote" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Shipping Calculator</Link></li>
              <li><Link href="/login" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Pay a Supplier</Link></li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div>
            <h4 className="font-bold mb-6 text-foreground">Account</h4>
            <ul className="space-y-4">
              <li><Link href="/login" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Login</Link></li>
              <li><Link href="/signup" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Sign Up</Link></li>
              <li><Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">My Dashboard</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-border/50 bg-background/50">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-medium">
            © {new Date().getFullYear()} C2G Logistics. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-6">
            <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Privacy Policy</Link></li>
            <li><Link href="/terms-and-conditions" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Terms & Conditions</Link></li>
            <li><Link href="/refund-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Refund Policy</Link></li>
            <li><Link href="/shipping-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Shipping Policy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
