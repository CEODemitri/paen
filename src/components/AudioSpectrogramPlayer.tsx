import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Activity, Radio, Waves } from "lucide-react";

interface AudioSpectrogramPlayerProps {
  title?: string;
  stationName?: string;
  biome?: string;
}

export default function AudioSpectrogramPlayer({
  title = "Biophonic Spectrogram Stream",
  stationName = "Mamirauá Biosphere Research Array #04",
  biome = "Amazonian Sub-Canopy Sensor Grid (34m Elevation)",
}: AudioSpectrogramPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [activeBand, setActiveBand] = useState<"2.4kHz" | "5.8kHz" | "12.1kHz">("5.8kHz");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Audio Synth generator for ambient acoustic telemetry
  const startAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }

      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(220, ctx.currentTime);

      gain.gain.setValueAtTime(isMuted ? 0 : volume * 0.05, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainNodeRef.current = gain;
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const stopAudio = () => {
    try {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
    } catch {
      // Ignored
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        isMuted ? 0 : volume * 0.05,
        audioContextRef.current.currentTime
      );
    }
  }, [volume, isMuted]);

  // Animated Spectrogram Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    const render = () => {
      time += 0.05;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = "#0c140f";
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = "rgba(16, 185, 129, 0.1)";
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Dynamic Frequency Bands
      const bars = 48;
      const barWidth = w / bars;
      for (let i = 0; i < bars; i++) {
        const factor = Math.sin(i * 0.2 + time) * 0.5 + 0.5;
        const speedMultiplier = isPlaying ? 1.8 : 0.2;
        const noise = Math.sin(i * 0.6 + time * speedMultiplier) * 0.4 + 0.6;
        const barHeight = Math.max(4, factor * noise * (h * 0.85));

        const gradient = ctx.createLinearGradient(0, h, 0, h - barHeight);
        gradient.addColorStop(0, "rgba(5, 150, 105, 0.8)");
        gradient.addColorStop(0.6, "rgba(52, 211, 153, 0.9)");
        gradient.addColorStop(1, "rgba(236, 253, 245, 1)");

        ctx.fillStyle = gradient;
        ctx.fillRect(i * barWidth + 1, h - barHeight, barWidth - 2, barHeight);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      stopAudio();
    };
  }, [isPlaying]);

  return (
    <div
      className="my-10 border border-zinc-300 dark:border-zinc-800 bg-[#faf7f2] dark:bg-zinc-950/70 p-5 font-mono text-zinc-700 dark:text-zinc-300"
      id="bioacoustic-spectrogram-player"
    >
      {/* Header telemetry info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800/80 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-widest">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{stationName}</span>
          </div>
          <div className="text-[10px] text-zinc-500 font-sans mt-0.5">{biome}</div>
        </div>

        <div className="flex items-center gap-2 text-[9px]">
          <span className="text-zinc-400">TELEMETRY BAND:</span>
          {(["2.4kHz", "5.8kHz", "12.1kHz"] as const).map((band) => (
            <button
              key={band}
              onClick={() => setActiveBand(band)}
              className={`px-2 py-0.5 border text-[8px] transition-colors ${
                activeBand === band
                  ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                  : "border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-foreground"
              }`}
            >
              {band}
            </button>
          ))}
        </div>
      </div>

      {/* Spectrogram Canvas Display */}
      <div className="relative w-full h-32 bg-[#0c140f] border border-zinc-800 overflow-hidden mb-4">
        <canvas
          ref={canvasRef}
          width={640}
          height={128}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-2 left-3 flex items-center gap-2 text-[8px] tracking-wider text-emerald-400/80 font-mono">
          <Activity className="w-3 h-3 animate-spin" />
          <span>REAL-TIME BIOPHONIC DENSITY [LIVE]</span>
        </div>

        <div className="absolute bottom-2 right-3 text-[8px] text-emerald-500/70 font-mono">
          LATENCY: 18ms • SNR: +28dB
        </div>
      </div>

      {/* Playback Controls & Wave Visualizer info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlayback}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 font-mono uppercase text-[10px] tracking-widest font-bold transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Stop Stream
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Stream Biophony
              </>
            )}
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 border border-zinc-300 dark:border-zinc-800 hover:text-emerald-600 transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-20 accent-emerald-600 h-1 bg-zinc-300 dark:bg-zinc-800 cursor-pointer"
            title="Acoustic Gain"
          />
        </div>

        <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-mono">
          <Waves className="w-3.5 h-3.5 text-emerald-600" />
          <span>{title}</span>
        </div>
      </div>
    </div>
  );
}
