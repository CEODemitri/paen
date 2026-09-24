import { MouseEvent } from "react";
import { Article } from "../types";
import { BookMarked, ArrowUpRight, Scale, CheckCircle2, Headphones, Radio, Sparkles } from "lucide-react";

interface EditorialHeroProps {
  leadArticle: Article;
  sideArticles: Article[];
  bookmarks: string[];
  onBookmarkToggle: (id: string, e: MouseEvent) => void;
  onSelectArticle: (article: Article) => void;
}

export default function EditorialHero({
  leadArticle,
  sideArticles,
  bookmarks,
  onBookmarkToggle,
  onSelectArticle,
}: EditorialHeroProps) {
  const isLeadBookmarked = bookmarks.includes(leadArticle.id);

  return (
    <section className="w-full border-b-2 border-double border-zinc-300 dark:border-zinc-800 pb-12 mb-14" id="editorial-lead-section">
      {/* Top Section Header Kicker */}
      <div className="flex justify-between items-center border-b border-zinc-250 dark:border-zinc-850 pb-2.5 mb-8 text-[9.5px] font-mono tracking-[0.25em] uppercase text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-none inline-block animate-pulse" />
          <span className="font-bold text-foreground">SECTION I • LEAD INVESTIGATION & WIRE DISPATCHES</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-zinc-400">
          <span>PEER-REVIEWED EDITION</span>
          <span>✦</span>
          <span>SPECIAL FIELD DOSSIER</span>
        </div>
      </div>

      {/* Asymmetric 12-Column Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Main Lead Story (8 cols) */}
        <div className="lg:col-span-8 flex flex-col group cursor-pointer" onClick={() => onSelectArticle(leadArticle)}>
          {/* Visual Canvas Frame */}
          <div className="relative aspect-[16/9] md:aspect-[21/10] w-full overflow-hidden bg-black border border-zinc-200 dark:border-zinc-800 p-1">
            <div className="w-full h-full relative overflow-hidden">
              <img
                src={leadArticle.imageUrl}
                alt={leadArticle.title}
                className="w-full h-full object-cover opacity-90 group-hover:scale-103 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Floating Meta Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 items-center">
                <span className="px-3 py-1 text-[9px] font-mono uppercase tracking-[0.2em] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                  {leadArticle.category}
                </span>
                {leadArticle.factChecked && (
                  <span className="px-2.5 py-1 text-[8.5px] font-mono uppercase tracking-widest font-bold bg-zinc-950/85 text-zinc-200 border border-zinc-700/60 backdrop-blur-md flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    CERTIFIED ACCORD
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <span className="px-2.5 py-1 text-[9px] font-mono tracking-wider bg-black/80 text-zinc-300 border border-white/10 backdrop-blur-md flex items-center gap-1.5">
                  <Headphones className="w-3 h-3 text-amber-400" />
                  AUDIO BRIEF ATTACHED
                </span>
              </div>
            </div>
          </div>

          {/* Lead Headline & Typography */}
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 border-b border-zinc-250 dark:border-zinc-850/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-widest">
                  SPECIAL INVESTIGATIVE REPORT
                </span>
                <span>•</span>
                <span>{leadArticle.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  id={`btn-bookmark-lead-${leadArticle.id}`}
                  onClick={(e) => onBookmarkToggle(leadArticle.id, e)}
                  className="flex items-center gap-1 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  title={isLeadBookmarked ? "Remove from dossier" : "Save report"}
                >
                  <BookMarked className={`w-3.5 h-3.5 ${isLeadBookmarked ? "fill-emerald-600 text-emerald-600" : ""}`} />
                  <span className="text-[9px] uppercase tracking-wider">{isLeadBookmarked ? "Saved" : "Save"}</span>
                </button>
              </div>
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-serif font-bold text-foreground leading-[1.12] tracking-tight group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
            >
              {leadArticle.title}
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans font-light text-justify">
              {leadArticle.subtitle}
            </p>

            {/* Author Capsule & Quality Indicators */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-2 border-t border-zinc-200 dark:border-zinc-800/80">
              <div className="flex items-center gap-3">
                {leadArticle.authorImage && (
                  <img
                    src={leadArticle.authorImage}
                    alt={leadArticle.author}
                    className="w-10 h-10 rounded-none object-cover border border-zinc-300 dark:border-zinc-700"
                  />
                )}
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">DISPATCH BY</div>
                  <div className="font-serif font-bold text-sm text-foreground">{leadArticle.author}</div>
                </div>
              </div>

              <div className="flex items-center gap-5 text-[10px] font-mono text-zinc-500">
                <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 border border-zinc-200 dark:border-zinc-800">
                  <Scale className="w-3.5 h-3.5 text-emerald-600" />
                  <span>OBJECTIVITY: <strong className="text-foreground font-bold">{leadArticle.objectivityRating}%</strong></span>
                </div>
                <div className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 uppercase tracking-wider font-semibold">
                  {leadArticle.readTime}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Wire Dispatches Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:border-l lg:border-zinc-250 dark:lg:border-zinc-800/80 lg:pl-8">
          <div className="flex items-center justify-between border-b border-zinc-250 dark:border-zinc-850 pb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-foreground flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              THE DISPATCH LEDGER
            </span>
            <span className="text-[9px] font-mono text-zinc-400">EXPEDITIONS</span>
          </div>

          <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-850">
            {sideArticles.slice(0, 3).map((art, idx) => {
              const isBookmarked = bookmarks.includes(art.id);
              return (
                <article
                  key={art.id}
                  onClick={() => onSelectArticle(art)}
                  className="group cursor-pointer py-4.5 first:pt-0 last:pb-0 flex flex-col gap-2 transition-all"
                  id={`side-dispatch-${art.id}`}
                >
                  <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400">
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                      DISPATCH 0{idx + 1} • {art.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{art.readTime}</span>
                      <button
                        onClick={(e) => onBookmarkToggle(art.id, e)}
                        className="text-zinc-400 hover:text-emerald-600 transition-colors"
                        title={isBookmarked ? "Saved" : "Save"}
                      >
                        <BookMarked className={`w-3 h-3 ${isBookmarked ? "fill-emerald-600 text-emerald-600" : ""}`} />
                      </button>
                    </div>
                  </div>

                  <h3
                    className="text-lg font-serif font-bold text-foreground leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
                  >
                    {art.title}
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 font-sans font-light leading-relaxed">
                    {art.subtitle}
                  </p>

                  <div className="flex items-center justify-between text-[8.5px] font-mono text-zinc-400 pt-1">
                    <span className="italic font-serif text-zinc-600 dark:text-zinc-300 font-medium">By {art.author}</span>
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                      Read dossier <ArrowUpRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Special Editorial Quotation Card */}
          <div className="bg-[#faf7f2] dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 p-4.5 mt-2 relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-emerald-600" />
            <div className="text-[8.5px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1 mb-2">
              <Sparkles className="w-3 h-3 text-amber-500" /> EDITOR’S OBSERVATION
            </div>
            <p className="font-serif italic text-sm text-foreground leading-snug">
              “When an ecosystem degrades, its sonic partition collapses long before the trees fall. Acoustics is the planetary stethoscope.”
            </p>
            <div className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 mt-2 font-semibold">
              — Paen Botanical Board, Field Directive IV
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
