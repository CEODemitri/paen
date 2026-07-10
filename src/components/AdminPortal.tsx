import React, { useState } from "react";
import { Article, Video, Category } from "../types";
import { Trash2, Edit, FileText, Video as VideoIcon, CheckCircle, KeyRound, Lock } from "lucide-react";

interface AdminPortalProps {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  videos: Video[];
  setVideos: (videos: Video[]) => void;
}

export default function AdminPortal({
  articles,
  setArticles,
  videos,
  setVideos,
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<"articles" | "videos">("articles");
  const [successMsg, setSuccessMsg] = useState("");

  // Passcode rotation state
  const [showPasscodeChange, setShowPasscodeChange] = useState(false);
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  // Article form state
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

  // Video form state
  const [vidId, setVidId] = useState("");
  const [vidTitle, setVidTitle] = useState("");
  const [vidDesc, setVidDesc] = useState("");
  const [vidCategory, setVidCategory] = useState<Category>("science");
  const [vidUrl, setVidUrl] = useState("");
  const [vidThumb, setVidThumb] = useState("");
  const [vidDuration, setVidDuration] = useState("");
  const [vidAuthor, setVidAuthor] = useState("");

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleRotatePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError("");

    if (newPasscode.length < 4) {
      setPasscodeError("Passcode must be at least 4 characters.");
      return;
    }

    if (newPasscode === "paen123") {
      setPasscodeError("Cannot reuse the default temporary passcode.");
      return;
    }

    if (newPasscode !== confirmPasscode) {
      setPasscodeError("Passcodes do not match.");
      return;
    }

    localStorage.setItem("paen_admin_password", newPasscode);
    localStorage.setItem("paen_has_changed_password", "true");
    
    triggerSuccess("PORTAL PASSCODE ROTATED SUCCESSFULLY");
    setShowPasscodeChange(false);
    setNewPasscode("");
    setConfirmPasscode("");
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle || !artContent || !artAuthor) {
      alert("Please fill in Title, Content, and Author.");
      return;
    }

    const sourceList = artSources
      ? artSources.split(",").map((s) => s.trim())
      : ["Editorial Research Desk"];

    const defaultImages = {
      tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
      science: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=1000&auto=format&fit=crop",
      politics: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1000&auto=format&fit=crop",
      culture: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop",
      finance: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1000&auto=format&fit=crop",
    };

    const finalImage = artImageUrl || defaultImages[artCategory];

    if (artId) {
      // Editing
      const updated = articles.map((art) =>
        art.id === artId
          ? {
              ...art,
              title: artTitle,
              subtitle: artSubtitle,
              content: artContent,
              category: artCategory,
              author: artAuthor,
              imageUrl: finalImage,
              readTime: artReadTime || "5 min read",
              sources: sourceList,
              factChecked: artFactChecked,
              objectivityRating: artObjectivity,
            }
          : art
      );
      setArticles(updated);
      triggerSuccess(`Article "${artTitle.substring(0, 20)}..." updated successfully.`);
    } else {
      // Creating
      const newArt: Article = {
        id: `art-${Date.now()}`,
        title: artTitle,
        subtitle: artSubtitle,
        content: artContent,
        category: artCategory,
        author: artAuthor,
        authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
        authorBio: `${artAuthor} is an editorial contributor writing on ${artCategory} systems and international development.`,
        imageUrl: finalImage,
        date: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        readTime: artReadTime || "5 min read",
        sources: sourceList,
        factChecked: artFactChecked,
        objectivityRating: artObjectivity,
        likes: 0,
      };
      setArticles([newArt, ...articles]);
      triggerSuccess(`Article "${artTitle.substring(0, 20)}..." created successfully.`);
    }

    // Reset Form
    setArtId("");
    setArtTitle("");
    setArtSubtitle("");
    setArtContent("");
    setArtAuthor("");
    setArtImageUrl("");
    setArtReadTime("");
    setArtSources("");
    setArtFactChecked(true);
    setArtObjectivity(95);
  };

  const handleEditArticleClick = (art: Article) => {
    setArtId(art.id);
    setArtTitle(art.title);
    setArtSubtitle(art.subtitle);
    setArtContent(art.content);
    setArtCategory(art.category);
    setArtAuthor(art.author);
    setArtImageUrl(art.imageUrl);
    setArtReadTime(art.readTime);
    setArtSources(art.sources.join(", "));
    setArtFactChecked(art.factChecked);
    setArtObjectivity(art.objectivityRating);
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm("Are you sure you want to retract this article?")) {
      setArticles(articles.filter((a) => a.id !== id));
      triggerSuccess("Article retracted from circulation.");
    }
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidTitle || !vidUrl) {
      alert("Please fill in Video Title and Video Stream URL.");
      return;
    }

    const defaultThumbs = {
      tech: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
      science: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
      politics: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=600&auto=format&fit=crop",
      culture: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600&auto=format&fit=crop",
      finance: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop",
    };

    const finalThumb = vidThumb || defaultThumbs[vidCategory];

    if (vidId) {
      const updated = videos.map((vid) =>
        vid.id === vidId
          ? {
              ...vid,
              title: vidTitle,
              description: vidDesc,
              category: vidCategory,
              videoUrl: vidUrl,
              thumbnailUrl: finalThumb,
              duration: vidDuration || "1:00",
              author: vidAuthor || "Staff Reporter",
            }
          : vid
      );
      setVideos(updated);
      triggerSuccess(`Video "${vidTitle.substring(0, 20)}..." updated successfully.`);
    } else {
      const newVid: Video = {
        id: `vid-${Date.now()}`,
        title: vidTitle,
        description: vidDesc,
        category: vidCategory,
        videoUrl: vidUrl,
        thumbnailUrl: finalThumb,
        duration: vidDuration || "1:00",
        date: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        author: vidAuthor || "Staff Reporter",
      };
      setVideos([...videos, newVid]);
      triggerSuccess(`Video "${vidTitle.substring(0, 20)}..." uploaded successfully.`);
    }

    setVidId("");
    setVidTitle("");
    setVidDesc("");
    setVidUrl("");
    setVidThumb("");
    setVidDuration("");
    setVidAuthor("");
  };

  const handleEditVideoClick = (vid: Video) => {
    setVidId(vid.id);
    setVidTitle(vid.title);
    setVidDesc(vid.description);
    setVidCategory(vid.category);
    setVidUrl(vid.videoUrl);
    setVidThumb(vid.thumbnailUrl);
    setVidDuration(vid.duration);
    setVidAuthor(vid.author);
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm("Are you sure you want to archive this video?")) {
      setVideos(videos.filter((v) => v.id !== id));
      triggerSuccess("Video archived successfully.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" id="admin-panel">
      {/* Editorial Title */}
      <div className="border-b-2 border-amber-500 pb-4 mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-500">PAEN PRESS CENTER</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Content Management System (CMS)</h2>
          <button
            onClick={() => {
              setShowPasscodeChange(!showPasscodeChange);
              setNewPasscode("");
              setConfirmPasscode("");
              setPasscodeError("");
            }}
            className="text-[10px] font-mono text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5 font-bold"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
            {showPasscodeChange ? "Close Passcode Manager" : "Rotate Portal Passcode"}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            id="tab-btn-articles"
            onClick={() => setActiveTab("articles")}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-mono border rounded transition-all ${
              activeTab === "articles"
                ? "bg-amber-500 text-black border-amber-500 font-bold"
                : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
            }`}
          >
            <FileText className="w-4 h-4" /> Articles
          </button>
          <button
            id="tab-btn-videos"
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-mono border rounded transition-all ${
              activeTab === "videos"
                ? "bg-amber-500 text-black border-amber-500 font-bold"
                : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
            }`}
          >
            <VideoIcon className="w-4 h-4" /> Videos (2-4 Max)
          </button>
        </div>
      </div>

      {/* Collapsible Passcode Rotator */}
      {showPasscodeChange && (
        <div className="bg-[#faf9f5] dark:bg-[#0c140f] border border-emerald-600/20 dark:border-emerald-500/10 p-5 mb-6 max-w-md shadow-sm">
          <h3 className="font-mono uppercase tracking-widest font-bold text-emerald-700 dark:text-emerald-400 mb-2.5 flex items-center gap-2 text-xs">
            <Lock className="w-3.5 h-3.5" /> Rotate Portal Passcode
          </h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-4 font-light leading-relaxed">
            Update your administrative login passcode signature. Changes will take effect immediately.
          </p>
          {passcodeError && (
            <div className="mb-3.5 p-2 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-mono text-[10px] uppercase tracking-wider text-center">
              {passcodeError}
            </div>
          )}
          <form onSubmit={handleRotatePasscode} className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-mono tracking-wider text-zinc-500 font-bold">New Passcode</label>
              <input
                type="password"
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                placeholder="Enter new passcode..."
                className="px-3 py-1.5 text-xs border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Confirm New Passcode</label>
              <input
                type="password"
                value={confirmPasscode}
                onChange={(e) => setConfirmPasscode(e.target.value)}
                placeholder="Confirm new passcode..."
                className="px-3 py-1.5 text-xs border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                required
              />
            </div>
            <div className="flex gap-2 pt-1.5">
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-4 py-2 font-mono uppercase text-[9px] tracking-wider font-bold rounded"
              >
                Apply Passcode Rotation
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasscodeChange(false);
                  setNewPasscode("");
                  setConfirmPasscode("");
                  setPasscodeError("");
                }}
                className="bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-foreground px-3 py-2 font-mono uppercase text-[9px] tracking-wider rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-600 dark:text-emerald-400 p-4 rounded mb-6 flex items-center gap-2 text-sm font-mono animate-pulse">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Articles Management */}
      {activeTab === "articles" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Article Form */}
          <form onSubmit={handleSaveArticle} className="lg:col-span-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg shadow-sm flex flex-col gap-4">
            <h3 className="text-lg font-serif font-bold border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-2">
              {artId ? "✏️ Edit Draft Article" : "✍️ Compose New Article"}
            </h3>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-mono tracking-wider text-zinc-500">Headline Title</label>
              <input
                type="text"
                value={artTitle}
                onChange={(e) => setArtTitle(e.target.value)}
                placeholder="e.g. The Quantum Shift"
                className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-mono tracking-wider text-zinc-500">Decker Subtitle</label>
              <input
                type="text"
                value={artSubtitle}
                onChange={(e) => setArtSubtitle(e.target.value)}
                placeholder="A summary of the central journalistic investigation"
                className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-mono tracking-wider text-zinc-500">Editorial Category</label>
                <select
                  value={artCategory}
                  onChange={(e) => setArtCategory(e.target.value as Category)}
                  className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="tech">Tech</option>
                  <option value="science">Science</option>
                  <option value="politics">Politics</option>
                  <option value="culture">Culture</option>
                  <option value="finance">Finance</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-mono tracking-wider text-zinc-500">Byline Author</label>
                <input
                  type="text"
                  value={artAuthor}
                  onChange={(e) => setArtAuthor(e.target.value)}
                  placeholder="e.g. Alastair Vance"
                  className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-mono tracking-wider text-zinc-500">Read Time Estimate</label>
                <input
                  type="text"
                  value={artReadTime}
                  onChange={(e) => setArtReadTime(e.target.value)}
                  placeholder="e.g. 6 min read"
                  className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-mono tracking-wider text-zinc-500">Objectivity Index (%)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={artObjectivity}
                  onChange={(e) => setArtObjectivity(Number(e.target.value))}
                  className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-mono tracking-wider text-zinc-500">Image Cover URL</label>
              <input
                type="text"
                value={artImageUrl}
                onChange={(e) => setArtImageUrl(e.target.value)}
                placeholder="Leave blank for high-res stock based on category"
                className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-mono tracking-wider text-zinc-500">Verification Sources (Comma split)</label>
              <input
                type="text"
                value={artSources}
                onChange={(e) => setArtSources(e.target.value)}
                placeholder="Source Alpha, Source Beta, Editorial Review"
                className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-xs"
              />
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="artFactChecked"
                checked={artFactChecked}
                onChange={(e) => setArtFactChecked(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-500"
              />
              <label htmlFor="artFactChecked" className="text-xs uppercase font-mono tracking-wider text-zinc-600 dark:text-zinc-400 select-none cursor-pointer">
                Passes Double Fact-Check Standards
              </label>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-mono tracking-wider text-zinc-500">Story Body (Markdown / Text)</label>
              <textarea
                value={artContent}
                onChange={(e) => setArtContent(e.target.value)}
                rows={10}
                placeholder="Write the full report here. Support with multiple paragraphs..."
                className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-sm leading-relaxed"
              />
            </div>

            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="flex-1 bg-amber-500 text-black py-2.5 rounded font-bold uppercase tracking-wider text-xs transition-colors hover:bg-amber-600 font-sans"
              >
                {artId ? "Publish Changes" : "Deploy Live Article"}
              </button>
              {artId && (
                <button
                  type="button"
                  onClick={() => {
                    setArtId("");
                    setArtTitle("");
                    setArtSubtitle("");
                    setArtContent("");
                    setArtAuthor("");
                    setArtImageUrl("");
                    setArtReadTime("");
                    setArtSources("");
                    setArtFactChecked(true);
                    setArtObjectivity(95);
                  }}
                  className="px-4 py-2 bg-zinc-300 dark:bg-zinc-800 hover:bg-zinc-400 dark:hover:bg-zinc-700 text-foreground text-xs uppercase tracking-wider font-mono rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Active Articles Inventory */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h3 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
              <FileText className="text-amber-500 w-5 h-5" /> Live Articles Database ({articles.length})
            </h3>
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden max-h-[750px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-zinc-100 dark:bg-zinc-850 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-mono uppercase tracking-wider">
                    <th className="p-3">Article Title</th>
                    <th className="p-3">Author & Category</th>
                    <th className="p-3">Stats</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {articles.map((art) => (
                    <tr key={art.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                      <td className="p-3">
                        <div className="font-semibold text-foreground truncate max-w-xs">{art.title}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{art.id}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-foreground">{art.author}</div>
                        <span className="px-2 py-0.5 text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded font-mono uppercase font-bold">
                          {art.category}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-xs">
                        <div>Read: {art.readTime}</div>
                        <div>Fact: {art.objectivityRating}%</div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditArticleClick(art)}
                            className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-blue-500 rounded transition-colors"
                            title="Edit Draft"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-rose-500 rounded transition-colors"
                            title="Retract Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Video Management Tab */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Video Form */}
          <form onSubmit={handleSaveVideo} className="lg:col-span-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg shadow-sm flex flex-col gap-4">
            <h3 className="text-lg font-serif font-bold border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-2">
              {vidId ? "✏️ Edit Video Meta" : "📹 Upload Broadcast Video"}
            </h3>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-mono tracking-wider text-zinc-500">Video Title</label>
              <input
                type="text"
                value={vidTitle}
                onChange={(e) => setVidTitle(e.target.value)}
                placeholder="e.g. Expedition Amazon Setup"
                className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-mono tracking-wider text-zinc-500">Stream Source (MP4 Direct URL)</label>
              <input
                type="text"
                value={vidUrl}
                onChange={(e) => setVidUrl(e.target.value)}
                placeholder="e.g. https://vjs.zencdn.net/v/oceans.mp4"
                className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-xs font-mono"
              />
              <span className="text-[10px] text-zinc-400 font-mono">Requires direct stream source (MP4, WebM)</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-mono tracking-wider text-zinc-500">Acoustic / Category</label>
                <select
                  value={vidCategory}
                  onChange={(e) => setVidCategory(e.target.value as Category)}
                  className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="tech">Tech</option>
                  <option value="science">Science</option>
                  <option value="politics">Politics</option>
                  <option value="culture">Culture</option>
                  <option value="finance">Finance</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-mono tracking-wider text-zinc-500">Duration (MM:SS)</label>
                <input
                  type="text"
                  value={vidDuration}
                  onChange={(e) => setVidDuration(e.target.value)}
                  placeholder="e.g. 1:45"
                  className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-mono tracking-wider text-zinc-500">Producer / Author</label>
              <input
                type="text"
                value={vidAuthor}
                onChange={(e) => setVidAuthor(e.target.value)}
                placeholder="e.g. Staff Explorer"
                className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-mono tracking-wider text-zinc-500">Thumbnail Image URL</label>
              <input
                type="text"
                value={vidThumb}
                onChange={(e) => setVidThumb(e.target.value)}
                placeholder="Optional background card image URL"
                className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-mono tracking-wider text-zinc-500">Narrative Description</label>
              <textarea
                value={vidDesc}
                onChange={(e) => setVidDesc(e.target.value)}
                rows={4}
                placeholder="A detailed narrative of the footage captured..."
                className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-xs leading-relaxed"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-amber-500 text-black py-2.5 rounded font-bold uppercase tracking-wider text-xs transition-colors hover:bg-amber-600"
              >
                {vidId ? "Apply Changes" : "Broadcast Video Stream"}
              </button>
              {vidId && (
                <button
                  type="button"
                  onClick={() => {
                    setVidId("");
                    setVidTitle("");
                    setVidDesc("");
                    setVidUrl("");
                    setVidThumb("");
                    setVidDuration("");
                    setVidAuthor("");
                  }}
                  className="px-4 py-2 bg-zinc-300 dark:bg-zinc-800 hover:bg-zinc-400 dark:hover:bg-zinc-700 text-foreground text-xs uppercase tracking-wider font-mono rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Active Videos Inventory */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h3 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
              <VideoIcon className="text-amber-500 w-5 h-5" /> Video Broadcast Archives ({videos.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((vid) => (
                <div key={vid.id} className="border border-zinc-200 dark:border-zinc-800 bg-background rounded-lg overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="aspect-video relative bg-black">
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 text-[10px] font-mono text-amber-500 font-bold rounded">
                        {vid.duration}
                      </span>
                      <span className="absolute top-2 left-2 bg-amber-500 text-black px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase">
                        {vid.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-serif font-bold text-sm text-foreground line-clamp-1">{vid.title}</h4>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{vid.description}</p>
                      <div className="text-[10px] text-zinc-400 font-mono mt-2">Reporter: {vid.author}</div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-zinc-100 dark:border-zinc-850 flex justify-end gap-2 bg-zinc-50 dark:bg-zinc-900/30">
                    <button
                      onClick={() => handleEditVideoClick(vid)}
                      className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono border border-zinc-300 dark:border-zinc-750 hover:bg-zinc-150 dark:hover:bg-zinc-800 rounded text-foreground"
                    >
                      <Edit className="w-3 h-3 text-blue-500" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteVideo(vid.id)}
                      className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono border border-zinc-300 dark:border-zinc-750 hover:bg-zinc-150 dark:hover:bg-zinc-800 rounded text-rose-500"
                    >
                      <Trash2 className="w-3 h-3" /> Archive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
