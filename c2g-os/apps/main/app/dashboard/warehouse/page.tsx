import { Copy, MapPin, Building2, Phone, User, CheckCircle2 } from "lucide-react";

export default function WarehouseAddressPage() {
  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Warehouse Addresses</h1>
        <p className="text-muted-foreground mt-1">Use these addresses when shopping on Chinese e-commerce platforms.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* China Warehouse Card */}
        <div className="glass-panel p-8 relative overflow-hidden group border-primary/20 hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="text-2xl">🇨🇳</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">Guangzhou Warehouse</h2>
              <p className="text-sm text-green-500 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Receiving Packages
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 flex flex-col gap-1 relative group/copy cursor-pointer hover:bg-secondary/50 transition-colors">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Receiver Name (Include your ID)</span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> C2G-CUST-9082
                </span>
                <Copy className="w-4 h-4 text-muted-foreground group-hover/copy:text-primary transition-colors" />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 flex flex-col gap-1 relative group/copy cursor-pointer hover:bg-secondary/50 transition-colors">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Phone Number</span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" /> 138-0013-8000
                </span>
                <Copy className="w-4 h-4 text-muted-foreground group-hover/copy:text-primary transition-colors" />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 flex flex-col gap-1 relative group/copy cursor-pointer hover:bg-secondary/50 transition-colors">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Province / City / District</span>
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" /> Guangdong Province, Guangzhou City, Baiyun District
                </span>
                <Copy className="w-4 h-4 text-muted-foreground group-hover/copy:text-primary transition-colors" />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 flex flex-col gap-1 relative group/copy cursor-pointer hover:bg-secondary/50 transition-colors">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Detailed Address</span>
              <div className="flex items-start justify-between gap-4">
                <span className="font-bold flex items-start gap-2 leading-tight">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" /> 
                  No. 123 Logistics Park, Airport Road, Baiyun District (C2G-CUST-9082)
                </span>
                <Copy className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 group-hover/copy:text-primary transition-colors" />
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-muted-foreground bg-primary/5 p-4 rounded-lg border border-primary/10">
            <strong>Important:</strong> Always ensure your unique ID (C2G-CUST-9082) is included in the receiver name or detailed address so we can identify your packages.
          </div>
        </div>

        {/* Instructions / Helpers */}
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold mb-4">How to use this address?</h3>
            <ol className="space-y-4 relative before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-border">
              {[
                "Copy the Chinese address details step-by-step.",
                "Paste them into your Taobao/1688 address book.",
                "Verify your unique ID is present in the address.",
                "Once the supplier ships, copy their tracking number.",
                "Register the tracking number in our 'Packages' tab."
              ].map((step, idx) => (
                <li key={idx} className="relative pl-10">
                  <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-sm">
                    {idx + 1}
                  </div>
                  <p className="text-sm font-medium pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="glass-panel p-6 bg-secondary/20">
            <h3 className="text-lg font-bold mb-2">Need help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you are having trouble adding the address to a specific platform, our support team can help you.
            </p>
            <button className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
