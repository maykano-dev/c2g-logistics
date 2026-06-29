"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HistorySearchClient({ initialQuery }: { initialQuery: string }) {
    const router = useRouter();
    const [query, setQuery] = useState(initialQuery);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/dashboard/wallet/history?page=1${query ? `&q=${encodeURIComponent(query)}` : ''}`);
    };

    return (
        <form onSubmit={handleSearch} className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by amount or reference..." 
                className="w-full h-12 pl-12 pr-4 bg-background border border-border/50 rounded-xl focus-visible:outline-none focus-visible:border-primary/50"
            />
        </form>
    );
}
