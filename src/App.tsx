import { useState, useEffect, MouseEvent } from "react";
import "./App.css";
import EditorialHeader from "./components/EditorialHeader";
import EditorialHero from "./components/EditorialHero";
import CuratedBentoGrid from "./components/CuratedBentoGrid";
import CorrespondentsGrid from "./components/CorrespondentsGrid";
import ArchivalIndex from "./components/ArchivalIndex";
import AdminPortal from "./components/AdminPortal";
import AuthorPortal from "./components/AuthorPortal";
import AuthModal from "./components/AuthModal";
import ArticleCard from "./components/ArticleCard";
import ArticleDetail from "./components/ArticleDetail";
import VideoBroadcast from "./components/VideoBroadcast";
import MarketTicker from "./components/MarketTicker";
import BiosphereTelemetryWidget from "./components/BiosphereTelemetryWidget";
import PlanetaryMap from "./components/PlanetaryMap";
import Footer from "./components/ui/Footer";
import { Article, Video, Comment, ReadingTheme, TextSize, Category, User } from "./types";
import {
  loadArticles,
  saveArticles,
  loadVideos,
  saveVideos,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthorMode, setIsAuthorMode] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Reader Settings
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>("standard");
  const [textSize, setTextSize] = useState<TextSize>("base");

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

    window.addEventListener("paen_data_sync", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener("paen_data_sync", handleSync);
      window.removeEventListener("storage", handleSync);
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

  // Sync state helpers
  const handleSetArticles = (newArticles: Article[]) => {
    setArticlesState(newArticles);
    saveArticles(newArticles);
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

  const handleSetVideos = (newVideos: Video[]) => {
    setVideosState(newVideos);
    saveVideos(newVideos);
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
      {/* Top Masthead */}
      <EditorialHeader
        currentCategory={currentCategory}
        setCategory={(cat) => {
          setCategory(cat);
          setActiveArticle(null);
          setIsAdminMode(false);
          setIsAuthorMode(false);
        }}
        bookmarksCount={bookmarks.length}
        readingTheme={readingTheme}
        setReadingTheme={setReadingTheme}
        textSize={textSize}
        setTextSize={setTextSize}
        onAdminToggle={() => {
          setIsAdminMode(!isAdminMode);
          setIsAuthorMode(false);
          setActiveArticle(null);
        }}
        isAdminMode={isAdminMode}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuthorDesk={() => {
          setIsAuthorMode(!isAuthorMode);
          setIsAdminMode(false);
          setActiveArticle(null);
        }}
        isAuthorMode={isAuthorMode}
      />

      {/* Admin Interface Panel */}
      {isAdminMode ? (
        <main className="flex-grow">
          <AdminPortal
            articles={articles}
            setArticles={handleSetArticles}
            videos={videos}
            setVideos={handleSetVideos}
            onExit={() => setIsAdminMode(false)}
          />
        </main>
      ) : isAuthorMode && currentUser && currentUser.role === "author" ? (
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
                    placeholder="SEARCH DOSSIERS: keywords, fellows, topics, coordinates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-[#f5ebd6] text-xs font-mono uppercase tracking-wider focus:outline-none placeholder-emerald-200/40"
                    id="frontpage-search-input"
                  />
                </div>

                <div className="flex items-center gap-3 shrink-0 text-[10px] font-mono text-emerald-200/60 justify-between sm:justify-end border-t sm:border-t-0 border-emerald-800/40 pt-2 sm:pt-0">
                  <span className="uppercase tracking-widest font-semibold">
                    INDEX: <strong className="text-[#f5ebd6]">{filteredArticles.length} DOSSIERS</strong>
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
                  <h3 className="font-serif font-semibold text-2xl text-[#f5ebd6]">No Research Dossiers Matched</h3>
                  <p className="text-xs text-emerald-200/60 mt-2 max-w-md mx-auto font-sans font-light">
                    No articles matching your current filter criteria were found. Please check spelling or reset filters.
                  </p>
                  <button
                    onClick={() => {
                      setCategory("all");
                      setSearchQuery("");
                    }}
                    className="mt-6 px-4 py-2 bg-emerald-600 text-white text-xs font-mono uppercase tracking-widest hover:bg-emerald-500 transition-colors shadow-md"
                  >
                    Reset Dossier Grid
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

                {/* Section IV: Research Taxonomy & Topic Index */}
                <ArchivalIndex
                  onSelectCategory={(cat) => {
                    setCategory(cat);
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                  onSearchQuery={(query) => {
                    setSearchQuery(query);
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                />

                {/* Section V: Biosphere Telemetry & Live Sensor Matrix */}
                <section className="w-full border-b-2 border-double border-zinc-300 dark:border-zinc-800 pb-14 mb-14" id="planetary-telemetry-section">
                  <div className="flex justify-between items-center border-b border-zinc-250 dark:border-zinc-850 pb-2.5 mb-8 text-[9.5px] font-mono tracking-[0.25em] uppercase text-zinc-500">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-teal-600 dark:bg-teal-400 rounded-none inline-block animate-pulse" />
                      <span className="font-bold text-foreground">SECTION V • EMPIRICAL BIOSPHERE SENSORY MATRIX</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 text-zinc-400">
                      <span>STATION TELEMETRY</span>
                      <span>✦</span>
                      <span>SYNCHRONIZED FEED</span>
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
                          <Award className="w-4 h-4" /> Peer-Verification Accord
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans font-light text-justify">
                          All botanical data streams, chemical vapor deposition specifications, and polar acoustic metrics are verified in accordance with the International Planetary Press Charter.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section VI: Wire Feed Index */}
                <section className="w-full pb-6" id="wire-releases-section">
                  <div className="flex justify-between items-center border-b border-zinc-250 dark:border-zinc-850 pb-2.5 mb-8 text-[9.5px] font-mono tracking-[0.25em] uppercase text-zinc-500">
                    <div className="flex items-center gap-2">
                      <Newspaper className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-bold text-foreground">SECTION VI • COMPLETE WIRE ARCHIVES</span>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-400">CHRONOLOGICAL DISPATCHES</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {liveArticles.map((art) => (
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
                </section>
              </div>
            </div>
          )}
        </main>
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
