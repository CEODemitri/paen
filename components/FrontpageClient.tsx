"use client";

import { useState } from "react";
import EditorialHeader from "./EditorialHeader";
import AdminPortal from "./AdminPortal";
import AdminLogin from "./AdminLogin";
import ArticleCard from "./ArticleCard";
import ArticleDetail from "./ArticleDetail";
import VideoBroadcast from "./VideoBroadcast";
import MarketTicker from "./MarketTicker";
import Footer from "./ui/Footer";
import { Article, Video, Comment, ReadingTheme, TextSize, Category } from "@/types";
import { Search, Globe, Award, Newspaper } from "lucide-react";
import { likeArticle } from "@/lib/actions/articles";
import { addComment, getComments } from "@/lib/actions/comments";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Reader Settings
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>("standard");
  const [textSize, setTextSize] = useState<TextSize>("base");

  // Sync bookmarks to localStorage
  const handleBookmarkToggle = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    let updated;
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter((bId) => bId !== id);
    } else {
      updated = [...bookmarks, id];
    }
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
      // Optimistically update local state
      setArticlesState((prev) =>
        prev.map((art) => (art.id === id ? { ...art, likes: art.likes + 1 } : art))
      );
    } catch (error) {
      console.error("Failed to like article:", error);
    }
  };

  // Filters
  const filteredArticles = articles.filter((art) => {
    if (currentCategory === "saved") {
      if (!bookmarks.includes(art.id)) return false;
    } else if (currentCategory !== "all") {
      if (art.category !== currentCategory) return false;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = art.title.toLowerCase().includes(query);
      const matchSubtitle = art.subtitle.toLowerCase().includes(query);
      const matchContent = art.content.toLowerCase().includes(query);
      const matchAuthor = art.author.toLowerCase().includes(query);
      return matchTitle || matchSubtitle || matchContent || matchAuthor;
    }

    return true;
  });

  const leadArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const secondaryArticles = filteredArticles.length > 1 ? filteredArticles.slice(1) : [];

  const handleSelectArticle = (art: Article) => {
    setActiveArticle(art);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        onAdminLoginRequest={() => {
          setIsAdminLoginOpen(true);
        }}
      />

      {/* Admin Interface Panel */}
      {isAdminMode ? (
        <main className="flex-grow">
          <AdminPortal articles={articles} setArticles={setArticlesState} videos={videos} setVideos={setVideosState} />
        </main>
      ) : activeArticle ? (
        /* Full Article Detail View */
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
          />
        </main>
      ) : currentCategory === "videos" ? (
        /* Native Video Broadcast Hub */
        <main className="flex-grow py-8 bg-zinc-950 text-white">
          <VideoBroadcast videos={videos} />
        </main>
      ) : (
        /* Main Newspaper Frontpage layout */
        <main className="flex-grow w-full px-6 md:px-10 xl:px-16 py-12 md:py-16">
          {/* Frontpage Grid Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Primary Columns: Stories (8 of 12 columns) */}
            <div className="lg:col-span-8 flex flex-col gap-12">
              {/* Keyword Search Filter Bar */}
              <div className="flex w-full border-b border-zinc-300 dark:border-zinc-800 bg-transparent items-center py-2 transition-all duration-300 focus-within:border-amber-500">
                <span className="pr-3 text-zinc-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="QUERY REGISTRY: keywords, reporters, sources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-foreground text-xs font-mono uppercase tracking-wider focus:outline-none placeholder-zinc-400"
                  id="frontpage-search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="pl-3 text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-amber-600 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Filtering summary bar */}
              {(currentCategory !== "all" || searchQuery) && (
                <div className="flex justify-between items-center bg-[#faf7f2] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-none text-xs">
                  <div className="font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                    RESULTS METRIC: {filteredArticles.length} MATCHES IN{" "}
                    <strong className="text-amber-600 dark:text-amber-500 font-extrabold">
                      {currentCategory.toUpperCase()}
                    </strong>{" "}
                    {searchQuery && `FOR "${searchQuery.toUpperCase()}"`}
                  </div>
                  <button
                    onClick={() => {
                      setCategory("all");
                      setSearchQuery("");
                    }}
                    className="text-[9px] font-mono text-zinc-500 hover:text-amber-600 uppercase tracking-widest font-extrabold"
                  >
                    Reset Grid
                  </button>
                </div>
              )}

              {filteredArticles.length === 0 ? (
                /* Empty state */
                <div className="text-center py-24 border border-dashed border-zinc-300 dark:border-zinc-800 bg-[#faf7f2]/40 dark:bg-zinc-950/20">
                  <Globe className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-5 animate-spin-slow" />
                  <h3 className="font-serif font-medium text-xl text-foreground">No circular stories matched</h3>
                  <p className="text-xs text-zinc-500 mt-2.5 max-w-sm mx-auto leading-relaxed font-sans font-light">
                    Adjust your query parameters. If you are browsing bookmarked archives, ensure you have saved stories.
                  </p>
                </div>
              ) : (
                /* Dynamic News Layout */
                <div className="flex flex-col gap-12">
                  {/* LEAD STORY */}
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

                  {/* SECONDARY GRID */}
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

            {/* Sidebar Column */}
            <aside className="lg:col-span-4 flex flex-col gap-10 border-t border-zinc-200 dark:border-zinc-800 lg:border-t-0 lg:border-l lg:pl-10 pt-10 lg:pt-0">
              {/* Editorial Quality Stamp */}
              <div className="border border-zinc-250 dark:border-zinc-800 p-6 relative bg-[#faf7f2] dark:bg-zinc-950/30">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-600" />
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold mb-3">
                  <Award className="w-4 h-4" /> Editorial Integrity Pledge
                </div>
                <h4 className="font-serif font-semibold text-base text-foreground mb-2">Objectivity & Peer Review</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-justify font-sans font-light">
                  Every field log, botanical telemetry update, and climate model published under the Paen Natura banner is subjected to rigorous peer verification. Our environmental statistics are generated continuously on immutable records.
                </p>
                <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-400 mt-4 pt-3 border-t border-zinc-150 dark:border-zinc-900 font-semibold tracking-wider">
                  <span>OK-STATUS</span>
                  <span>•</span>
                  <span>SHA-256 SECURED</span>
                </div>
              </div>

              {/* Live Market Ticker */}
              <MarketTicker />

              {/* Quick brief listing */}
              <div>
                <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-5 border-b border-zinc-200 dark:border-zinc-800 pb-2 flex items-center justify-between font-bold">
                  <span>LATEST WIRE RELEASES</span>
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

              {/* Dynamic Micro Tickers */}
              <div className="border border-zinc-200 dark:border-zinc-800 p-5 font-mono text-[9px] text-zinc-500 flex flex-col gap-3 bg-[#faf7f2] dark:bg-zinc-950/20">
                <span className="uppercase tracking-[0.18em] text-zinc-400 font-bold border-b border-zinc-200 dark:border-zinc-800 pb-2 block">
                  PLANETARY BIOSPHERE TELEMETRY
                </span>
                <div className="flex justify-between items-center">
                  <span>CANOPY TRANSPIRATION RATE</span>
                  <span className="text-emerald-500 font-bold">4.2 L/m²/d</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>JURUÁ SOIL MOISTURE</span>
                  <span className="text-zinc-400 font-semibold">32.8% NOMINAL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>CONSERVATION PATROLS</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">14 ACTIVE TEAMS</span>
                </div>
              </div>
            </aside>
          </div>
        </main>
      )}

      {/* Footer Area */}
      <Footer />

      {/* Admin Login Cryptographic Gate */}
      <AdminLogin
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminMode(true);
          setActiveArticle(null);
        }}
      />
    </div>
  );
}
