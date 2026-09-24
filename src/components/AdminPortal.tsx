import React, { useState } from "react";
import { Article, Video, Category } from "../types";
import {
  Trash2,
  Plus,
  FileText,
  Video as VideoIcon,
  CheckCircle,
  KeyRound,
  Shield,
  Search,
  Database,
  LogOut,
} from "lucide-react";
import { setAdminPassword } from "../lib/db";

interface AdminPortalProps {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  videos: Video[];
  setVideos: (videos: Video[]) => void;
  onExit?: () => void;
}

export default function AdminPortal({
  articles,
  setArticles,
  videos,
  setVideos,
  onExit,
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<"content" | "new_article" | "new_video" | "settings">("content");
  const [contentType, setContentType] = useState<"articles" | "videos">("articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // New Article Form
  const [artTitle, setArtTitle] = useState("");
  const [artSubtitle, setArtSubtitle] = useState("");
  const [artCategory, setArtCategory] = useState<Category>("tech");
  const [artAuthor, setArtAuthor] = useState("Editorial Desk");
  const [artContent, setArtContent] = useState("");
  const [artImageUrl, setArtImageUrl] = useState("");

  // New Video Form
  const [vidTitle, setVidTitle] = useState("");
  const [vidDesc, setVidDesc] = useState("");
  const [vidCategory, setVidCategory] = useState<Category>("science");
  const [vidUrl, setVidUrl] = useState("");
  const [vidThumb, setVidThumb] = useState("");
  const [vidDuration, setVidDuration] = useState("12:00");
  const [vidAuthor, setVidAuthor] = useState("Paen Field Broadcast");

  // Settings
  const [newPass, setNewPass] = useState("");
  const [passMsg, setPassMsg] = useState("");

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  // Article Actions
  const handleDeleteArticle = (id: string) => {
    if (confirm("Are you sure you want to remove this dispatch?")) {
      const updated = articles.filter((a) => a.id !== id);
      setArticles(updated);
      triggerSuccess("Dispatch removed successfully.");
    }
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle.trim() || !artContent.trim()) {
      alert("Please provide at least a title and content.");
      return;
    }

    const newArt: Article = {
      id: `art-${Date.now()}`,
      title: artTitle,
      subtitle: artSubtitle || "Special field dispatch",
      content: artContent,
      category: artCategory,
      author: artAuthor || "Editorial Desk",
      authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      authorBio: "Paen Field Research Correspondent",
      imageUrl:
        artImageUrl ||
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      readTime: "5 min read",
      sources: ["Paen Field Station 04"],
      factChecked: true,
      objectivityRating: 98,
      likes: 0,
      status: "published",
    };

    setArticles([newArt, ...articles]);
    setArtTitle("");
    setArtSubtitle("");
    setArtContent("");
    setArtImageUrl("");
    setActiveTab("content");
    triggerSuccess("New article published directly to site!");
  };

  // Video Actions
  const handleDeleteVideo = (id: string) => {
    if (confirm("Delete this broadcast video?")) {
      const updated = videos.filter((v) => v.id !== id);
      setVideos(updated);
      triggerSuccess("Broadcast video removed.");
    }
  };

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidTitle.trim() || !vidUrl.trim()) {
      alert("Please provide video title and URL.");
      return;
    }

    const newVid: Video = {
      id: `vid-${Date.now()}`,
      title: vidTitle,
      description: vidDesc || vidTitle,
      category: vidCategory,
      videoUrl: vidUrl,
      thumbnailUrl:
        vidThumb ||
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
      duration: vidDuration || "10:00",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      author: vidAuthor || "Paen Field Broadcast",
    };

    setVideos([newVid, ...videos]);
    setVidTitle("");
    setVidDesc("");
    setVidUrl("");
    setVidThumb("");
    setActiveTab("content");
    setContentType("videos");
    triggerSuccess("Video broadcast added!");
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 4) {
      setPassMsg("Password must be at least 4 characters.");
      return;
    }
    setAdminPassword(newPass);
    setNewPass("");
    setPassMsg("Admin password updated successfully.");
    setTimeout(() => setPassMsg(""), 4000);
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVideos = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-[#f4ecd9] dark:bg-[#0a100d] min-h-screen text-zinc-900 dark:text-zinc-100 font-sans pb-24">
      {/* Top Banner */}
      <div className="bg-[#121a15] text-[#cfc5b6] px-6 py-4 border-b border-[#1c2a21] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-sm uppercase tracking-widest text-amber-400 font-bold">
                PAEN SITE MANAGEMENT
              </h1>
              <span className="px-2 py-0.5 text-[8.5px] font-mono uppercase tracking-widest bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                ADMIN
              </span>
            </div>
            <p className="text-[10.5px] font-mono text-zinc-400">
              Simple content management & access control
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-500/30 text-[9.5px] font-mono text-emerald-300">
            <Database className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>CLOUD FIRESTORE ACTIVE</span>
          </div>
          {onExit && (
            <button
              onClick={onExit}
              className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-[10px] font-mono uppercase tracking-wider font-bold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Desk</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <div className="p-3 bg-emerald-900/80 border border-emerald-500 text-emerald-100 text-xs font-mono font-bold flex items-center gap-2 shadow-md">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-300 dark:border-zinc-800 pb-4 mb-6">
          <button
            onClick={() => setActiveTab("content")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-all ${
              activeTab === "content"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-250 dark:border-zinc-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Published Content ({articles.length + videos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("new_article")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-all ${
              activeTab === "new_article"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-250 dark:border-zinc-800"
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-emerald-500" />
            <span>+ New Dispatch</span>
          </button>

          <button
            onClick={() => setActiveTab("new_video")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-all ${
              activeTab === "new_video"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-250 dark:border-zinc-800"
            }`}
          >
            <VideoIcon className="w-3.5 h-3.5 text-blue-500" />
            <span>+ New Video</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-all ${
              activeTab === "settings"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-250 dark:border-zinc-800"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            <span>Security & Passcode</span>
          </button>
        </div>

        {/* TAB 1: CONTENT MANAGEMENT */}
        {activeTab === "content" && (
          <div>
            {/* Quick Filter & Search Bar */}
            <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setContentType("articles")}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-bold ${
                    contentType === "articles"
                      ? "bg-emerald-700 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  Articles ({articles.length})
                </button>
                <button
                  onClick={() => setContentType("videos")}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-bold ${
                    contentType === "videos"
                      ? "bg-blue-700 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  Videos ({videos.length})
                </button>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs font-sans text-foreground focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Articles Table/List */}
            {contentType === "articles" && (
              <div className="space-y-3">
                {filteredArticles.length === 0 ? (
                  <div className="p-12 text-center text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800">
                    No articles found.
                  </div>
                ) : (
                  filteredArticles.map((art) => (
                    <div
                      key={art.id}
                      className="p-4 bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-zinc-400 transition-all shadow-sm"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                          <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 font-bold text-foreground">
                            {art.category}
                          </span>
                          <span>•</span>
                          <span>{art.author}</span>
                          <span>•</span>
                          <span>{art.date}</span>
                        </div>
                        <h3 className="font-serif font-bold text-base text-foreground leading-snug">
                          {art.title}
                        </h3>
                        {art.subtitle && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                            {art.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
                          title="Delete dispatch"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Videos List */}
            {contentType === "videos" && (
              <div className="space-y-3">
                {filteredVideos.length === 0 ? (
                  <div className="p-12 text-center text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800">
                    No videos found.
                  </div>
                ) : (
                  filteredVideos.map((vid) => (
                    <div
                      key={vid.id}
                      className="p-4 bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-zinc-400 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-20 h-12 object-cover bg-black rounded shrink-0 border border-zinc-250 dark:border-zinc-800"
                        />
                        <div>
                          <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-wider text-zinc-500 mb-0.5">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">{vid.category}</span>
                            <span>•</span>
                            <span>{vid.duration}</span>
                          </div>
                          <h3 className="font-serif font-bold text-sm text-foreground leading-snug">
                            {vid.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
                          title="Delete video"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SIMPLE NEW ARTICLE FORM */}
        {activeTab === "new_article" && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif font-bold text-xl text-foreground mb-1">
              Publish New Field Dispatch
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 font-mono">
              Fill in the essential fields to publish directly to the live journal.
            </p>

            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-bold">
                  Dispatch Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bio-Acoustic Monitoring of Canopy Biomes"
                  value={artTitle}
                  onChange={(e) => setArtTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm font-sans focus:outline-none focus:border-emerald-600 text-foreground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-bold">
                    Category *
                  </label>
                  <select
                    value={artCategory}
                    onChange={(e) => setArtCategory(e.target.value as Category)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs font-mono focus:outline-none focus:border-emerald-600 text-foreground"
                  >
                    <option value="science">Planetary Science</option>
                    <option value="tech">Eco-Technology</option>
                    <option value="politics">Earth Polity</option>
                    <option value="culture">Ecological Culture</option>
                    <option value="finance">Green Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-bold">
                    Author Byline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Eleanor Wright"
                    value={artAuthor}
                    onChange={(e) => setArtAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs font-sans focus:outline-none focus:border-emerald-600 text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-bold">
                  Subtitle / Summary
                </label>
                <input
                  type="text"
                  placeholder="Short one-line synopsis"
                  value={artSubtitle}
                  onChange={(e) => setArtSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs font-sans focus:outline-none focus:border-emerald-600 text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-bold">
                  Hero Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={artImageUrl}
                  onChange={(e) => setArtImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs font-sans focus:outline-none focus:border-emerald-600 text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-bold">
                  Full Article Body *
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="Write the article copy here..."
                  value={artContent}
                  onChange={(e) => setArtContent(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm font-sans focus:outline-none focus:border-emerald-600 text-foreground leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("content")}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-mono uppercase tracking-widest font-bold shadow-md transition-all"
                >
                  Publish Dispatch
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: SIMPLE NEW VIDEO FORM */}
        {activeTab === "new_video" && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif font-bold text-xl text-foreground mb-1">
              Add Video Broadcast
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 font-mono">
              Provide video link and thumbnail for the In Focus broadcast section.
            </p>

            <form onSubmit={handleCreateVideo} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-bold">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Ocean Geothermal Probes"
                  value={vidTitle}
                  onChange={(e) => setVidTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm font-sans focus:outline-none focus:border-blue-600 text-foreground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-bold">
                    Category *
                  </label>
                  <select
                    value={vidCategory}
                    onChange={(e) => setVidCategory(e.target.value as Category)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs font-mono focus:outline-none focus:border-blue-600 text-foreground"
                  >
                    <option value="science">Planetary Science</option>
                    <option value="tech">Eco-Technology</option>
                    <option value="politics">Earth Polity</option>
                    <option value="culture">Ecological Culture</option>
                    <option value="finance">Green Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-bold">
                    Presenter / Correspondent
                  </label>
                  <input
                    type="text"
                    placeholder="Paen Field Broadcast"
                    value={vidAuthor}
                    onChange={(e) => setVidAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs font-sans focus:outline-none focus:border-blue-600 text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-bold">
                  Duration (e.g. 14:20)
                </label>
                <input
                  type="text"
                  placeholder="14:20"
                  value={vidDuration}
                  onChange={(e) => setVidDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs font-sans focus:outline-none focus:border-blue-600 text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-bold">
                  Description / Synopsis
                </label>
                <input
                  type="text"
                  placeholder="Short description of the broadcast..."
                  value={vidDesc}
                  onChange={(e) => setVidDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs font-sans focus:outline-none focus:border-blue-600 text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-bold">
                  Video Stream URL (MP4 / WebM / HLS) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://assets.mixkit.co/videos/preview/..."
                  value={vidUrl}
                  onChange={(e) => setVidUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs font-sans focus:outline-none focus:border-blue-600 text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-bold">
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={vidThumb}
                  onChange={(e) => setVidThumb(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs font-sans focus:outline-none focus:border-blue-600 text-foreground"
                />
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("content")}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-mono uppercase tracking-widest font-bold shadow-md transition-all"
                >
                  Add Video
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: SECURITY & PASSCODE */}
        {activeTab === "settings" && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 p-6 sm:p-8 shadow-sm max-w-xl">
            <h2 className="font-serif font-bold text-xl text-foreground mb-1">
              Admin Access Passcode
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 font-mono">
              Update the master passcode used to access the administrator panel.
            </p>

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-bold">
                  New Admin Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password (min 4 characters)"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm font-sans focus:outline-none focus:border-amber-600 text-foreground"
                />
              </div>

              {passMsg && (
                <div
                  className={`text-xs font-mono p-2.5 rounded ${
                    passMsg.includes("success")
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                  }`}
                >
                  {passMsg}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono uppercase tracking-widest font-bold shadow-md transition-all"
                >
                  Update Passcode
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
