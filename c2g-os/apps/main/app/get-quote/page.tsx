"use client";

import { useState } from "react";
import { SiteNav } from "../../components/site-nav";
import Link from "next/link";
import { Plane, Ship, ArrowRight, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";

// Shipping rates matching CB
const AIR_RATES = {
  express: { rate: 85, days: "3–7 Days", label: "Air Express" },
  normal: { rate: 55, days: "12–16 Days", label: "Air Normal" },
};
const SEA_RATE_PER_CBM = 1800; // GHS per CBM

// Metadata is moved out since this is a client component

export default function GetQuotePage() {
  const [tab, setTab] = useState<"air" | "sea">("air");

  // Air state
  const [airWeight, setAirWeight] = useState("");
  const [airMode, setAirMode] = useState<"express" | "normal">("express");
  const [isElectronic, setIsElectronic] = useState(false);

  // Sea state
  const [seaLength, setSeaLength] = useState("");
  const [seaWidth, setSeaWidth] = useState("");
  const [seaHeight, setSeaHeight] = useState("");

  // Result
  const [result, setResult] = useState<{ cost: string; time: string } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    setResult(null);

    if (tab === "air") {
      const weight = parseFloat(airWeight);
      if (!airWeight || isNaN(weight) || weight <= 0) {
        setError("Please enter a valid weight.");
        return;
      }
      const mode = isElectronic ? "express" : airMode;
      const { rate, days, label } = AIR_RATES[mode];
      const cost = (weight * rate).toLocaleString("en-GH", { style: "currency", currency: "GHS", maximumFractionDigits: 2 });
      setResult({ cost, time: `${label} — ${days}` });
    } else {
      const l = parseFloat(seaLength);
      const w = parseFloat(seaWidth);
      const h = parseFloat(seaHeight);
      if (!seaLength || !seaWidth || !seaHeight || isNaN(l) || isNaN(w) || isNaN(h) || l <= 0 || w <= 0 || h <= 0) {
        setError("Please enter valid dimensions (L × W × H).");
        return;
      }
      const cbm = (l * w * h) / 1_000_000;
      const cost = (cbm * SEA_RATE_PER_CBM).toLocaleString("en-GH", { style: "currency", currency: "GHS", maximumFractionDigits: 2 });
      setResult({ cost, time: `Sea Freight — 50–60 Days (CBM: ${cbm.toFixed(4)})` });
    }
  };

  const reset = () => {
    setResult(null);
    setError("");
    setAirWeight("");
    setSeaLength("");
    setSeaWidth("");
    setSeaHeight("");
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <SiteNav />

      {/* Hero */}
      <section className="relative py-28 pt-36 bg-gradient-to-br from-primary via-blue-700 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-1/2 -right-1/4 w-[60%] h-[200%] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[50%] h-[150%] rounded-full bg-white/8 blur-3xl" />
          {/* Floating orbs */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white/10"
              style={{
                width: `${120 + i * 80}px`,
                height: `${120 + i * 80}px`,
                top: `${20 + i * 15}%`,
                right: `${10 + i * 10}%`,
                animation: `pulse ${3 + i}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-5" style={{ letterSpacing: "-0.02em" }}>
            Shipping Rate Estimator
          </h1>
          <p className="text-xl text-white/90 max-w-xl mx-auto leading-relaxed">
            Get an instant, no-obligation estimate for your shipping costs from China to Ghana.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-20 md:py-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-6 md:p-10 shadow-2xl">
            <h3 className="text-2xl font-bold mb-8">Calculate Your Shipping Cost</h3>

            {/* Mode tabs */}
            <div className="flex gap-2 p-1 rounded-xl bg-secondary/60 mb-8">
              {(["air", "sea"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); reset(); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    tab === t
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "air" ? <Plane className="w-4 h-4" /> : <Ship className="w-4 h-4" />}
                  {t === "air" ? "Air Freight" : "Sea Freight"}
                </button>
              ))}
            </div>

            {/* Air Panel */}
            {tab === "air" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Total Weight (kg)</label>
                    <input
                      type="number"
                      value={airWeight}
                      onChange={e => setAirWeight(e.target.value)}
                      placeholder="e.g., 5.5"
                      min="0"
                      step="0.1"
                      className="w-full h-12 bg-background/50 border border-input rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Shipping Mode</label>
                    <select
                      value={airMode}
                      onChange={e => setAirMode(e.target.value as "express" | "normal")}
                      disabled={isElectronic}
                      className="w-full h-12 bg-background/50 border border-input rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="express">Air Express (3–7 Days)</option>
                      <option value="normal">Air Normal (12–16 Days)</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary/40 cursor-pointer transition-colors group">
                  <input
                    type="checkbox"
                    checked={isElectronic}
                    onChange={e => {
                      setIsElectronic(e.target.checked);
                      if (e.target.checked) setAirMode("express");
                    }}
                    className="mt-0.5 w-4 h-4 rounded accent-primary"
                  />
                  <div>
                    <span className="text-sm font-medium">Is this a phone, PC, or other high-value electronic?</span>
                    <p className="text-xs text-muted-foreground mt-0.5">Phones & PCs are compulsory <strong className="text-foreground">Air Express</strong>.</p>
                  </div>
                </label>

                {/* Rate info */}
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(AIR_RATES).map(([key, val]) => (
                    <div key={key} className={`p-3.5 rounded-xl border text-sm transition-all ${
                      (isElectronic ? "express" : airMode) === key
                        ? "border-primary/50 bg-primary/8"
                        : "border-border bg-secondary/30"
                    }`}>
                      <div className="font-semibold text-foreground">{val.label}</div>
                      <div className="text-muted-foreground text-xs mt-0.5">{val.days}</div>
                      <div className="text-primary font-bold mt-1">GHS {val.rate}/kg</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sea Panel */}
            {tab === "sea" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <label className="block text-sm font-semibold mb-3">Package Dimensions (in Centimeters)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Length", val: seaLength, set: setSeaLength, ph: "L (cm)" },
                      { label: "Width", val: seaWidth, set: setSeaWidth, ph: "W (cm)" },
                      { label: "Height", val: seaHeight, set: setSeaHeight, ph: "H (cm)" },
                    ].map(({ label, val, set, ph }) => (
                      <div key={label}>
                        <label className="block text-xs text-muted-foreground mb-1.5 font-medium">{label}</label>
                        <input
                          type="number"
                          value={val}
                          onChange={e => set(e.target.value)}
                          placeholder={ph}
                          min="0"
                          step="0.1"
                          className="w-full h-12 bg-background/50 border border-input rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-center"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">We will calculate the total volume (CBM) for you.</p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Ship className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="font-semibold text-foreground">Sea Freight Rate</div>
                      <div className="text-xs text-muted-foreground">50–60 days · Accra, Ghana</div>
                      <div className="text-primary font-bold mt-0.5">GHS {SEA_RATE_PER_CBM.toLocaleString()}/CBM</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 mt-5 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="mt-5 p-5 rounded-xl border border-green-500/30 bg-green-500/8 space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2 text-green-500 font-semibold">
                  <CheckCircle className="w-5 h-5" /> Estimate Ready
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-foreground">{result.cost}</div>
                  <div className="text-sm text-muted-foreground mt-1">{result.time}</div>
                </div>
                <div className="flex items-start gap-2 text-xs text-amber-500/90 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  This is only an estimate. Final cost depends on actual weight, dimensions, and any applicable duties.
                </div>
                <button onClick={reset} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" /> Calculate again
                </button>
              </div>
            )}

            {/* CTA Button */}
            {!result && (
              <button
                onClick={calculate}
                className="w-full mt-6 h-13 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 hover:scale-[1.01] transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 py-4 text-base"
              >
                Calculate Estimate <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* How it works cards */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { icon: "fa-plane", title: "Air Freight", desc: "Charged per kg. Best for items under 100kg.", badge: "3–16 days" },
              { icon: "fa-ship", title: "Sea Freight", desc: "Charged per CBM. Best for large/heavy orders.", badge: "50–60 days" },
            ].map((item) => (
              <div key={item.title} className="glass-panel p-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <i className={`fas ${item.icon}`} />
                </div>
                <div className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold inline-block mb-2">{item.badge}</div>
                <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Procurement CTA */}
      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-blue-800 p-8 md:p-10 text-white text-center space-y-4">
            <h3 className="text-2xl font-bold">Need a Full Procurement Quote?</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              For complex orders, "Buy For Me" services, or supplier payments, please contact us directly for a detailed quote.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white text-primary font-bold hover:bg-white/90 hover:scale-[1.02] transition-all shadow-lg">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
