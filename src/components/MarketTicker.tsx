import { useState } from "react";
import { Globe, RefreshCw, Radio, Satellite, ShieldCheck } from "lucide-react";
import { usePlanetaryTelemetry, TelemetryPoint } from "../lib/telemetry";

export default function MarketTicker() {
  const {
    telemetry,
    lastSyncTime,
    isLiveStreaming,
    setIsLiveStreaming,
    streamLatencyMs,
    flashingIds,
    forceSync,
  } = usePlanetaryTelemetry(2800);

  const [activeCategory, setActiveCategory] = useState<"all" | "biosphere" | "climatology" | "oceans_ice" | "bioeconomy">("all");
  const [selectedAsset, setSelectedAsset] = useState<TelemetryPoint | null>(telemetry[0] || null);
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  const handleManualSync = () => {
    setIsManualSyncing(true);
    forceSync();
    setTimeout(() => setIsManualSyncing(false), 500);
  };

  const filtered = telemetry.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  // Keep selectedAsset in sync with updated values
  const currentSelected = telemetry.find((t) => t.id === selectedAsset?.id) || selectedAsset || telemetry[0];

  const drawSparkline = (points: number[], isUp: boolean) => {
    if (!points || points.length < 2) return null;
    const width = 76;
    const height = 22;
    const padding = 2;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 0.0001;

    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * (width - padding * 2) + padding;
      const y = height - ((val - min) / range) * (height - padding * 2) - padding;
      return `${x},${y}`;
    });

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={isUp ? "#10b981" : "#f43f5e"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={coords.join(" ")}
        />
      </svg>
    );
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-transparent flex flex-col relative rounded-none" id="live-planetary-telemetry-widget">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500" />
      
      {/* Telemetry Header */}
      <div className="bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 p-3.5 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"}`} />
          <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-foreground flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            EARTH SENSORY TELEMETRY
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-zinc-400 hidden sm:inline">
            {streamLatencyMs}ms ping
          </span>
          <button
            onClick={handleManualSync}
            disabled={isManualSyncing}
            className={`p-1 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-transform ${
              isManualSyncing ? "animate-spin text-emerald-600" : ""
            }`}
            title="Force telemetry sensor poll"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-wider font-bold rounded-none border ${
              isLiveStreaming
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700"
            }`}
          >
            {isLiveStreaming ? "LIVE (2.8s)" : "PAUSED"}
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="px-3.5 py-1.5 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.02] border-b border-zinc-200/60 dark:border-zinc-800/60 flex justify-between items-center text-[9px] font-mono text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Satellite className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>NOAA • ERA5 • MAUNA LOA • JURUÁ</span>
        </div>
        <span className="text-zinc-500 font-medium">
          SYNC: {lastSyncTime.toLocaleTimeString("en-US", { hour12: false })}
        </span>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800/80 p-1.5 overflow-x-auto bg-zinc-50/50 dark:bg-zinc-950/20">
        {(["all", "climatology", "biosphere", "oceans_ice", "bioeconomy"] as const).map((cat) => {
          let label = "All Feeds";
          if (cat === "climatology") label = "Atmosphere";
          if (cat === "biosphere") label = "Canopy & Soil";
          if (cat === "oceans_ice") label = "Oceans & Cryo";
          if (cat === "bioeconomy") label = "Bioeconomy";
          
          return (
            <button
              key={cat}
              id={`btn-telemetry-cat-${cat}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${
                activeCategory === cat
                  ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold"
                  : "border-transparent text-zinc-500 hover:text-foreground"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Grid of Telemetry Mini Cards */}
      <div className="grid grid-cols-1 gap-1 p-2 max-h-[380px] overflow-y-auto">
        {filtered.map((item) => {
          const isUp = item.change24h >= 0;
          const flash = flashingIds[item.id];
          const isSelected = currentSelected?.id === item.id;

          let flashClass = "";
          if (flash === "up") flashClass = "bg-emerald-500/10 border-emerald-500/40 transition-colors";
          if (flash === "down") flashClass = "bg-rose-500/10 border-rose-500/40 transition-colors";

          return (
            <div
              key={item.id}
              onClick={() => setSelectedAsset(item)}
              className={`p-2.5 transition-all cursor-pointer flex justify-between items-center gap-3 border-b border-zinc-200/60 dark:border-zinc-800/60 ${
                isSelected
                  ? "bg-emerald-500/5 dark:bg-emerald-500/5 border-l-2 border-l-emerald-600"
                  : "bg-transparent hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50"
              } ${flashClass}`}
              id={`telemetry-card-${item.id}`}
            >
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] font-bold text-foreground tracking-tight">
                    {item.symbol}
                  </span>
                  <span className="text-[8.5px] font-sans uppercase tracking-wider text-zinc-400 truncate max-w-[120px] font-light">
                    {item.name}
                  </span>
                </div>
                <div className="font-mono text-xs font-bold tracking-tight mt-0.5 text-foreground flex items-baseline gap-1">
                  <span>{item.value.toLocaleString(undefined, {
                    minimumFractionDigits: item.precision,
                    maximumFractionDigits: item.precision,
                  })}</span>
                  <span className="text-[9px] font-normal text-zinc-500 dark:text-zinc-400">{item.unit}</span>
                </div>
              </div>

              {/* Sparkline & Delta */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:block opacity-85">
                  {drawSparkline(item.history, isUp)}
                </div>

                <div
                  className={`font-mono text-[10px] font-bold shrink-0 text-right min-w-[54px] ${
                    isUp
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {isUp ? "▲ +" : "▼ "}{Math.abs(item.change24h).toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Sensor Station Briefing */}
      {currentSelected && (
        <div className="bg-zinc-50/70 dark:bg-zinc-950/60 border-t border-zinc-200 dark:border-zinc-800 p-3.5" id="telemetry-station-brief">
          <div className="text-[8.5px] font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.18em] font-bold mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-emerald-600" /> SENSOR STATION TELEMETRY
            </span>
            <span className="text-zinc-400 font-normal">REF: {currentSelected.baseline}</span>
          </div>
          
          <h4 className="font-serif font-bold text-xs text-foreground">
            {currentSelected.name} ({currentSelected.station})
          </h4>
          
          <div className="text-[9.5px] font-mono text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">INSTRUMENT:</span>
            <span className="truncate">{currentSelected.sensorModel}</span>
          </div>

          <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed mt-2 text-justify font-sans font-light">
            {currentSelected.macroContext}
          </p>

          <div className="flex items-center justify-between text-[8px] font-mono text-zinc-400 mt-2.5 pt-2 border-t border-zinc-200/50 dark:border-zinc-850">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-2.5 h-2.5" /> CALIBRATED EMPIRICAL STREAM
            </span>
            <span>24H SAMPLING FREQUENCY: 1 Hz</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Global Horizontal moving marquee ticker to be used in the top-bar header
export function GlobalHorizontalTicker() {
  const { telemetry } = usePlanetaryTelemetry(3000);

  return (
    <div className="overflow-hidden whitespace-nowrap w-full flex items-center h-full text-[11px] font-mono text-zinc-300">
      <div className="animate-marquee flex gap-8">
        {telemetry.map((item) => {
          const isUp = item.change24h >= 0;
          return (
            <span key={item.id} className="flex items-center gap-1.5 shrink-0 select-none">
              <span className="text-zinc-500">{item.symbol}</span>
              <span className="font-bold text-white">
                {item.value.toLocaleString(undefined, {
                  minimumFractionDigits: item.precision,
                  maximumFractionDigits: item.precision,
                })} <span className="text-[9px] font-normal text-zinc-400">{item.unit}</span>
              </span>
              <span
                className={`font-semibold text-[10px] ${
                  isUp ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {isUp ? "▲ +" : "▼ "}{Math.abs(item.change24h).toFixed(2)}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
