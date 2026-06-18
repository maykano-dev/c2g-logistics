"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

const countries = [
  { code: "GH", dial: "+233", name: "Ghana", flag: "🇬🇭" },
  { code: "NG", dial: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "KE", dial: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "ZA", dial: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "TG", dial: "+228", name: "Togo", flag: "🇹🇬" },
  { code: "CI", dial: "+225", name: "Ivory Coast", flag: "🇨🇮" },
  { code: "GB", dial: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", dial: "+1", name: "United States", flag: "🇺🇸" },
];

export function PhoneInput({ name = "phone", required = true }: { name?: string; required?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(countries[0]);
  const [phone, setPhone] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search)
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Hidden input to submit the full combined phone number */}
      <input type="hidden" name={name} value={`${selected?.dial || '+233'} ${phone}`} />
      
      <div className="flex h-11 w-full rounded-md border border-input bg-background/50 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-colors backdrop-blur-sm group">
        
        {/* Country Selector Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 hover:bg-white/5 dark:hover:bg-black/10 rounded-l-md border-r border-input transition-colors shrink-0 outline-none focus:bg-white/10"
        >
          <span className="text-lg">{selected?.flag || "🇬🇭"}</span>
          <span className="font-semibold text-foreground">{selected?.dial || "+233"}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^0-9\s]/g, ""))}
          placeholder="24 123 4567"
          required={required}
          className="flex-1 bg-transparent px-3 py-2 outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full sm:w-[320px] rounded-lg border border-input bg-background/95 backdrop-blur-md shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-input flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground ml-1 shrink-0" />
            <input
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-[240px] overflow-y-auto py-1 custom-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`.custom-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    setSelected(country);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center gap-3 p-2 rounded-md text-sm hover:bg-primary/10 transition-colors ${selected?.code === country.code ? "bg-primary/20 font-bold" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{country.flag}</span>
                    <span className="font-medium text-foreground">{country.name}</span>
                  </div>
                  <span className="font-bold text-primary">{country.dial}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                No countries found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
