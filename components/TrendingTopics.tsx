"use client";

import { TrendingUp, Heart, ChevronRight } from "lucide-react";
import { Article, Category } from "@/types";

interface TrendingTopicsProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (category: Category) => void;
}

const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string }> = {
  tech:     { bg: "bg-blue-50 dark:bg-blue-950/30",    text: "text-blue-600 dark:text-blue-400",    border: "border-blue-200 dark:border-blue-800" },
  science:  { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  politics: { bg: "bg-red-50 dark:bg-red-950/30",      text: "text-red-600 dark:text-red-400",      border: "border-red-200 dark:border-red-800" },
  culture:  { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800" },
  finance:  { bg: "bg-amber-50 dark:bg-amber-950/30",  text: "text-amber-600 dark:text-amber-400",  border: "border-amber-200 dark:border-amber-800" },
};

export default function TrendingTopics({
  articles,
  onSelectArticle,
  onSelectCategory,
}: TrendingTopicsProps) {
  // Sort by likes descending for trending
  const trending = [...articles].sort((a, b) => b.likes - a.likes).slice(0, 5);

  // Count articles per category
  const categoryCounts = articles.reduce<Record<string, number>>((acc, art) => {
    acc[art.category] = (acc[art.category] ?? 0) + 1;
    return acc;
  }, {});

  const sortedCategories = (Object.entries(categoryCounts) as [Category, number][]).sort(
    (a, b) => b[1] - a[1]
  );

  // Max likes for bar width scaling
  const maxLikes = trending[0]?.likes ?? 1;

  return (
    <div className="flex flex-col gap-8">
      {/* Category chips */}
      <div>
        <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2 font-bold">
          Browse by Topic
        </h3>
        <div className="flex flex-wrap gap-2">
          {sortedCategories.map(([cat, count]) => {
            const colors = CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-mono uppercase tracking-wider font-semibold transition-all hover:scale-105 ${colors.bg} ${colors.text} ${colors.border}`}
              >
                {cat}
                <span className="opacity-60 text-[10px]">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trending list */}
      <div>
        <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2 flex items-center justify-between font-bold">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Most Read
          </span>
        </h3>

        <ol className="flex flex-col gap-4">
          {trending.map((article, idx) => {
            const colors = CATEGORY_COLORS[article.category];
            const barWidth = maxLikes > 0 ? Math.max(8, (article.likes / maxLikes) * 100) : 8;

            return (
              <li key={article.id}>
                <button
                  onClick={() => onSelectArticle(article)}
                  className="w-full text-left group flex items-start gap-3"
                >
                  {/* Rank number */}
                  <span className="text-2xl font-serif font-bold text-zinc-200 dark:text-zinc-800 leading-none mt-0.5 w-6 shrink-0 select-none">
                    {idx + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[9px] font-mono uppercase tracking-widest font-bold ${colors.text}`}>
                        {article.category}
                      </span>
                    </div>
                    <p className="text-sm font-serif font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {article.title}
                    </p>

                    {/* Likes bar */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-0.5 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 dark:bg-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <span className="flex items-center gap-0.5 text-[9px] font-mono text-zinc-400 shrink-0">
                        <Heart className="w-2.5 h-2.5" />
                        {article.likes}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700 group-hover:text-emerald-500 transition-colors mt-1 shrink-0" />
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
