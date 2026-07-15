"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, ArrowRight, Clock, Hash } from "lucide-react";
import { Article } from "@/types";
import { searchArticles } from "@/lib/actions/articles";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
  recentSearches?: string[];
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-amber-200 dark:bg-amber-700/50 text-inherit rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function SearchOverlay({
  isOpen,
  onClose,
  onSelectArticle,
  recentSearches = [],
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setActiveIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Debounced search
  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await searchArticles(q);
      setResults(res);
      setActiveIndex(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      onSelectArticle(results[activeIndex]);
      onClose();
    }
  };

  if (!isOpen) return null;

  const categoryColors: Record<string, string> = {
    tech: "text-blue-500",
    science: "text-emerald-500",
    politics: "text-red-500",
    culture: "text-purple-500",
    finance: "text-amber-500",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center pt-[12vh] px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl bg-[#faf9f5] dark:bg-[#0f150e] border border-zinc-200 dark:border-zinc-800 shadow-2xl">
        {/* Search Input Row */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search articles, reporters, topics..."
            className="flex-1 bg-transparent text-base font-sans text-foreground placeholder-zinc-400 focus:outline-none"
          />
          {loading && (
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 animate-pulse">
              Searching...
            </span>
          )}
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === "" && (
            <div className="px-5 py-6">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Recent Searches
              </p>
              {recentSearches.length === 0 ? (
                <p className="text-sm text-zinc-400 font-serif italic">
                  Start typing to search across all editorial content.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                    >
                      <Hash className="w-3 h-3" />
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {query.trim() !== "" && results.length === 0 && !loading && (
            <div className="px-5 py-10 text-center">
              <p className="font-serif text-zinc-400 italic text-sm">
                No articles found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                Try a different keyword or reporter name.
              </p>
            </div>
          )}

          {results.length > 0 && (
            <ul>
              {results.map((article, i) => (
                <li key={article.id}>
                  <button
                    className={`w-full text-left flex items-start gap-4 px-5 py-4 border-b border-zinc-100 dark:border-zinc-900 transition-colors ${
                      i === activeIndex
                        ? "bg-emerald-50 dark:bg-emerald-950/30"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
                    }`}
                    onClick={() => {
                      onSelectArticle(article);
                      onClose();
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 shrink-0 bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-mono uppercase tracking-widest font-bold ${categoryColors[article.category] ?? "text-zinc-400"}`}>
                          {article.category}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{article.date}</span>
                      </div>
                      <p className="text-sm font-serif font-semibold text-foreground leading-snug line-clamp-1">
                        {highlight(article.title, query)}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                        {highlight(article.subtitle, query)}
                      </p>
                    </div>

                    <ArrowRight className={`w-4 h-4 shrink-0 mt-1 transition-colors ${i === activeIndex ? "text-emerald-600" : "text-zinc-300 dark:text-zinc-700"}`} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-900 flex items-center gap-4 text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
          <span>↑↓ Navigate</span>
          <span>↵ Open</span>
          <span>Esc Close</span>
          {results.length > 0 && (
            <span className="ml-auto">{results.length} result{results.length !== 1 ? "s" : ""}</span>
          )}
        </div>
      </div>
    </div>
  );
}
