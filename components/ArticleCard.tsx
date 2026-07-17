"use client";

import { Article, Category } from "@/types";
import { BookMarked, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  density: "lead" | "grid" | "compact";
  isBookmarked: boolean;
  onBookmarkToggle: (id: string, e: React.MouseEvent) => void;
  onSelect: () => void;
  onLike?: () => void;
}

const CATEGORY_COLOR_SCHEMES: Record<Category, string> = {
  tech: "text-emerald-800 dark:text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
  science: "text-teal-800 dark:text-teal-400 bg-teal-500/5 border-teal-500/10",
  politics: "text-amber-800 dark:text-amber-400 bg-amber-500/5 border-amber-500/10",
  culture: "text-indigo-800 dark:text-indigo-400 bg-indigo-500/5 border-indigo-500/10",
  finance: "text-yellow-900 dark:text-yellow-500 bg-yellow-500/5 border-yellow-500/10",
};

export default function ArticleCard({
  article,
  density,
  isBookmarked,
  onBookmarkToggle,
  onSelect,
  onLike,
}: ArticleCardProps) {
  const scheme = CATEGORY_COLOR_SCHEMES[article.category];

  if (density === "lead") {
    return (
      <article
        id={`lead-story-${article.id}`}
        onClick={onSelect}
        className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-zinc-200 dark:border-zinc-800/80 pb-12 transition-all duration-300"
      >
        {/* Massive Cover Photo - Elevated Artsy Look with Offset Elegant Frame */}
        <div className="lg:col-span-7 relative p-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800/60 aspect-[16/10] lg:aspect-auto lg:h-[480px]">
          <div className="w-full h-full overflow-hidden relative bg-black">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-102 opacity-85 group-hover:opacity-95"
            />
            {/* Elegant Inner Classic Line Accent */}
            <div className="absolute inset-3 border border-white/20 pointer-events-none transition-all duration-300 group-hover:inset-4" />
          </div>
          
          <div className="absolute top-6 left-6 flex gap-2">
            <span className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest font-bold border backdrop-blur-md rounded-none ${scheme}`}>
              {article.category}
            </span>
            {article.factChecked && (
              <span className="px-2 py-1 text-[9px] font-mono uppercase tracking-wider font-bold bg-zinc-900/90 text-emerald-400 border border-emerald-500/25 rounded-none flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Peer-Verified
              </span>
            )}
          </div>
        </div>

        {/* Big Editorial Headline */}
        <div className="lg:col-span-5 flex flex-col justify-between py-2 pl-2">
          <div>
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-none block" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">{article.date}</span>
              </div>
              <button
                id={`btn-bookmark-lead-${article.id}`}
                onClick={(e) => onBookmarkToggle(article.id, e)}
                className="p-1.5 rounded-full hover:bg-emerald-500/10 transition-colors text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-450"
                title={isBookmarked ? "Remove Bookmark" : "Save Story"}
              >
                <BookMarked className={`w-4 h-4 ${isBookmarked ? "fill-emerald-600 text-emerald-600" : ""}`} />
              </button>
            </div>

            <h2
              className="text-3xl md:text-4xl lg:text-[2.65rem] font-serif font-semibold text-foreground leading-[1.15] tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors decoration-emerald-500/40 decoration-1 hover:underline underline-offset-4"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
            >
              {article.title}
            </h2>

            <p className="text-zinc-600 dark:text-zinc-300 mt-5 text-[15px] leading-relaxed text-justify font-sans font-light">
              {article.subtitle}
            </p>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 mt-6 flex justify-between items-end">
            <div className="text-xs font-serif italic text-zinc-600 dark:text-zinc-400">By {article.author}</div>
            <div className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-none text-[9px] tracking-wider uppercase font-semibold text-zinc-500 dark:text-zinc-400">
              {article.readTime}
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (density === "compact") {
    return (
      <article
        id={`compact-story-${article.id}`}
        onClick={onSelect}
        className="group cursor-pointer flex items-start gap-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800/60 hover:bg-emerald-500/5 px-2 transition-all duration-200"
      >
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 shrink-0 overflow-hidden border border-zinc-200 dark:border-zinc-700">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-350" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[8px] font-mono uppercase tracking-[0.15em] text-zinc-400 mb-1.5">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">{article.category}</span>
            <span>✦</span>
            <span>{article.readTime}</span>
          </div>
          <h4 className="font-serif font-medium text-sm text-foreground leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
            {article.title}
          </h4>
        </div>
        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:translate-y-0 transition-all duration-250 shrink-0" />
      </article>
    );
  }

  // Grid Story - Elegant, Artsy, Less Rigid Border-bottom Style Card
  return (
    <article
      id={`grid-story-${article.id}`}
      onClick={onSelect}
      className="group cursor-pointer bg-transparent border-b-2 border-double border-zinc-200 dark:border-zinc-800/80 hover:border-emerald-500/50 pb-6 transition-all duration-300 flex flex-col justify-between h-full"
    >
      <div>
        {/* Artsy Photo frame */}
        <div className="aspect-[16/10] overflow-hidden relative mb-4 p-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80">
          <div className="w-full h-full overflow-hidden bg-black relative">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
          <span className={`absolute top-4 left-4 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest font-bold border backdrop-blur-md ${scheme}`}>
            {article.category}
          </span>
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 bg-emerald-600 rounded-full" />
            <span>{article.date}</span>
          </div>
          <button
            id={`btn-bookmark-grid-${article.id}`}
            onClick={(e) => onBookmarkToggle(article.id, e)}
            className="p-1 rounded-full hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-600 transition-colors"
            title={isBookmarked ? "Remove Bookmark" : "Save Story"}
          >
            <BookMarked className={`w-3.5 h-3.5 ${isBookmarked ? "fill-emerald-600 text-emerald-600" : ""}`} />
          </button>
        </div>

        <h3
          className="text-xl md:text-2xl font-serif font-medium text-foreground leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-3"
          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
        >
          {article.title}
        </h3>

        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-3 line-clamp-3 leading-relaxed text-justify font-sans font-light">
          {article.subtitle}
        </p>
      </div>

      <div className="border-t border-zinc-150 dark:border-zinc-800/50 pt-4 mt-5 flex justify-between items-center">
        <div className="text-xs font-serif italic text-zinc-600 dark:text-zinc-400">By {article.author}</div>
        <div className="text-[9px] font-mono bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 px-2 py-0.5 text-zinc-500 dark:text-zinc-400">
          {article.readTime}
        </div>
      </div>
    </article>
  );
}
