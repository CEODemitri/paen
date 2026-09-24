import { MapPin, BookOpen } from "lucide-react";

interface Correspondent {
  name: string;
  role: string;
  station: string;
  affiliation: string;
  focus: string;
  image: string;
  recentReport: string;
}

const CORRESPONDENTS: Correspondent[] = [
  {
    name: "Dr. Alastair Vance",
    role: "Senior Bioacoustics Fellow",
    station: "Mamirauá Sustainable Development Reserve, Brazil",
    affiliation: "Amazonian Bioacoustics Collective",
    focus: "Canopy bioacoustics, acoustic niche partitioning, AI signal classification",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    recentReport: "The Acoustic Silhouette of the Amazonian Canopy",
  },
  {
    name: "Elena Rostova",
    role: "Materials & Semiconductor Investigator",
    station: "Diamond Epitaxy Cleanroom, Ulm, Germany",
    affiliation: "Max Planck Institute for Solid State Physics",
    focus: "CVD synthetic diamond wafers, post-silicon semiconductors, thermal dissipation",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
    recentReport: "Diamond Substrates and the Twilight of Silicon",
  },
  {
    name: "Jean-Baptiste Coutau",
    role: "Geoeconomic & Sovereign Capital Editor",
    station: "Geneva, Switzerland & Singapore",
    affiliation: "Center for Sovereign Wealth Geopolitics",
    focus: "State capitalism, critical mineral supply localization, decarbonization funds",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    recentReport: "The New Mercantilism: Sovereign Wealth and State Capitalism",
  },
  {
    name: "Sarah Lin",
    role: "Digital Heritage & Culture Archival Lead",
    station: "Kyoto & San Francisco",
    affiliation: "Internet Memory & Cultural Commons Trust",
    focus: "Digital decay, forum preservation, open-web protocols, software emulation",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300",
    recentReport: "The Dissolution of the Early Web and Archival Ephemera",
  },
];

interface CorrespondentsGridProps {
  onSearchAuthor: (name: string) => void;
}

export default function CorrespondentsGrid({ onSearchAuthor }: CorrespondentsGridProps) {
  return (
    <section className="w-full border-b-2 border-double border-zinc-300 dark:border-zinc-800 pb-14 mb-14" id="fellows-directory-section">
      {/* Section Header */}
      <div className="flex justify-between items-center border-b border-zinc-250 dark:border-zinc-850 pb-2.5 mb-8 text-[9.5px] font-mono tracking-[0.25em] uppercase text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-none inline-block" />
          <span className="font-bold text-foreground">SECTION III • CORRESPONDENTS & PRINCIPAL INVESTIGATORS</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-zinc-400">
          <span>PEER ACCREDITATION</span>
          <span>✦</span>
          <span>GLOBAL STATIONS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CORRESPONDENTS.map((fellow, idx) => (
          <div
            key={idx}
            className="group border border-zinc-200 dark:border-zinc-800 p-5 bg-[#faf7f2] dark:bg-zinc-950/40 flex flex-col justify-between hover:border-emerald-600/50 transition-all duration-300"
            id={`correspondent-card-${idx}`}
          >
            <div>
              {/* Fellow Avatar & Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="relative">
                  <img
                    src={fellow.image}
                    alt={fellow.name}
                    className="w-14 h-14 object-cover border border-zinc-300 dark:border-zinc-700"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-black rounded-full" title="Active in Field" />
                </div>
                <span className="px-2 py-0.5 text-[8px] font-mono uppercase tracking-widest font-bold bg-zinc-200 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400">
                  FELLOW 0{idx + 1}
                </span>
              </div>

              <h4 className="font-serif font-bold text-lg text-foreground leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {fellow.name}
              </h4>

              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                {fellow.role}
              </div>

              <div className="flex items-center gap-1.5 text-[9.5px] font-sans text-zinc-500 mt-2 font-light">
                <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                <span className="truncate">{fellow.station}</span>
              </div>

              <p className="text-[11px] font-sans text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed line-clamp-2 font-light">
                {fellow.focus}
              </p>
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-850 pt-3 mt-4">
              <button
                onClick={() => onSearchAuthor(fellow.name)}
                className="w-full py-1.5 px-2 text-[9px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-600/40 transition-colors flex items-center justify-center gap-1.5 font-bold"
              >
                <BookOpen className="w-3 h-3 text-emerald-600" />
                View Field Dossiers
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
