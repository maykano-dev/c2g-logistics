import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Store as StoreIcon, ShieldCheck, MapPin, Search } from "lucide-react";
import ProductCard from "../../../components/shop/product-card";

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
  
  // 1. Check if user is logged in (per requirements: visiting a store without an account forces login)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=/store/${resolvedParams.slug}`);
  }

  // 2. Fetch the importer
  const { data: importer } = await supabase
    .from("importers")
    .select("*")
    .eq("store_slug", resolvedParams.slug)
    .single();

  if (!importer || importer.status !== "approved") {
    notFound();
  }

  // 3. Fetch Exchange Rate
  let exchangeRate = 1;
  const { data: sysData } = await supabase.from('system_settings').select('value').eq('key', 'exchange_rate_cny_ghs').single();
  if (sysData && sysData.value) exchangeRate = parseFloat(sysData.value);

  // 4. Fetch Importer's Products
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      product_images (id, image_url, is_primary, media_type)
    `)
    .eq("importer_id", importer.id)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Storefront Hero / Banner */}
      <div className="relative h-[250px] sm:h-[350px] w-full bg-gradient-to-tr from-primary/90 to-primary/40 overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=2000&auto=format&fit=crop')] mix-blend-overlay opacity-20 object-cover bg-cover bg-center group-hover:scale-105 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 max-w-7xl mx-auto flex items-end gap-6 translate-y-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-background rounded-3xl shadow-2xl flex items-center justify-center border-4 border-background shrink-0 -translate-y-8 relative z-10 overflow-hidden">
            <span className="text-4xl sm:text-5xl font-black text-primary">
              {importer.business_name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="pb-8 z-10">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                {importer.business_name}
              </h1>
              <div className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-1 text-green-500 text-xs font-bold uppercase tracking-widest backdrop-blur-sm shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Importer
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Accra, Ghana</span>
              <span className="flex items-center gap-1"><StoreIcon className="w-4 h-4" /> Since {new Date(importer.created_at).getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-10 mt-16 sm:mt-8">
        {importer.business_description && (
          <div className="max-w-3xl mb-12">
            <h3 className="text-lg font-bold mb-2">About Us</h3>
            <p className="text-muted-foreground leading-relaxed">
              {importer.business_description}
            </p>
          </div>
        )}

        {/* Smart Order Bar */}
        <div className="glass-panel p-6 rounded-2xl border-primary/20 bg-primary/5 shadow-lg mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight mb-1">Know exactly what you want?</h2>
            <p className="text-sm text-muted-foreground">Type the Product Code (e.g., P0001) given to you on WhatsApp.</p>
          </div>
          <div className="w-full md:w-96 relative">
            <input 
              type="text" 
              placeholder="Enter P-Code (e.g. P0001)"
              className="w-full h-14 bg-background border border-input rounded-xl pl-12 pr-4 font-mono uppercase text-lg shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
            />
            <Search className="w-6 h-6 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
            <button className="absolute right-2 top-2 h-10 px-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors">
              Find
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">All Products</h2>
          <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border">
            {products?.length || 0} items
          </span>
        </div>

        {!products || products.length === 0 ? (
          <div className="glass-panel p-16 text-center flex flex-col items-center justify-center border-dashed border-2">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No Products Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">This importer hasn't uploaded any products to their store yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} exchangeRate={exchangeRate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Need Package icon
import { Package } from "lucide-react";
