import { useState } from "react";
import {
  BookOpen,
  Download,
  ShoppingBag,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Search,
  CheckCircle2,
  ArrowDown,
  Plus,
  Minus,
  Trash2,
  X,
  CreditCard,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { ShopItem, ShopEvent, CartItem } from "../types";

interface ShopViewProps {
  items: ShopItem[];
  events: ShopEvent[];
  cart: CartItem[];
  onAddToCart: (item: ShopItem | ShopEvent, type: "item" | "event", variant?: string) => void;
  onUpdateCartQty: (id: string, qty: number) => void;
  onRemoveFromCart: (id: string) => void;
  onClearCart: () => void;
  onBack: () => void;
}

export default function ShopView({
  items,
  events,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onClearCart,
  onBack,
}: ShopViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "live-books" | "ebooks" | "merch" | "events">("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Filter items and events
  const physicalBooks = items.filter((i) => i.category === "live-books");
  const ebooks = items.filter((i) => i.category === "ebooks");
  const merchItems = items.filter((i) => i.category === "merch");

  const filterMatches = (text: string) =>
    !searchQuery || text.toLowerCase().includes(searchQuery.toLowerCase());

  const filteredBooks = physicalBooks.filter(
    (b) => filterMatches(b.title) || filterMatches(b.subtitle) || filterMatches(b.description) || (b.authorOrCreator && filterMatches(b.authorOrCreator))
  );

  const filteredEbooks = ebooks.filter(
    (b) => filterMatches(b.title) || filterMatches(b.subtitle) || filterMatches(b.description) || (b.authorOrCreator && filterMatches(b.authorOrCreator))
  );

  const filteredMerch = merchItems.filter(
    (m) => filterMatches(m.title) || filterMatches(m.subtitle) || filterMatches(m.description)
  );

  const filteredEvents = events.filter(
    (e) =>
      filterMatches(e.title) ||
      filterMatches(e.subtitle) ||
      filterMatches(e.city) ||
      filterMatches(e.venueName) ||
      filterMatches(e.address) ||
      e.attractions.some((a) => filterMatches(a))
  );

  const totalCartCount = cart.reduce((acc, c) => acc + c.quantity, 0);
  const totalCartPrice = cart.reduce((acc, c) => acc + c.price * c.quantity, 0);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      onClearCart();
      setCheckoutSuccess(false);
      setIsCartOpen(false);
    }, 3000);
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
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-mono text-[9.5px] uppercase tracking-wider font-extrabold hover:scale-105 transition-all shadow-md"
            id="shop-open-cart-btn"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>BAG ({totalCartCount})</span>
            <span className="text-black font-black">${totalCartPrice.toFixed(2)}</span>
          </button>
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
            <div className="flex items-center gap-1 text-[#d9483b] dark:text-amber-400 font-bold uppercase tracking-widest">
              <span>✦ FREE WORLDWIDE SHIPPING ON PRINT ORDERS OVER $75</span>
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
                <span>{physicalBooks.length} AVAILABLE TITLES</span>
                <span className="text-amber-400 font-bold">FROM $38.00</span>
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
                <span className="text-amber-400 font-bold">FROM $12.00</span>
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
                <span className="text-amber-400 font-bold">FROM $28.00</span>
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
                <span>{events.length} UPCOMING EXPEDITIONS</span>
                <span className="text-amber-400 font-bold">LIVE SEAT INVENTORY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Shop Search & Category Quick Filter Bar */}
        <div className="mb-14 p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sticky top-16 z-30 shadow-md backdrop-blur-md">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all" as const, label: "All Items" },
              { id: "live-books" as const, label: "Live Books" },
              { id: "ebooks" as const, label: "E-Books" },
              { id: "merch" as const, label: "Merch" },
              { id: "events" as const, label: "Event Tickets" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedFilter(cat.id);
                  if (cat.id !== "all") {
                    scrollToSection(`section-${cat.id}`);
                  }
                }}
                className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider font-bold transition-all ${
                  selectedFilter === cat.id
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                    : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-250 dark:border-zinc-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input Field */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center flex-1 sm:w-72">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search titles, authors, cities, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-zinc-950 text-xs font-sans text-foreground border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-400 placeholder-zinc-400"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-bold shrink-0"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 1: LIVE BOOKS (PHYSICAL HARDCOVERS) */}
        {/* ============================================================ */}
        <section className="mb-24 scroll-mt-28" id="section-live-books">
          <div className="flex justify-between items-center border-b-2 border-zinc-300 dark:border-zinc-800 pb-3 mb-8 text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-500">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-foreground text-sm">SECTION 01 • LIVE BOOKS & HARDCOVERS</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400">PHYSICAL PRINT EDITIONS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredBooks.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-zinc-900/90 border border-zinc-300 dark:border-zinc-800 flex flex-col justify-between group hover:border-emerald-600 transition-all shadow-sm"
              >
                {/* Book Cover Frame */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {item.featured && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[8px] font-mono uppercase tracking-wider bg-emerald-600 text-white font-bold">
                      PRINCIPAL MONOGRAPH
                    </span>
                  )}

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-[8.5px] font-mono text-emerald-200/90">
                    <span>{item.pagesOrSpecs}</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 mb-1">
                      <span>BY {item.authorOrCreator}</span>
                      <span className="text-emerald-600 font-bold">{item.stockCount} IN STOCK</span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-foreground leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans font-light mt-1.5 line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-base font-serif font-bold text-foreground">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-zinc-400 line-through ml-2 font-mono">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onAddToCart(item, "item")}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-emerald-700 dark:bg-zinc-100 dark:hover:bg-emerald-600 text-white dark:text-zinc-900 dark:hover:text-white text-[9px] font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> ORDER BOOK
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 2: E-BOOKS & DIGITAL EDITIONS */}
        {/* ============================================================ */}
        <section className="mb-24 scroll-mt-28" id="section-ebooks">
          <div className="flex justify-between items-center border-b-2 border-zinc-300 dark:border-zinc-800 pb-3 mb-8 text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-500">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-foreground text-sm">SECTION 02 • E-BOOKS & DIGITAL DOSSIERS</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400">INSTANT DRM-FREE DELIVERY</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredEbooks.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-zinc-900/90 border border-zinc-300 dark:border-zinc-800 flex flex-col justify-between group hover:border-blue-500 transition-all shadow-sm"
              >
                {/* Ebook Graphic Frame */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1420] via-transparent to-transparent" />
                  
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[8px] font-mono uppercase tracking-wider bg-blue-600 text-white font-bold flex items-center gap-1">
                    <Download className="w-2.5 h-2.5" /> DIGITAL EDITION
                  </span>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-[8.5px] font-mono text-blue-200/90">
                    <span>{item.format}</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 mb-1">
                      <span>BY {item.authorOrCreator}</span>
                      <span className="text-blue-500 font-bold">INSTANT LINK</span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-foreground leading-snug group-hover:text-blue-500 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans font-light mt-1.5 line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-base font-serif font-bold text-foreground">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => onAddToCart(item, "item")}
                      className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white text-[9px] font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3 h-3" /> GET E-BOOK
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: OFFICIAL MERCHANDISE & ARTIFACTS */}
        {/* ============================================================ */}
        <section className="mb-24 scroll-mt-28" id="section-merch">
          <div className="flex justify-between items-center border-b-2 border-zinc-300 dark:border-zinc-800 pb-3 mb-8 text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-500">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-foreground text-sm">SECTION 03 • MERCHANDISE & ARTIFACTS</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400">LIMITED ARTISAN DROPS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredMerch.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-zinc-900/90 border border-zinc-300 dark:border-zinc-800 flex flex-col justify-between group hover:border-amber-600 transition-all shadow-sm"
              >
                {/* Product Frame */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {item.featured && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[8px] font-mono uppercase tracking-wider bg-amber-600 text-white font-bold">
                      LIMITED ARTIFACT
                    </span>
                  )}

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-[8.5px] font-mono text-amber-200/90">
                    <span>{item.format}</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 mb-1">
                      <span>PAEN ATELIER</span>
                      <span className="text-amber-600 font-bold">{item.stockCount} LEFT</span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-foreground leading-snug group-hover:text-amber-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans font-light mt-1.5 line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-base font-serif font-bold text-foreground">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => onAddToCart(item, "item")}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-amber-700 dark:bg-zinc-100 dark:hover:bg-amber-600 text-white dark:text-zinc-900 dark:hover:text-white text-[9px] font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> ADD TO BAG
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 4: LIVE EVENTS & TICKETS BOX OFFICE */}
        {/* ============================================================ */}
        <section className="mb-24 scroll-mt-28" id="section-events">
          <div className="flex justify-between items-center border-b-2 border-zinc-300 dark:border-zinc-800 pb-3 mb-8 text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-500">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-purple-600" />
              <span className="font-bold text-foreground text-sm">SECTION 04 • LIVE EVENTS & EXPEDITION TICKETS</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400">BOX OFFICE & PASSES</span>
          </div>

          <div className="flex flex-col gap-10">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white dark:bg-zinc-900/90 border border-zinc-300 dark:border-zinc-800 overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12 group hover:border-purple-600 transition-all"
              >
                {/* Event Image Banner (5 cols) */}
                <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto w-full overflow-hidden bg-black">
                  <img
                    src={evt.imageUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Live Ticket Count Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-[#121a24]/95 border border-purple-400/50 text-purple-300 text-[9px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 shadow-md backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      ONLY {evt.ticketsLeft} TICKETS LEFT
                    </span>
                  </div>

                  {/* Date & Location Pill at Bottom */}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1 text-white">
                    <span className="text-xs font-mono font-bold text-amber-300 tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {evt.date}
                    </span>
                    <span className="text-xs font-sans font-medium text-zinc-200 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" /> {evt.venueName}, {evt.city}
                    </span>
                  </div>
                </div>

                {/* Event Full Information Column (7 cols) */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    {/* Header info */}
                    <div className="flex flex-wrap items-center gap-3 text-[9.5px] font-mono text-zinc-500 mb-2">
                      <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold">
                        <Clock className="w-3 h-3" /> {evt.time}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        VENUE ADDRESS: {evt.address}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-2xl sm:text-3xl text-foreground leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans font-light mt-2 leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Key Attractions List (Requested Details) */}
                    <div className="mt-5 p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                      <div className="text-[9px] font-mono uppercase tracking-[0.2em] font-bold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" /> EVENT HIGHLIGHTS & ATTRACTIONS
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-zinc-700 dark:text-zinc-300">
                        {evt.attractions.map((att, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{att}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Speaker Roster */}
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-500">
                      <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                        KEYNOTE FELLOWS:
                      </span>
                      {evt.speakers.map((sp, idx) => (
                        <span key={idx} className="bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-[9px] text-foreground font-semibold">
                          {sp.name} ({sp.role})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Ticket Purchase Bar */}
                  <div className="pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">REGISTRATION FEE</div>
                      <div className="text-2xl font-serif font-bold text-foreground">
                        ${evt.price.toFixed(2)} <span className="text-xs font-sans text-zinc-500 font-normal">/ Attendee Pass</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => onAddToCart(evt, "event")}
                        className="flex-1 sm:flex-none px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>RESERVE TICKETS ({evt.ticketsLeft} LEFT)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Slide-Over Shopping Bag & Box Office Checkout Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col justify-between border-l border-zinc-250 dark:border-zinc-800 animate-slide-in">
            {/* Drawer Header */}
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span className="font-serif font-bold text-lg text-foreground">SHOPPING BAG & BOX OFFICE</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-5 flex-1 overflow-y-auto divide-y divide-zinc-200 dark:divide-zinc-800">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-zinc-500">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-serif text-lg font-medium text-foreground">Your bag is empty</p>
                  <p className="text-xs mt-1">Explore our books, ebooks, merch, and event tickets.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4 items-center">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-20 object-cover bg-zinc-950 border border-zinc-250 dark:border-zinc-800 shrink-0"
                    />
                    <div className="flex-1">
                      <div className="text-[8.5px] font-mono uppercase tracking-widest text-emerald-600 font-bold">
                        {item.type === "event" ? "EVENT PASS" : "ITEM"}
                      </div>
                      <h4 className="font-serif font-bold text-sm text-foreground line-clamp-1">{item.title}</h4>
                      <div className="text-xs font-mono text-zinc-500 mt-1">${item.price.toFixed(2)} each</div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                          <button
                            onClick={() => onUpdateCartQty(item.id, Math.max(1, item.quantity - 1))}
                            className="px-2 py-0.5 text-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-bold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateCartQty(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveFromCart(item.id)}
                          className="text-zinc-400 hover:text-red-500 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer & Checkout */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col gap-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">TOTAL AMOUNT</span>
                  <span className="font-serif font-bold text-2xl text-foreground">${totalCartPrice.toFixed(2)}</span>
                </div>

                <div className="text-[9px] font-mono text-zinc-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> SECURE 256-BIT ENCRYPTED CHECKOUT
                </div>

                {checkoutSuccess ? (
                  <div className="p-4 bg-emerald-900/80 border border-emerald-500 text-emerald-100 text-center font-mono text-xs font-bold">
                    ✓ ORDER COMPLETED! Confirmation & passes deployed to your email.
                  </div>
                ) : (
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-xl transition-all"
                  >
                    <CreditCard className="w-4 h-4" /> COMPLETE ORDER (${totalCartPrice.toFixed(2)})
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
