"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

export function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/shop", label: "C2G Mall" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
            <div className="w-10 h-10 md:w-16 md:h-16 relative flex items-center justify-center">
              <Image src="/logo.png" alt="C2G Logistics Logo" fill className="object-contain" />
            </div>
            <span className="text-lg md:text-xl shrink-0">C2G Logistics</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/shop' ? 'text-primary' : 'text-muted-foreground'}`}>C2G Mall</Link>
            
            {/* Services dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                Services <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div
                className={`absolute top-full left-0 mt-2 w-52 rounded-xl border border-border bg-card shadow-xl shadow-black/10 py-2 transition-all ${servicesOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <Link href="/dashboard" className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors">Pay Supplier</Link>
                <Link href="/get-quote" className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors">Get Quote</Link>
                <Link href="/dashboard/warehouse" className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors">Get Warehouse Address</Link>
              </div>
            </div>

            <Link href="/about" className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/about' ? 'text-primary' : 'text-muted-foreground'}`}>About</Link>
            <Link href="/contact" className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/contact' ? 'text-primary' : 'text-muted-foreground'}`}>Contact</Link>
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Login</Link>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold h-9 px-5 shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] transition-all">
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border/50 space-y-1">
            <Link href="/shop" className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition-colors" onClick={() => setMobileOpen(false)}>C2G Mall</Link>
            <Link href="/dashboard" className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition-colors" onClick={() => setMobileOpen(false)}>Pay Supplier</Link>
            <Link href="/get-quote" className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition-colors" onClick={() => setMobileOpen(false)}>Get Quote</Link>
            <Link href="/about" className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition-colors" onClick={() => setMobileOpen(false)}>About</Link>
            <Link href="/contact" className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition-colors" onClick={() => setMobileOpen(false)}>Contact</Link>
            <div className="flex gap-3 px-3 pt-2">
              <Link href="/login" className="flex-1 text-center text-sm font-medium border border-border rounded-lg py-2.5 hover:bg-secondary transition-colors" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link href="/signup" className="flex-1 text-center text-sm font-semibold bg-primary text-primary-foreground rounded-lg py-2.5 hover:bg-primary/90 transition-colors" onClick={() => setMobileOpen(false)}>Sign Up</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
