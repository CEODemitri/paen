import { useState, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  ArrowDown,
  Sparkles
} from "lucide-react";
import { Category, User as UserType } from "../types";

interface KyotoHeroIntroProps {
  onExploreClick: () => void;
  onSelectCategory: (cat: Category | "all") => void;
  bookmarksCount: number;
  currentUser: UserType | null;
  onOpenAuth: () => void;
}

export default function KyotoHeroIntro({
  onExploreClick,
  onSelectCategory,
  bookmarksCount,
  currentUser,
  onOpenAuth,
}: KyotoHeroIntroProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [kyotoTime, setKyotoTime] = useState("");
  const [activeSpot, setActiveSpot] = useState<string | null>(null);

  // Live Kyoto JST Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const jst = new Intl.DateTimeFormat("ja-JP", {
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);
      setKyotoTime(jst);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio Zen Chime / Rain Ambient generator
  const toggleAmbientSound = () => {
    if (isPlayingAudio) {
      if (audioCtx) {
        audioCtx.close();
        setAudioCtx(null);
      }
      setIsPlayingAudio(false);
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      // Soothing Japanese Temple Bell / Wind Chime Synthesizer
      const chimeFrequencies = [528, 660, 792, 1056, 1320];
      
      const playChime = () => {
        if (ctx.state === "closed") return;
        const freq = chimeFrequencies[Math.floor(Math.random() * chimeFrequencies.length)];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.8);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 4.0);
      };

      // Play initial chime and interval
      playChime();
      const interval = setInterval(() => {
        if (ctx.state !== "closed") {
          playChime();
        } else {
          clearInterval(interval);
        }
      }, 4500);

      setAudioCtx(ctx);
      setIsPlayingAudio(true);
    } catch {
      console.warn("Web Audio not supported in this browser context");
    }
  };

  return (
    <div
      className="relative w-full h-screen min-h-[680px] max-h-[100vh] bg-[#f2eada] text-[#1b2a3a] select-none flex flex-col justify-between overflow-hidden font-sans border-b-4 border-[#162738]"
      id="kyoto-hero-intro-screen"
    >
      {/* Outer Paper Border / Poster Matting */}
      <div className="absolute inset-0 pointer-events-none border-[12px] sm:border-[16px] md:border-[20px] border-[#f2eada] z-30" />

      {/* 1. Top Masthead Bar (Matching Poster) */}
      <div className="relative z-20 w-full px-5 sm:px-8 md:px-12 pt-4 sm:pt-6 pb-2 flex items-center justify-between border-b border-[#1b2a3a]/20 text-[10px] sm:text-xs font-mono tracking-[0.28em] uppercase text-[#1b2a3a]">
        <div className="flex items-center gap-3">
          <span className="font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#d9483b] rounded-full inline-block" />
            JAPAN
          </span>
          <span className="hidden sm:inline text-zinc-400">/</span>
          <span className="hidden sm:inline text-[#1b2a3a]/70">KANSAI REGION</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 font-bold tracking-[0.3em] text-[10px] sm:text-xs text-center text-[#1b2a3a]">
          <span className="text-[#d9483b]">✦</span>
          <span>TRAVEL DEEPER</span>
          <span className="text-[#d9483b]">✦</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-serif font-bold text-sm tracking-widest text-[#1b2a3a]">京都市</span>
          <span className="hidden md:inline text-[9px] text-[#1b2a3a]/60 tracking-wider">
            JST {kyotoTime || "12:00:00"}
          </span>
        </div>
      </div>

      {/* 2. Massive Poster Headline "KYOTO" */}
      <div className="relative z-20 w-full px-5 sm:px-8 md:px-12 pt-1 sm:pt-2 flex items-center justify-between">
        <h1
          className="w-full text-center text-[16vw] sm:text-[14vw] md:text-[12.5vw] lg:text-[11vw] font-black tracking-[-0.03em] leading-[0.82] text-[#1a2b3c] drop-shadow-sm uppercase cursor-pointer hover:text-[#111e2b] transition-colors"
          style={{
            fontFamily: "'Playfair Display', 'Cinzel', 'Cinzel Decorative', 'Times New Roman', serif",
            textShadow: "0 2px 8px rgba(27,42,58,0.06)",
          }}
          onClick={onExploreClick}
        >
          KYOTO
        </h1>
      </div>

      {/* 3. Main Poster Stage (Artwork + Overlays + Vertical Sidebar) */}
      <div className="relative z-10 flex-1 w-full mx-auto px-5 sm:px-8 md:px-12 pb-4 sm:pb-6 flex items-stretch gap-4 sm:gap-6 min-h-0">
        {/* Left Column: Visual Artwork Canvas with Overlaid Typography */}
        <div className="relative flex-1 h-full min-h-0 overflow-hidden border border-[#1b2a3a]/30 shadow-inner bg-[#2c3d4f] group">
          {/* Main Atmospheric Kyoto Street Painting Background */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-103"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(20, 32, 45, 0.82) 0%, rgba(26, 39, 53, 0.35) 45%, rgba(240, 230, 214, 0.25) 100%), url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=85&w=1800')`,
            }}
          />

          {/* Secondary Layer: Stylized Kyoto Mist & Traditional Japanese Townhouse Scene */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#172533]/85 via-transparent to-[#172533]/40 mix-blend-multiply" />

          {/* Sun / Moon Halo & Pagoda Silhouette glow */}
          <div className="absolute top-[8%] left-[45%] w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#fdf0cd]/40 blur-xl pointer-events-none" />

          {/* Overlaid Powerlines & Electrical Cable Graphic (Authentic Showa/Modern Japan Street aesthetic) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 700"
            preserveAspectRatio="none"
          >
            <path d="M 0,120 Q 350,180 750,140 T 1000,160" fill="none" stroke="#162330" strokeWidth="1.2" />
            <path d="M 0,140 Q 400,210 800,165 T 1000,185" fill="none" stroke="#162330" strokeWidth="0.8" />
            <path d="M 0,190 Q 500,240 1000,210" fill="none" stroke="#162330" strokeWidth="0.6" />
            {/* Utility Pole silhouette */}
            <line x1="720" y1="50" x2="720" y2="700" stroke="#162330" strokeWidth="4" />
            <line x1="680" y1="130" x2="760" y2="130" stroke="#162330" strokeWidth="3" />
            <line x1="695" y1="170" x2="745" y2="170" stroke="#162330" strokeWidth="2.5" />
          </svg>

          {/* Top-Left In-Canvas Kicker (Matches Poster's "京都 / WHERE TRADITION MEETS TIMELESS BEAUTY") */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 flex flex-col gap-1 text-[#f8f5ed] drop-shadow-md max-w-[240px]">
            <span className="text-2xl sm:text-4xl font-serif font-extrabold tracking-wider text-[#eed9b3]">
              京都
            </span>
            <div className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] uppercase font-bold leading-tight text-[#e6decb]">
              WHERE TRADITION <br />
              MEETS TIMELESS BEAUTY
            </div>
            {/* Mon / Botanical Crest SVG */}
            <div className="mt-1.5 w-6 h-6 text-[#eed9b3] opacity-85">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a10 10 0 0 1 0 20M2 12a10 10 0 0 1 20 0" />
                <circle cx="12" cy="12" r="4" />
                <path d="M7 7l10 10M17 7L7 17" />
              </svg>
            </div>
          </div>

          {/* Interactive Japanese Hotspots on Canvas */}
          <div className="absolute inset-0 z-20 pointer-events-auto">
            {/* Hotspot 1: Yasaka Pagoda */}
            <button
              onClick={() => setActiveSpot(activeSpot === "pagoda" ? null : "pagoda")}
              className="absolute top-[28%] left-[52%] -translate-x-1/2 p-2 group/spot focus:outline-none"
              title="Yasaka Pagoda (八坂の塔)"
            >
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white" />
              </span>
              {activeSpot === "pagoda" && (
                <div className="absolute left-6 top-0 bg-[#162738]/95 backdrop-blur-md text-[#f8f5ed] text-[10px] font-mono p-2.5 rounded shadow-xl border border-amber-500/40 w-44 text-left">
                  <div className="font-bold text-amber-300 uppercase tracking-wider">Hōkan-ji Pagoda</div>
                  <div className="text-zinc-300 text-[9px] mt-0.5 font-sans">
                    5-story timber pagoda standing 46m tall above Higashiyama.
                  </div>
                </div>
              )}
            </button>

            {/* Hotspot 2: Machiya Townhouses */}
            <button
              onClick={() => setActiveSpot(activeSpot === "machiya" ? null : "machiya")}
              className="absolute bottom-[28%] left-[22%] p-2 group/spot focus:outline-none"
              title="Traditional Machiya"
            >
              <span className="relative flex h-3.5 w-3.5">
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
              </span>
              {activeSpot === "machiya" && (
                <div className="absolute left-6 bottom-0 bg-[#162738]/95 backdrop-blur-md text-[#f8f5ed] text-[10px] font-mono p-2.5 rounded shadow-xl border border-emerald-500/40 w-48 text-left">
                  <div className="font-bold text-emerald-300 uppercase tracking-wider">Kyoto Machiya</div>
                  <div className="text-zinc-300 text-[9px] mt-0.5 font-sans">
                    Lattice-front wooden merchant houses preserving centuries of craft.
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Bottom-Left In-Canvas Caption (Matches Poster's "古き美しき、新しき出会い。") */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-20 flex flex-col gap-1.5 text-[#f8f5ed] max-w-[280px]">
            <span className="text-sm sm:text-base font-serif font-bold text-[#f2e6cb] tracking-wider">
              古き美しき、新しき出会い。
            </span>
            <div className="text-[8.5px] sm:text-[9.5px] font-mono tracking-[0.22em] uppercase text-[#e2d8c3] leading-relaxed">
              DISCOVER <br />
              THE BEAUTY OF <br />
              OLD AND NEW.
            </div>
            <div className="mt-1 pt-1.5 border-t border-white/20 text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.3em] text-[#eed9b3] font-bold">
              KYOTO CITY, JAPAN
            </div>
          </div>

          {/* Bottom-Right In-Canvas Interactive Controls */}
          <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-20 flex items-center gap-2">
            {/* Zen Ambient Soundscape Button */}
            <button
              id="btn-kyoto-audio-toggle"
              onClick={toggleAmbientSound}
              className={`px-3 py-1.5 rounded-none text-[9px] font-mono uppercase tracking-widest flex items-center gap-1.5 transition-all backdrop-blur-md border ${
                isPlayingAudio
                  ? "bg-amber-500/90 text-black border-amber-400 font-bold"
                  : "bg-black/60 text-zinc-200 border-white/20 hover:bg-black/80"
              }`}
              title={isPlayingAudio ? "Mute Zen Wind Chimes" : "Play Kyoto Wind Chimes"}
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-black animate-pulse" />
                  <span>SOUNDSCAPE: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                  <span>ZEN AMBIENCE</span>
                </>
              )}
            </button>

            {/* Scroll/Explore CTA */}
            <button
              id="btn-kyoto-explore-dossiers"
              onClick={onExploreClick}
              className="px-4 py-1.5 bg-[#d9483b] hover:bg-[#c23d30] text-white text-[9px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 transition-all shadow-lg hover:shadow-red-900/30"
            >
              <span>EXPLORE WIRE</span>
              <ArrowDown className="w-3 h-3 animate-bounce" />
            </button>
          </div>
        </div>

        {/* Right Vertical Sidebar Banner (Matching Poster's Deep Navy Side Panel) */}
        <aside
          className="w-20 sm:w-28 md:w-36 lg:w-44 bg-[#172739] text-[#f2eada] p-3 sm:p-4 flex flex-col justify-between items-center relative border border-[#172739] shadow-xl shrink-0"
          id="kyoto-poster-side-banner"
        >
          {/* Top Pagoda / Torii Ornament */}
          <div className="w-full flex flex-col items-center gap-2 pt-1 border-b border-white/10 pb-3">
            <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.25em] text-[#d9ab6a] uppercase text-center font-bold">
              KANSAI
            </span>
          </div>

          {/* Central Vertical Japanese Text (Exact from poster: 千年の都、心に残る旅。) */}
          <div className="flex-1 flex flex-col items-center justify-center my-3 gap-3">
            <div
              className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-[#f8f5ed] tracking-[0.25em] select-none"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "upright",
                letterSpacing: "0.28em",
              }}
            >
              千年の都、心に残る旅。
            </div>

            <div className="text-[7.5px] sm:text-[8.5px] md:text-[9px] font-mono tracking-[0.2em] text-[#d9ab6a] uppercase text-center mt-2 leading-tight">
              A JOURNEY <br />
              THAT STAYS <br />
              WITH YOU.
            </div>

            {/* 5-Story Pagoda Silhouette Icon */}
            <div className="w-8 h-10 my-1 text-[#f2eada]/80 flex items-center justify-center">
              <svg viewBox="0 0 40 50" fill="currentColor" className="w-full h-full text-[#d9ab6a]">
                {/* Spire */}
                <line x1="20" y1="2" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="20" cy="3" r="1.5" />
                {/* Tier 5 */}
                <path d="M 12,12 L 28,12 L 25,16 L 15,16 Z" />
                {/* Tier 4 */}
                <path d="M 10,18 L 30,18 L 27,22 L 13,22 Z" />
                {/* Tier 3 */}
                <path d="M 8,24 L 32,24 L 29,28 L 11,28 Z" />
                {/* Tier 2 */}
                <path d="M 6,30 L 34,30 L 31,35 L 9,35 Z" />
                {/* Tier 1 Base */}
                <path d="M 4,37 L 36,37 L 33,44 L 7,44 Z" />
                <rect x="14" y="44" width="12" height="5" />
              </svg>
            </div>
          </div>

          {/* Bottom Section: Outline Map of Japan with Kyoto Marker & GPS Coordinates */}
          <div className="w-full border-t border-white/10 pt-2 flex flex-col items-center gap-1.5">
            {/* Stylized Japan Map Vector */}
            <div className="relative w-12 sm:w-16 h-12 flex items-center justify-center">
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="w-full h-full text-zinc-400">
                {/* Hokkaido */}
                <path d="M 75,12 C 82,14 88,22 84,28 C 76,28 72,20 75,12 Z" fill="currentColor" opacity="0.6" />
                {/* Honshu Curve */}
                <path
                  d="M 70,32 C 75,40 68,55 52,68 C 42,75 32,82 20,86 C 18,84 25,76 38,70 C 48,64 58,50 62,35 Z"
                  fill="currentColor"
                  opacity="0.75"
                />
                {/* Shikoku & Kyushu */}
                <circle cx="34" cy="78" r="4" fill="currentColor" opacity="0.6" />
                <path d="M 16,84 C 18,92 24,94 20,98 C 14,94 12,88 16,84 Z" fill="currentColor" opacity="0.6" />
                {/* Kyoto Pinpoint pulsing node */}
                <circle cx="48" cy="65" r="3.5" fill="#d9483b" />
                <circle cx="48" cy="65" r="7" stroke="#d9483b" strokeWidth="1" opacity="0.75" className="animate-ping" />
              </svg>
            </div>

            {/* Geographical Coordinates (Exact from poster: 35.0116° N / 135.7681° E) */}
            <div className="text-[7.5px] sm:text-[8.5px] font-mono text-zinc-300 tracking-wider text-center leading-tight">
              <div>35.0116° N</div>
              <div>135.7681° E</div>
            </div>
          </div>
        </aside>
      </div>

      {/* 4. Bottom Horizontal Quick-Nav Ribbon */}
      <div className="relative z-20 w-full px-5 sm:px-8 md:px-12 py-2 bg-[#e9decb] border-t border-[#1b2a3a]/20 flex flex-wrap items-center justify-between gap-3 text-[9.5px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[#1b2a3a]">
        <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
          <span className="font-bold text-[#d9483b] flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> DOSSIER SECTIONS:
          </span>
          <button
            onClick={() => {
              onSelectCategory("science");
              onExploreClick();
            }}
            className="hover:text-[#d9483b] font-semibold transition-colors"
          >
            Bioacoustics & Ecology
          </button>
          <span>•</span>
          <button
            onClick={() => {
              onSelectCategory("tech");
              onExploreClick();
            }}
            className="hover:text-[#d9483b] font-semibold transition-colors"
          >
            Materials & Optics
          </button>
          <span>•</span>
          <button
            onClick={() => {
              onSelectCategory("culture");
              onExploreClick();
            }}
            className="hover:text-[#d9483b] font-semibold transition-colors"
          >
            Cultural Archiving
          </button>
          <span>•</span>
          <button
            onClick={() => {
              onSelectCategory("finance");
              onExploreClick();
            }}
            className="hover:text-[#d9483b] font-semibold transition-colors"
          >
            Sovereign Capital
          </button>
        </div>

        <div className="flex items-center gap-4 shrink-0 font-medium">
          <span className="text-[#1b2a3a]/70">
            DOSSIER ARCHIVE: <strong className="text-[#1b2a3a]">SAVED ({bookmarksCount})</strong>
          </span>
          {currentUser ? (
            <span className="text-emerald-800 font-bold">FELLOW: {currentUser.name}</span>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-[#d9483b] font-bold hover:underline"
            >
              READER LOGIN →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
