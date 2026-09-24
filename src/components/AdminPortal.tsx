import React, { useState } from "react";
import { Article, Video, Category, User, UserRole, UserStatus } from "../types";
import {
  Trash2,
  Edit,
  FileText,
  Video as VideoIcon,
  CheckCircle,
  KeyRound,
  Users,
  UserCheck,
  Shield,
  Clock,
  Search,
} from "lucide-react";
import { loadUsers, saveUsers, setAdminPassword } from "../lib/db";

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
  const [activeTab, setActiveTab] = useState<"articles" | "videos" | "users" | "security">("articles");
  const [successMsg, setSuccessMsg] = useState("");

  // Users state
  const [usersList, setUsersList] = useState<User[]>(() => loadUsers());
  const [userSearch, setUserSearch] = useState("");

  // Passcode rotation state
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
  const [artStatus, setArtStatus] = useState<"published" | "pending_review" | "draft">("published");
  const [artNotes, setArtNotes] = useState("");

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

  const pendingUsers = usersList.filter(
    (u) => u.status === "pending_approval" || (u.requestedRole === "author" && u.role !== "author")
  );

  const pendingArticles = articles.filter((a) => a.status === "pending_review");
  const publishedArticles = articles.filter((a) => a.status !== "pending_review");

  // User Management Actions
  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    const updated = usersList.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          role: newRole,
          status: "approved" as UserStatus,
          requestedRole: undefined,
        };
      }
      return u;
    });
    setUsersList(updated);
    saveUsers(updated);
    triggerSuccess(`Role updated to ${newRole.toUpperCase()} for user.`);
  };

  const handleUpdateUserStatus = (userId: string, newStatus: UserStatus) => {
    const updated = usersList.map((u) => {
      if (u.id === userId) {
        return { ...u, status: newStatus };
      }
      return u;
    });
    setUsersList(updated);
    saveUsers(updated);
    triggerSuccess(`Status updated to ${newStatus.toUpperCase()}`);
  };

  const handleApproveAuthor = (user: User) => {
    const updated = usersList.map((u) => {
      if (u.id === user.id) {
        return {
          ...u,
          role: "author" as UserRole,
          status: "approved" as UserStatus,
          requestedRole: undefined,
        };
      }
      return u;
    });
    setUsersList(updated);
    saveUsers(updated);
    triggerSuccess(`Approved ${user.name} as Author. Contributor desk unlocked.`);
  };

  const handleDeclineAuthor = (user: User) => {
    const updated = usersList.map((u) => {
      if (u.id === user.id) {
        return {
          ...u,
          role: "user" as UserRole,
          status: "approved" as UserStatus,
          requestedRole: undefined,
        };
      }
      return u;
    });
    setUsersList(updated);
    saveUsers(updated);
    triggerSuccess(`Assigned ${user.name} as Reader.`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to remove this user account from the registry?")) {
      const updated = usersList.filter((u) => u.id !== userId);
      setUsersList(updated);
      saveUsers(updated);
      triggerSuccess("User removed from registry.");
    }
  };

  // Review Queue Actions
  const handleApproveArticle = (art: Article) => {
    const updated = articles.map((a) =>
      a.id === art.id
        ? {
            ...a,
            status: "published" as const,
            factChecked: true,
            editorialNotes: undefined,
          }
        : a
    );
    setArticles(updated);
    triggerSuccess(`Approved and Published "${art.title.substring(0, 24)}..." to Frontpage.`);
  };

  const handleRejectArticle = (art: Article) => {
    const note = prompt("Enter optional editorial feedback for the author:", "Needs additional field citations.");
    const updated = articles.map((a) =>
      a.id === art.id
        ? {
            ...a,
            status: "draft" as const,
            editorialNotes: note || "Returned by editor for revisions.",
          }
        : a
    );
    setArticles(updated);
    triggerSuccess(`Returned "${art.title.substring(0, 20)}..." to author draft queue.`);
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

    setAdminPassword(newPasscode);
    triggerSuccess("ADMIN PASSCODE ROTATED SUCCESSFULLY");
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
              status: artStatus,
              editorialNotes: artNotes || undefined,
            }
          : art
      );
      setArticles(updated);
      triggerSuccess(`Article "${artTitle.substring(0, 20)}..." updated.`);
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
        status: artStatus,
        editorialNotes: artNotes || undefined,
      };
      setArticles([newArt, ...articles]);
      triggerSuccess(`Article "${artTitle.substring(0, 20)}..." created.`);
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
    setArtStatus("published");
    setArtNotes("");
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
    setArtStatus(art.status || "published");
    setArtNotes(art.editorialNotes || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      triggerSuccess(`Video "${vidTitle.substring(0, 20)}..." updated.`);
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
      triggerSuccess(`Video "${vidTitle.substring(0, 20)}..." uploaded.`);
    }

    setVidId("");
    setVidTitle("");
    setVidDesc("");
    setVidUrl("");
    setVidThumb("");
    setVidDuration("");
    setVidAuthor("");
  };

  const filteredUsers = usersList.filter((u) => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      (u.institution && u.institution.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" id="admin-panel">
      {/* Header */}
      <div className="border-b-2 border-amber-500 pb-4 mb-8 flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-500 font-bold">
            PAEN PRESS GOVERNANCE CENTER
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            Editorial & Role Management Portal
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            Administer publication dispatches, video streams, user roles, and passcode security.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2">
          <button
            id="tab-btn-articles"
            onClick={() => setActiveTab("articles")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-mono border transition-all ${
              activeTab === "articles"
                ? "bg-amber-500 text-black border-amber-500 font-bold"
                : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Articles
            {pendingArticles.length > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[9px] font-bold">
                {pendingArticles.length}
              </span>
            )}
          </button>

          <button
            id="tab-btn-users"
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-mono border transition-all ${
              activeTab === "users"
                ? "bg-amber-500 text-black border-amber-500 font-bold"
                : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Roles & Users
            {pendingUsers.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-600 text-black rounded-full text-[9px] font-bold">
                {pendingUsers.length}
              </span>
            )}
          </button>

          <button
            id="tab-btn-videos"
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-mono border transition-all ${
              activeTab === "videos"
                ? "bg-amber-500 text-black border-amber-500 font-bold"
                : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
            }`}
          >
            <VideoIcon className="w-3.5 h-3.5" /> Broadcasts
          </button>

          <button
            id="tab-btn-security"
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-mono border transition-all ${
              activeTab === "security"
                ? "bg-amber-500 text-black border-amber-500 font-bold"
                : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" /> Passcode Security
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="px-3 py-2 border border-zinc-400 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-mono uppercase font-bold"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-600 dark:text-emerald-400 p-4 rounded mb-6 flex items-center gap-2 text-sm font-mono animate-pulse">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB 1: ARTICLES & EDITORIAL REVIEW QUEUE */}
      {activeTab === "articles" && (
        <div className="space-y-8">
          {/* Pending Submissions Queue */}
          {pendingArticles.length > 0 && (
            <div className="border border-amber-500/50 bg-amber-500/5 p-6 rounded">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
                  Editorial Review Queue ({pendingArticles.length} Submissions Awaiting Approval)
                </h3>
                <span className="text-[10px] font-mono uppercase bg-amber-500 text-black px-2 py-0.5 font-bold">
                  Action Required
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingArticles.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 border border-amber-500/30 bg-background rounded flex flex-col justify-between gap-3 shadow-sm"
                  >
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mb-1">
                        <span>BYLINE: {art.author}</span>
                        <span className="uppercase text-amber-600 font-bold">{art.category}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-foreground">{art.title}</h4>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{art.subtitle}</p>
                      <div className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-2 p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 line-clamp-3 font-mono">
                        {art.content}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        onClick={() => handleEditArticleClick(art)}
                        className="px-2.5 py-1 text-[10px] font-mono border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded uppercase font-bold text-foreground"
                      >
                        Inspect & Edit
                      </button>
                      <button
                        onClick={() => handleRejectArticle(art)}
                        className="px-2.5 py-1 text-[10px] font-mono bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 rounded uppercase font-bold"
                      >
                        Request Revisions
                      </button>
                      <button
                        onClick={() => handleApproveArticle(art)}
                        className="px-3 py-1 text-[10px] font-mono bg-emerald-600 hover:bg-emerald-700 text-white rounded uppercase font-bold flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve & Publish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Article Composer and Inventory Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form */}
            <form
              onSubmit={handleSaveArticle}
              className="lg:col-span-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded shadow-sm flex flex-col gap-4"
            >
              <h3 className="text-lg font-serif font-bold border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-2">
                {artId ? "✏️ Edit Broadsheet Article" : "✍️ Compose Article (Direct Publish)"}
              </h3>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold">
                  Headline Title
                </label>
                <input
                  type="text"
                  value={artTitle}
                  onChange={(e) => setArtTitle(e.target.value)}
                  placeholder="e.g. The Quantum Shift in Biosphere Monitoring"
                  className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-xs font-serif"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold">
                  Decker Subtitle
                </label>
                <input
                  type="text"
                  value={artSubtitle}
                  onChange={(e) => setArtSubtitle(e.target.value)}
                  placeholder="A summary of the central journalistic investigation"
                  className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 focus:ring-1 focus:ring-amber-500 focus:outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold">
                    Category
                  </label>
                  <select
                    value={artCategory}
                    onChange={(e) => setArtCategory(e.target.value as Category)}
                    className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs font-mono"
                  >
                    <option value="tech">Eco-Tech</option>
                    <option value="science">Planetary Science</option>
                    <option value="politics">Earth Polity</option>
                    <option value="culture">Ecological Culture</option>
                    <option value="finance">Green Finance</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold">
                    Byline Author
                  </label>
                  <input
                    type="text"
                    value={artAuthor}
                    onChange={(e) => setArtAuthor(e.target.value)}
                    placeholder="e.g. Alastair Vance"
                    className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={artReadTime}
                    onChange={(e) => setArtReadTime(e.target.value)}
                    placeholder="e.g. 6 min read"
                    className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold">
                    Objectivity Rating (%)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={artObjectivity}
                    onChange={(e) => setArtObjectivity(Number(e.target.value))}
                    className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold">
                  Publication Status
                </label>
                <select
                  value={artStatus}
                  onChange={(e) => setArtStatus(e.target.value as "published" | "pending_review" | "draft")}
                  className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs font-mono"
                >
                  <option value="published">Published (Live on Frontpage)</option>
                  <option value="pending_review">Pending Editorial Review</option>
                  <option value="draft">Draft (Unpublished)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold">
                  Image Cover URL
                </label>
                <input
                  type="text"
                  value={artImageUrl}
                  onChange={(e) => setArtImageUrl(e.target.value)}
                  placeholder="Leave blank for high-res stock based on category"
                  className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold">
                  Verification Sources (Comma separated)
                </label>
                <input
                  type="text"
                  value={artSources}
                  onChange={(e) => setArtSources(e.target.value)}
                  placeholder="Source Alpha, Source Beta, Editorial Review"
                  className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold">
                  Story Content (Markdown / Text)
                </label>
                <textarea
                  value={artContent}
                  onChange={(e) => setArtContent(e.target.value)}
                  rows={8}
                  placeholder="Write the full report here..."
                  className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs leading-relaxed font-mono"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 text-black py-2.5 rounded font-bold uppercase tracking-wider text-xs transition-colors hover:bg-amber-600 font-mono"
                >
                  {artId ? "Save Article Changes" : "Deploy Live Article"}
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
                      setArtStatus("published");
                    }}
                    className="px-4 py-2 bg-zinc-300 dark:bg-zinc-800 hover:bg-zinc-400 text-foreground text-xs uppercase tracking-wider font-mono rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Inventory Table */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <h3 className="text-lg font-serif font-bold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="text-amber-500 w-5 h-5" /> All Publications ({articles.length})
                </span>
                <span className="text-xs font-mono text-zinc-400 font-normal">
                  {publishedArticles.length} Live • {pendingArticles.length} Pending
                </span>
              </h3>

              <div className="border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden max-h-[750px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-100 dark:bg-zinc-850 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-mono uppercase tracking-wider">
                      <th className="p-3">Title & Status</th>
                      <th className="p-3">Author</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {articles.map((art) => {
                      const isPending = art.status === "pending_review";
                      return (
                        <tr key={art.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                          <td className="p-3">
                            <div className="font-semibold text-foreground truncate max-w-xs">{art.title}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className={`text-[9px] font-mono uppercase px-1.5 py-0.2 font-bold ${
                                  isPending
                                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                                    : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                                }`}
                              >
                                {art.status || "published"}
                              </span>
                              <span className="text-[10px] text-zinc-400 font-mono">{art.readTime}</span>
                            </div>
                          </td>
                          <td className="p-3 font-mono">{art.author}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded font-mono uppercase font-bold">
                              {art.category}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleEditArticleClick(art)}
                                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-blue-500 rounded"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(art.id)}
                                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-rose-500 rounded"
                                title="Retract"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER & ROLE MANAGEMENT (Assigned in Admin Panel) */}
      {activeTab === "users" && (
        <div className="space-y-8">
          {/* Pending Author Applications Review Banner */}
          {pendingUsers.length > 0 ? (
            <div className="border border-amber-500/50 bg-amber-500/5 p-6 rounded">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
                    Pending Author Applications ({pendingUsers.length})
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">
                    Authors were informed upon sign-up of a slight delay until your approval here.
                  </p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-mono uppercase bg-amber-500 text-black font-bold">
                  Awaiting Editorial Grant
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingUsers.map((applicant) => (
                  <div
                    key={applicant.id}
                    className="p-4 border border-amber-500/30 bg-background rounded flex flex-col justify-between gap-3 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-base text-foreground">{applicant.name}</h4>
                        <span className="text-[10px] font-mono text-zinc-400">{applicant.createdAt}</span>
                      </div>
                      <p className="text-xs font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {applicant.email} {applicant.institution && `• ${applicant.institution}`}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-2 italic bg-zinc-50 dark:bg-zinc-900/50 p-2.5 border border-zinc-200 dark:border-zinc-800">
                        "{applicant.bio || "No biographical statement provided."}"
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        onClick={() => handleDeclineAuthor(applicant)}
                        className="px-3 py-1 text-[10px] font-mono border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded uppercase font-bold text-zinc-600 dark:text-zinc-400"
                      >
                        Keep as Reader
                      </button>
                      <button
                        onClick={() => handleApproveAuthor(applicant)}
                        className="px-3.5 py-1 text-[10px] font-mono bg-emerald-700 hover:bg-emerald-800 text-white rounded uppercase font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Approve as Author
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              All author applications have been processed. You can reassign any user role below.
            </div>
          )}

          {/* All Registered Users Directory */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" /> All Registered Users ({usersList.length})
                </h3>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">
                  Assign or change user roles (`Reader`, `Author`, `Admin`) dynamically.
                </p>
              </div>

              {/* Search */}
              <div className="flex items-center border border-zinc-300 dark:border-zinc-700 bg-background px-3 py-1.5 rounded w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-400 mr-2" />
                <input
                  type="text"
                  placeholder="Filter users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full text-xs bg-transparent text-foreground focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 rounded overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-100 dark:bg-zinc-850 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-mono uppercase tracking-wider">
                    <th className="p-3">User & Email</th>
                    <th className="p-3">Assigned Role</th>
                    <th className="p-3">Account Status</th>
                    <th className="p-3">Affiliation</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-850/50">
                      <td className="p-3">
                        <div className="font-bold text-foreground flex items-center gap-2">
                          {u.name}
                          {u.role === "admin" && (
                            <span className="text-[9px] font-mono bg-amber-500 text-black px-1.5 py-0.2 font-bold">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">{u.email}</div>
                      </td>

                      {/* Role Dropdown */}
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateUserRole(u.id, e.target.value as UserRole)}
                          className="px-2.5 py-1 text-xs font-mono border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 font-bold focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="user">Reader (User)</option>
                          <option value="author">Field Author</option>
                          <option value="admin">Editor-in-Chief (Admin)</option>
                        </select>
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-3">
                        <select
                          value={u.status}
                          onChange={(e) => handleUpdateUserStatus(u.id, e.target.value as UserStatus)}
                          className={`px-2 py-1 text-[11px] font-mono border rounded bg-background font-medium ${
                            u.status === "approved"
                              ? "text-emerald-600 border-emerald-500/30"
                              : u.status === "pending_approval"
                              ? "text-amber-600 border-amber-500/30 font-bold"
                              : "text-rose-600 border-rose-500/30"
                          }`}
                        >
                          <option value="approved">Approved</option>
                          <option value="pending_approval">Pending Approval</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </td>

                      <td className="p-3 text-zinc-500 font-mono text-[11px]">
                        {u.institution || "Independent"}
                      </td>

                      <td className="p-3 text-right">
                        {u.role !== "admin" && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-500 rounded transition-colors"
                            title="Remove User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VIDEO BROADCASTS */}
      {activeTab === "videos" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleSaveVideo}
            className="lg:col-span-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded shadow-sm flex flex-col gap-4"
          >
            <h3 className="text-lg font-serif font-bold border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-2">
              {vidId ? "✏️ Edit Video Meta" : "📹 Upload Broadcast Video"}
            </h3>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold">
                Video Title
              </label>
              <input
                type="text"
                value={vidTitle}
                onChange={(e) => setVidTitle(e.target.value)}
                placeholder="e.g. Expedition Amazon Acoustic Setup"
                className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold">
                Stream Source (MP4 Direct URL)
              </label>
              <input
                type="text"
                value={vidUrl}
                onChange={(e) => setVidUrl(e.target.value)}
                placeholder="e.g. https://vjs.zencdn.net/v/oceans.mp4"
                className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold">
                  Category
                </label>
                <select
                  value={vidCategory}
                  onChange={(e) => setVidCategory(e.target.value as Category)}
                  className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs font-mono"
                >
                  <option value="science">Planetary Science</option>
                  <option value="tech">Eco-Tech</option>
                  <option value="politics">Earth Polity</option>
                  <option value="culture">Ecological Culture</option>
                  <option value="finance">Green Finance</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold">
                  Duration (MM:SS)
                </label>
                <input
                  type="text"
                  value={vidDuration}
                  onChange={(e) => setVidDuration(e.target.value)}
                  placeholder="e.g. 1:45"
                  className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold">
                Producer / Author
              </label>
              <input
                type="text"
                value={vidAuthor}
                onChange={(e) => setVidAuthor(e.target.value)}
                placeholder="e.g. Staff Explorer"
                className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold">
                Narrative Description
              </label>
              <textarea
                value={vidDesc}
                onChange={(e) => setVidDesc(e.target.value)}
                rows={3}
                placeholder="A detailed description of the video stream..."
                className="px-3 py-2 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs"
              />
            </div>

            <button
              type="submit"
              className="bg-amber-500 text-black py-2.5 rounded font-bold uppercase tracking-wider text-xs transition-colors hover:bg-amber-600 font-mono"
            >
              {vidId ? "Apply Changes" : "Broadcast Video Stream"}
            </button>
          </form>

          {/* Videos List */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="border border-zinc-200 dark:border-zinc-800 bg-background rounded overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video relative bg-black">
                    <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover opacity-80" />
                    <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 text-[10px] font-mono text-amber-500 font-bold">
                      {vid.duration}
                    </span>
                  </div>
                  <div className="p-3">
                    <h4 className="font-serif font-bold text-sm text-foreground">{vid.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{vid.description}</p>
                  </div>
                </div>
                <div className="p-2.5 border-t border-zinc-100 dark:border-zinc-850 flex justify-end gap-2 bg-zinc-50 dark:bg-zinc-900/30">
                  <button
                    onClick={() => {
                      if (confirm("Archive this video?")) {
                        setVideos(videos.filter((v) => v.id !== vid.id));
                      }
                    }}
                    className="text-xs font-mono text-rose-500 hover:underline"
                  >
                    Archive
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PASSCODE SECURITY */}
      {activeTab === "security" && (
        <div className="max-w-xl mx-auto bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-600 rounded">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-foreground">Change Generic Admin Password</h3>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                Current generic password can be rotated here anytime.
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
            As the administrator, you can update the system passcode. Once rotated, new sign-ins will require this updated passcode signature.
          </p>

          {passcodeError && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono text-center uppercase tracking-wider">
              {passcodeError}
            </div>
          )}

          <form onSubmit={handleRotatePasscode} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                New Admin Passcode
              </label>
              <input
                type="password"
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                placeholder="Enter new strong passcode..."
                className="px-3 py-2.5 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                Confirm New Admin Passcode
              </label>
              <input
                type="password"
                value={confirmPasscode}
                onChange={(e) => setConfirmPasscode(e.target.value)}
                placeholder="Repeat new passcode..."
                className="px-3 py-2.5 border rounded bg-background text-foreground border-zinc-300 dark:border-zinc-700 text-xs font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-black py-3 font-mono uppercase text-xs tracking-widest font-bold mt-2 shadow"
            >
              Apply Passcode Rotation
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
