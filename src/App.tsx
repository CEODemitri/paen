import { useState, useEffect, MouseEvent } from "react";
import "./App.css";
import EditorialHeader from "./components/EditorialHeader";
import EditorialHero from "./components/EditorialHero";
import CuratedBentoGrid from "./components/CuratedBentoGrid";
import CorrespondentsGrid from "./components/CorrespondentsGrid";
import AdminPortal from "./components/AdminPortal";
import AuthorPortal from "./components/AuthorPortal";
import AuthModal from "./components/AuthModal";
import ArticleCard from "./components/ArticleCard";
import ArticleDetail from "./components/ArticleDetail";
import VideoBroadcast from "./components/VideoBroadcast";
import ShopView from "./components/ShopView";
import MarketTicker from "./components/MarketTicker";
import BiosphereTelemetryWidget from "./components/BiosphereTelemetryWidget";
import PlanetaryMap from "./components/PlanetaryMap";
import Footer from "./components/ui/Footer";
import { Article, Video, Comment, ReadingTheme, TextSize, Category, User } from "./types";
import {
  loadArticles,
  saveArticles,
  loadVideos,
  loadComments,
  saveComments,
  loadBookmarks,
  saveBookmarks,
  getCurrentUser,
  setCurrentUser as persistCurrentUser,
  logoutUser as persistLogoutUser,
} from "./lib/db";
import { Search, Globe, Award, Newspaper, RotateCcw } from "lucide-react";

function App() {
  // DB State
  const [articles, setArticlesState] = useState<Article[]>([]);
  const [videos, setVideosState] = useState<Video[]>([]);
  const [comments, setCommentsState] = useState<Comment[]>([]);
  const [bookmarks, setBookmarksState] = useState<string[]>([]);
  const [currentUser, setCurrentUserState] = useState<User | null>(null);

  // Navigation / UI State
  const [currentCategory, setCategory] = useState<Category | "all" | "saved" | "videos">("all");
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthorMode, setIsAuthorMode] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Reader Settings
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>("standard");
  const [textSize, setTextSize] = useState<TextSize>("base");

  // All Articles Section Dedicated Filter & Search
  const [allArticlesSearch, setAllArticlesSearch] = useState("");
  const [allArticlesCategory, setAllArticlesCategory] = useState<Category | "all">("all");

  // Load Initial Data & set up reactive sync listeners
  useEffect(() => {
    const refreshAllData = () => {
      setArticlesState(loadArticles());
      setVideosState(loadVideos());
      setCommentsState(loadComments());
      setBookmarksState(loadBookmarks());
      setCurrentUserState(getCurrentUser());
    };

    refreshAllData();

    const handleSync = () => {
      refreshAllData();
    };

    const handleCustomNavigate = (e: Event) => {
      const customEvt = e as CustomEvent<string>;
      if (customEvt.detail === "shop") {
        setIsShopOpen(true);
        setActiveArticle(null);
        setIsAdminMode(false);
        setIsAuthorMode(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("paen_data_sync", handleSync);
    window.addEventListener("storage", handleSync);
    window.addEventListener("paen_navigate", handleCustomNavigate);

    return () => {
      window.removeEventListener("paen_data_sync", handleSync);
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("paen_navigate", handleCustomNavigate);
    };
  }, []);

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUserState(user);
    persistCurrentUser(user);
    if (user.role === "admin") {
      setIsAdminMode(true);
      setIsAuthorMode(false);
    } else if (user.role === "author" && user.status === "approved") {
      setIsAuthorMode(true);
      setIsAdminMode(false);
    }
  };

  const handleLogout = () => {
    persistLogoutUser();
    setCurrentUserState(null);
    setIsAdminMode(false);
    setIsAuthorMode(false);
  };

  const handleAuthorSaveArticle = (article: Article) => {
    const existingIndex = articles.findIndex((a) => a.id === article.id);
    let updated: Article[];
    if (existingIndex >= 0) {
      updated = articles.map((a) => (a.id === article.id ? article : a));
    } else {
      updated = [article, ...articles];
    }
    setArticlesState(updated);
    saveArticles(updated);
  };

  const handleAuthorDeleteArticle = (id: string) => {
    const updated = articles.filter((a) => a.id !== id);
    setArticlesState(updated);
    saveArticles(updated);
  };

  const handleBookmarkToggle = (id: string, e?: MouseEvent) => {
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
    saveBookmarks(updated);
  };

  const handleAddComment = (articleId: string, text: string) => {
    const authorName = currentUser ? currentUser.name : "Correspondent Reader";
    const newComment: Comment = {
      id: `com-${Date.now()}`,
      articleId,
      author: authorName,
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      text,
    };
    const updated = [newComment, ...comments];
    setCommentsState(updated);
    saveComments(updated);
  };

  // Published articles for the general broadsheet
  const liveArticles = articles.filter((art) => art.status === "published" || !art.status);

  // Filters calculation
  const filteredArticles = liveArticles.filter((art) => {
    // 1. Category check
    if (currentCategory === "saved") {
      if (!bookmarks.includes(art.id)) return false;
    } else if (currentCategory !== "all" && currentCategory !== "videos") {
      if (art.category !== currentCategory) return false;
    }

    // 2. Search check
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

  // Pick Lead Story and secondary splits
  const leadArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const sideArticles = filteredArticles.length > 1 ? filteredArticles.slice(1) : [];

  const handleSelectArticle = (art: Article) => {
    setActiveArticle(art);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // CSS theme settings
  const themeStyles: Record<ReadingTheme, string> = {
    standard: "bg-[#f4f3ec] text-[#121a15]",
    "editorial-sepia": "bg-[#f5ebd6] text-[#4a3f35]",
    "high-contrast": "bg-[#060d09] text-[#e3ded4]",
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-300 ${themeStyles[readingTheme]}`}
      id="root-app-container"
    >
      {/* Dedicated Standalone Admin Portal Page */}
      {isAdminMode ? (
        <main className="flex-grow">
          <AdminPortal
            onExit={() => {
              setIsAdminMode(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </main>
      ) : isShopOpen ? (
        /* Dedicated Standalone Shop Page */
        <main className="flex-grow">
          <ShopView
            onBack={() => {
              setIsShopOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </main>
      ) : (
        <>
          {/* Top Masthead & Pinned Hero (Only on Journal / Frontpage) */}
          <EditorialHeader
            currentCategory={currentCategory}
            setCategory={(cat) => {
              setCategory(cat);
              setActiveArticle(null);
              setIsAdminMode(false);
              setIsAuthorMode(false);
              setIsShopOpen(false);
            }}
            bookmarksCount={bookmarks.length}
            onAdminToggle={() => {
              setIsAdminMode(true);
              setIsAuthorMode(false);
              setActiveArticle(null);
              setIsShopOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            isAdminMode={isAdminMode}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenAuthorDesk={() => {
              setIsAuthorMode(!isAuthorMode);
              setIsAdminMode(false);
              setActiveArticle(null);
              setIsShopOpen(false);
            }}
            isAuthorMode={isAuthorMode}
            onNavigateToShop={() => {
              setIsShopOpen(true);
              setActiveArticle(null);
              setIsAdminMode(false);
              setIsAuthorMode(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            isShopMode={isShopOpen}
          />

          {isAuthorMode && currentUser && currentUser.role === "author" ? (
            /* Author Field Desk */
            <main className="flex-grow">
              <AuthorPortal
                currentUser={currentUser}
                articles={articles}
                onSaveArticle={handleAuthorSaveArticle}
                onDeleteArticle={handleAuthorDeleteArticle}
                onExit={() => setIsAuthorMode(false)}
              />
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
                onSetReadingTheme={setReadingTheme}
                onSetTextSize={setTextSize}
              />
            </main>
          ) : currentCategory === "videos" ? (
            /* Native Video Broadcast Hub */
            <main className="flex-grow py-8 bg-zinc-950 text-white">
              <VideoBroadcast videos={videos} />
            </main>
          ) : (
            /* Main Newspaper Frontpage layout */
            <main className="flex-grow w-full">
          {/* Top Lead Section in deep emerald canvas matching hero bottom */}
          <div className="w-full bg-[#0a1812] text-[#ede8de] border-b border-emerald-900/60 shadow-inner">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
              {/* Editorial Search & Filter Console */}
              <div className="border border-emerald-800/40 bg-[#0f241c]/90 backdrop-blur-md p-4 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-lg shadow-black/20">
                <div className="flex items-center gap-3 flex-1">
                  <Search className="w-4 h-4 text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="SEARCH ARTICLES: keywords, topics, author, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-[#f5ebd6] text-xs font-mono uppercase tracking-wider focus:outline-none placeholder-emerald-200/40"
                    id="frontpage-search-input"
                  />
                </div>

                <div className="flex items-center gap-3 shrink-0 text-[10px] font-mono text-emerald-200/60 justify-between sm:justify-end border-t sm:border-t-0 border-emerald-800/40 pt-2 sm:pt-0">
                  <span className="uppercase tracking-widest font-semibold">
                    INDEX: <strong className="text-[#f5ebd6]">{filteredArticles.length} ARTICLES</strong>
                  </span>
                  {(currentCategory !== "all" || searchQuery) && (
                    <button
                      onClick={() => {
                        setCategory("all");
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-1 text-amber-400 hover:text-amber-300 hover:underline uppercase tracking-wider font-bold"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  )}
                </div>
              </div>

              {filteredArticles.length === 0 ? (
                /* Empty State */
                <div className="text-center py-20 border border-dashed border-emerald-800/40 bg-[#0f241c]/40 my-6">
                  <Globe className="w-12 h-12 text-emerald-400/50 mx-auto mb-4 animate-spin-slow" />
                  <h3 className="font-serif font-semibold text-2xl text-[#f5ebd6]">No Articles Found</h3>
                  <p className="text-xs text-emerald-200/60 mt-2 max-w-md mx-auto font-sans font-light">
                    No articles matching your current search criteria were found. Please check your spelling or clear filters.
                  </p>
                  <button
                    onClick={() => {
                      setCategory("all");
                      setSearchQuery("");
                    }}
                    className="mt-6 px-4 py-2 bg-emerald-600 text-white text-xs font-mono uppercase tracking-widest hover:bg-emerald-500 transition-colors shadow-md"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                /* Section I: Lead Investigation & Dispatch Ledger */
                leadArticle && (
                  <EditorialHero
                    leadArticle={leadArticle}
                    sideArticles={sideArticles}
                    bookmarks={bookmarks}
                    onBookmarkToggle={handleBookmarkToggle}
                    onSelectArticle={handleSelectArticle}
                  />
                )
              )}
            </div>
          </div>

          {/* Rest of the page in its original background & aesthetic */}
          {filteredArticles.length > 0 && (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
              <div className="flex flex-col">
                {/* Section II: Curated Bento Grid (Deep Inquiries & Longreads) */}
                {sideArticles.length > 0 && (
                  <CuratedBentoGrid
                    articles={sideArticles}
                    bookmarks={bookmarks}
                    onBookmarkToggle={handleBookmarkToggle}
                    onSelectArticle={handleSelectArticle}
                  />
                )}

                {/* Section III: Principal Fellows & Field Researchers Directory */}
                <CorrespondentsGrid
                  onSearchAuthor={(name) => {
                    setSearchQuery(name);
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                />

                {/* Section IV: Biosphere Telemetry & Live Sensor Matrix */}
                <section className="w-full border-b-2 border-double border-zinc-300 dark:border-zinc-800 pb-14 mb-14" id="planetary-telemetry-section">
                  <div className="flex justify-between items-center border-b border-zinc-250 dark:border-zinc-850 pb-2.5 mb-8 text-[9.5px] font-mono tracking-[0.25em] uppercase text-zinc-500">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-teal-600 dark:bg-teal-400 rounded-none inline-block animate-pulse" />
                      <span className="font-bold text-foreground">SECTION IV • PLANETARY SENSORS & TELEMETRY</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 text-zinc-400">
                      <span>LIVE TELEMETRY</span>
                      <span>✦</span>
                      <span>ENVIRONMENT FEED</span>
                    </div>
                  </div>

                  {/* Geospatial Observation Grid */}
                  <PlanetaryMap
                    onSelectStationDispatch={(title) => {
                      const match = articles.find((a) => a.title.toLowerCase().includes(title.toLowerCase()) || title.toLowerCase().includes(a.title.toLowerCase()));
                      if (match) {
                        handleSelectArticle(match);
                      } else {
                        setSearchQuery(title.split(" ")[0]);
                        window.scrollTo({ top: 120, behavior: "smooth" });
                      }
                    }}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                    {/* Left Column: Planetary Telemetry Terminal (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                      <MarketTicker />
                    </div>

                    {/* Right Column: Sensor Matrix Overview & Quality Pledge (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                      <BiosphereTelemetryWidget />

                      {/* Editorial Integrity Capsule */}
                      <div className="border border-zinc-250 dark:border-zinc-800 p-5 bg-[#faf7f2] dark:bg-zinc-950/40 relative">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-600" />
                        <div className="flex items-center gap-2 text-[9.5px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold mb-2">
                          <Award className="w-4 h-4" /> Editorial Standards
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans font-light text-justify">
                          All articles, scientific data, and telemetry are independently fact-checked and verified by the head editor.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section V: All Published Articles with Dedicated Filter & Search */}
                <section className="w-full pb-6" id="wire-releases-section">
                  <div className="flex justify-between items-center border-b border-zinc-250 dark:border-zinc-850 pb-2.5 mb-6 text-[9.5px] font-mono tracking-[0.25em] uppercase text-zinc-500">
                    <div className="flex items-center gap-2">
                      <Newspaper className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-bold text-foreground">SECTION V • ALL PUBLISHED ARTICLES</span>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-400">CHRONOLOGICAL ARCHIVE</span>
                  </div>

                  {/* Dedicated Search & Category Filter Bar for All Articles */}
                  <div className="mb-8 p-4 bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(["all", "science", "tech", "politics", "culture", "finance"] as (Category | "all")[]).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setAllArticlesCategory(cat)}
                          className={`px-3 py-1 text-[9px] font-mono uppercase tracking-wider font-bold transition-all ${
                            allArticlesCategory === cat
                              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                              : "bg-white dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-250 dark:border-zinc-700/60"
                          }`}
                        >
                          {cat === "all" ? "All Categories" : cat}
                        </button>
                      ))}
                    </div>

                    {/* Search Field & Clear Button */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center flex-1 sm:w-64">
                        <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Filter these articles..."
                          value={allArticlesSearch}
                          onChange={(e) => setAllArticlesSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-zinc-950 text-xs font-sans text-foreground border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-400 placeholder-zinc-400"
                        />
                      </div>
                      {(allArticlesCategory !== "all" || allArticlesSearch) && (
                        <button
                          onClick={() => {
                            setAllArticlesCategory("all");
                            setAllArticlesSearch("");
                          }}
                          className="px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-bold shrink-0"
                          title="Reset section filter"
                        >
                          <RotateCcw className="w-3 h-3" /> Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Articles Grid or Filter Empty State */}
                  {(() => {
                    const sectionArticles = liveArticles.filter((art) => {
                      const matchesCat = allArticlesCategory === "all" || art.category === allArticlesCategory;
                      const matchesSearch =
                        !allArticlesSearch ||
                        art.title.toLowerCase().includes(allArticlesSearch.toLowerCase()) ||
                        art.subtitle.toLowerCase().includes(allArticlesSearch.toLowerCase()) ||
                        art.content.toLowerCase().includes(allArticlesSearch.toLowerCase()) ||
                        art.author.toLowerCase().includes(allArticlesSearch.toLowerCase());
                      return matchesCat && matchesSearch;
                    });

                    if (sectionArticles.length === 0) {
                      return (
                        <div className="text-center py-14 border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/30 my-4">
                          <p className="font-serif text-lg text-foreground font-semibold">No articles match your filter</p>
                          <p className="text-xs text-zinc-500 mt-1">Try selecting another category or clearing your search term.</p>
                          <button
                            onClick={() => {
                              setAllArticlesCategory("all");
                              setAllArticlesSearch("");
                            }}
                            className="mt-4 px-3.5 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-mono uppercase tracking-wider hover:opacity-90"
                          >
                            Show All Articles
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sectionArticles.map((art) => (
                          <ArticleCard
                            key={art.id}
                            article={art}
                            density="grid"
                            isBookmarked={bookmarks.includes(art.id)}
                            onBookmarkToggle={handleBookmarkToggle}
                            onSelect={() => handleSelectArticle(art)}
                          />
                        ))}
                      </div>
                    );
                  })()}
                </section>
              </div>
            </div>
          )}
        </main>
      )}
      </>
      )}

      {/* Footer Area */}
      <Footer />

      {/* Global Auth Modal for Reader, Author & Admin */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
