import { Category } from "../types";
import { ExternalLink } from "lucide-react";

interface ArchivalIndexProps {
  onSelectCategory: (cat: Category | "all") => void;
  onSearchQuery: (query: string) => void;
}

const TOPICS = [
  { label: "Bioacoustics & Canopy Soundscapes", count: 14, category: "science" as Category, query: "Acoustic" },
  { label: "CVD Synthetic Diamond Wafers", count: 8, category: "tech" as Category, query: "Diamond" },
  { label: "Sovereign Wealth Decarbonization", count: 11, category: "finance" as Category, query: "Sovereign" },
  { label: "Digital Heritage & Forum Archiving", count: 19, category: "culture" as Category, query: "Web" },
  { label: "High-Arctic Demilitarization Treaties", count: 7, category: "politics" as Category, query: "Arctic" },
  { label: "Eddy-Covariance Transpiration Flux", count: 6, category: "science" as Category, query: "Canopy" },
  { label: "Quantum Tunneling Dissipation Limits", count: 5, category: "tech" as Category, query: "Silicon" },
  { label: "Pacific Station ALOHA pH Indices", count: 9, category: "science" as Category, query: "Ocean" },
];

export default function ArchivalIndex({ onSelectCategory, onSearchQuery }: ArchivalIndexProps) {
  return (
    <section className="w-full border-b-2 border-double border-zinc-300 dark:border-zinc-800 pb-14 mb-14" id="archival-index-section">
      {/* Section Header */}
      <div className="flex justify-between items-center border-b border-zinc-250 dark:border-zinc-850 pb-2.5 mb-8 text-[9.5px] font-mono tracking-[0.25em] uppercase text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-zinc-600 dark:bg-zinc-400 rounded-none inline-block" />
          <span className="font-bold text-foreground">SECTION IV • TOPICAL INDEX & RESEARCH TAXONOMY</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-zinc-400">
          <span>CLASSIFIED VOLUMES</span>
          <span>✦</span>
          <span>CROSS-INDEXED</span>
        </div>
      </div>

      <div className="bg-[#faf7f2] dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOPICS.map((topic, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSearchQuery(topic.query);
              }}
              className="group cursor-pointer p-3.5 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-emerald-600/50 bg-white/70 dark:bg-zinc-900/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center text-[8.5px] font-mono text-zinc-400 mb-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCategory(topic.category);
                    }}
                    className="text-emerald-700 dark:text-emerald-400 uppercase font-bold tracking-widest hover:underline"
                  >
                    {topic.category}
                  </button>
                  <span className="px-1.5 py-0.2 bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-600 dark:text-zinc-300">
                    {topic.count} DOCS
                  </span>
                </div>
                <h5 className="font-serif font-semibold text-sm text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  {topic.label}
                </h5>
              </div>

              <div className="flex items-center justify-between text-[8.5px] font-mono text-zinc-400 mt-3 pt-2 border-t border-zinc-150 dark:border-zinc-850">
                <span>QUERY REGISTRY</span>
                <ExternalLink className="w-2.5 h-2.5 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
