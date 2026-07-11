import { useState, useRef } from "react";
import { Category, ReadingTheme, TextSize } from "../types";
import { BookMarked, Flame, User } from "lucide-react";
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
  onAdminLoginRequest: () => void;
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
  onAdminLoginRequest,
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
      onAdminLoginRequest();
    } else {
      setSealClicks(nextClicks);
      clickTimeoutRef.current = setTimeout(() => {
        setSealClicks(0);
      }, 2500);
    }
  };
  // Get current date formatted like a classical newspaper
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);

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
    <header className="border-b border-[#2d271e]/15 dark:border-amber-500/10 bg-[#faf7f2] dark:bg-[#0c0d10] transition-colors duration-500" id="editorial-header">
      {/* Upper Meta Bar (BBC style ticker and controls with brassy tone) */}
      <div className="bg-[#121a15] text-[#cfc5b6] text-[10px] uppercase tracking-[0.2em] font-mono py-2 px-4 flex flex-col md:flex-row justify-between items-center gap-2 border-b border-[#1c2a21]">
        <div className="flex items-center gap-4 overflow-hidden w-full md:w-auto flex-1">
          <span className="text-amber-500 flex items-center gap-1 shrink-0 font-bold tracking-widest text-[9px]">
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> BIOSPHERE STREAM:
          </span>
          <GlobalHorizontalTicker />
        </div>

        <div className="flex items-center gap-6 shrink-0 mt-1 md:mt-0">
          {/* Text Size Controllers */}
          <div className="flex items-center gap-1.5 border-r border-[#1c2a21]/50 pr-4">
            <span className="text-[9px] text-zinc-500 font-semibold tracking-wider">TYPOGRAPHY:</span>
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

          {/* Reading Mode Theme Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-zinc-500 font-semibold tracking-wider">PALETTE:</span>
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
        </div>
      </div>

      {/* Main Classical Masthead (Washington Post & National Geographic Heritage aesthetic) */}
      <div className="w-full px-6 md:px-10 xl:px-16 py-10 md:py-16 text-center flex flex-col items-center justify-between relative select-none">
        <div className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.45em] text-zinc-500 dark:text-zinc-400 mb-4 flex items-center gap-3">
          <span>AMAZONIA</span> ✦ <span>GALAPAGOS</span> ✦ <span>MADAGASCAR</span> ✦ <span>SIBERIA</span>
        </div>

        {/* Decorative thin floral/star flourish */}
        <div className="text-emerald-700 dark:text-emerald-500 mb-2 text-sm opacity-85">
          ✿ ✦ ✿
        </div>

        {/* Brand Name */}
        <h1 
          className="text-5xl md:text-8xl font-semibold tracking-tight text-foreground relative inline-block px-4 py-2" 
          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", letterSpacing: "-0.01em" }}
          id="main-masthead-title"
        >
          PAEN NATURA
          <span 
            className="absolute -top-1 right-2 w-2.5 h-2.5 bg-emerald-600 rounded-none block cursor-pointer hover:bg-emerald-500 active:bg-amber-500 transition-colors duration-150" 
            title="Planetary Ecological Heritage Seal"
            onClick={handleSealClick}
          />
        </h1>

        <div className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-emerald-850 dark:text-emerald-400 font-sans font-medium mt-4 max-w-xl text-center leading-relaxed opacity-95">
          The Botanical & Ecological Journal of Earth Systems & Planetary Preservation
        </div>

        {/* Date and Portal Controls - High-end Double-Line Box layout */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center border-t border-b border-zinc-300/60 dark:border-zinc-800/60 py-3 mt-10 text-xs text-zinc-600 dark:text-zinc-400 font-mono">
          <span className="tracking-wide text-center md:text-left font-light">{formattedDate}</span>
          <span className="hidden md:inline text-zinc-300 dark:text-zinc-800">✦</span>
          <span className="tracking-widest uppercase text-zinc-500 dark:text-zinc-400 text-center py-1 md:py-0 font-medium">No. 18,442 • Vol. CIV</span>
          <span className="hidden md:inline text-zinc-300 dark:text-zinc-800">✦</span>
          <div className="flex items-center gap-5 mt-2 md:mt-0">
            <button
              id="btn-toggle-saved"
              onClick={() => setCategory("saved")}
              className={`flex items-center gap-1.5 transition-colors uppercase tracking-widest text-[10px] font-bold ${
                currentCategory === "saved"
                  ? "text-amber-600 dark:text-amber-500 font-extrabold"
                  : "hover:text-amber-600 text-zinc-500 dark:text-zinc-400"
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              SAVES ({bookmarksCount})
            </button>
            {isAdminMode && (
              <button
                id="btn-toggle-admin"
                onClick={onAdminToggle}
                className="flex items-center gap-1.5 px-4 py-1.5 border transition-all text-[10px] uppercase tracking-widest rounded-none font-bold bg-amber-500 text-black border-amber-500"
              >
                <User className="w-3.5 h-3.5" />
                Exit Portal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BBC/NatGeo Styled Category Navigation Bar */}
      <nav className="bg-zinc-100/50 dark:bg-zinc-950/40 border-t border-b border-zinc-250 dark:border-zinc-850/80 transition-colors duration-500">
        <div className="w-full px-6 md:px-10 xl:px-16">
          <ul className="flex justify-start md:justify-center overflow-x-auto whitespace-nowrap scrollbar-none py-1 gap-2 md:gap-5 scroll-smooth">
            {categories.map((cat) => {
              const isActive = currentCategory === cat.value;
              return (
                <li key={cat.value}>
                  <button
                    id={`nav-cat-${cat.value}`}
                    onClick={() => setCategory(cat.value)}
                    className={`px-4 py-2 text-xs font-sans uppercase tracking-[0.2em] font-semibold transition-all duration-300 relative ${
                      isActive
                        ? "text-amber-700 dark:text-amber-400 font-extrabold"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-500"
                    }`}
                  >
                    {cat.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-amber-500" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
