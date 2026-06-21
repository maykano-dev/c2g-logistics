import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Store as StoreIcon, ShieldCheck, MapPin, Package } from "lucide-react";
import StorefrontClient from "../../../components/shop/storefront-client";
import StoreHeader from "../../../components/shop/store-header";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;



  const supabase = await createClient();
  const { data: importer } = await supabase
    .from("importers")
    .select("business_name, business_description")
    .eq("store_slug", resolvedParams.slug)
    .single();

  if (!importer) return { title: "Store Not Found" };

  return {
    title: `${importer.business_name} | Verified C2G Importer`,
    description: importer.business_description || `Shop amazing products imported from China by ${importer.business_name}.`,
  };
}

export default async function StorefrontPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  
  let importer;
  let products: any[] = [];
  let exchangeRate = 1;


    // 1. Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      redirect(`/login?next=/store/${resolvedParams.slug}`);
    }

    // 2. Fetch the importer
    const { data: dbImporter } = await supabase
      .from("importers")
      .select("*")
      .eq("store_slug", resolvedParams.slug)
      .single();

    if (!dbImporter || dbImporter.status !== "approved") {
      notFound();
    }
    importer = dbImporter;

    // 3. Fetch Exchange Rate
    const { data: sysData } = await supabase.from('system_settings').select('value').eq('key', 'exchange_rate_cny_ghs').single();
    if (sysData && sysData.value) exchangeRate = parseFloat(sysData.value);

    // 4. Fetch Importer's Products
    const { data: dbProducts } = await supabase
      .from("products")
      .select(`
        *,
        product_images (id, image_url, is_primary, media_type)
      `)
      .eq("importer_id", importer.id)
      .eq("status", "published")
      .order("created_at", { ascending: false });
    
    products = dbProducts || [];

  return (
    <div className="bg-background min-h-screen pb-24 pt-14 md:pt-16">
      <StoreHeader />
      {/* Storefront Hero / Banner */}
      <div className="relative h-[250px] sm:h-[350px] w-full bg-gradient-to-tr from-primary/90 to-primary/40 overflow-hidden group flex items-center justify-center">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=2000&auto=format&fit=crop')] mix-blend-overlay opacity-20 object-cover bg-cover bg-center group-hover:scale-105 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        {/* C2G Branding Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 px-4">
          <span className="text-4xl sm:text-[8vw] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] whitespace-nowrap select-none drop-shadow-2xl bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent opacity-40 sm:opacity-50">
            C2G Logistics
          </span>
        </div>

        {/* Top-Right Badge */}
        <div className="absolute top-6 right-6 z-20 hidden sm:flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white shadow-xl">
          <Package className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold tracking-widest uppercase">Powered by C2G</span>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-10 max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 translate-y-12 sm:translate-y-8">
          <div className="w-20 h-20 sm:w-32 sm:h-32 bg-background rounded-2xl sm:rounded-3xl shadow-2xl flex items-center justify-center border-4 border-background shrink-0 sm:-translate-y-8 relative z-10 overflow-hidden">
            <span className="text-3xl sm:text-5xl font-black text-primary">
              {importer.business_name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="pb-4 sm:pb-8 z-10 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-1">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground drop-shadow-sm truncate max-w-full">
                {importer.business_name}
              </h1>
              <div className="w-fit px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-1 text-green-500 text-xs font-bold uppercase tracking-widest backdrop-blur-sm shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Importer
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Accra, Ghana</span>
              <span className="flex items-center gap-1"><StoreIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Since {new Date(importer.created_at).getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-10 mt-12 sm:mt-8">
        {importer.business_description && (
          <div className="max-w-3xl mb-8 sm:mb-12">
            <h3 className="text-lg font-bold mb-2">About Us</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {importer.business_description}
            </p>
          </div>
        )}

        <StorefrontClient products={products} exchangeRate={exchangeRate} />
      </div>
    </div>
  );
}
