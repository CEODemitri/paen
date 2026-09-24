import { useState, useRef, useEffect } from "react";
import { Category, ReadingTheme, TextSize, User as UserType } from "../types";
import { BookMarked, Flame, User, LogIn, LogOut, Feather, ShieldCheck } from "lucide-react";
import { GlobalHorizontalTicker } from "./MarketTicker";

interface EditorialHeaderProps {
  currentCategory: Category | "all" | "saved" | "videos";
  setCategory: (cat: Category | "all" | "saved" | "videos") => void;
  bookmarksCount: number;
  readingTheme: ReadingTheme;
  setReadingTheme: (theme: ReadingTheme) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  onAdminToggle: () => void;
  isAdminMode: boolean;
  onOpenAuth: () => void;
  currentUser: UserType | null;
  onLogout: () => void;
  onOpenAuthorDesk: () => void;
  isAuthorMode: boolean;
}

export default function EditorialHeader({
  currentCategory,
  setCategory,
  bookmarksCount,
  readingTheme,
  setReadingTheme,
  textSize,
  setTextSize,
  onAdminToggle,
  isAdminMode,
  onOpenAuth,
  currentUser,
  onLogout,
  onOpenAuthorDesk,
  isAuthorMode,
}: EditorialHeaderProps) {
  const [sealClicks, setSealClicks] = useState(0);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSealClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    const nextClicks = sealClicks + 1;
    if (nextClicks >= 5) {
      setSealClicks(0);
      onOpenAuth();
    } else {
      setSealClicks(nextClicks);
      clickTimeoutRef.current = setTimeout(() => {
        setSealClicks(0);
      }, 2500);
    }
  };

  const [currentTime, setCurrentTime] = useState(new Date());
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const heroTrackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const video = heroVideoRef.current;
      const track = heroTrackRef.current;
      if (!video || !track || !video.duration || !Number.isFinite(video.duration)) return;

      const rect = track.getBoundingClientRect();
      const trackScrollableDist = track.offsetHeight - window.innerHeight;
      if (trackScrollableDist <= 0) return;

      // Scrolled distance within the pinned track
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / trackScrollableDist, 0), 1);

      // Repeat and scrub twice (2 full cycles) before scrolling away
      const cycle = progress * 2;
      const cycleProgress = cycle >= 2 ? 0.999 : cycle % 1;
      video.currentTime = cycleProgress * video.duration;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = currentTime.toLocaleDateString("en-US", options);
  const formattedTimeLocal = currentTime.toLocaleTimeString("en-US", { hour12: false });

  const categories: { label: string; value: Category | "all" | "videos" | "saved" }[] = [
    { label: "All Field Reports", value: "all" },
    { label: "Eco-Technology", value: "tech" },
    { label: "Planetary Science", value: "science" },
    { label: "Earth Polity", value: "politics" },
    { label: "Ecological Culture", value: "culture" },
    { label: "Green Finance", value: "finance" },
    { label: "In Focus (Video)", value: "videos" },
  ];

  return (
    <header
      className="border-b border-[#2d271e]/15 dark:border-amber-500/10 bg-[#faf7f2] dark:bg-[#0c0d10] transition-colors duration-500"
      id="editorial-header"
    >
      {/* Upper Meta Bar (BBC style ticker and controls with brassy tone) */}
      <div className="bg-[#121a15] text-[#cfc5b6] text-[10px] uppercase tracking-[0.2em] font-mono py-2 px-4 flex flex-col md:flex-row justify-between items-center gap-2 border-b border-[#1c2a21]">
        <div className="flex items-center gap-4 overflow-hidden w-full md:w-auto flex-1">
          <span className="text-amber-500 flex items-center gap-1 shrink-0 font-bold tracking-widest text-[9px]">
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> BIOSPHERE STREAM:
          </span>
          <GlobalHorizontalTicker />
        </div>

        <div className="flex items-center gap-4 shrink-0 mt-1 md:mt-0 flex-wrap">
          {/* Typography Sizes */}
          <div className="flex items-center gap-1.5 border-r border-[#1c2a21]/50 pr-3">
            <span className="text-[9px] text-zinc-500 font-semibold tracking-wider">TYPO:</span>
            {(["sm", "base", "lg", "xl"] as TextSize[]).map((size) => (
              <button
                key={size}
                id={`btn-text-${size}`}
                onClick={() => setTextSize(size)}
                className={`px-1.5 py-0.5 text-[9px] transition-all font-sans font-bold ${
                  textSize === size
                    ? "bg-amber-500 text-black font-extrabold"
                    : "hover:bg-[#1c2a21] text-[#b3a898]"
                }`}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Reading Palette */}
          <div className="flex items-center gap-1.5 border-r border-[#1c2a21]/50 pr-3">
            <button
              id="btn-theme-standard"
              onClick={() => setReadingTheme("standard")}
              className={`w-3.5 h-3.5 rounded-full border border-zinc-600 bg-[#f4f3ec] ${
                readingTheme === "standard" ? "ring-2 ring-emerald-500" : ""
              }`}
              title="Forest Vellum"
            />
            <button
              id="btn-theme-sepia"
              onClick={() => setReadingTheme("editorial-sepia")}
              className={`w-3.5 h-3.5 rounded-full border border-zinc-600 bg-[#f5ebd6] ${
                readingTheme === "editorial-sepia" ? "ring-2 ring-emerald-500" : ""
              }`}
              title="Woodland Sienna"
            />
            <button
              id="btn-theme-dark"
              onClick={() => setReadingTheme("high-contrast")}
              className={`w-3.5 h-3.5 rounded-full border border-zinc-600 bg-[#060d09] ${
                readingTheme === "high-contrast" ? "ring-2 ring-emerald-500" : ""
              }`}
              title="Midnight Moss"
            />
          </div>

          {/* User Account Capsule */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  {currentUser.role === "admin" ? (
                    <span className="bg-amber-500 text-black font-extrabold px-1.5 py-0.2 rounded text-[8px]">
                      ADMIN
                    </span>
                  ) : currentUser.role === "author" ? (
                    <span className="bg-emerald-600 text-white font-extrabold px-1.5 py-0.2 rounded text-[8px]">
                      AUTHOR
                    </span>
                  ) : (
                    <span className="bg-zinc-700 text-zinc-200 px-1.5 py-0.2 rounded text-[8px]">
                      READER
                    </span>
                  )}
                  <span className="text-[10px] text-zinc-200 font-sans font-medium max-w-[110px] truncate">
                    {currentUser.name}
                  </span>
                </div>

                {/* Author Desk shortcut */}
                {currentUser.role === "author" && currentUser.status === "approved" && (
                  <button
                    onClick={onOpenAuthorDesk}
                    className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded flex items-center gap-1 ${
                      isAuthorMode
                        ? "bg-amber-500 text-black"
                        : "bg-emerald-800 hover:bg-emerald-700 text-emerald-100"
                    }`}
                  >
                    <Feather className="w-2.5 h-2.5" />
                    {isAuthorMode ? "Exit Desk" : "Field Desk"}
                  </button>
                )}

                {/* Admin Portal shortcut */}
                {currentUser.role === "admin" && (
                  <button
                    onClick={onAdminToggle}
                    className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded flex items-center gap-1 ${
                      isAdminMode
                        ? "bg-amber-500 text-black"
                        : "bg-zinc-800 hover:bg-zinc-700 text-amber-400"
                    }`}
                  >
                    <ShieldCheck className="w-2.5 h-2.5" />
                    {isAdminMode ? "Exit Admin" : "CMS Admin"}
                  </button>
                )}

                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="text-zinc-400 hover:text-rose-400 p-1 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                id="btn-open-auth-modal"
                onClick={onOpenAuth}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold text-[9px] tracking-wider uppercase border border-amber-500/30 px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
              >
                <LogIn className="w-3 h-3" /> Sign In / Register
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BBC/NatGeo Styled Category Navigation Bar (Top Nav/Info Bar) */}
      <nav className="bg-zinc-100/90 dark:bg-zinc-950/90 border-b border-[#2d271e]/15 dark:border-amber-500/10 transition-colors duration-500 relative z-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex justify-start md:justify-center overflow-x-auto whitespace-nowrap scrollbar-none py-1 gap-2 md:gap-5 scroll-smooth">
            {categories.map((cat) => {
              const isActive = currentCategory === cat.value;
              return (
                <li key={cat.value}>
                  <button
                    id={`nav-cat-${cat.value}`}
                    onClick={() => setCategory(cat.value)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[10.5px] sm:text-xs font-sans uppercase tracking-[0.2em] font-semibold transition-all duration-300 relative ${
                      isActive
                        ? "text-amber-700 dark:text-amber-400 font-extrabold"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-500"
                    }`}
                  >
                    {cat.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 sm:left-4 sm:right-4 h-0.5 bg-amber-500" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Pinned Scroll Track for Hero Section: video scrubs 2 full cycles before scrolling */}
      <div
        ref={heroTrackRef}
        className="relative w-full"
        style={{
          height: "260vh",
        }}
        id="hero-pinned-scroll-track"
      >
        {/* Main Classical Masthead transformed into 100vh Kyoto Poster Intro Hero (Pinned / Sticky) */}
        <div
          className="sticky top-0 w-full select-none flex flex-col justify-between overflow-hidden bg-[#f4ecd9] text-[#1a2b3c] border-b-2 border-[#162738]"
          style={{
            height: "calc(100vh - 74px)",
            minHeight: "560px",
          }}
        >
        {/* Full-Width Background Video Stretching Across the Entire Page */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <video
            ref={heroVideoRef}
            src="/assets/eagle-flying.mp4"
            className="w-full h-full object-cover object-center"
            playsInline
            muted
            autoPlay
            loop
            preload="auto"
          />
          {/* Seamless Top Yellow/Cream Color Match for NATURUA space */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f4ecd9] via-[#f4ecd9]/60 via-22% to-transparent pointer-events-none" />
          {/* Ambient Contrast & Vignette Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121e2a]/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        </div>

        {/* Poster Top Sub-Bar */}
        <div className="relative z-10 w-full px-3 sm:px-8 md:px-12 pt-2 sm:pt-4 pb-1 sm:pb-1.5 flex items-center justify-between border-b border-[#1b2a3a]/15 text-[8.5px] sm:text-[11px] font-mono tracking-[0.2em] sm:tracking-[0.28em] uppercase text-[#1a2b3c] shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-3 z-10">
            <span className="font-bold flex items-center gap-1 text-[#1a2b3c]">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#d9483b] rounded-full inline-block" />
              PAEN
            </span>
            <span className="hidden sm:inline text-zinc-400">/</span>
            <span className="hidden sm:inline text-[#1a2b3c]/70 font-medium">SPECIAL FIELD EDITION</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 sm:gap-4 font-bold tracking-[0.25em] sm:tracking-[0.32em] text-[8.5px] sm:text-xs text-center text-[#1a2b3c] pointer-events-auto">
            <span className="text-[#d9483b] text-[10px] sm:text-xs">✦</span>
            <span className="text-center">TRAVEL DEEPER</span>
            <span className="text-[#d9483b] text-[10px] sm:text-xs">✦</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 z-10">
            {/* Elemental Symbols: Ice, Fire, Earth, Air */}
            <div className="flex items-center gap-1 sm:gap-2 text-[#1a2b3c]" title="Elements: Ice • Fire • Earth • Air">
              {/* Ice Symbol */}
              <span className="p-0.5 sm:p-1 rounded hover:bg-[#1a2b3c]/10 transition-colors flex items-center justify-center text-[#3c6b8c]" title="Ice">
                <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4 stroke-current fill-none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                </svg>
              </span>

              {/* Fire Symbol */}
              <span className="p-0.5 sm:p-1 rounded hover:bg-[#1a2b3c]/10 transition-colors flex items-center justify-center text-[#d9483b]" title="Fire">
                <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4 stroke-current fill-none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
                </svg>
              </span>

              {/* Earth Symbol */}
              <span className="p-0.5 sm:p-1 rounded hover:bg-[#1a2b3c]/10 transition-colors flex items-center justify-center text-[#7a5e38]" title="Earth">
                <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4 stroke-current fill-none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 3 2 21 22 21 12 3" />
                  <line x1="6" y1="14" x2="18" y2="14" />
                </svg>
              </span>

              {/* Air Symbol */}
              <span className="p-0.5 sm:p-1 rounded hover:bg-[#1a2b3c]/10 transition-colors flex items-center justify-center text-[#35727a]" title="Air">
                <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4 stroke-current fill-none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
                </svg>
              </span>
            </div>

            <span className="hidden md:inline text-[9px] text-[#1a2b3c]/70 font-mono tracking-wider pl-1 border-l border-[#1a2b3c]/20">
              {formattedTimeLocal}
            </span>
          </div>
        </div>

        {/* Massive Vintage Headline: Tall & Thicker Sans Font Spread Edge-to-Edge */}
        <div className="relative z-10 w-full px-3 sm:px-8 md:px-12 pt-0.5 sm:pt-1 pb-0.5 sm:pb-1 shrink-0">
          <h1
            className="w-full flex justify-between items-baseline font-black uppercase text-[#1a2b3c] drop-shadow-sm cursor-pointer hover:text-[#111e2b] transition-colors"
            style={{
              fontFamily: "'Arial Black', 'Montserrat', 'Inter', 'Impact', 'Helvetica Neue', sans-serif",
              fontSize: "clamp(2.1rem, 11.8vw, 9.6rem)",
              fontWeight: 950,
              lineHeight: 0.85,
              paddingTop: "6px",
              paddingBottom: "6px",
              WebkitTextStroke: "1px currentColor",
              transform: "scaleY(1.15)",
              transformOrigin: "center center",
              textShadow: "0 2px 8px rgba(26,43,60,0.08)",
            }}
            id="main-masthead-title"
            onClick={() => {
              setCategory("all");
              handleSealClick();
            }}
            title="Click to reset or triple-click seal"
          >
            {"NATURUA".split("").map((char, index) => (
              <span key={index} className="inline-block transition-transform duration-150 hover:-translate-y-1">
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* Central Visual Art Overlay Canvas & Right Vertical Banner */}
        <div className="relative z-10 flex-1 w-full mx-auto px-3 sm:px-8 md:px-12 py-1.5 sm:py-3 flex items-stretch justify-between gap-2.5 sm:gap-5 min-h-0">
          {/* Main Visual Canvas Frame (original full-height structure) */}
          <div className="relative w-36 sm:w-52 md:w-64 lg:w-1/4 h-full min-h-0 overflow-hidden border border-[#1b2a3a]/25 shadow-md bg-[#121e2a]/20 backdrop-blur-[2px] group shrink-0">
            {/* Glowing Sun / Moon in mountain mist */}
            <div className="absolute top-[8%] left-[46%] w-16 h-16 sm:w-28 sm:h-28 rounded-full bg-[#faecd0]/40 blur-xl pointer-events-none" />

            {/* Overlaid Powerlines & Overhead Cables */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-45"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1000 700"
              preserveAspectRatio="none"
            >
              <path d="M 0,110 Q 350,170 750,130 T 1000,150" fill="none" stroke="#f4ecd9" strokeWidth="1.2" />
              <path d="M 0,135 Q 400,200 800,155 T 1000,175" fill="none" stroke="#f4ecd9" strokeWidth="0.8" />
              <path d="M 0,180 Q 500,230 1000,200" fill="none" stroke="#f4ecd9" strokeWidth="0.6" />
              <line x1="720" y1="40" x2="720" y2="700" stroke="#f4ecd9" strokeWidth="3" opacity="0.6" />
              <line x1="680" y1="120" x2="760" y2="120" stroke="#f4ecd9" strokeWidth="2.2" opacity="0.6" />
              <line x1="695" y1="160" x2="745" y2="160" stroke="#f4ecd9" strokeWidth="1.8" opacity="0.6" />
            </svg>

            {/* Top-Left: "探求 / THE JOURNEY OF DISCOVERY UNCOVERS CREATIVITY" */}
            <div className="absolute top-2.5 sm:top-5 left-2.5 sm:left-5 z-20 flex flex-col gap-0.5 sm:gap-1 text-[#f8f5ed] drop-shadow-md max-w-[240px]">
              <span className="text-xl sm:text-3xl font-serif font-extrabold tracking-wider text-[#f5ebd6]">
                探求
              </span>
              <div className="text-[7.5px] sm:text-[9.5px] font-mono tracking-[0.18em] sm:tracking-[0.22em] uppercase font-bold leading-tight text-[#e6decb]">
                THE JOURNEY OF <br />
                DISCOVERY UNCOVERS <br />
                CREATIVITY
              </div>
              {/* Botanical Mon Crest */}
              <div className="mt-0.5 sm:mt-1 w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#eed9b3] opacity-90">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a10 10 0 0 1 0 20M2 12a10 10 0 0 1 20 0" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
            </div>

            {/* Bottom-Left: "宇宙の律動に、波長を合わせて。" & "TUNE INTO THE COSMIC RHYTHM" */}
            <div className="absolute bottom-2.5 sm:bottom-5 left-2.5 sm:left-5 z-20 flex flex-col gap-0.5 sm:gap-1 text-[#f8f5ed] max-w-[280px]">
              <span className="text-xs sm:text-sm font-serif font-bold text-[#f5ebd6] tracking-wider">
                宇宙の律動に、波長を合わせて。
              </span>
              <div className="text-[7px] sm:text-[9px] font-mono tracking-[0.18em] sm:tracking-[0.22em] uppercase text-[#e2d8c3] leading-tight sm:leading-relaxed">
                TUNE INTO THE <br />
                COSMIC RHYTHM.
              </div>
              <div className="mt-0.5 pt-1 border-t border-white/20 text-[7px] sm:text-[8.5px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#eed9b3] font-bold">
                VOL. 1 • EST. SEPT 24, 2026
              </div>
            </div>
          </div>

          {/* Right Group: Red Action Button & Vertical Banner */}
          <div className="flex items-end gap-2 sm:gap-4 shrink-0 h-full">
            {/* Free-Standing Red Action Button */}
            <div className="z-30 pointer-events-auto pb-0.5 sm:pb-2">
              <a
                href="#editorial-lead-section"
                className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-[#d9483b] hover:bg-[#c23d30] text-white text-[7.5px] sm:text-[9.5px] md:text-[10px] font-mono uppercase tracking-wider sm:tracking-widest font-bold flex items-center gap-1 sm:gap-2 transition-all shadow-xl rounded-sm hover:scale-105 border border-white/20 whitespace-nowrap"
                id="hero-read-dispatches-btn"
              >
                <span>READ ARTICLES</span>
                <span className="animate-bounce">↓</span>
              </a>
            </div>

            {/* Right Deep Indigo Vertical Banner */}
            <aside
              className="w-14 sm:w-24 md:w-32 lg:w-40 h-full bg-[#122030]/95 backdrop-blur-md text-[#f4ecd9] p-1.5 sm:p-3 flex flex-col justify-between items-center relative border border-[#1d334c] shadow-2xl shrink-0 overflow-hidden group"
              id="kyoto-poster-side-banner"
            >
              {/* Top Station Status Strip */}
              <div className="w-full flex items-center justify-between pt-0.5 border-b border-white/15 pb-1 sm:pb-1.5 text-[6.5px] sm:text-[8px] font-mono tracking-[0.15em] sm:tracking-[0.2em] text-[#d9ab6a] uppercase">
                <span className="font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  LIVE
                </span>
                <span className="text-[#f4ecd9]/70 font-semibold tracking-widest">VOL. 1</span>
              </div>

              {/* Center Area: Soaring Eagle Celestial Glyph & Vertical Poetry */}
              <div className="flex-1 flex flex-col items-center justify-center my-1 sm:my-2 gap-1.5 sm:gap-2.5 w-full">
                {/* Bespoke PAEN Eagle & Celestial River Crest */}
                <div className="w-6 h-6 sm:w-10 sm:h-10 text-[#d9ab6a] relative flex items-center justify-center">
                  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className="w-full h-full" strokeWidth="1.4">
                    {/* Orbit & Meridian Rings */}
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
                    <ellipse cx="32" cy="32" rx="26" ry="10" stroke="currentColor" strokeWidth="1" transform="rotate(-25 32 32)" opacity="0.75" />
                    
                    {/* Soaring Eagle Silhouette in Cosmic Crest */}
                    <path
                      d="M 14,30 Q 24,18 32,24 Q 40,18 50,30 Q 38,27 32,36 Q 26,27 14,30 Z"
                      fill="currentColor"
                      opacity="0.9"
                    />
                    {/* Tail & Head feathers */}
                    <polygon points="32,22 34,25 30,25" fill="#f8f5ed" />
                    <polygon points="32,36 34,42 30,42" fill="currentColor" />

                    {/* River Flow Currents */}
                    <path d="M 18,48 Q 32,44 46,48" stroke="#d9ab6a" strokeWidth="1.2" opacity="0.8" />
                    <path d="M 22,53 Q 32,49 42,53" stroke="#d9ab6a" strokeWidth="0.8" opacity="0.6" />

                    {/* Northern Guiding Star */}
                    <circle cx="32" cy="10" r="2" fill="#d9ab6a" className="animate-pulse" />
                  </svg>
                </div>

                {/* Vertical Japanese Calligraphy: "蒼穹を翔る、生命の鼓動。" */}
                <div
                  className="text-xs sm:text-lg md:text-xl font-serif font-bold text-[#f8f5ed] tracking-[0.2em] sm:tracking-[0.25em] select-none drop-shadow-sm leading-tight"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "upright",
                    letterSpacing: "0.22em",
                  }}
                  title="蒼穹を翔る、生命の鼓動。(Soaring the azure skies, the heartbeat of life.)"
                >
                  蒼穹を翔る、生命の鼓動。
                </div>

                {/* Subtitle in Warm Gold Typography */}
                <div className="text-[6px] sm:text-[7.5px] md:text-[8px] font-mono tracking-[0.16em] sm:tracking-[0.2em] text-[#d9ab6a] uppercase text-center leading-snug font-bold">
                  ELEVATING DISCOVERY <br />
                  TO COSMIC SCALE.
                </div>

                {/* Biosphere Audio Resonance Equalizer Wave */}
                <div className="flex items-center justify-center gap-0.5 sm:gap-1 pt-0.5 opacity-80" title="Audio Soundscape Frequency">
                  <span className="w-0.5 h-1.5 sm:h-2 bg-amber-400 animate-pulse" />
                  <span className="w-0.5 h-3 sm:h-4 bg-amber-400 animate-pulse delay-75" />
                  <span className="w-0.5 h-2 sm:h-3 bg-amber-400 animate-pulse delay-150" />
                  <span className="w-0.5 h-3.5 sm:h-5 bg-amber-400 animate-pulse delay-300" />
                  <span className="w-0.5 h-2 bg-amber-400 animate-pulse delay-100" />
                  <span className="text-[5.5px] sm:text-[7px] font-mono tracking-widest text-emerald-300 font-bold ml-0.5 sm:ml-1">
                    432 Hz
                  </span>
                </div>
              </div>

              {/* Bottom: Coordinates & Radar */}
              <div className="w-full border-t border-white/15 pt-1 flex flex-col items-center gap-0.5 sm:gap-1">
                <div className="relative w-6 sm:w-10 h-5 sm:h-7 flex items-center justify-center">
                  <svg viewBox="0 0 80 60" fill="none" stroke="currentColor" className="w-full h-full text-zinc-400">
                    <line x1="10" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
                    <line x1="40" y1="5" x2="40" y2="55" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
                    <circle cx="40" cy="30" r="18" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                    <circle cx="40" cy="30" r="8" stroke="currentColor" strokeWidth="1" opacity="0.7" />
                    <circle cx="40" cy="30" r="3" fill="#d9483b" />
                    <circle cx="40" cy="30" r="5.5" stroke="#d9483b" strokeWidth="0.8" opacity="0.75" className="animate-ping" />
                  </svg>
                </div>

                <div className="text-[5.5px] sm:text-[7px] font-mono text-zinc-300/80 tracking-wider text-center leading-tight">
                  <div className="text-[#d9ab6a]/90 font-bold">HORIZON 35°N</div>
                  <div>135.7681° E</div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Date and Navigation Strip */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center border-t border-[#1b2a3a]/15 bg-[#ebdcc4]/60 px-3 sm:px-8 md:px-12 py-1.5 sm:py-2 text-[8.5px] sm:text-[10px] text-[#1b2a3a] font-mono gap-1 sm:gap-0">
          <div className="flex items-center gap-2 tracking-wide font-medium">
            <span>{formattedDate}</span>
            <span className="text-[#1b2a3a]/40">•</span>
            <span className="text-[#d9483b] font-bold">PAEN JOURNAL • HEADQUARTERS</span>
          </div>

          <div className="flex items-center gap-4 mt-1 sm:mt-0">
            <button
              id="btn-toggle-saved"
              onClick={() => setCategory("saved")}
              className={`flex items-center gap-1 transition-colors uppercase tracking-widest text-[9.5px] font-bold ${
                currentCategory === "saved"
                  ? "text-[#d9483b] font-extrabold"
                  : "hover:text-[#d9483b] text-[#1b2a3a]"
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              SAVES ({bookmarksCount})
            </button>
            {isAdminMode && (
              <button
                id="btn-toggle-admin"
                onClick={onAdminToggle}
                className="flex items-center gap-1 px-3 py-1 border transition-all text-[9px] uppercase tracking-widest font-bold bg-amber-500 text-black border-amber-500"
              >
                <User className="w-3 h-3" />
                Exit Portal
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </header>
  );
}
