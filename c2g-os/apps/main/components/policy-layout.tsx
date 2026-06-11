"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface TocItem {
  id: string;
  label: string;
}

interface PolicyLayoutProps {
  crumbIcon: string; // e.g. "fa-shield-alt"
  title: string;
  subtitle: string;
  effectiveDate: string;
  toc: TocItem[];
  children: React.ReactNode;
  relatedLinks?: { href: string; icon: string; label: string; sub: string }[];
}

export function PolicyLayout({ crumbIcon, title, subtitle, effectiveDate, toc, children, relatedLinks }: PolicyLayoutProps) {
  const tocRef = useRef<HTMLOListElement>(null);

  // Active TOC highlighting
  useEffect(() => {
    const links = tocRef.current?.querySelectorAll("a[href^='#']");
    if (!links) return;

    const articles = Array.from(links)
      .map(a => document.querySelector((a as HTMLAnchorElement).getAttribute("href")!))
      .filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          links.forEach(l => l.classList.remove("active"));
          const id = visible[0]?.target.id;
          const active = Array.from(links).find(l => (l as HTMLAnchorElement).getAttribute("href") === `#${id}`);
          active?.classList.add("active");
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    articles.forEach(a => observer.observe(a));
    return () => observer.disconnect();
  }, []);

  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Hero */}
      <section className="relative py-24 pt-32 bg-gradient-to-br from-primary to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20"
            style={{ background: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15), transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.10), transparent 50%)" }} />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-xs font-bold uppercase tracking-widest text-white mb-5">
            <i className={`fas ${crumbIcon} text-[0.7rem]`} /> Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>{title}</h1>
          <p className="text-lg text-white/90 max-w-2xl mb-6 leading-relaxed">{subtitle}</p>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 border border-white/25 text-sm font-medium text-white">
            <i className="far fa-calendar-alt" /> Effective Date: <strong className="font-bold">{effectiveDate}</strong>
          </span>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 items-start">
            {/* TOC */}
            <aside className="lg:sticky lg:top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">On this page</h4>
              <ol className="list-none p-0 m-0 space-y-0.5" ref={tocRef}
                style={{ counterReset: "toc" }}>
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleTocClick(e, `#${item.id}`)}
                      className="flex items-baseline gap-2.5 px-2.5 py-2 rounded-lg text-sm text-foreground/80 hover:text-primary hover:bg-primary/8 transition-colors [&.active]:text-primary [&.active]:bg-primary/8 no-underline"
                    >
                      <span className="shrink-0 w-5 text-muted-foreground text-xs font-semibold flex items-center justify-end pr-1 mt-0.5">
                        {toc.indexOf(item) + 1}.
                      </span>
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            {/* Content */}
            <div className="min-w-0 space-y-10">
              {children}

              {/* Related links */}
              {relatedLinks && relatedLinks.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4" aria-label="Related policies">
                  {relatedLinks.map((rel) => (
                    <Link key={rel.href} href={rel.href}
                      className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group no-underline">
                      <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <i className={`fas ${rel.icon}`} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-foreground">{rel.label}</span>
                        <small className="text-xs text-muted-foreground">{rel.sub}</small>
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-12 p-5 rounded-xl border border-dashed border-primary/30 bg-primary/5 text-center text-sm text-muted-foreground">
                Have a question we didn't answer here?{" "}
                <Link href="/contact" className="text-primary font-semibold hover:underline">Get in touch with our team</Link>.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* Reusable article component */
export function PolicyArticle({ id, num, title, children }: { id: string; num: number; title: string; children: React.ReactNode }) {
  return (
    <article id={id} className="scroll-mt-24 space-y-4" style={{ scrollMarginTop: "6rem" }}>
      <h2 className="flex items-center gap-3.5 text-2xl font-bold tracking-tight border-b border-border pb-3">
        <span className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-700 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-primary/25">
          {num}
        </span>
        {title}
      </h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed">
        {children}
      </div>
    </article>
  );
}

export function PolicyCallout({ type = "warning", children }: { type?: "warning" | "info"; children: React.ReactNode }) {
  const isInfo = type === "info";
  return (
    <div className={`flex gap-3.5 p-4 rounded-xl border ${isInfo ? "bg-blue-500/10 border-blue-500/30" : "bg-amber-500/10 border-amber-500/30"}`}>
      <span className={`shrink-0 ${isInfo ? "text-blue-500" : "text-amber-500"}`}>
        <i className={`fas ${isInfo ? "fa-circle-info" : "fa-triangle-exclamation"}`} />
      </span>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export function PolicyContactCard() {
  return (
    <div className="mt-4 p-5 rounded-xl border border-border bg-card shadow-sm">
      <h4 className="font-bold mb-4 text-foreground">C2G Logistics</h4>
      <ul className="space-y-3">
        <li className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <i className="fas fa-envelope text-sm" />
          </span>
          <a href="mailto:c2glogisticsgh@gmail.com" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">c2glogisticsgh@gmail.com</a>
        </li>
        <li className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <i className="fab fa-whatsapp text-sm" />
          </span>
          <a href="https://wa.me/233241465282" target="_blank" rel="noopener" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">+233 24 146 5282</a>
        </li>
        <li className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <i className="fas fa-globe text-sm" />
          </span>
          <a href="https://www.c2g-logistics.com" target="_blank" rel="noopener" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">www.c2g-logistics.com</a>
        </li>
      </ul>
    </div>
  );
}
