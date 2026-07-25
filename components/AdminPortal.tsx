"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Article, Video, Comment, Category } from "@/types";
import {
  Trash2, Edit, FileText, Video as VideoIcon, CheckCircle, KeyRound, Lock,
  MessageSquare, Search, X, BarChart3, Heart, Eye, Clock, TrendingUp,
  ChevronDown, Filter, Plus, RefreshCw, Shield, AlertTriangle, Star,
} from "lucide-react";
import { getComments } from "@/lib/actions/comments";

interface AdminPortalProps {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  videos: Video[];
  setVideos: (videos: Video[]) => void;
}

type Tab = "overview" | "articles" | "videos" | "comments";

const CATEGORY_COLORS: Record<Category, string> = {
  tech: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  science: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  politics: "bg-rose-500/10 text-rose-500 border-rose-500/30",
  culture: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  finance: "bg-amber-500/10 text-amber-600 border-amber-500/30",
};

export default function AdminPortal({
  articles,
  setArticles,
  videos,
  setVideos,
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [successMsg, setSuccessMsg] = useState("");

  // --- Passcode ---
  const [showPasscodeChange, setShowPasscodeChange] = useState(false);
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  // --- Article form ---
  const [artId, setArtId] = useState("");
  const [artTitle, setArtTitle] = useState("");
  const [artSubtitle, setArtSubtitle] = useState("");
  const [artContent, setArtContent] = useState("");
  const [artCategory, setArtCategory] = useState<Category>("tech");
  const [artAuthor, setArtAuthor] = useState("");
  const [artImageUrl, setArtImageUrl] = useState("");
  const [artReadTime, setArtReadTime] = useState("");
  const [artSources, setArtSources] = useState("");
  const [artFactChecked, setArtFactChecked] = useState(true);
  const [artObjectivity, setArtObjectivity] = useState(95);
  const [showArticleForm, setShowArticleForm] = useState(false);

  // --- Article list filters ---
  const [artSearch, setArtSearch] = useState("");
  const [artCatFilter, setArtCatFilter] = useState<Category | "all">("all");

  // --- Video form ---
  const [vidId, setVidId] = useState("");
  const [vidTitle, setVidTitle] = useState("");
  const [vidDesc, setVidDesc] = useState("");
  const [vidCategory, setVidCategory] = useState<Category>("science");
  const [vidUrl, setVidUrl] = useState("");
  const [vidThumb, setVidThumb] = useState("");
  const [vidDuration, setVidDuration] = useState("");
  const [vidAuthor, setVidAuthor] = useState("");
  const [showVideoForm, setShowVideoForm] = useState(false);

  // --- Comments ---
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentSearch, setCommentSearch] = useState("");

  // --- Load comments when tab opens ---
  useEffect(() => {
    if (activeTab === "comments" && !commentsLoaded) {
      // Load comments for all articles
      const loadComments = async () => {
        const fetched: Comment[] = [];
        for (const art of articles) {
          try {
            const cs = await getComments(art.id);
            fetched.push(...cs);
          } catch {
            // skip
          }
        }
        setAllComments(fetched);
        setCommentsLoaded(true);
      };
      loadComments();
    }
  }, [activeTab, articles, commentsLoaded]);

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // --- Stats ---
  const totalLikes = useMemo(() => articles.reduce((s, a) => s + a.likes, 0), [articles]);
  const avgObjectivity = useMemo(
    () => articles.length ? Math.round(articles.reduce((s, a) => s + a.objectivityRating, 0) / articles.length) : 0,
    [articles]
  );
  const factCheckedCount = useMemo(() => articles.filter((a) => a.factChecked).length, [articles]);
  const catBreakdown = useMemo(() => {
    const cats: Record<string, number> = {};
    for (const a of articles) cats[a.category] = (cats[a.category] || 0) + 1;
    return Object.entries(cats).sort((a, b) => b[1] - a[1]);
  }, [articles]);

  // --- Passcode ---
  const handleRotatePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError("");
    if (newPasscode.length < 4) { setPasscodeError("Passcode must be at least 4 characters."); return; }
    if (newPasscode === "paen123") { setPasscodeError("Cannot reuse the default temporary passcode."); return; }
    if (newPasscode !== confirmPasscode) { setPasscodeError("Passcodes do not match."); return; }
    localStorage.setItem("paen_admin_password", newPasscode);
    localStorage.setItem("paen_has_changed_password", "true");
    triggerSuccess("PORTAL PASSCODE ROTATED SUCCESSFULLY");
    setShowPasscodeChange(false);
    setNewPasscode(""); setConfirmPasscode("");
  };

  // --- Article CRUD ---
  const resetArtForm = () => {
    setArtId(""); setArtTitle(""); setArtSubtitle(""); setArtContent("");
    setArtAuthor(""); setArtImageUrl(""); setArtReadTime("");
    setArtSources(""); setArtFactChecked(true); setArtObjectivity(95);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle || !artContent || !artAuthor) { alert("Please fill in Title, Content, and Author."); return; }
    const sourceList = artSources ? artSources.split(",").map((s) => s.trim()) : ["Editorial Research Desk"];
    const defaultImages: Record<Category, string> = {
      tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
      science: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=1000&auto=format&fit=crop",
      politics: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1000&auto=format&fit=crop",
      culture: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop",
      finance: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1000&auto=format&fit=crop",
    };
    const finalImage = artImageUrl || defaultImages[artCategory];
    if (artId) {
      const updated = articles.map((art) =>
        art.id === artId ? { ...art, title: artTitle, subtitle: artSubtitle, content: artContent, category: artCategory, author: artAuthor, imageUrl: finalImage, readTime: artReadTime || "5 min read", sources: sourceList, factChecked: artFactChecked, objectivityRating: artObjectivity } : art
      );
      setArticles(updated);
      triggerSuccess(`Article updated: "${artTitle.substring(0, 30)}..."`);
    } else {
      const newArt: Article = {
        id: `art-${Date.now()}`, title: artTitle, subtitle: artSubtitle, content: artContent,
        category: artCategory, author: artAuthor,
        authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
        authorBio: `${artAuthor} is an editorial contributor writing on ${artCategory} systems.`,
        imageUrl: finalImage, date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        readTime: artReadTime || "5 min read", sources: sourceList, factChecked: artFactChecked,
        objectivityRating: artObjectivity, likes: 0,
      };
      setArticles([newArt, ...articles]);
      triggerSuccess(`Article published: "${artTitle.substring(0, 30)}..."`);
    }
    resetArtForm();
    setShowArticleForm(false);
  };

  const handleEditArticleClick = (art: Article) => {
    setArtId(art.id); setArtTitle(art.title); setArtSubtitle(art.subtitle);
    setArtContent(art.content); setArtCategory(art.category); setArtAuthor(art.author);
    setArtImageUrl(art.imageUrl); setArtReadTime(art.readTime);
    setArtSources(art.sources.join(", ")); setArtFactChecked(art.factChecked);
    setArtObjectivity(art.objectivityRating);
    setShowArticleForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm("Retract this article from circulation?")) {
      setArticles(articles.filter((a) => a.id !== id));
      triggerSuccess("Article retracted.");
    }
  };

  // --- Video CRUD ---
  const resetVidForm = () => {
    setVidId(""); setVidTitle(""); setVidDesc(""); setVidUrl("");
    setVidThumb(""); setVidDuration(""); setVidAuthor("");
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidTitle || !vidUrl) { alert("Please fill in Video Title and Stream URL."); return; }
    const defaultThumbs: Record<Category, string> = {
      tech: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
      science: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
      politics: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=600&auto=format&fit=crop",
      culture: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600&auto=format&fit=crop",
      finance: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop",
    };
    const finalThumb = vidThumb || defaultThumbs[vidCategory];
    if (vidId) {
      const updated = videos.map((vid) =>
        vid.id === vidId ? { ...vid, title: vidTitle, description: vidDesc, category: vidCategory, videoUrl: vidUrl, thumbnailUrl: finalThumb, duration: vidDuration || "1:00", author: vidAuthor || "Staff Reporter" } : vid
      );
      setVideos(updated);
      triggerSuccess(`Video updated: "${vidTitle.substring(0, 30)}..."`);
    } else {
      const newVid: Video = {
        id: `vid-${Date.now()}`, title: vidTitle, description: vidDesc, category: vidCategory,
        videoUrl: vidUrl, thumbnailUrl: finalThumb, duration: vidDuration || "1:00",
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        author: vidAuthor || "Staff Reporter",
      };
      setVideos([...videos, newVid]);
      triggerSuccess(`Video broadcast published: "${vidTitle.substring(0, 30)}..."`);
    }
    resetVidForm();
    setShowVideoForm(false);
  };

  const handleEditVideoClick = (vid: Video) => {
    setVidId(vid.id); setVidTitle(vid.title); setVidDesc(vid.description);
    setVidCategory(vid.category); setVidUrl(vid.videoUrl); setVidThumb(vid.thumbnailUrl);
    setVidDuration(vid.duration); setVidAuthor(vid.author);
    setShowVideoForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm("Archive this video broadcast?")) {
      setVideos(videos.filter((v) => v.id !== id));
      triggerSuccess("Video archived.");
    }
  };

  // --- Filtered articles ---
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchesCat = artCatFilter === "all" || a.category === artCatFilter;
      const q = artSearch.toLowerCase();
      const matchesSearch = !q || a.title.toLowerCase().includes(q) || a.author.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [articles, artSearch, artCatFilter]);

  // --- Filtered comments ---
  const filteredComments = useMemo(() => {
    const q = commentSearch.toLowerCase();
    return allComments.filter((c) => {
      const art = articles.find((a) => a.id === c.articleId);
      return !q || c.text.toLowerCase().includes(q) || c.author.toLowerCase().includes(q) || art?.title.toLowerCase().includes(q);
    });
  }, [allComments, commentSearch, articles]);

  // --- Tab config ---
  const TABS: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "articles", label: "Articles", icon: <FileText className="w-4 h-4" />, count: articles.length },
    { id: "videos", label: "Videos", icon: <VideoIcon className="w-4 h-4" />, count: videos.length },
    { id: "comments", label: "Comments", icon: <MessageSquare className="w-4 h-4" />, count: allComments.length || undefined },
  ];

  return (
    <div className="min-h-screen bg-background" id="admin-panel">
      {/* ─── Admin Header ─── */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-500 font-bold">PAEN PRESS CENTER</p>
            <h2 className="text-xl font-serif font-bold text-foreground">Content Management System</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowPasscodeChange(!showPasscodeChange); setNewPasscode(""); setConfirmPasscode(""); setPasscodeError(""); }}
              className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-emerald-500 transition-colors font-bold"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              Rotate Passcode
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex gap-0 border-t border-zinc-200 dark:border-zinc-800">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-[11px] font-mono uppercase tracking-wider font-bold border-b-2 transition-all relative ${
                activeTab === tab.id
                  ? "border-amber-500 text-amber-600 dark:text-amber-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  activeTab === tab.id ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ─── Passcode Rotator ─── */}
        {showPasscodeChange && (
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-emerald-500/20 p-5 mb-6 max-w-md shadow-sm rounded">
            <h3 className="font-mono uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400 mb-2.5 flex items-center gap-2 text-xs">
              <Lock className="w-3.5 h-3.5" /> Rotate Portal Passcode
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
              Update your administrative login passcode. Changes take effect immediately.
            </p>
            {passcodeError && (
              <div className="mb-3 p-2 bg-rose-500/10 border border-rose-500/30 text-rose-500 font-mono text-[10px] uppercase tracking-wider text-center rounded">
                {passcodeError}
              </div>
            )}
            <form onSubmit={handleRotatePasscode} className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-mono tracking-wider text-zinc-500 font-bold">New Passcode</label>
                <input type="password" value={newPasscode} onChange={(e) => setNewPasscode(e.target.value)} placeholder="Enter new passcode..." className="px-3 py-1.5 text-xs border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono" required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Confirm Passcode</label>
                <input type="password" value={confirmPasscode} onChange={(e) => setConfirmPasscode(e.target.value)} placeholder="Confirm passcode..." className="px-3 py-1.5 text-xs border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono" required />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 font-mono uppercase text-[9px] tracking-wider font-bold rounded">Apply Rotation</button>
                <button type="button" onClick={() => { setShowPasscodeChange(false); setNewPasscode(""); setConfirmPasscode(""); setPasscodeError(""); }} className="bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-foreground px-3 py-2 font-mono uppercase text-[9px] tracking-wider rounded">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* ─── Success Toast ─── */}
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-600 dark:text-emerald-400 p-3 rounded mb-6 flex items-center gap-2 text-xs font-mono">
            <CheckCircle className="w-4 h-4 shrink-0" />
            {successMsg}
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB: OVERVIEW
        ════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Articles", value: articles.length, icon: <FileText className="w-5 h-5" />, color: "text-amber-500", sub: `${factCheckedCount} fact-checked` },
                { label: "Video Broadcasts", value: videos.length, icon: <VideoIcon className="w-5 h-5" />, color: "text-blue-500", sub: "max 4 recommended" },
                { label: "Total Likes", value: totalLikes, icon: <Heart className="w-5 h-5" />, color: "text-rose-500", sub: "across all articles" },
                { label: "Avg Objectivity", value: `${avgObjectivity}%`, icon: <Shield className="w-5 h-5" />, color: "text-emerald-500", sub: "editorial integrity" },
              ].map((stat) => (
                <div key={stat.label} className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-lg flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">{stat.label}</span>
                    <span className={stat.color}>{stat.icon}</span>
                  </div>
                  <div className="text-3xl font-serif font-bold text-foreground">{stat.value}</div>
                  <div className="text-[10px] font-mono text-zinc-400">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Content Breakdown + Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Category Distribution */}
              <div className="lg:col-span-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5">
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> Category Distribution
                </h3>
                <div className="flex flex-col gap-3">
                  {catBreakdown.map(([cat, count]) => {
                    const pct = articles.length ? Math.round((count / articles.length) * 100) : 0;
                    return (
                      <div key={cat} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${CATEGORY_COLORS[cat as Category]}`}>{cat}</span>
                          <span className="text-[11px] font-mono text-zinc-500 font-bold">{count} <span className="text-zinc-400 font-normal">({pct}%)</span></span>
                        </div>
                        <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  {catBreakdown.length === 0 && <p className="text-xs text-zinc-400 font-mono">No articles yet.</p>}
                </div>
              </div>

              {/* Recent Articles */}
              <div className="lg:col-span-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5">
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> Recently Published
                </h3>
                <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                  {articles.slice(0, 6).map((art) => (
                    <div key={art.id} className="flex items-center gap-4 py-3 group">
                      <img src={art.imageUrl} alt={art.title} className="w-12 h-12 object-cover rounded shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate leading-tight">{art.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border ${CATEGORY_COLORS[art.category]}`}>{art.category}</span>
                          <span className="text-[10px] font-mono text-zinc-400">{art.author}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400 shrink-0">
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-rose-400" />{art.likes}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{art.readTime}</span>
                        {art.factChecked && <span className="flex items-center gap-1 text-emerald-500"><Shield className="w-3 h-3" />OK</span>}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => { setActiveTab("articles"); handleEditArticleClick(art); }} className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-blue-500 rounded transition-colors" title="Edit">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteArticle(art.id)} className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-rose-500 rounded transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {articles.length === 0 && <p className="text-xs text-zinc-400 font-mono py-4 text-center">No articles published yet.</p>}
                </div>
                {articles.length > 6 && (
                  <button onClick={() => setActiveTab("articles")} className="mt-3 w-full text-[10px] font-mono uppercase tracking-widest text-amber-500 hover:text-amber-600 transition-colors font-bold py-2 border-t border-zinc-200 dark:border-zinc-800">
                    View all {articles.length} articles →
                  </button>
                )}
              </div>
            </div>

            {/* Videos Quick View */}
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
                  <VideoIcon className="w-3.5 h-3.5 text-blue-500" /> Video Broadcasts ({videos.length}/4)
                </h3>
                <button onClick={() => setActiveTab("videos")} className="text-[10px] font-mono uppercase tracking-widest text-amber-500 hover:text-amber-600 font-bold">Manage →</button>
              </div>
              {videos.length === 0 ? (
                <p className="text-xs text-zinc-400 font-mono">No videos yet.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {videos.map((vid) => (
                    <div key={vid.id} className="relative rounded overflow-hidden aspect-video bg-zinc-900">
                      <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover opacity-70" />
                      <div className="absolute inset-0 p-2 flex flex-col justify-between">
                        <span className={`self-start text-[8px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border ${CATEGORY_COLORS[vid.category]}`}>{vid.category}</span>
                        <div>
                          <p className="text-white text-[11px] font-semibold line-clamp-1 leading-tight">{vid.title}</p>
                          <p className="text-zinc-300 text-[9px] font-mono mt-0.5">{vid.duration} · {vid.author}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB: ARTICLES
        ════════════════════════════════════════ */}
        {activeTab === "articles" && (
          <div className="flex flex-col gap-6">
            {/* Article Form (collapsible) */}
            {showArticleForm && (
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-serif font-bold text-foreground">
                    {artId ? "Edit Article" : "Compose New Article"}
                  </h3>
                  <button onClick={() => { setShowArticleForm(false); resetArtForm(); }} className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSaveArticle} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Headline Title *</label>
                    <input type="text" value={artTitle} onChange={(e) => setArtTitle(e.target.value)} placeholder="e.g. The Quantum Shift" className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm" required />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Decker Subtitle</label>
                    <input type="text" value={artSubtitle} onChange={(e) => setArtSubtitle(e.target.value)} placeholder="A summary of the investigation" className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Category</label>
                    <select value={artCategory} onChange={(e) => setArtCategory(e.target.value as Category)} className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm">
                      {["tech","science","politics","culture","finance"].map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Byline Author *</label>
                    <input type="text" value={artAuthor} onChange={(e) => setArtAuthor(e.target.value)} placeholder="e.g. Alastair Vance" className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm" required />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Read Time</label>
                    <input type="text" value={artReadTime} onChange={(e) => setArtReadTime(e.target.value)} placeholder="e.g. 6 min read" className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Objectivity Index (%)</label>
                    <input type="number" min="50" max="100" value={artObjectivity} onChange={(e) => setArtObjectivity(Number(e.target.value))} className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Cover Image URL</label>
                    <input type="text" value={artImageUrl} onChange={(e) => setArtImageUrl(e.target.value)} placeholder="Leave blank for default category image" className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-xs font-mono" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Sources (comma separated)</label>
                    <input type="text" value={artSources} onChange={(e) => setArtSources(e.target.value)} placeholder="Source Alpha, Source Beta, Editorial Review" className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-xs font-mono" />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <input type="checkbox" id="artFactChecked" checked={artFactChecked} onChange={(e) => setArtFactChecked(e.target.checked)} className="w-4 h-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-500" />
                    <label htmlFor="artFactChecked" className="text-xs font-mono tracking-wider text-zinc-500 select-none cursor-pointer uppercase">Passes Double Fact-Check Standards</label>
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Story Body *</label>
                    <textarea value={artContent} onChange={(e) => setArtContent(e.target.value)} rows={10} placeholder="Write the full report here..." className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm leading-relaxed resize-y" required />
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-black py-2.5 rounded font-bold uppercase tracking-wider text-xs font-sans transition-colors">
                      {artId ? "Save Changes" : "Publish Article"}
                    </button>
                    <button type="button" onClick={() => { setShowArticleForm(false); resetArtForm(); }} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-foreground text-xs uppercase tracking-wider font-mono rounded transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-zinc-200 dark:border-zinc-700 rounded px-3 py-2 bg-zinc-50 dark:bg-zinc-900">
                <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  value={artSearch}
                  onChange={(e) => setArtSearch(e.target.value)}
                  placeholder="Search articles, authors..."
                  className="bg-transparent text-sm text-foreground placeholder:text-zinc-400 focus:outline-none w-full"
                />
                {artSearch && <button onClick={() => setArtSearch("")} className="text-zinc-400 hover:text-zinc-600"><X className="w-3.5 h-3.5" /></button>}
              </div>
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-zinc-400" />
                <select value={artCatFilter} onChange={(e) => setArtCatFilter(e.target.value as Category | "all")} className="text-xs font-mono border border-zinc-200 dark:border-zinc-700 rounded px-2 py-2 bg-zinc-50 dark:bg-zinc-900 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase tracking-wider">
                  <option value="all">All Categories</option>
                  {["tech","science","politics","culture","finance"].map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
              </div>
              <button
                onClick={() => { setShowArticleForm(true); resetArtForm(); }}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded text-xs font-bold uppercase tracking-wider font-mono transition-colors ml-auto"
              >
                <Plus className="w-3.5 h-3.5" /> New Article
              </button>
            </div>

            {/* Articles Table */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
              <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                  {filteredArticles.length} of {articles.length} articles
                </span>
                {(artSearch || artCatFilter !== "all") && (
                  <button onClick={() => { setArtSearch(""); setArtCatFilter("all"); }} className="text-[9px] font-mono text-amber-500 hover:text-amber-600 uppercase tracking-widest font-bold">Clear Filters</button>
                )}
              </div>
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                    <tr className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                      <th className="px-4 py-3 font-bold">Article</th>
                      <th className="px-4 py-3 font-bold">Author</th>
                      <th className="px-4 py-3 font-bold">Category</th>
                      <th className="px-4 py-3 font-bold">Stats</th>
                      <th className="px-4 py-3 font-bold">Status</th>
                      <th className="px-4 py-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {filteredArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={art.imageUrl} alt="" className="w-10 h-10 object-cover rounded shrink-0" />
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-foreground truncate max-w-xs leading-tight">{art.title}</div>
                              <div className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate max-w-xs">{art.subtitle}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-foreground">{art.author}</div>
                          <div className="text-[10px] text-zinc-400 font-mono">{art.date}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-mono uppercase font-bold px-2 py-1 rounded border ${CATEGORY_COLORS[art.category]}`}>{art.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-rose-400" />{art.likes}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{art.readTime}</span>
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500 mt-1">OBJ: {art.objectivityRating}%</div>
                        </td>
                        <td className="px-4 py-3">
                          {art.factChecked ? (
                            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-500 font-bold uppercase">
                              <Shield className="w-3 h-3" /> Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-mono text-amber-500 font-bold uppercase">
                              <AlertTriangle className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => handleEditArticleClick(art)} className="p-1.5 hover:bg-blue-500/10 text-blue-500 rounded transition-colors" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteArticle(art.id)} className="p-1.5 hover:bg-rose-500/10 text-rose-500 rounded transition-colors" title="Retract">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredArticles.length === 0 && (
                  <div className="py-16 text-center text-zinc-400 font-mono text-sm">
                    No articles match your filters.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB: VIDEOS
        ════════════════════════════════════════ */}
        {activeTab === "videos" && (
          <div className="flex flex-col gap-6">
            {showVideoForm && (
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-serif font-bold text-foreground">
                    {vidId ? "Edit Video" : "Upload Broadcast Video"}
                  </h3>
                  <button onClick={() => { setShowVideoForm(false); resetVidForm(); }} className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSaveVideo} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Video Title *</label>
                    <input type="text" value={vidTitle} onChange={(e) => setVidTitle(e.target.value)} placeholder="e.g. Expedition Amazon" className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm" required />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Stream URL (MP4) *</label>
                    <input type="text" value={vidUrl} onChange={(e) => setVidUrl(e.target.value)} placeholder="https://example.com/video.mp4" className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-xs font-mono" required />
                    <span className="text-[10px] text-zinc-400 font-mono">Requires direct stream URL (MP4, WebM)</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Category</label>
                    <select value={vidCategory} onChange={(e) => setVidCategory(e.target.value as Category)} className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm">
                      {["tech","science","politics","culture","finance"].map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Duration (MM:SS)</label>
                    <input type="text" value={vidDuration} onChange={(e) => setVidDuration(e.target.value)} placeholder="e.g. 1:45" className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Producer / Author</label>
                    <input type="text" value={vidAuthor} onChange={(e) => setVidAuthor(e.target.value)} placeholder="e.g. Staff Explorer" className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Thumbnail URL</label>
                    <input type="text" value={vidThumb} onChange={(e) => setVidThumb(e.target.value)} placeholder="Optional — defaults to category image" className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-xs font-mono" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Description</label>
                    <textarea value={vidDesc} onChange={(e) => setVidDesc(e.target.value)} rows={4} placeholder="A narrative of the footage captured..." className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm leading-relaxed resize-y" />
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-black py-2.5 rounded font-bold uppercase tracking-wider text-xs font-sans transition-colors">
                      {vidId ? "Save Changes" : "Publish Broadcast"}
                    </button>
                    <button type="button" onClick={() => { setShowVideoForm(false); resetVidForm(); }} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-foreground text-xs uppercase tracking-wider font-mono rounded">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                <VideoIcon className="w-4 h-4 text-blue-500" />
                <span className="font-bold">{videos.length}</span> broadcast{videos.length !== 1 ? "s" : ""}
                {videos.length >= 4 && <span className="ml-2 text-amber-500 font-bold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> At recommended limit</span>}
              </div>
              <button
                onClick={() => { setShowVideoForm(true); resetVidForm(); }}
                disabled={videos.length >= 4}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-black px-4 py-2 rounded text-xs font-bold uppercase tracking-wider font-mono transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> New Video
              </button>
            </div>

            {/* Video Grid */}
            {videos.length === 0 ? (
              <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg py-16 text-center">
                <VideoIcon className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                <p className="text-sm font-mono text-zinc-400">No video broadcasts published yet.</p>
                <button onClick={() => { setShowVideoForm(true); resetVidForm(); }} className="mt-4 text-xs font-mono text-amber-500 hover:text-amber-600 uppercase tracking-widest font-bold">+ Add First Video</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {videos.map((vid) => (
                  <div key={vid.id} className="border border-zinc-200 dark:border-zinc-800 bg-background rounded-lg overflow-hidden flex flex-col">
                    <div className="aspect-video relative bg-black">
                      <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover opacity-80" />
                      <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 text-[10px] font-mono text-amber-400 font-bold rounded">{vid.duration}</span>
                      <span className={`absolute top-2 left-2 text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border ${CATEGORY_COLORS[vid.category]}`}>{vid.category}</span>
                    </div>
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <h4 className="font-serif font-bold text-sm text-foreground line-clamp-1">{vid.title}</h4>
                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{vid.description}</p>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400 mt-auto pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <span>{vid.author}</span>
                        <span>·</span>
                        <span>{vid.date}</span>
                      </div>
                    </div>
                    <div className="px-4 pb-4 flex gap-2">
                      <button onClick={() => handleEditVideoClick(vid)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-mono border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-foreground transition-colors">
                        <Edit className="w-3.5 h-3.5 text-blue-500" /> Edit
                      </button>
                      <button onClick={() => handleDeleteVideo(vid.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-mono border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded text-rose-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> Archive
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB: COMMENTS
        ════════════════════════════════════════ */}
        {activeTab === "comments" && (
          <div className="flex flex-col gap-6">
            {/* Toolbar */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-zinc-200 dark:border-zinc-700 rounded px-3 py-2 bg-zinc-50 dark:bg-zinc-900">
                <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  value={commentSearch}
                  onChange={(e) => setCommentSearch(e.target.value)}
                  placeholder="Search comments, authors, articles..."
                  className="bg-transparent text-sm text-foreground placeholder:text-zinc-400 focus:outline-none w-full"
                />
                {commentSearch && <button onClick={() => setCommentSearch("")} className="text-zinc-400 hover:text-zinc-600"><X className="w-3.5 h-3.5" /></button>}
              </div>
              <button
                onClick={() => { setCommentsLoaded(false); setAllComments([]); setActiveTab("overview"); setTimeout(() => setActiveTab("comments"), 50); }}
                className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 border border-zinc-200 dark:border-zinc-700 px-3 py-2 rounded transition-colors uppercase tracking-wider"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            {!commentsLoaded ? (
              <div className="py-16 text-center">
                <div className="inline-block w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-mono text-zinc-400">Loading comments...</p>
              </div>
            ) : filteredComments.length === 0 ? (
              <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg py-16 text-center">
                <MessageSquare className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                <p className="text-sm font-mono text-zinc-400">
                  {commentSearch ? "No comments match your search." : "No reader comments yet."}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold px-1">
                  {filteredComments.length} comment{filteredComments.length !== 1 ? "s" : ""}
                </div>
                {filteredComments.map((comment) => {
                  const art = articles.find((a) => a.id === comment.articleId);
                  return (
                    <div key={comment.id} className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[11px] font-bold text-amber-600 uppercase">{comment.author.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <span className="text-sm font-semibold text-foreground">{comment.author}</span>
                            <span className="text-[10px] font-mono text-zinc-400 ml-2">{comment.date}</span>
                          </div>
                          {art && (
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border ${CATEGORY_COLORS[art.category]}`}>{art.category}</span>
                              <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[180px]">{art.title}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2 leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
