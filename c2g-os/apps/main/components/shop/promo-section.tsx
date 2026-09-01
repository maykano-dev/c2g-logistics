"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Tag, Monitor, Watch, Car, Shirt, Gamepad2, Laptop, Home, Headphones, Smile } from 'lucide-react';

const largePromos = [
  {
    id: 'hero-1',
    title: 'Summer Tech Deals',
    subtitle: 'Up to 50% Off Smart Devices',
    description: 'Upgrade your lifestyle with our premium selection of electronics. Limited time offer.',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80',
    link: '/shop?query=electronics',
    buttonText: 'Shop Tech',
    gradient: 'from-blue-600/80 via-blue-900/60 to-black/80',
    icon: Monitor,
  },
  {
    id: 'hero-2',
    title: 'Luxury Watches',
    subtitle: 'Direct from Manufacturers',
    description: 'Discover premium timepieces at a fraction of the cost. Shop our exclusive collection today.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
    link: '/shop?query=watch',
    buttonText: 'Explore Watches',
    gradient: 'from-slate-600/80 via-slate-900/60 to-black/80',
    icon: Watch,
  },
  {
    id: 'hero-3',
    title: 'Pro Gaming Gear',
    subtitle: 'Elevate Your Setup',
    description: 'Mechanical keyboards, ultra-fast mice, and premium headsets for the ultimate edge.',
    image: 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&q=80',
    link: '/shop?query=gaming',
    buttonText: 'Shop Gaming',
    gradient: 'from-purple-600/80 via-purple-900/60 to-black/80',
    icon: Gamepad2,
  },
  {
    id: 'hero-4',
    title: 'Laptops & PCs',
    subtitle: 'Power & Performance',
    description: 'From lightweight ultrabooks to heavy-duty workstations, find your perfect machine.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80',
    link: '/shop?query=laptops',
    buttonText: 'View Laptops',
    gradient: 'from-teal-600/80 via-teal-900/60 to-black/80',
    icon: Laptop,
  }
];

const smallPromosTop = [
  {
    id: 'small-1',
    title: 'Sneaker Drops',
    subtitle: 'Exclusive New Arrivals',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80',
    link: '/shop?query=sneakers',
    buttonText: 'View Sneakers',
    gradient: 'from-red-600/80 via-red-900/60 to-black/80',
    icon: Tag,
  },
  {
    id: 'small-3',
    title: 'Auto Parts',
    subtitle: 'Wholesale Car Accessories',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80',
    link: '/shop?query=car accessories',
    buttonText: 'View Auto Parts',
    gradient: 'from-amber-600/80 via-amber-900/60 to-black/80',
    icon: Car,
  },
  {
    id: 'small-5',
    title: 'Home & Living',
    subtitle: 'Modern Decor & Tools',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80',
    link: '/shop?query=home garden',
    buttonText: 'Shop Home',
    gradient: 'from-emerald-600/80 via-emerald-900/60 to-black/80',
    icon: Home,
  },
  {
    id: 'small-7',
    title: 'Premium Audio',
    subtitle: 'Headphones & Speakers',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80',
    link: '/shop?query=audio',
    buttonText: 'View Audio',
    gradient: 'from-cyan-600/80 via-cyan-900/60 to-black/80',
    icon: Headphones,
  }
];

const smallPromosBottom = [
  {
    id: 'small-2',
    title: 'Womens Fashion',
    subtitle: 'Trending Styles 2026',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80',
    link: '/shop?query=womens fashion',
    buttonText: 'Shop Fashion',
    gradient: 'from-pink-600/80 via-pink-900/60 to-black/80',
    icon: Sparkles,
  },
  {
    id: 'small-4',
    title: 'Menswear',
    subtitle: 'Sharp & Casual Fits',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80',
    link: '/shop?query=mens clothing',
    buttonText: 'Shop Mens',
    gradient: 'from-indigo-600/80 via-indigo-900/60 to-black/80',
    icon: Shirt,
  },
  {
    id: 'small-6',
    title: 'Beauty',
    subtitle: 'Skincare & Cosmetics',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80',
    link: '/shop?query=beauty',
    buttonText: 'Shop Beauty',
    gradient: 'from-rose-600/80 via-rose-900/60 to-black/80',
    icon: Sparkles,
  },
  {
    id: 'small-8',
    title: 'Kids & Toys',
    subtitle: 'Joy for the Little Ones',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80',
    link: '/shop?query=toys',
    buttonText: 'View Toys',
    gradient: 'from-orange-600/80 via-orange-900/60 to-black/80',
    icon: Smile,
  }
];

export function PromoSection() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);

  useEffect(() => {
    // Independent intervals for asynchronous, random-feeling updates
    const heroTimer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % largePromos.length);
    }, 7000);

    const topTimer = setInterval(() => {
      setTopIndex((prev) => (prev + 1) % smallPromosTop.length);
    }, 5500);

    const bottomTimer = setInterval(() => {
      setBottomIndex((prev) => (prev + 1) % smallPromosBottom.length);
    }, 8000);

    return () => {
      clearInterval(heroTimer);
      clearInterval(topTimer);
      clearInterval(bottomTimer);
    };
  }, []);

  return (
    <section className="w-full mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto lg:h-[400px]">
        
        {/* Main Hero Card (Slides Left) */}
        <div className="col-span-1 lg:col-span-2 rounded-none overflow-hidden relative shadow-xl min-h-[300px]">
          <div 
            className="flex w-full h-full transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${heroIndex * 100}%)` }}
          >
            {largePromos.map((promo) => (
              <Link 
                key={promo.id}
                href={promo.link}
                className="w-full h-full flex-shrink-0 group relative flex flex-col justify-end p-8 border border-white/5 hover:border-primary/50 transition-colors duration-500 block"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0 overflow-hidden bg-muted">
                  <img 
                    src={promo.image} 
                    alt={promo.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 z-10 bg-gradient-to-r ${promo.gradient}`} />

                {/* Content */}
                <div className="relative z-20 w-full md:w-2/3 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-wider">
                    <promo.icon className="w-4 h-4" />
                    Featured Event
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md">
                    {promo.title}
                  </h2>
                  
                  <p className="text-lg md:text-xl text-white/90 font-medium">
                    {promo.subtitle}
                  </p>
                  
                  <p className="text-white/70 text-sm hidden md:block max-w-md pb-2">
                    {promo.description}
                  </p>

                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 shadow-lg shadow-primary/25 transition-transform group-hover:translate-x-2 pointer-events-none">
                    {promo.buttonText} <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side Small Cards Stack */}
        <div className="flex flex-col gap-4 h-full">
          
          {/* Top Small Track (Slides Left) */}
          <div className="flex-1 rounded-none overflow-hidden relative shadow-lg min-h-[180px]">
            <div 
              className="flex w-full h-full transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${topIndex * 100}%)` }}
            >
              {smallPromosTop.map((promo) => (
                <Link
                  key={promo.id}
                  href={promo.link}
                  className="w-full h-full flex-shrink-0 group relative flex flex-col justify-end p-6 border border-white/5 hover:border-white/20 transition-colors duration-500 block"
                >
                  <div className="absolute inset-0 z-0 overflow-hidden bg-muted">
                    <img 
                      src={promo.image} 
                      alt={promo.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className={`absolute inset-0 z-10 bg-gradient-to-t ${promo.gradient}`} />
                  <div className="relative z-20 space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
                      <promo.icon className="w-3.5 h-3.5" />
                      {promo.title}
                    </div>
                    <h3 className="text-2xl font-black text-white leading-tight">
                      {promo.subtitle}
                    </h3>
                    <div className="flex items-center text-white/80 text-sm font-semibold group-hover:text-white transition-colors">
                      {promo.buttonText} <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom Small Track (Slides Right) */}
          <div className="flex-1 rounded-none overflow-hidden relative shadow-lg min-h-[180px]">
            <div 
              className="flex w-full h-full flex-row-reverse transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(${bottomIndex * 100}%)` }}
            >
              {smallPromosBottom.map((promo) => (
                <Link
                  key={promo.id}
                  href={promo.link}
                  className="w-full h-full flex-shrink-0 group relative flex flex-col justify-end p-6 border border-white/5 hover:border-white/20 transition-colors duration-500 block"
                >
                  <div className="absolute inset-0 z-0 overflow-hidden bg-muted">
                    <img 
                      src={promo.image} 
                      alt={promo.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className={`absolute inset-0 z-10 bg-gradient-to-t ${promo.gradient}`} />
                  <div className="relative z-20 space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
                      <promo.icon className="w-3.5 h-3.5" />
                      {promo.title}
                    </div>
                    <h3 className="text-2xl font-black text-white leading-tight">
                      {promo.subtitle}
                    </h3>
                    <div className="flex items-center text-white/80 text-sm font-semibold group-hover:text-white transition-colors">
                      {promo.buttonText} <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
