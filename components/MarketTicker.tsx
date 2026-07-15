"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";

export interface TickerItem {
  symbol: string;
  name: string;
  category: "crypto" | "forex_stocks" | "metals" | "commodities";
  price: number;
  change: number; // percentage
  history: number[]; // Sparkline data points
  unit: string;
  macroContext: string;
}

const INITIAL_TICKER_DATA: TickerItem[] = [
  // Biosphere (formerly crypto)
  {
    symbol: "CO2_OFFSET",
    name: "Amazonian Carbon Offsets",
    category: "crypto",
    price: 142.5,
    change: 1.42,
    history: [138, 140, 139, 141, 142, 141.5, 142.5],
    unit: "$/t",
    macroContext: "Carbon trading index surges as international tightening on old-growth preservation credits increases valuation."
  },
  {
    symbol: "MYCEL_NET",
    name: "Mycelial Signaling Pulse",
    category: "crypto",
    price: 12.82,
    change: -0.68,
    history: [13.4, 13.2, 13.1, 13.0, 12.9, 12.95, 12.82],
    unit: "Hz",
    macroContext: "Fungal communication latency in old-growth redwoods slows slightly due to prolonged sub-soil temperature elevation."
  },
  {
    symbol: "BIODIV_IND",
    name: "Planetary Biodiversity Index",
    category: "crypto",
    price: 92.4,
    change: 3.84,
    history: [88, 89, 89.5, 91, 91.2, 91.8, 92.4],
    unit: "pts",
    macroContext: "Ecosystem recovery in protected reserves drives global species richness indicators higher this quarter."
  },
  // Climatology (formerly forex_stocks)
  {
    symbol: "TEMP_ANOM",
    name: "Atmospheric Temperature Deviation",
    category: "forex_stocks",
    price: 1.142,
    change: 0.12,
    history: [1.120, 1.131, 1.125, 1.135, 1.140, 1.138, 1.142],
    unit: "°C",
    macroContext: "Baseline deviation from pre-industrial century average remains highly critical in the sub-tropical zones."
  },
  {
    symbol: "ICE_VOL",
    name: "Greenland Ice Sheet Volume",
    category: "forex_stocks",
    price: 2642.18,
    change: -0.45,
    history: [2680, 2675, 2668, 2660, 2655, 2648, 2642.18],
    unit: "Gt",
    macroContext: "Persistent seasonal melting event leads to higher volumes of glacial discharge into the North Atlantic."
  },
  {
    symbol: "OCEAN_PH",
    name: "Pacific Acidification Index",
    category: "forex_stocks",
    price: 8.04,
    change: -0.18,
    history: [8.10, 8.08, 8.07, 8.06, 8.05, 8.05, 8.04],
    unit: "pH",
    macroContext: "Alkalinity metrics drop slightly under heavy carbon sequestration pressure in tropical kelp trenches."
  },
  {
    symbol: "RAIN_AMZN",
    name: "Amazonian Rain Basin Level",
    category: "forex_stocks",
    price: 189.42,
    change: 2.24,
    history: [181, 183.5, 185, 184.2, 187.8, 188.5, 189.42],
    unit: "mm",
    macroContext: "Precipitation returns to baseline levels following a humid equatorial trade-wind cycle."
  },
  // Minerals (formerly metals)
  {
    symbol: "SILVA_GOLD",
    name: "Raw Botanical Ochre",
    category: "metals",
    price: 442.8,
    change: 0.85,
    history: [435, 438, 436, 440, 441, 440.5, 442.8],
    unit: "$/kg",
    macroContext: "Valuation of natural bio-pigments climbs under heavy demand from non-synthetic textile makers."
  },
  {
    symbol: "PEAT_HUM",
    name: "Organic Peat Humus",
    category: "metals",
    price: 29.15,
    change: 1.12,
    history: [28.4, 28.7, 28.6, 28.9, 29.0, 28.9, 29.15],
    unit: "$/t",
    macroContext: "Peat nutrient density metrics remain extremely robust across managed Northern peatlands."
  },
  {
    symbol: "LITH_BRINE",
    name: "Atacama Geothermal Lithium Brine",
    category: "metals",
    price: 984.5,
    change: -0.42,
    history: [995, 992, 988, 990, 985, 987, 984.5],
    unit: "$/m³",
    macroContext: "Supply abundance in South American flats stabilizes sustainable battery transition pipelines."
  },
  // Forest & Soil (formerly commodities)
  {
    symbol: "TIMB_CERT",
    name: "Certified Eco-Lumber",
    category: "commodities",
    price: 84.62,
    change: 1.95,
    history: [82.1, 82.8, 83.0, 83.4, 83.9, 84.1, 84.62],
    unit: "$/m³",
    macroContext: "Sustainable lumber futures appreciate as global eco-restoration rules limit clear-cutting parameters."
  },
  {
    symbol: "COCOA_WILD",
    name: "Wild Shade-Grown Cocoa",
    category: "commodities",
    price: 12.48,
    change: 2.36,
    history: [11.5, 11.8, 12.0, 12.1, 12.3, 12.4, 12.48],
    unit: "$/kg",
    macroContext: "Favorable multi-strata canopy shade produces premium yields of heirloom forest cocoa pods."
  },
  {
    symbol: "KAPOK_FIB",
    name: "Kapok Organic Fiber",
    category: "commodities",
    price: 4.62,
    change: 0.76,
    history: [4.55, 4.58, 4.56, 4.60, 4.59, 4.61, 4.62],
    unit: "$/bale",
    macroContext: "High-grade thermal kapok fiber bidding holds strong as bio-based insulated outerwear demand surges."
  }
];

export default function MarketTicker() {
  const [data, setData] = useState<TickerItem[]>(INITIAL_TICKER_DATA);
  const [activeCategory, setActiveCategory] = useState<"all" | "crypto" | "forex_stocks" | "metals" | "commodities">("all");
  const [selectedAsset, setSelectedAsset] = useState<TickerItem | null>(INITIAL_TICKER_DATA[0]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [flashStates, setFlashStates] = useState<Record<string, "up" | "down" | null>>({});

  // Simulate real-time ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const nextFlash: Record<string, "up" | "down" | null> = {};
        const updated = prev.map((item) => {
          // 30% chance for an asset to tick
          if (Math.random() > 0.3) return item;

          // Tick size is tiny (0.05% - 0.2%)
          const percent = (Math.random() * 0.15 + 0.05) / 100;
          const up = Math.random() > 0.48; // slight upward bias
          const diff = item.price * percent;
          const nextPrice = up ? item.price + diff : item.price - diff;
          const nextChange = item.change + (up ? percent * 100 : -percent * 100);

          // Update history array
          const nextHistory = [...item.history.slice(1), Number(nextPrice.toFixed(4))];

          nextFlash[item.symbol] = up ? "up" : "down";

          return {
            ...item,
            price: Number(nextPrice.toFixed(4)),
            change: Number(nextChange.toFixed(2)),
            history: nextHistory
          };
        });

        setFlashStates(nextFlash);
        // Clear flash states after a short duration
        setTimeout(() => {
          setFlashStates({});
        }, 800);

        return updated;
      });

      const now = new Date();
      setLastUpdate(now.toLocaleTimeString("en-US", { hour12: false }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const filtered = data.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  const drawSparkline = (points: number[], isUp: boolean) => {
    if (points.length < 2) return "";
    const width = 80;
    const height = 24;
    const padding = 2;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;

    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * (width - padding * 2) + padding;
      const y = height - ((val - min) / range) * (height - padding * 2) - padding;
      return `${x},${y}`;
    });

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={isUp ? "#10b981" : "#ef4444"}
          strokeWidth="1.5"
          points={coords.join(" ")}
        />
      </svg>
    );
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-transparent flex flex-col relative" id="live-market-ticker-widget">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500/80" />
      {/* Widget Header */}
      <div className="bg-zinc-50 dark:bg-zinc-950/40 border-b border-zinc-200 dark:border-zinc-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
          <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">
            PAEN BIOSPHERE & CLIMATE INDEX
          </h3>
        </div>
        <span className="text-[9px] font-mono text-zinc-400">
          UTC {lastUpdate || "LIVE FEED"}
        </span>
      </div>

      {/* Categories Horizontal Scroll tabs */}
      <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800/80 p-2 overflow-x-auto bg-zinc-50/50 dark:bg-zinc-950/20">
        {(["all", "crypto", "forex_stocks", "metals", "commodities"] as const).map((cat) => {
          let label = cat.replace("_", " ");
          if (cat === "crypto") label = "Biosphere";
          if (cat === "forex_stocks") label = "Climatology";
          if (cat === "metals") label = "Minerals";
          if (cat === "commodities") label = "Forest & Soil";
          
          return (
            <button
              key={cat}
              id={`btn-market-cat-${cat}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${
                activeCategory === cat
                  ? "border-amber-500 text-amber-700 dark:text-amber-400 font-bold"
                  : "border-transparent text-zinc-500 hover:text-foreground"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Grid of Mini Cards */}
      <div className="grid grid-cols-1 gap-1.5 p-2 max-h-[380px] overflow-y-auto">
        {filtered.map((item) => {
          const isUp = item.change >= 0;
          const flash = flashStates[item.symbol];
          const isSelected = selectedAsset?.symbol === item.symbol;

          let flashClass = "";
          if (flash === "up") flashClass = "bg-emerald-500/5 border-emerald-500/20";
          if (flash === "down") flashClass = "bg-rose-500/5 border-rose-500/20";

          return (
            <div
              key={item.symbol}
              onClick={() => setSelectedAsset(item)}
              className={`p-3 transition-all cursor-pointer flex justify-between items-center gap-4 border-b border-zinc-200/60 dark:border-zinc-800/60 ${
                isSelected
                  ? "bg-amber-500/5 dark:bg-amber-500/5 border-l-2 border-l-amber-500"
                  : "bg-transparent hover:bg-zinc-100/40 dark:hover:bg-zinc-900/40"
              } ${flashClass}`}
              id={`ticker-card-${item.symbol}`}
            >
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-foreground">
                    {item.symbol}
                  </span>
                  <span className="text-[9px] font-sans uppercase tracking-wider text-zinc-400 truncate max-w-[100px] font-light">
                    {item.name}
                  </span>
                </div>
                <div className="font-mono text-xs font-semibold tracking-tight mt-1 text-foreground">
                  {item.unit}
                  {item.price.toLocaleString(undefined, {
                    minimumFractionDigits: item.price < 5 ? 4 : 2,
                    maximumFractionDigits: item.price < 5 ? 4 : 2,
                  })}
                </div>
              </div>

              {/* Sparkline & Percentage Area */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="hidden sm:block opacity-80">
                  {drawSparkline(item.history, isUp)}
                </div>

                <div
                  className={`font-mono text-[10px] font-bold shrink-0 text-right min-w-[55px] ${
                    isUp
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {isUp ? "▲" : "▼"}{Math.abs(item.change).toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Asset Macro Context Briefing (National Geographic style context) */}
      {selectedAsset && (
        <div className="bg-zinc-50/50 dark:bg-zinc-950/40 border-t border-zinc-200 dark:border-zinc-800 p-4" id="ticker-editorial-brief">
          <div className="text-[9px] font-mono text-amber-600 dark:text-amber-500 uppercase tracking-[0.18em] font-bold mb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 animate-spin-slow text-amber-500" /> MACRO EDITORIAL CONTEXT: {selectedAsset.symbol}
          </div>
          <h4 className="font-serif font-bold text-sm text-foreground">
            {selectedAsset.name} Indices Overview
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2 text-justify font-sans font-light">
            {selectedAsset.macroContext}
          </p>
        </div>
      )}
    </div>
  );
}

// Global Horizontal moving marquee ticker to be used in the top-bar header
export function GlobalHorizontalTicker() {
  const [data, setData] = useState<TickerItem[]>(INITIAL_TICKER_DATA);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((item) => {
          if (Math.random() > 0.4) return item;
          const percent = (Math.random() * 0.1) / 100;
          const up = Math.random() > 0.48;
          const diff = item.price * percent;
          return {
            ...item,
            price: Number((up ? item.price + diff : item.price - diff).toFixed(3)),
            change: Number((item.change + (up ? percent * 100 : -percent * 100)).toFixed(2))
          };
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden whitespace-nowrap w-full flex items-center h-full text-[11px] font-mono text-zinc-300">
      <div className="animate-marquee flex gap-8">
        {data.map((item) => {
          const isUp = item.change >= 0;
          return (
            <span key={item.symbol} className="flex items-center gap-1.5 shrink-0 select-none">
              <span className="text-zinc-500">{item.symbol}</span>
              <span className="font-bold text-white">
                {item.unit}
                {item.price.toLocaleString(undefined, {
                  minimumFractionDigits: item.price < 5 ? 3 : 2,
                })}
              </span>
              <span
                className={`font-semibold text-[10px] ${
                  isUp ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {isUp ? "▲" : "▼"} {Math.abs(item.change).toFixed(2)}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
