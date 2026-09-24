import { Radio, RefreshCw, Satellite, CheckCircle2 } from "lucide-react";
import { usePlanetaryTelemetry } from "../lib/telemetry";

export default function BiosphereTelemetryWidget() {
  const {
    telemetry,
    lastSyncTime,
    streamLatencyMs,
    flashingIds,
    forceSync,
  } = usePlanetaryTelemetry(2500);

  const co2 = telemetry.find((t) => t.id === "CO2_ATMOS");
  const temp = telemetry.find((t) => t.id === "TEMP_ANOMALY");
  const transp = telemetry.find((t) => t.id === "CANOPY_TRANSPIRATION");
  const soil = telemetry.find((t) => t.id === "SOIL_MOISTURE");
  const bio = telemetry.find((t) => t.id === "BIODIVERSITY_INDEX");
  const nodes = telemetry.find((t) => t.id === "ACTIVE_ACOUSTIC_NODES");

  return (
    <div
      className="border border-zinc-200 dark:border-zinc-800 p-5 font-mono text-[9px] text-zinc-500 flex flex-col gap-3.5 bg-[#faf7f2] dark:bg-zinc-950/40 relative"
      id="planetary-biosphere-telemetry-panel"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-600" />

      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800/80 pb-2.5">
        <div className="flex items-center gap-1.5 font-bold tracking-[0.18em] text-foreground uppercase text-[9.5px]">
          <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <span>BIOSPHERE SENSOR MATRIX</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] text-zinc-400 font-medium">{streamLatencyMs}ms</span>
          <button
            onClick={forceSync}
            className="text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            title="Poll environmental sensors"
          >
            <RefreshCw className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* Metrics List */}
      <div className="flex flex-col gap-2.5">
        {/* Canopy Transpiration */}
        <div
          className={`flex justify-between items-center py-1 px-1.5 rounded-none transition-colors ${
            flashingIds["CANOPY_TRANSPIRATION"] ? "bg-emerald-500/10" : ""
          }`}
        >
          <span className="text-zinc-500 dark:text-zinc-400">CANOPY TRANSPIRATION</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            {transp?.value.toFixed(3)} {transp?.unit}
          </span>
        </div>

        {/* Soil Moisture */}
        <div
          className={`flex justify-between items-center py-1 px-1.5 rounded-none transition-colors ${
            flashingIds["SOIL_MOISTURE"] ? "bg-emerald-500/10" : ""
          }`}
        >
          <span className="text-zinc-500 dark:text-zinc-400">JURUÁ SOIL MOISTURE</span>
          <span className="text-zinc-700 dark:text-zinc-300 font-bold">
            {soil?.value.toFixed(2)}% NOMINAL
          </span>
        </div>

        {/* Mauna Loa CO2 */}
        <div
          className={`flex justify-between items-center py-1 px-1.5 rounded-none transition-colors ${
            flashingIds["CO2_ATMOS"] ? "bg-emerald-500/10" : ""
          }`}
        >
          <span className="text-zinc-500 dark:text-zinc-400">ATMOSPHERIC CO₂ (MLO)</span>
          <span className="text-amber-600 dark:text-amber-400 font-bold">
            {co2?.value.toFixed(2)} ppm
          </span>
        </div>

        {/* Surface Temp Anomaly */}
        <div
          className={`flex justify-between items-center py-1 px-1.5 rounded-none transition-colors ${
            flashingIds["TEMP_ANOMALY"] ? "bg-emerald-500/10" : ""
          }`}
        >
          <span className="text-zinc-500 dark:text-zinc-400">GLOBAL TEMP ANOMALY</span>
          <span className="text-rose-600 dark:text-rose-400 font-bold">
            +{temp?.value.toFixed(3)} °C
          </span>
        </div>

        {/* Bioacoustic Density */}
        <div
          className={`flex justify-between items-center py-1 px-1.5 rounded-none transition-colors ${
            flashingIds["BIODIVERSITY_INDEX"] ? "bg-emerald-500/10" : ""
          }`}
        >
          <span className="text-zinc-500 dark:text-zinc-400">BIOACOUSTIC DENSITY</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            {bio?.value.toFixed(1)} / 100 pts
          </span>
        </div>

        {/* Active Acoustic Nodes */}
        <div className="flex justify-between items-center py-1 px-1.5">
          <span className="text-zinc-500 dark:text-zinc-400">AURA ACOUSTIC NODES</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" /> {nodes?.value} ACTIVE
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-zinc-200 dark:border-zinc-850 pt-2 flex justify-between items-center text-[8px] text-zinc-400">
        <span className="flex items-center gap-1">
          <Satellite className="w-2.5 h-2.5 text-emerald-600" /> COPERNICUS & INPA
        </span>
        <span>LAST SYNC: {lastSyncTime.toLocaleTimeString("en-US", { hour12: false })}</span>
      </div>
    </div>
  );
}
