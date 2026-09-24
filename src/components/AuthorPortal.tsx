import { useState } from "react";
import { Article, User, Category, ArticleStatus } from "../types";
import {
  Feather,
  FileText,
  CheckCircle,
  Send,
  Save,
  Trash2,
  Edit,
} from "lucide-react";

interface AuthorPortalProps {
  currentUser: User;
  articles: Article[];
  onSaveArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  onExit: () => void;
}

export default function AuthorPortal({
  currentUser,
  articles,
  onSaveArticle,
  onDeleteArticle,
  onExit,
}: AuthorPortalProps) {
  const [artId, setArtId] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("science");
  const [readTime, setReadTime] = useState("5 min read");
  const [sources, setSources] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // Filter articles written by this author (or matching their name)
  const authorArticles = articles.filter(
    (a) => a.authorId === currentUser.id || a.author.toLowerCase() === currentUser.name.toLowerCase()
  );

  const handleSave = (targetStatus: ArticleStatus) => {
    if (!title.trim() || !content.trim()) {
      alert("Please provide at least a Headline Title and Story Body.");
      return;
    }

    const sourceList = sources
      ? sources.split(",").map((s) => s.trim())
      : ["Field Dispatch", "Empirical Observation"];

    const defaultImages = {
      tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
      science: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=1000&auto=format&fit=crop",
      politics: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1000&auto=format&fit=crop",
      culture: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop",
      finance: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1000&auto=format&fit=crop",
    };

    const finalImage = imageUrl.trim() || defaultImages[category];

    const articleToSave: Article = {
      id: artId || `art-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || "A dispatch from field observations.",
      content: content.trim(),
      category: category,
      author: currentUser.name,
      authorId: currentUser.id,
      authorImage: currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      authorBio: currentUser.bio || `${currentUser.name} is an active field contributor with ${currentUser.institution || "Paen Natura"}.`,
      imageUrl: finalImage,
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      readTime: readTime || "5 min read",
      sources: sourceList,
      factChecked: targetStatus === "published",
      objectivityRating: 96,
      likes: 0,
      status: targetStatus,
      submittedAt: targetStatus === "pending_review" ? new Date().toISOString() : undefined,
    };

    onSaveArticle(articleToSave);

    if (targetStatus === "pending_review") {
      triggerSuccess(`Dispatch "${title.substring(0, 24)}..." submitted to Editorial Review Board.`);
    } else {
      triggerSuccess(`Draft saved locally in your Field Desk.`);
    }

    // Reset form
    setArtId("");
    setTitle("");
    setSubtitle("");
    setContent("");
    setSources("");
    setImageUrl("");
  };

  const handleEditClick = (art: Article) => {
    setArtId(art.id);
    setTitle(art.title);
    setSubtitle(art.subtitle);
    setContent(art.content);
    setCategory(art.category);
    setReadTime(art.readTime);
    setSources(art.sources.join(", "));
    setImageUrl(art.imageUrl);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" id="author-field-desk">
      {/* Header */}
      <div className="border-b-2 border-emerald-600 dark:border-emerald-500 pb-5 mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400 font-bold">
              FIELD DESK & AUTHOR STUDIO
            </span>
            <span className="px-2 py-0.5 text-[9px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono font-bold uppercase border border-emerald-600/30">
              Verified Contributor
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-1">
            Welcome, {currentUser.name}
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            {currentUser.institution ? `${currentUser.institution} • ` : ""}Author ID: {currentUser.id}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-mono uppercase tracking-wider font-bold"
          >
            Exit to Broadsheet
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-600 dark:text-emerald-400 p-4 rounded mb-6 flex items-center gap-2 text-sm font-mono animate-pulse">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Story Composition Form */}
        <div className="lg:col-span-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <h3 className="text-lg font-serif font-bold flex items-center gap-2">
              <Feather className="w-4 h-4 text-emerald-600" />
              {artId ? "Edit Field Dispatch" : "Draft New Field Dispatch"}
            </h3>
            <span className="text-[10px] font-mono text-zinc-400">BYLINE: {currentUser.name}</span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">
              Dispatch Headline Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Acoustic Markers in the Primary Canopy"
              className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">
              Decker / Abstract Subtitle
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Executive summary of the field findings"
              className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">
                Field Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="science">Planetary Science</option>
                <option value="tech">Eco-Technology</option>
                <option value="politics">Earth Polity</option>
                <option value="culture">Ecological Culture</option>
                <option value="finance">Green Finance</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">
                Read Time Estimate
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 7 min read"
                className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">
              Telemetry / Photo URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Leave blank for automatic high-resolution field imagery"
              className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">
              Research Citations & Sources (Comma Separated)
            </label>
            <input
              type="text"
              value={sources}
              onChange={(e) => setSources(e.target.value)}
              placeholder="e.g. Juruá Field Station, IUCN Red List Data, NASA MODIS"
              className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">
              Dispatch Body (Markdown / Text)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="Compose your field findings, empirical measurements, and conclusions..."
              className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs leading-relaxed focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleSave("draft")}
              className="flex-1 py-2.5 px-4 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-foreground font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Local Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave("pending_review")}
              className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit to Editorial Board
            </button>
          </div>

          {artId && (
            <button
              type="button"
              onClick={() => {
                setArtId("");
                setTitle("");
                setSubtitle("");
                setContent("");
                setSources("");
                setImageUrl("");
              }}
              className="text-[10px] font-mono text-zinc-400 hover:text-rose-500 uppercase tracking-widest text-center"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* Author Dispatches Inventory */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <h3 className="text-lg font-serif font-bold flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Your Submissions & Dispatches ({authorArticles.length})
            </h3>
            <span className="text-[10px] font-mono text-zinc-400">PUBLISHING PIPELINE</span>
          </div>

          {authorArticles.length === 0 ? (
            <div className="border border-dashed border-zinc-300 dark:border-zinc-800 p-8 text-center bg-zinc-50/50 dark:bg-zinc-950/20">
              <Feather className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
              <h4 className="font-serif font-semibold text-foreground">No Dispatches Created Yet</h4>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Use the form on the left to write your first scientific report or field observation.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {authorArticles.map((art) => {
                const isPending = art.status === "pending_review";
                const isPublished = art.status === "published" || !art.status;

                return (
                  <div
                    key={art.id}
                    className="p-4 border border-zinc-200 dark:border-zinc-800 bg-background rounded flex flex-col gap-2 hover:border-emerald-600/40 transition-all"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[9px] font-mono uppercase px-2 py-0.5 font-bold tracking-wider ${
                              isPublished
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                                : isPending
                                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 animate-pulse"
                                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                            }`}
                          >
                            {isPublished
                              ? "● Live on Broadsheet"
                              : isPending
                              ? "⏳ Under Editorial Review"
                              : "📝 Draft"}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 uppercase">{art.category}</span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-foreground">{art.title}</h4>
                        <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{art.subtitle}</p>
                      </div>

                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => handleEditClick(art)}
                          className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this draft/submission?")) {
                              onDeleteArticle(art.id);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Editorial notes if any */}
                    {art.editorialNotes && (
                      <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] font-mono">
                        <strong>Editorial Note:</strong> {art.editorialNotes}
                      </div>
                    )}

                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-850">
                      <span>{art.date}</span>
                      <span>{art.readTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
