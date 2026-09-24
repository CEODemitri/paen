import { MouseEvent } from "react";
import { Article } from "../types";
import { BookMarked, ArrowUpRight, Scale, CheckCircle2, Headphones, Sparkles } from "lucide-react";

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
    <section className="w-full pb-2" id="editorial-lead-section">
      {/* Top Section Header Kicker */}
      <div className="flex justify-between items-center border-b border-emerald-800/40 pb-2.5 mb-8 text-[9.5px] font-mono tracking-[0.25em] uppercase text-emerald-300/70">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-none inline-block animate-pulse" />
          <span className="font-bold text-[#f5ebd6]">FEATURED INVESTIGATION & LATEST STORIES</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-emerald-200/50">
          <span>HEAD EDITORIAL</span>
          <span>✦</span>
          <span>ORIGINAL ESSAY</span>
        </div>
      </div>

      {/* Asymmetric 12-Column Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Main Lead Story (8 cols) */}
        <div className="lg:col-span-8 flex flex-col group cursor-pointer" onClick={() => onSelectArticle(leadArticle)}>
          {/* Visual Canvas Frame */}
          <div className="relative aspect-[16/9] md:aspect-[21/10] w-full overflow-hidden bg-black border border-emerald-800/50 p-1 shadow-lg shadow-black/30">
            <div className="w-full h-full relative overflow-hidden">
              <img
                src={leadArticle.imageUrl}
                alt={leadArticle.title}
                className="w-full h-full object-cover opacity-90 group-hover:scale-103 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1812]/90 via-[#0a1812]/25 to-transparent" />
              
              {/* Floating Meta Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 items-center">
                <span className="px-3 py-1 text-[9px] font-mono uppercase tracking-[0.2em] font-bold bg-[#0a1812]/95 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                  {leadArticle.category}
                </span>
                {leadArticle.factChecked && (
                  <span className="px-2.5 py-1 text-[8.5px] font-mono uppercase tracking-widest font-bold bg-[#0a1812]/90 text-emerald-100 border border-emerald-700/60 backdrop-blur-md flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    FACT CHECKED
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <span className="px-2.5 py-1 text-[9px] font-mono tracking-wider bg-black/80 text-emerald-100 border border-emerald-500/20 backdrop-blur-md flex items-center gap-1.5">
                  <Headphones className="w-3 h-3 text-amber-400" />
                  AUDIO ESSAY INCLUDED
                </span>
              </div>
            </div>
          </div>

          {/* Lead Headline & Typography */}
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex justify-between items-center text-[10px] font-mono text-emerald-200/60 border-b border-emerald-800/40 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold uppercase tracking-widest">
                  FEATURE STORY
                </span>
                <span>•</span>
                <span>{leadArticle.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  id={`btn-bookmark-lead-${leadArticle.id}`}
                  onClick={(e) => onBookmarkToggle(leadArticle.id, e)}
                  className="flex items-center gap-1 text-emerald-300/70 hover:text-emerald-300 transition-colors"
                  title={isLeadBookmarked ? "Remove from bookmarks" : "Save article"}
                >
                  <BookMarked className={`w-3.5 h-3.5 ${isLeadBookmarked ? "fill-emerald-400 text-emerald-400" : ""}`} />
                  <span className="text-[9px] uppercase tracking-wider">{isLeadBookmarked ? "Saved" : "Save"}</span>
                </button>
              </div>
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-serif font-bold text-[#f5ebd6] leading-[1.12] tracking-tight group-hover:text-emerald-300 transition-colors"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
            >
              {leadArticle.title}
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/75 leading-relaxed font-sans font-light text-justify">
              {leadArticle.subtitle}
            </p>

            {/* Author Capsule & Quality Indicators */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-2 border-t border-emerald-800/40">
              <div className="flex items-center gap-3">
                {leadArticle.authorImage && (
                  <img
                    src={leadArticle.authorImage}
                    alt={leadArticle.author}
                    className="w-10 h-10 rounded-none object-cover border border-emerald-700/50"
                  />
                )}
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-emerald-300/60">WRITTEN BY</div>
                  <div className="font-serif font-bold text-sm text-[#f5ebd6]">{leadArticle.author}</div>
                </div>
              </div>

              <div className="flex items-center gap-5 text-[10px] font-mono text-emerald-200/60">
                <div className="flex items-center gap-1.5 bg-[#0f241c] px-2.5 py-1 border border-emerald-800/40">
                  <Scale className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ACCURACY: <strong className="text-[#f5ebd6] font-bold">{leadArticle.objectivityRating}%</strong></span>
                </div>
                <div className="px-2.5 py-1 bg-[#0f241c] border border-emerald-800/40 uppercase tracking-wider font-semibold text-emerald-200">
                  {leadArticle.readTime}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Latest Stories Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:border-l lg:border-emerald-800/40 lg:pl-8">
          {/* Header Strip */}
          <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2.5">
            <span className="text-[10px] font-mono uppercase tracking-[0.22em] font-bold text-[#f5ebd6] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              LATEST STORIES
            </span>
            <span className="text-[8.5px] font-mono text-emerald-300/60 tracking-widest uppercase">RECENT ESSAYS</span>
          </div>

          <div className="flex flex-col divide-y divide-emerald-800/30">
            {sideArticles.slice(0, 3).map((art, idx) => {
              const isBookmarked = bookmarks.includes(art.id);
              const romanNumerals = ["I", "II", "III", "IV"];
              return (
                <article
                  key={art.id}
                  onClick={() => onSelectArticle(art)}
                  className="group cursor-pointer py-4.5 first:pt-0 last:pb-0 flex flex-col gap-2 transition-all"
                  id={`side-dispatch-${art.id}`}
                >
                  <div className="flex justify-between items-center text-[9px] font-mono text-emerald-300/60">
                    <span className="text-amber-400 font-bold uppercase tracking-widest">
                      STORY {romanNumerals[idx] || idx + 1} • {art.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{art.readTime}</span>
                      <button
                        onClick={(e) => onBookmarkToggle(art.id, e)}
                        className="text-emerald-300/60 hover:text-emerald-300 transition-colors"
                        title={isBookmarked ? "Saved" : "Save"}
                      >
                        <BookMarked className={`w-3 h-3 ${isBookmarked ? "fill-emerald-400 text-emerald-400" : ""}`} />
                      </button>
                    </div>
                  </div>

                  <h3
                    className="text-lg font-serif font-bold text-[#f5ebd6] leading-snug group-hover:text-emerald-300 transition-colors line-clamp-2"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
                  >
                    {art.title}
                  </h3>

                  <p className="text-xs text-emerald-100/70 line-clamp-2 font-sans font-light leading-relaxed">
                    {art.subtitle}
                  </p>

                  <div className="flex items-center justify-between text-[8.5px] font-mono text-emerald-300/60 pt-1">
                    <span className="italic font-serif text-emerald-200/90 font-medium">By {art.author}</span>
                    <span className="flex items-center gap-1 text-emerald-400 group-hover:translate-x-0.5 transition-transform font-mono uppercase text-[8px] tracking-wider">
                      Read full article <ArrowUpRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Special Editorial Quotation Card */}
          <div className="bg-[#0f241c]/90 border border-emerald-800/50 py-7 sm:py-8 px-6 sm:px-7 mt-3 relative shadow-md flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400" />
            <div className="text-[8.5px] sm:text-[9px] font-mono text-emerald-300/70 uppercase tracking-widest flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> EDITOR’S NOTE
            </div>
            <p className="font-serif italic text-sm sm:text-[15px] text-[#f5ebd6] leading-relaxed my-1">
              “Organic vitality, inherent individual sovereignty, and the present moment are the true bedrock of existence. Everything else is consensual abstraction.”
            </p>
            <div className="text-[9px] sm:text-[9.5px] font-mono text-emerald-400 mt-3.5 pt-2.5 border-t border-emerald-800/40 font-semibold tracking-wide">
              — ceoDemitri, Head Editor
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
