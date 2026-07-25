"use client";

import { Article, Category } from "@/types";
import { CheckCircle2, ArrowUpRight, Scale } from "lucide-react";

const CATEGORY_COLORS: Record<Category, string> = {
  tech:     "text-blue-600 dark:text-blue-400 bg-blue-500/8 border-blue-500/15",
  science:  "text-teal-700 dark:text-teal-400 bg-teal-500/8 border-teal-500/15",
  politics: "text-amber-700 dark:text-amber-400 bg-amber-500/8 border-amber-500/15",
  culture:  "text-indigo-700 dark:text-indigo-400 bg-indigo-500/8 border-indigo-500/15",
  finance:  "text-yellow-800 dark:text-yellow-400 bg-yellow-500/8 border-yellow-500/15",
};

interface CorrespondentsHubProps {
  articles: Article[];
  onSelectAuthor: (name: string, e?: React.MouseEvent) => void;
}

interface CorrespondentSummary {
  name: string;
  image: string;
  bio: string;
  articleCount: number;
  totalLikes: number;
  avgObjectivity: number;
  categories: Category[];
  latestDate: string;
  verified: boolean;
}

function buildCorrespondents(articles: Article[]): CorrespondentSummary[] {
  const map = new Map<string, Article[]>();
  for (const article of articles) {
    const existing = map.get(article.author) ?? [];
    map.set(article.author, [...existing, article]);
  }

  return Array.from(map.entries()).map(([name, arts]) => {
    const categories = [...new Set(arts.map((a) => a.category))] as Category[];
    const totalLikes = arts.reduce((s, a) => s + a.likes, 0);
    const avgObjectivity = Math.round(arts.reduce((s, a) => s + a.objectivityRating, 0) / arts.length);
    return {
      name,
      image: arts[0].authorImage,
      bio: arts[0].authorBio,
      articleCount: arts.length,
      totalLikes,
      avgObjectivity,
      categories,
      latestDate: arts[0].date,
      verified: arts.some((a) => a.factChecked),
    };
  });
}

export default function CorrespondentsHub({ articles, onSelectAuthor }: CorrespondentsHubProps) {
  const correspondents = buildCorrespondents(articles);

  return (
    <div className="min-h-screen pb-24">
      {/* Section header */}
      <div className="border-b border-border px-6 md:px-10 xl:px-16 py-10">
        <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-muted-foreground mb-2">
          Paen Natura
        </p>
        <h1
          className="text-4xl md:text-5xl font-serif font-semibold text-foreground"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Field Correspondents
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-light max-w-lg">
          The journalists, scientists, and analysts behind the reporting.
        </p>
      </div>

      {/* Grid */}
      <div className="px-6 md:px-10 xl:px-16 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {correspondents.map((c) => (
            <button
              key={c.name}
              onClick={(e) => onSelectAuthor(c.name, e)}
              className="group bg-background text-left p-7 flex flex-col gap-4 hover:bg-secondary/30 transition-colors"
            >
              {/* Top row: avatar + name */}
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-14 h-14 object-cover border border-border grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                  {c.verified && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h2
                      className="font-serif font-semibold text-lg text-foreground leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {c.name}
                    </h2>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                  </div>

                  {/* Beat tags */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {c.categories.map((cat) => (
                      <span
                        key={cat}
                        className={`px-1.5 py-px text-[8px] font-mono uppercase tracking-widest border font-semibold ${CATEGORY_COLORS[cat]}`}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio excerpt */}
              <p className="text-[12px] text-muted-foreground leading-relaxed font-light line-clamp-2">
                {c.bio}
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-5 text-[9px] font-mono text-muted-foreground border-t border-border pt-4">
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  {c.articleCount}
                  <span className="font-normal text-muted-foreground ml-0.5">
                    {c.articleCount === 1 ? "report" : "reports"}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Scale className="w-2.5 h-2.5" />
                  {c.avgObjectivity}% obj.
                </span>
                <span className="ml-auto text-muted-foreground/60">{c.latestDate}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
