"use client";

import { Article, Category } from "@/types";
import { ArrowLeft, CheckCircle2, Scale, Clock, Heart, BookOpen, TrendingUp } from "lucide-react";

const CATEGORY_COLORS: Record<Category, string> = {
  tech:     "text-blue-600 dark:text-blue-400 bg-blue-500/8 border-blue-500/15",
  science:  "text-teal-700 dark:text-teal-400 bg-teal-500/8 border-teal-500/15",
  politics: "text-amber-700 dark:text-amber-400 bg-amber-500/8 border-amber-500/15",
  culture:  "text-indigo-700 dark:text-indigo-400 bg-indigo-500/8 border-indigo-500/15",
  finance:  "text-yellow-800 dark:text-yellow-400 bg-yellow-500/8 border-yellow-500/15",
};

interface UserProfileProps {
  authorName: string;
  articles: Article[];
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
}

export default function UserProfile({
  authorName,
  articles,
  onBack,
  onSelectArticle,
}: UserProfileProps) {
  const authorArticles = articles.filter((a) => a.author === authorName);
  const authorData = authorArticles[0];

  if (!authorData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
            Correspondent not found
          </p>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest hover:text-emerald-600 transition-colors mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return
          </button>
        </div>
      </div>
    );
  }

  const totalLikes = authorArticles.reduce((sum, a) => sum + a.likes, 0);
  const avgObjectivity = Math.round(
    authorArticles.reduce((sum, a) => sum + a.objectivityRating, 0) / authorArticles.length
  );
  const verifiedCount = authorArticles.filter((a) => a.factChecked).length;

  // Collect unique categories
  const categories = [...new Set(authorArticles.map((a) => a.category))] as Category[];

  return (
    <div className="min-h-screen pb-24">
      {/* Back bar */}
      <div className="border-b border-border px-6 md:px-10 xl:px-16 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All Correspondents
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-10 pt-14 pb-8">
        {/* Identity block */}
        <div className="flex items-start gap-7 pb-10 border-b border-border">
          <div className="relative shrink-0">
            <img
              src={authorData.authorImage}
              alt={authorName}
              className="w-20 h-20 object-cover border border-border grayscale"
            />
            {verifiedCount > 0 && (
              <span className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-muted-foreground mb-1.5">
              Field Correspondent
            </p>
            <h1
              className="text-3xl md:text-4xl font-serif font-semibold text-foreground leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
            >
              {authorName}
            </h1>

            {/* Beat tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest border font-semibold ${CATEGORY_COLORS[cat]}`}
                >
                  {cat}
                </span>
              ))}
            </div>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed font-light max-w-xl">
              {authorData.authorBio}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 border-b border-border">
          {[
            { label: "Reports", value: authorArticles.length, icon: <BookOpen className="w-3.5 h-3.5" /> },
            { label: "Total Likes", value: totalLikes.toLocaleString(), icon: <Heart className="w-3.5 h-3.5" /> },
            { label: "Avg Objectivity", value: `${avgObjectivity}%`, icon: <Scale className="w-3.5 h-3.5" /> },
            { label: "Verified", value: `${verifiedCount}/${authorArticles.length}`, icon: <TrendingUp className="w-3.5 h-3.5" /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="py-6 px-4 border-r border-border last:border-r-0 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                {icon}
                {label}
              </div>
              <span className="text-2xl font-serif font-semibold text-foreground">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Articles list */}
        <div className="mt-10">
          <h2 className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-6 flex items-center justify-between">
            <span>Filed Reports</span>
            <span className="text-foreground font-bold">{authorArticles.length}</span>
          </h2>

          <div className="flex flex-col divide-y divide-border">
            {authorArticles.map((article) => (
              <button
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="group flex items-start gap-5 py-5 text-left hover:bg-secondary/30 -mx-4 px-4 transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-20 h-16 shrink-0 overflow-hidden border border-border">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`px-1.5 py-px text-[8px] font-mono uppercase tracking-widest border font-bold ${CATEGORY_COLORS[article.category as Category]}`}>
                      {article.category}
                    </span>
                    {article.factChecked && (
                      <span className="flex items-center gap-1 text-[8px] font-mono text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                      </span>
                    )}
                  </div>

                  <h3
                    className="font-serif font-medium text-base text-foreground leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {article.title}
                  </h3>

                  <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 font-light">
                    {article.subtitle}
                  </p>
                </div>

                {/* Meta */}
                <div className="shrink-0 flex flex-col items-end gap-1.5 text-[9px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {article.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-2.5 h-2.5" />
                    {article.likes.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Scale className="w-2.5 h-2.5" />
                    {article.objectivityRating}%
                  </span>
                  <span className="text-muted-foreground/60 mt-1">{article.date}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
