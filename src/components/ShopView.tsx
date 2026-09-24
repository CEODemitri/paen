import {
  BookOpen,
  Download,
  ShoppingBag,
  Ticket,
  Sparkles,
  ArrowDown,
} from "lucide-react";

interface ShopViewProps {
  onBack: () => void;
}

export default function ShopView({
  onBack,
}: ShopViewProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full bg-[#f8f5ed] dark:bg-[#0c120e] text-zinc-900 dark:text-zinc-100 min-h-screen transition-colors duration-300 pb-28">
      {/* Standalone Page Top Utility Navigation */}
      <div className="bg-[#121a15] text-[#cfc5b6] text-[10px] uppercase tracking-[0.2em] font-mono py-2.5 px-4 sm:px-8 flex justify-between items-center border-b border-[#1c2a21] sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold tracking-widest transition-all hover:scale-105"
            id="shop-back-to-journal-btn"
          >
            <span>← RETURN TO JOURNAL</span>
          </button>
          <span className="hidden sm:inline text-zinc-500">•</span>
          <span className="hidden sm:inline text-zinc-400 font-bold">PAEN EXPEDITION & BOOKSHOP DESK</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-[#34d399] font-bold border border-[#34d399]/30 bg-[#34d399]/10">
            OFFICIAL CATALOGUE
          </span>
        </div>
      </div>

      {/* Header Container */}
      <div className="w-full border-b border-zinc-300 dark:border-zinc-800 bg-[#f4ecd9] dark:bg-[#0a100d] relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          {/* Top Sub-Bar */}
          <div className="flex justify-between items-center border-b border-[#1b2a3a]/15 dark:border-zinc-800 pb-2 mb-4 text-[9.5px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-[#1a2b3c] dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#d9483b] rounded-full inline-block animate-pulse" />
              <span className="font-bold">PAEN DISPATCHES & PROVISIONS</span>
              <span className="hidden sm:inline text-zinc-400">•</span>
              <span className="hidden sm:inline">OFFICIAL BOOKSHOP & BOX OFFICE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
                VOL. 1 FIELD CATALOGUE
              </span>
            </div>
          </div>

          {/* Massive Vintage Masthead Title: SHOP (Reduced font size & tighter letter tracking) */}
          <div className="w-full py-1">
            <h1
              className="flex items-baseline gap-3 sm:gap-6 md:gap-8 font-black uppercase text-[#1a2b3c] dark:text-[#f4ecd9] drop-shadow-sm cursor-default select-none"
              style={{
                fontFamily: "'Arial Black', 'Montserrat', 'Inter', 'Impact', 'Helvetica Neue', sans-serif",
                fontSize: "clamp(2rem, 6.5vw, 5.2rem)",
                fontWeight: 950,
                lineHeight: 0.85,
                paddingTop: "2px",
                paddingBottom: "4px",
                letterSpacing: "-0.025em",
                WebkitTextStroke: "0.5px currentColor",
                transform: "scaleY(1.05)",
                transformOrigin: "left center",
                textShadow: "0 2px 8px rgba(26,43,60,0.06)",
              }}
              id="shop-masthead-title"
            >
              {"SHOP".split("").map((char, index) => (
                <span key={index} className="inline-block transition-transform duration-150 hover:-translate-y-1">
                  {char}
                </span>
              ))}
            </h1>
          </div>

          {/* Subtitle / Philosophy Strip */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 border-t border-[#1b2a3a]/15 dark:border-zinc-800 text-[9.5px] font-mono text-zinc-600 dark:text-zinc-400 gap-2">
            <div>
              PHYSICAL EDITIONS • DIGITAL MONOGRAPHS • NATURALIST ARTIFACTS • GATHERING TICKETS
            </div>
            <div className="flex items-center gap-1 text-[#34d399] font-bold uppercase tracking-widest">
              <span>✦ OFFICIAL PROVISIONS & ADMISSIONS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Four Artistic Bento Boxes of Different Shapes (Artistic Only, clicking takes to section) */}
        <div className="mb-16">
          <div className="flex items-center justify-between border-b border-zinc-300 dark:border-zinc-800 pb-2 mb-6 text-[9.5px] font-mono tracking-[0.25em] uppercase text-zinc-500">
            <span className="font-bold flex items-center gap-2 text-foreground">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> CURATED PROVISIONS DIRECTORY
            </span>
            <span>SELECT TO JUMP TO CATALOGUE</span>
          </div>

          {/* Bento Grid layout with distinct organic shapes */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
            {/* Bento 1: Live Books (7 cols, rich landscape shape) */}
            <div
              onClick={() => scrollToSection("section-live-books")}
              className="md:col-span-7 bg-[#142319] text-[#f4ecd9] border border-emerald-900/60 p-6 sm:p-8 rounded-none relative overflow-hidden group cursor-pointer hover:border-emerald-500 transition-all duration-300 shadow-xl flex flex-col justify-between min-h-[260px]"
            >
              {/* Artistic Woodcut Background Graphic */}
              <div className="absolute right-0 bottom-0 w-64 h-64 opacity-15 pointer-events-none group-hover:scale-105 transition-transform duration-700">
                <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" className="w-full h-full text-emerald-300">
                  <circle cx="100" cy="100" r="80" strokeWidth="1" strokeDasharray="4 4" />
                  <polygon points="100,20 180,180 20,180" strokeWidth="1.5" />
                  <circle cx="100" cy="100" r="40" strokeWidth="1.2" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/40 text-[8.5px] font-mono uppercase tracking-[0.2em] text-emerald-300 font-bold">
                    01 • PRINT ARCHIVE
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 group-hover:translate-y-1 transition-transform flex items-center gap-1 font-bold">
                    EXPLORE SECTION <ArrowDown className="w-3 h-3" />
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5ebd6] leading-tight tracking-tight">
                  Live Books & Hardcovers
                </h2>
                <p className="text-xs text-emerald-100/70 mt-2 max-w-md font-sans font-light leading-relaxed">
                  Clothbound monographs, gold-embossed library bindings, and archival lithographs printed on heavy unbleached paper.
                </p>
              </div>

              <div className="relative z-10 pt-4 mt-4 border-t border-emerald-800/40 flex items-center justify-between text-[9px] font-mono text-emerald-300/80">
                <span>PHYSICAL PRINT ARCHIVE</span>
                <span className="text-[#34d399] font-bold">COMING SOON</span>
              </div>
            </div>

            {/* Bento 2: E-Books (5 cols, vertical card shape) */}
            <div
              onClick={() => scrollToSection("section-ebooks")}
              className="md:col-span-5 bg-[#101b2b] text-[#f4ecd9] border border-blue-900/60 p-6 sm:p-8 rounded-none relative overflow-hidden group cursor-pointer hover:border-blue-400 transition-all duration-300 shadow-xl flex flex-col justify-between min-h-[260px]"
            >
              <div className="absolute right-2 top-2 opacity-10 pointer-events-none">
                <Download className="w-36 h-36 text-blue-300" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 bg-blue-950/80 border border-blue-500/40 text-[8.5px] font-mono uppercase tracking-[0.2em] text-blue-300 font-bold">
                    02 • DIGITAL LEDGERS
                  </span>
                  <span className="text-[9px] font-mono text-blue-400 group-hover:translate-y-1 transition-transform flex items-center gap-1 font-bold">
                    JUMP <ArrowDown className="w-3 h-3" />
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f5ebd6] leading-tight">
                  E-Books & Dossiers
                </h2>
                <p className="text-xs text-blue-100/70 mt-2 font-sans font-light leading-relaxed">
                  DRM-free digital editions with high-definition vector plates and embedded audio narration tracks.
                </p>
              </div>

              <div className="relative z-10 pt-4 mt-4 border-t border-blue-800/40 flex items-center justify-between text-[9px] font-mono text-blue-300/80">
                <span>INSTANT PDF & EPUB</span>
                <span className="text-[#34d399] font-bold">COMING SOON</span>
              </div>
            </div>

            {/* Bento 3: Merchandise & Artifacts (5 cols, square shape) */}
            <div
              onClick={() => scrollToSection("section-merch")}
              className="md:col-span-5 bg-[#2b1f14] text-[#f4ecd9] border border-amber-900/60 p-6 sm:p-8 rounded-none relative overflow-hidden group cursor-pointer hover:border-amber-500 transition-all duration-300 shadow-xl flex flex-col justify-between min-h-[260px]"
            >
              <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                <ShoppingBag className="w-40 h-40 text-amber-300" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 bg-amber-950/80 border border-amber-500/40 text-[8.5px] font-mono uppercase tracking-[0.2em] text-amber-300 font-bold">
                    03 • FIELD GEAR
                  </span>
                  <span className="text-[9px] font-mono text-amber-400 group-hover:translate-y-1 transition-transform flex items-center gap-1 font-bold">
                    JUMP <ArrowDown className="w-3 h-3" />
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f5ebd6] leading-tight">
                  Merch & Artifacts
                </h2>
                <p className="text-xs text-amber-100/70 mt-2 font-sans font-light leading-relaxed">
                  Limited lithograph prints, forged brass reading seals, stone paper field journals, and organic linen apparel.
                </p>
              </div>

              <div className="relative z-10 pt-4 mt-4 border-t border-amber-800/40 flex items-center justify-between text-[9px] font-mono text-amber-300/80">
                <span>HAND-CRAFTED ARTIFACTS</span>
                <span className="text-[#34d399] font-bold">COMING SOON</span>
              </div>
            </div>

            {/* Bento 4: Live Events & Tickets (7 cols, wide panorama shape) */}
            <div
              onClick={() => scrollToSection("section-events")}
              className="md:col-span-7 bg-[#1c1424] text-[#f4ecd9] border border-purple-900/60 p-6 sm:p-8 rounded-none relative overflow-hidden group cursor-pointer hover:border-purple-400 transition-all duration-300 shadow-xl flex flex-col justify-between min-h-[260px]"
            >
              <div className="absolute right-0 top-0 w-48 h-48 opacity-15 pointer-events-none">
                <Ticket className="w-full h-full text-purple-300" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 bg-purple-950/80 border border-purple-500/40 text-[8.5px] font-mono uppercase tracking-[0.2em] text-purple-300 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 04 • LIVE BOX OFFICE
                  </span>
                  <span className="text-[9px] font-mono text-purple-400 group-hover:translate-y-1 transition-transform flex items-center gap-1 font-bold">
                    VIEW DATES & PASSES <ArrowDown className="w-3 h-3" />
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f5ebd6] leading-tight">
                  Gatherings & Expedition Tickets
                </h2>
                <p className="text-xs text-purple-100/70 mt-2 max-w-md font-sans font-light leading-relaxed">
                  Reserve tickets for upcoming scientific symposiums, bioacoustic canopy walks, and field research expeditions in Kyoto, London, and the Pacific Northwest.
                </p>
              </div>

              <div className="relative z-10 pt-4 mt-4 border-t border-purple-800/40 flex items-center justify-between text-[9px] font-mono text-purple-300/80">
                <span>BOX OFFICE & PASSES</span>
                <span className="text-[#34d399] font-bold">COMING SOON</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 1: LIVE BOOKS (PHYSICAL HARDCOVERS) */}
        {/* ============================================================ */}
        <section className="mb-24 scroll-mt-28" id="section-live-books">
          <div className="flex justify-between items-center border-b-2 border-zinc-300 dark:border-zinc-800 pb-3 mb-6 text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-500">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-foreground text-sm">SECTION 01 • LIVE BOOKS & HARDCOVERS</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400">PHYSICAL PRINT EDITIONS</span>
          </div>

          {/* Sharp 26px Light Green Coming Soon */}
          <div className="py-12 px-6 sm:px-8 bg-white/70 dark:bg-zinc-900/60 border border-zinc-250 dark:border-zinc-800 flex flex-col items-start gap-3 shadow-sm">
            <div
              className="font-mono font-bold uppercase tracking-[0.22em] text-[#34d399]"
              style={{ fontSize: "26px", lineHeight: "1.1" }}
            >
              COMING SOON
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans font-light max-w-2xl leading-relaxed">
              Archival clothbound monographs, gold-embossed library bindings, and limited botanical field editions printed on 120gsm unbleached paper. Physical print volume catalogue and pre-orders will open here.
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 2: E-BOOKS & DIGITAL EDITIONS */}
        {/* ============================================================ */}
        <section className="mb-24 scroll-mt-28" id="section-ebooks">
          <div className="flex justify-between items-center border-b-2 border-zinc-300 dark:border-zinc-800 pb-3 mb-6 text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-500">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-foreground text-sm">SECTION 02 • E-BOOKS & DIGITAL DOSSIERS</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400">INSTANT DRM-FREE DELIVERY</span>
          </div>

          {/* Sharp 26px Light Green Coming Soon */}
          <div className="py-12 px-6 sm:px-8 bg-white/70 dark:bg-zinc-900/60 border border-zinc-250 dark:border-zinc-800 flex flex-col items-start gap-3 shadow-sm">
            <div
              className="font-mono font-bold uppercase tracking-[0.22em] text-[#34d399]"
              style={{ fontSize: "26px", lineHeight: "1.1" }}
            >
              COMING SOON
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans font-light max-w-2xl leading-relaxed">
              DRM-free digital editions, interactive vector plates, and high-fidelity bio-acoustic research dossiers formatted for cross-platform e-readers and tablet study.
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: OFFICIAL MERCHANDISE & ARTIFACTS */}
        {/* ============================================================ */}
        <section className="mb-24 scroll-mt-28" id="section-merch">
          <div className="flex justify-between items-center border-b-2 border-zinc-300 dark:border-zinc-800 pb-3 mb-6 text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-500">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-foreground text-sm">SECTION 03 • MERCHANDISE & ARTIFACTS</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400">LIMITED ARTISAN DROPS</span>
          </div>

          {/* Sharp 26px Light Green Coming Soon */}
          <div className="py-12 px-6 sm:px-8 bg-white/70 dark:bg-zinc-900/60 border border-zinc-250 dark:border-zinc-800 flex flex-col items-start gap-3 shadow-sm">
            <div
              className="font-mono font-bold uppercase tracking-[0.22em] text-[#34d399]"
              style={{ fontSize: "26px", lineHeight: "1.1" }}
            >
              COMING SOON
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans font-light max-w-2xl leading-relaxed">
              Hand-numbered washi lithographs, forged solid brass reading seals, water-resistant stone paper naturalist journals, and organic heavyweight linen field apparel.
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 4: LIVE EVENTS & TICKETS BOX OFFICE */}
        {/* ============================================================ */}
        <section className="mb-24 scroll-mt-28" id="section-events">
          <div className="flex justify-between items-center border-b-2 border-zinc-300 dark:border-zinc-800 pb-3 mb-6 text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-500">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-foreground text-sm">SECTION 04 • LIVE EVENTS & EXPEDITION TICKETS</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400">BOX OFFICE & PASSES</span>
          </div>

          {/* Sharp 26px Light Green Coming Soon */}
          <div className="py-12 px-6 sm:px-8 bg-white/70 dark:bg-zinc-900/60 border border-zinc-250 dark:border-zinc-800 flex flex-col items-start gap-3 shadow-sm">
            <div
              className="font-mono font-bold uppercase tracking-[0.22em] text-[#34d399]"
              style={{ fontSize: "26px", lineHeight: "1.1" }}
            >
              COMING SOON
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans font-light max-w-2xl leading-relaxed">
              Registration and seat passes for upcoming solstice symposiums, old-growth rainforest sensor camps, and bioacoustic research gatherings. Schedule, dates, venue addresses, attractions, and live ticket allocations will be posted here.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

