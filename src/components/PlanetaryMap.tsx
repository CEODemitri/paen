import { useState } from "react";
import { Compass, Radio, MapPin, Activity } from "lucide-react";

interface PlanetaryStation {
  id: string;
  name: string;
  region: string;
  coords: string;
  elevation: string;
  status: "ACTIVE" | "SYNCHRONIZED" | "CALIBRATING";
  metric: string;
  articleQuery: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

const STATIONS: PlanetaryStation[] = [
  {
    id: "st-amazon",
    name: "Amazonian Canopy Array #04",
    region: "Mamirauá Reserve, Brazil",
    coords: "03°08'S 64°45'W",
    elevation: "34m",
    status: "ACTIVE",
    metric: "94.2% Biophonic Density",
    articleQuery: "Acoustic Biosphere",
    x: 32,
    y: 58,
  },
  {
    id: "st-kyoto",
    name: "Kyoto Forest Hydrographic Node",
    region: "Kitayama Valley, Japan",
    coords: "35°01'N 135°46'E",
    elevation: "410m",
    status: "SYNCHRONIZED",
    metric: "18.4°C Soil • 92% Hydration",
    articleQuery: "Kyoto",
    x: 82,
    y: 38,
  },
  {
    id: "st-arctic",
    name: "High Arctic Marine Observer",
    region: "Fram Strait, Svalbard",
    coords: "78°55'N 11°56'E",
    elevation: "0m",
    status: "ACTIVE",
    metric: "-4.2°C Salinity 34.8 PSU",
    articleQuery: "Arctic Summer Sea Ice",
    x: 52,
    y: 16,
  },
  {
    id: "st-alps",
    name: "Alpine Atmospheric Observatory",
    region: "Jungfraujoch, Switzerland",
    coords: "46°32'N 07°59'E",
    elevation: "3,571m",
    status: "SYNCHRONIZED",
    metric: "421.4 ppm CO₂ Baseline",
    articleQuery: "Diamond Semiconductor",
    x: 48,
    y: 32,
  },
  {
    id: "st-pacific",
    name: "Polynesian Acoustic Mooring",
    region: "Kermadec Trench",
    coords: "30°15'S 178°30'W",
    elevation: "-2,400m",
    status: "CALIBRATING",
    metric: "Deep Sub-Sea Low Frequency",
    articleQuery: "Dispatches",
    x: 90,
    y: 78,
  },
];

interface PlanetaryMapProps {
  onSelectStationDispatch: (title: string) => void;
}

export default function PlanetaryMap({ onSelectStationDispatch }: PlanetaryMapProps) {
  const [selectedStation, setSelectedStation] = useState<PlanetaryStation>(STATIONS[0]);
  const [radarSweep, setRadarSweep] = useState(true);

  return (
    <div
      className="border border-zinc-250 dark:border-zinc-800 bg-[#faf7f2] dark:bg-zinc-950/60 p-4 sm:p-6 font-mono text-[10px] relative overflow-hidden"
      id="planetary-map-container"
    >
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold uppercase tracking-[0.2em] text-foreground text-[10px]">
            GEOSPATIAL BIOSPHERE OBSERVATION NETWORK
          </span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400 text-[9px]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            5/5 SENSORS ONLINE
          </span>
          <button
            onClick={() => setRadarSweep(!radarSweep)}
            className="hover:text-foreground text-zinc-500 underline transition-colors"
          >
            {radarSweep ? "Radar: ON" : "Radar: OFF"}
          </button>
        </div>
      </div>

      {/* Main Map Visual Canvas Area */}
      <div className="relative w-full aspect-[21/9] min-h-[260px] bg-[#f2ede4] dark:bg-[#0c140f] border border-zinc-300/80 dark:border-zinc-800 overflow-hidden select-none">
        {/* World Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4%_12.5%]" />

        {/* Radar Sweep Effect */}
        {radarSweep && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent w-32 animate-[slide_6s_linear_infinite]" />
        )}

        {/* Equatorial & Prime Meridian Hairlines */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-emerald-600/20 dashed" />
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-emerald-600/20" />
        <span className="absolute top-1/2 right-2 -translate-y-1/2 text-[8px] text-zinc-400 tracking-widest">
          EQUATOR 00°00'
        </span>

        {/* Map Stations */}
        {STATIONS.map((st) => {
          const isSelected = selectedStation.id === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setSelectedStation(st)}
              style={{ left: `${st.x}%`, top: `${st.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none z-10"
              title={`${st.name} (${st.region})`}
            >
              {/* Ping circle */}
              <span
                className={`absolute -inset-2 rounded-full transition-all ${
                  isSelected
                    ? "bg-emerald-500/30 scale-125 animate-ping"
                    : "group-hover:bg-emerald-500/20 group-hover:scale-110"
                }`}
              />

              {/* Center Dot */}
              <span
                className={`relative flex items-center justify-center w-3 h-3 rounded-full border transition-all ${
                  isSelected
                    ? "bg-emerald-600 border-white text-white shadow-md scale-110"
                    : "bg-[#faf7f2] dark:bg-zinc-900 border-emerald-600 dark:border-emerald-400 text-emerald-600"
                }`}
              >
                <span className="w-1 h-1 bg-current rounded-full" />
              </span>

              {/* Station Tooltip Tag */}
              <div
                className={`absolute left-1/2 bottom-full mb-1.5 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 border shadow-sm text-[8px] tracking-wider transition-opacity ${
                  isSelected
                    ? "opacity-100 bg-[#1b2a3a] text-white border-[#1b2a3a]"
                    : "opacity-0 group-hover:opacity-100 bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700"
                }`}
              >
                {st.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Station Telemetry Strip & Jump Action */}
      <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-zinc-600 dark:text-zinc-300">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{selectedStation.name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500">
            <span>{selectedStation.region}</span>
            <span>•</span>
            <span className="text-zinc-400">{selectedStation.coords}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
            <Activity className="w-3 h-3" />
            <span>{selectedStation.metric}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectStationDispatch(selectedStation.articleQuery)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 font-bold uppercase tracking-wider text-[9px] transition-colors"
          >
            <Radio className="w-3 h-3" />
            <span>Access Field Dispatch</span>
          </button>
        </div>
      </div>
    </div>
  );
}
