"use client";

import { useState, useEffect, useCallback } from "react";
import EditorialHeader from "./EditorialHeader";
import AdminPortal from "./AdminPortal";
import AdminLogin from "./AdminLogin";
import ArticleCard from "./ArticleCard";
import ArticleDetail from "./ArticleDetail";
import VideoBroadcast from "./VideoBroadcast";
import MarketTicker from "./MarketTicker";
import Footer from "./ui/Footer";
import SearchOverlay from "./SearchOverlay";
import TrendingTopics from "./TrendingTopics";
import { Article, Video, Comment, ReadingTheme, TextSize, Category } from "@/types";
import { Search, Globe, Award, Newspaper } from "lucide-react";
import { likeArticle } from "@/lib/actions/articles";
import { addComment } from "@/lib/actions/comments";

const CATEGORIES: Category[] = ["tech", "science", "politics", "culture", "finance"];

const CATEGORY_COLORS: Record<Category, { active: string; inactive: string }> = {
  tech:     { active: "bg-blue-600 text-white border-blue-600",       inactive: "border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30" },
  science:  { active: "bg-emerald-600 text-white border-emerald-600", inactive: "border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30" },
  politics: { active: "bg-red-600 text-white border-red-600",         inactive: "border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30" },
  culture:  { active: "bg-purple-600 text-white border-purple-600",   inactive: "border-purple-200 dark:border-purple-900 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30" },
  finance:  { active: "bg-amber-600 text-white border-amber-600",     inactive: "border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30" },
};

interface FrontpageClientProps {
  initialArticles: Article[];
  initialVideos: Video[];
  initialComments: Comment[];
}

export default function FrontpageClient({
  initialArticles,
  initialVideos,
  initialComments,
}: FrontpageClientProps) {
  // DB State
  const [articles, setArticlesState] = useState<Article[]>(initialArticles);
  const [videos, setVideosState] = useState<Video[]>(initialVideos);
  const [comments, setCommentsState] = useState<Comment[]>(initialComments);
  const [bookmarks, setBookmarksState] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation / UI State
  const [currentCategory, setCategory] = useState<Category | "all" | "saved" | "videos">("all");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Search State
  const [searchOpen, setSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<Category | null>(null);

  // Reader Settings
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>("standard");
  const [textSize, setTextSize] = useState<TextSize>("base");

  // "/" key opens search overlay
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Sync bookmarks to localStorage
  const handleBookmarkToggle = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = bookmarks.includes(id)
      ? bookmarks.filter((bId) => bId !== id)
      : [...bookmarks, id];
    setBookmarksState(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  // Add comment via server action
  const handleAddComment = async (articleId: string, text: string) => {
    try {
      const newComment = await addComment(articleId, "Correspondent Reader", text);
      setCommentsState((prev) => [newComment, ...prev]);
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  // Like article via server action
  const handleLikeArticle = async (id: string) => {
    try {
      await likeArticle(id);
      setArticlesState((prev) =>
        prev.map((art) => (art.id === id ? { ...art, likes: art.likes + 1 } : art))
      );
    } catch (error) {
      console.error("Failed to like article:", error);
    }
  };

  // Open article + save recent search if query was used
  const handleSelectArticle = useCallback((art: Article, query?: string) => {
    setActiveArticle(art);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (query?.trim()) {
      setRecentSearches((prev) => {
        const updated = [query, ...prev.filter((q) => q !== query)].slice(0, 6);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  // Category filter from TrendingTopics widget
  const handleCategoryFromWidget = (cat: Category) => {
    setActiveCategoryFilter(cat);
    setCategory(cat);
    setActiveArticle(null);
  };

  // Filters — category pill overrides main nav category if set
  const filteredArticles = articles.filter((art) => {
    const catFilter = activeCategoryFilter ?? (currentCategory !== "all" && currentCategory !== "saved" && currentCategory !== "videos" ? currentCategory : null);

    if (currentCategory === "saved") {
      if (!bookmarks.includes(art.id)) return false;
    } else if (catFilter) {
      if (art.category !== catFilter) return false;
    }
    return true;
  });

  const leadArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const secondaryArticles = filteredArticles.length > 1 ? filteredArticles.slice(1) : [];

  const themeStyles: Record<ReadingTheme, string> = {
    standard: "bg-[#fcfcfc] text-zinc-900",
    "editorial-sepia": "bg-[#fdf6e3] text-[#586e75]",
    "high-contrast": "bg-[#131313] text-zinc-100",
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${themeStyles[readingTheme]}`}
      id="root-app-container"
    >
      {/* Top Masthead */}
      <EditorialHeader
        currentCategory={currentCategory}
        setCategory={(cat) => {
          setCategory(cat);
          setActiveCategoryFilter(null);
          setActiveArticle(null);
        }}
        bookmarksCount={bookmarks.length}
        readingTheme={readingTheme}
        setReadingTheme={setReadingTheme}
        textSize={textSize}
        setTextSize={setTextSize}
        onAdminToggle={() => {
          setIsAdminMode(!isAdminMode);
          setActiveArticle(null);
        }}
        isAdminMode={isAdminMode}
        onAdminLoginRequest={() => setIsAdminLoginOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
      />

      {/* Admin Interface Panel */}
      {isAdminMode ? (
        <main className="flex-grow">
          <AdminPortal articles={articles} setArticles={setArticlesState} videos={videos} setVideos={setVideosState} />
        </main>
      ) : activeArticle ? (
        <main className="flex-grow">
          <ArticleDetail
            article={activeArticle}
            comments={comments.filter((c) => c.articleId === activeArticle.id)}
            onAddComment={(text) => handleAddComment(activeArticle.id, text)}
            isBookmarked={bookmarks.includes(activeArticle.id)}
            onBookmarkToggle={() => handleBookmarkToggle(activeArticle.id)}
            onBack={() => setActiveArticle(null)}
            readingTheme={readingTheme}
            textSize={textSize}
            onLike={() => handleLikeArticle(activeArticle.id)}
            relatedArticles={articles.filter((a) => a.category === activeArticle.category && a.id !== activeArticle.id)}
            onArticleSelect={(article) => setActiveArticle(article)}
          />
        </main>
      ) : currentCategory === "videos" ? (
        <main className="flex-grow py-8 bg-zinc-950 text-white">
          <VideoBroadcast videos={videos} />
        </main>
      ) : (
        <main className="flex-grow w-full px-6 md:px-10 xl:px-16 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Primary Columns (8/12) */}
            <div className="lg:col-span-8 flex flex-col gap-10">

              {/* Search bar + category pills row */}
              <div className="flex flex-col gap-4">
                {/* Search trigger bar */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-full flex items-center gap-3 border-b border-zinc-300 dark:border-zinc-800 py-2 text-left hover:border-emerald-500 transition-colors group"
                >
                  <Search className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Search articles, reporters, topics...
                  </span>
                  <span className="ml-auto text-[9px] font-mono text-zinc-300 dark:text-zinc-700 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5">
                    /
                  </span>
                </button>

                {/* Category filter pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => { setActiveCategoryFilter(null); setCategory("all"); }}
                    className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest font-bold border transition-colors ${
                      !activeCategoryFilter && currentCategory === "all"
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                        : "border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:border-zinc-500 dark:hover:border-zinc-400"
                    }`}
                  >
                    All
                  </button>
                  {CATEGORIES.map((cat) => {
                    const isActive = activeCategoryFilter === cat || (currentCategory === cat && !activeCategoryFilter);
                    const colors = CATEGORY_COLORS[cat];
                    const count = articles.filter((a) => a.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => handleCategoryFromWidget(cat)}
                        className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono uppercase tracking-widest font-bold border transition-all ${
                          isActive ? colors.active : colors.inactive
                        }`}
                      >
                        {cat}
                        <span className="opacity-70">{count}</span>
                      </button>
                    );
                  })}
                  {(activeCategoryFilter || (currentCategory !== "all" && currentCategory !== "saved" && currentCategory !== "videos")) && (
                    <button
                      onClick={() => { setActiveCategoryFilter(null); setCategory("all"); }}
                      className="text-[9px] font-mono text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline underline-offset-2 ml-1"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Results context bar */}
              {(activeCategoryFilter || currentCategory !== "all") && currentCategory !== "videos" && (
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-xs">
                  <span className="font-mono uppercase tracking-widest text-zinc-500">
                    {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} in{" "}
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      {(activeCategoryFilter ?? currentCategory).toString().toUpperCase()}
                    </strong>
                  </span>
                  <button
                    onClick={() => { setActiveCategoryFilter(null); setCategory("all"); }}
                    className="text-[9px] font-mono text-zinc-400 hover:text-emerald-600 uppercase tracking-widest font-bold transition-colors"
                  >
                    Reset
                  </button>
                </div>
              )}

              {/* Article grid */}
              {filteredArticles.length === 0 ? (
                <div className="text-center py-24 border border-dashed border-zinc-300 dark:border-zinc-800">
                  <Globe className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-5" />
                  <h3 className="font-serif font-medium text-xl text-foreground">No stories matched</h3>
                  <p className="text-xs text-zinc-500 mt-2.5 max-w-sm mx-auto leading-relaxed">
                    Try a different category or use search to explore all content.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-12">
                  {leadArticle && (
                    <ArticleCard
                      article={leadArticle}
                      density="lead"
                      isBookmarked={bookmarks.includes(leadArticle.id)}
                      onBookmarkToggle={handleBookmarkToggle}
                      onSelect={() => handleSelectArticle(leadArticle)}
                      onLike={() => handleLikeArticle(leadArticle.id)}
                    />
                  )}
                  {secondaryArticles.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                      {secondaryArticles.map((art) => (
                        <ArticleCard
                          key={art.id}
                          article={art}
                          density="grid"
                          isBookmarked={bookmarks.includes(art.id)}
                          onBookmarkToggle={handleBookmarkToggle}
                          onSelect={() => handleSelectArticle(art)}
                          onLike={() => handleLikeArticle(art.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar (4/12) */}
            <aside className="lg:col-span-4 flex flex-col gap-10 border-t border-zinc-200 dark:border-zinc-800 lg:border-t-0 lg:border-l lg:pl-10 pt-10 lg:pt-0">

              {/* Editorial Quality Stamp */}
              <div className="border border-zinc-250 dark:border-zinc-800 p-6 relative bg-[#faf7f2] dark:bg-zinc-950/30">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-600" />
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold mb-3">
                  <Award className="w-4 h-4" /> Editorial Integrity Pledge
                </div>
                <h4 className="font-serif font-semibold text-base text-foreground mb-2">Objectivity & Peer Review</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
                  Every field log, botanical telemetry update, and climate model published under the Paen Natura banner is subjected to rigorous peer verification. Our environmental statistics are generated continuously on immutable records.
                </p>
                <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-400 mt-4 pt-3 border-t border-zinc-150 dark:border-zinc-900 font-semibold tracking-wider">
                  <span>OK-STATUS</span>
                  <span>•</span>
                  <span>SHA-256 SECURED</span>
                </div>
              </div>

              {/* Trending Topics widget */}
              <TrendingTopics
                articles={articles}
                onSelectArticle={(art) => handleSelectArticle(art)}
                onSelectCategory={handleCategoryFromWidget}
              />

              {/* Live Market Ticker */}
              <MarketTicker />

              {/* Latest Wire Releases */}
              <div>
                <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-5 border-b border-zinc-200 dark:border-zinc-800 pb-2 flex items-center justify-between font-bold">
                  <span>Latest Wire Releases</span>
                  <Newspaper className="w-3.5 h-3.5 text-emerald-600" />
                </h3>
                <div className="flex flex-col">
                  {articles.slice(0, 5).map((art) => (
                    <ArticleCard
                      key={art.id}
                      article={art}
                      density="compact"
                      isBookmarked={bookmarks.includes(art.id)}
                      onBookmarkToggle={handleBookmarkToggle}
                      onSelect={() => handleSelectArticle(art)}
                      onLike={() => handleLikeArticle(art.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Planetary Biosphere Telemetry */}
              <div className="border border-zinc-200 dark:border-zinc-800 p-5 font-mono text-[9px] text-zinc-500 flex flex-col gap-3 bg-[#faf7f2] dark:bg-zinc-950/20">
                <span className="uppercase tracking-[0.18em] text-zinc-400 font-bold border-b border-zinc-200 dark:border-zinc-800 pb-2 block">
                  Planetary Biosphere Telemetry
                </span>
                <div className="flex justify-between items-center">
                  <span>Canopy Transpiration Rate</span>
                  <span className="text-emerald-500 font-bold">4.2 L/m²/d</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Juruá Soil Moisture</span>
                  <span className="text-zinc-400 font-semibold">32.8% Nominal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Conservation Patrols</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">14 Active Teams</span>
                </div>
              </div>
            </aside>
          </div>
        </main>
      )}

      <Footer />

      {/* Admin Login Gate */}
      <AdminLogin
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminMode(true);
          setActiveArticle(null);
        }}
      />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectArticle={(art) => {
          handleSelectArticle(art);
          setSearchOpen(false);
        }}
        recentSearches={recentSearches}
      />
    </div>
  );
}
