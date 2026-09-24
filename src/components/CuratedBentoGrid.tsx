import { MouseEvent } from "react";
import { Article } from "../types";
import { BookMarked, ArrowUpRight } from "lucide-react";

interface CuratedBentoGridProps {
  articles: Article[];
  bookmarks: string[];
  onBookmarkToggle: (id: string, e: MouseEvent) => void;
  onSelectArticle: (article: Article) => void;
}

export default function CuratedBentoGrid({
  articles,
  bookmarks,
  onBookmarkToggle,
  onSelectArticle,
}: CuratedBentoGridProps) {
  if (articles.length === 0) return null;

  // Let's create a curated variety of cards
  const panoramic = articles[0];
  const essay1 = articles[1];
  const essay2 = articles[2];
  const column1 = articles[3];

  return (
    <section className="w-full border-b-2 border-double border-zinc-300 dark:border-zinc-800 pb-14 mb-14" id="curated-inquiries-section">
      {/* Section Header */}
      <div className="flex justify-between items-center border-b border-zinc-250 dark:border-zinc-850 pb-2.5 mb-8 text-[9.5px] font-mono tracking-[0.25em] uppercase text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-600 dark:bg-amber-500 rounded-none inline-block" />
          <span className="font-bold text-foreground">SECTION II • DEEP FIELD INQUIRIES & LONGREADS</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-zinc-400">
          <span>PEER-INDEXED</span>
          <span>✦</span>
          <span>EMPIRICAL ESSAYS</span>
        </div>
      </div>

      {/* Dynamic Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Panoramic Featured Card (7 cols) */}
        {panoramic && (
          <div
            className="lg:col-span-7 group cursor-pointer border border-zinc-200 dark:border-zinc-800 bg-[#faf7f2] dark:bg-zinc-950/40 p-1 flex flex-col justify-between"
            onClick={() => onSelectArticle(panoramic)}
            id={`bento-panoramic-${panoramic.id}`}
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
              <img
                src={panoramic.imageUrl}
                alt={panoramic.title}
                className="w-full h-full object-cover opacity-85 group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-2.5 py-1 text-[8.5px] font-mono uppercase tracking-widest font-bold bg-amber-950/90 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                  {panoramic.category} • PANORAMIC DOSSIER
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-[9px] font-mono uppercase tracking-widest text-amber-400 mb-1">
                  FIELD INVESTIGATION
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight line-clamp-2">
                  {panoramic.title}
                </h3>
              </div>
            </div>

            <div className="p-5 flex flex-col justify-between flex-grow">
              <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed font-sans font-light text-justify">
                {panoramic.subtitle}
              </p>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-5 flex justify-between items-center text-[9px] font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="italic font-serif text-zinc-600 dark:text-zinc-300 text-xs font-semibold">By {panoramic.author}</span>
                  <span>•</span>
                  <span>{panoramic.readTime}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookmarkToggle(panoramic.id, e);
                    }}
                    className="text-zinc-400 hover:text-amber-600 transition-colors"
                  >
                    <BookMarked className={`w-3.5 h-3.5 ${bookmarks.includes(panoramic.id) ? "fill-amber-600 text-amber-600" : ""}`} />
                  </button>
                  <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">
                    Examine <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2 Column Stacked Essays (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {essay1 && (
            <div
              className="group cursor-pointer border border-zinc-200 dark:border-zinc-800 p-5 bg-[#faf7f2]/50 dark:bg-zinc-950/30 flex flex-col justify-between transition-all hover:border-emerald-600/40"
              onClick={() => onSelectArticle(essay1)}
              id={`bento-essay-${essay1.id}`}
            >
              <div>
                <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400 mb-2">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                    {essay1.category} • ESSAY
                  </span>
                  <span>{essay1.readTime}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-foreground leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {essay1.title}
                </h3>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2.5 line-clamp-3 font-sans font-light leading-relaxed">
                  {essay1.subtitle}
                </p>
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-800/80 pt-3 mt-4 flex justify-between items-center text-[9px] font-mono text-zinc-400">
                <span className="italic font-serif text-xs text-zinc-700 dark:text-zinc-300">By {essay1.author}</span>
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                  Read Essay <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          )}

          {essay2 && (
            <div
              className="group cursor-pointer border border-zinc-200 dark:border-zinc-800 p-5 bg-[#faf7f2]/50 dark:bg-zinc-950/30 flex flex-col justify-between transition-all hover:border-emerald-600/40"
              onClick={() => onSelectArticle(essay2)}
              id={`bento-essay-${essay2.id}`}
            >
              <div>
                <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400 mb-2">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                    {essay2.category} • CRITIQUE
                  </span>
                  <span>{essay2.readTime}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-foreground leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {essay2.title}
                </h3>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2.5 line-clamp-3 font-sans font-light leading-relaxed">
                  {essay2.subtitle}
                </p>
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-800/80 pt-3 mt-4 flex justify-between items-center text-[9px] font-mono text-zinc-400">
                <span className="italic font-serif text-xs text-zinc-700 dark:text-zinc-300">By {essay2.author}</span>
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                  Read Critique <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Supplementary Horizontal Wire Strip */}
      {column1 && (
        <div
          onClick={() => onSelectArticle(column1)}
          className="mt-8 border border-zinc-250 dark:border-zinc-800 bg-[#faf7f2] dark:bg-zinc-950/60 p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group cursor-pointer hover:border-emerald-600/50 transition-all"
          id={`bento-strip-${column1.id}`}
        >
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 text-[8.5px] font-mono uppercase tracking-widest font-bold bg-zinc-900 text-zinc-100 border border-zinc-700 shrink-0">
              DISPATCH
            </span>
            <div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {column1.title}
              </h4>
              <span className="text-[10px] font-mono text-zinc-400">By {column1.author} • {column1.readTime}</span>
            </div>
          </div>

          <button className="text-[9px] font-mono uppercase tracking-widest font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 shrink-0 group-hover:translate-x-1 transition-transform">
            Open File <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </section>
  );
}
