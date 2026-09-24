import React, { useState, useEffect } from "react";
import { User, UserRole } from "../types";
import {
  loadUsers,
  saveUsers,
  loadSiteSettings,
  saveSiteSettings,
  SiteSettings,
  DEFAULT_SITE_SETTINGS,
  setAdminPassword,
} from "../lib/db";
import {
  Users,
  Video as VideoIcon,
  BookOpen,
  KeyRound,
  Shield,
  CheckCircle,
  Clock,
  Trash2,
  RotateCcw,
  Search,
  Save,
  Play,
  UserCheck,
  ArrowLeft,
} from "lucide-react";

interface AdminPortalProps {
  onExit?: () => void;
  articles?: unknown;
  setArticles?: unknown;
  videos?: unknown;
  setVideos?: unknown;
}

export default function AdminPortal({ onExit }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<"users" | "hero_video" | "vol_edition" | "security">("users");
  const [users, setUsers] = useState<User[]>(loadUsers);
  const [searchUser, setSearchUser] = useState("");
  const [siteSettings, setSiteSettingsState] = useState<SiteSettings>(loadSiteSettings);

  // Form states for settings
  const [volumeNumber, setVolumeNumber] = useState(siteSettings.volumeNumber);
  const [issueEdition, setIssueEdition] = useState(siteSettings.issueEdition);
  const [heroVideoUrl, setHeroVideoUrl] = useState(siteSettings.heroVideoUrl);

  // Passcode form
  const [newPass, setNewPass] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    const handleSync = () => {
      setUsers(loadUsers());
      const updated = loadSiteSettings();
      setSiteSettingsState(updated);
      setVolumeNumber(updated.volumeNumber);
      setIssueEdition(updated.issueEdition);
      setHeroVideoUrl(updated.heroVideoUrl);
    };

    window.addEventListener("paen_data_sync", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("paen_data_sync", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  // User Actions
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          role: newRole,
          status: "approved" as const,
        };
      }
      return u;
    });
    setUsers(updated);
    saveUsers(updated);
    showToast(`User role updated to ${newRole.toUpperCase()}`);
  };

  const handleApproveAuthor = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          role: "author" as UserRole,
          status: "approved" as const,
        };
      }
      return u;
    });
    setUsers(updated);
    saveUsers(updated);
    showToast("Author application approved!");
  };

  const handleRejectAuthor = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          role: "user" as UserRole,
          status: "approved" as const,
          requestedRole: undefined,
        };
      }
      return u;
    });
    setUsers(updated);
    saveUsers(updated);
    showToast("Author request declined. User retained as reader.");
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`Remove user "${userName}" from the registry?`)) {
      const updated = users.filter((u) => u.id !== userId);
      setUsers(updated);
      saveUsers(updated);
      showToast(`User ${userName} removed.`);
    }
  };

  // Site Settings Actions
  const handleSaveVideoSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SiteSettings = {
      ...siteSettings,
      heroVideoUrl: heroVideoUrl.trim() || DEFAULT_SITE_SETTINGS.heroVideoUrl,
    };
    setSiteSettingsState(updated);
    saveSiteSettings(updated);
    showToast("Hero background video updated!");
  };

  const handleResetVideo = () => {
    const updated: SiteSettings = {
      ...siteSettings,
      heroVideoUrl: DEFAULT_SITE_SETTINGS.heroVideoUrl,
    };
    setHeroVideoUrl(DEFAULT_SITE_SETTINGS.heroVideoUrl);
    setSiteSettingsState(updated);
    saveSiteSettings(updated);
    showToast("Reset to default lifetime background video.");
  };

  const handleSaveVolEdition = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SiteSettings = {
      ...siteSettings,
      volumeNumber: volumeNumber.trim() || DEFAULT_SITE_SETTINGS.volumeNumber,
      issueEdition: issueEdition.trim() || DEFAULT_SITE_SETTINGS.issueEdition,
    };
    setSiteSettingsState(updated);
    saveSiteSettings(updated);
    showToast("Publication Volume and Edition updated!");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 4) {
      setPassMsg("Password must be at least 4 characters.");
      return;
    }
    setAdminPassword(newPass);
    setNewPass("");
    setPassMsg("Admin password successfully updated.");
    setTimeout(() => setPassMsg(""), 3500);
  };

  // Filter users
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.role.toLowerCase().includes(searchUser.toLowerCase()) ||
      (u.institution && u.institution.toLowerCase().includes(searchUser.toLowerCase()))
  );

  const pendingAuthors = users.filter(
    (u) => u.requestedRole === "author" && u.status === "pending_approval"
  );

  return (
    <div className="w-full bg-[#fafaf8] dark:bg-[#0c0d10] min-h-screen text-zinc-900 dark:text-zinc-100 font-sans pb-24">
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
                OPERATIONAL DESK
              </span>
            </div>
            <p className="text-[10.5px] font-mono text-zinc-400">
              Users • Hero Video • Volume & Edition Controls
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onExit && (
            <button
              onClick={onExit}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-[10.5px] font-mono uppercase tracking-wider font-bold transition-all shadow-sm rounded-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>← Return to Journal</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="max-w-5xl mx-auto px-4 mt-4 animate-in fade-in">
          <div className="p-3 bg-emerald-900/90 border border-emerald-500 text-emerald-100 text-xs font-mono font-bold flex items-center gap-2 shadow-md">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{successToast}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Navigation Tabs - Focused on the 3 core tasks */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-300 dark:border-zinc-800 pb-4 mb-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-all ${
              activeTab === "users"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-250 dark:border-zinc-800"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-500" />
            <span>User Management ({users.length})</span>
            {pendingAuthors.length > 0 && (
              <span className="w-4 h-4 bg-amber-500 text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                {pendingAuthors.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("hero_video")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-all ${
              activeTab === "hero_video"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-250 dark:border-zinc-800"
            }`}
          >
            <VideoIcon className="w-3.5 h-3.5 text-blue-500" />
            <span>Hero Background Video</span>
          </button>

          <button
            onClick={() => setActiveTab("vol_edition")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-all ${
              activeTab === "vol_edition"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-250 dark:border-zinc-800"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>Volume & Edition</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-all ${
              activeTab === "security"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-250 dark:border-zinc-800"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-zinc-500" />
            <span>Admin Passcode</span>
          </button>
        </div>

        {/* ==================================================== */}
        {/* TAB 1: USER MANAGEMENT                               */}
        {/* ==================================================== */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Pending Author Approval Banner */}
            {pendingAuthors.length > 0 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/40">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-mono text-xs uppercase font-bold tracking-wider mb-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Pending Author Approvals ({pendingAuthors.length})</span>
                </div>
                <div className="space-y-2">
                  {pendingAuthors.map((u) => (
                    <div
                      key={u.id}
                      className="p-3 bg-white dark:bg-zinc-900 border border-amber-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                    >
                      <div>
                        <div className="font-serif font-bold text-sm text-foreground">{u.name}</div>
                        <div className="text-xs font-mono text-zinc-500">{u.email}</div>
                        {u.institution && (
                          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                            {u.institution}
                          </div>
                        )}
                        {u.bio && (
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 italic font-light">
                            "{u.bio}"
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApproveAuthor(u.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Approve Author
                        </button>
                        <button
                          onClick={() => handleRejectAuthor(u.id)}
                          className="px-2.5 py-1.5 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono text-xs uppercase"
                        >
                          Keep as Reader
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User Search & Stats Filter */}
            <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter users by name, email, or role..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs font-mono text-foreground focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
                <span>
                  Admins: <strong>{users.filter((u) => u.role === "admin").length}</strong>
                </span>
                <span>•</span>
                <span>
                  Authors: <strong>{users.filter((u) => u.role === "author").length}</strong>
                </span>
                <span>•</span>
                <span>
                  Readers: <strong>{users.filter((u) => u.role === "user").length}</strong>
                </span>
              </div>
            </div>

            {/* Users Roster Table */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-250 dark:border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    <th className="py-2.5 px-4 font-bold">User Identity</th>
                    <th className="py-2.5 px-4 font-bold">Correspondence</th>
                    <th className="py-2.5 px-4 font-bold">Role</th>
                    <th className="py-2.5 px-4 font-bold">Status</th>
                    <th className="py-2.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-sans">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-850/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-serif font-bold text-sm text-foreground">{u.name}</div>
                        {u.institution && (
                          <div className="text-[10px] font-mono text-zinc-500 mt-0.5">{u.institution}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-600 dark:text-zinc-400">
                        {u.email}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                          className={`px-2 py-1 text-[10px] font-mono uppercase font-bold border focus:outline-none ${
                            u.role === "admin"
                              ? "bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-800 dark:text-amber-300"
                              : u.role === "author"
                              ? "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-300"
                              : "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          <option value="user">Reader</option>
                          <option value="author">Author</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold ${
                            u.status === "approved"
                              ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300"
                              : "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1 text-zinc-400 hover:text-rose-600 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs font-mono text-zinc-500">
                        No registered users match your query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: HERO BACKGROUND VIDEO                         */}
        {/* ==================================================== */}
        {activeTab === "hero_video" && (
          <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 space-y-4">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
                  MASTHEAD MEDIA CONFIGURATION
                </span>
                <h3 className="font-serif text-xl font-bold text-foreground">Hero Background Video</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  The primary background video that loops across the NATURUA masthead hero section.
                </p>
              </div>

              {/* Video Preview Box */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                  Active Video Feed Preview:
                </div>
                <div className="relative w-full h-56 sm:h-72 bg-black overflow-hidden border border-zinc-300 dark:border-zinc-700 shadow-inner flex items-center justify-center">
                  <video
                    key={heroVideoUrl}
                    src={heroVideoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-emerald-400 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5">
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>CURRENT FEED ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Video URL Form */}
              <form onSubmit={handleSaveVideoSettings} className="space-y-4 pt-2">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold mb-1">
                    Video Source URL / Local Asset Path
                  </label>
                  <input
                    type="text"
                    value={heroVideoUrl}
                    onChange={(e) => setHeroVideoUrl(e.target.value)}
                    placeholder="/assets/eagle-flying.mp4"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 font-mono text-xs text-foreground focus:outline-none focus:border-emerald-600"
                    required
                  />
                  <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>Default Lifetime Video: <code>/assets/eagle-flying.mp4</code></span>
                    <button
                      type="button"
                      onClick={handleResetVideo}
                      className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset to Default
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Video Settings</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: VOLUME NUMBER & EDITION                       */}
        {/* ==================================================== */}
        {activeTab === "vol_edition" && (
          <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 space-y-4">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
                  PUBLICATION METADATA
                </span>
                <h3 className="font-serif text-xl font-bold text-foreground">Volume & Edition Header</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  Adjust the masthead volume number and edition subtitle printed across the front page.
                </p>
              </div>

              {/* Live Preview Card */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                  Live Masthead Display Preview:
                </div>
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 text-[10px] font-mono">
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    PAEN / <span className="text-amber-600 dark:text-amber-400">{issueEdition || "SPECIAL FIELD EDITION"}</span>
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold">
                    {volumeNumber || "VOL. 1"}
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveVolEdition} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold mb-1">
                      Volume Identifier
                    </label>
                    <input
                      type="text"
                      value={volumeNumber}
                      onChange={(e) => setVolumeNumber(e.target.value)}
                      placeholder="e.g. VOL. 1 or VOL. XXIV"
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 font-mono text-xs text-foreground focus:outline-none focus:border-amber-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold mb-1">
                      Edition Tagline
                    </label>
                    <input
                      type="text"
                      value={issueEdition}
                      onChange={(e) => setIssueEdition(e.target.value)}
                      placeholder="e.g. SPECIAL FIELD EDITION"
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 font-mono text-xs text-foreground focus:outline-none focus:border-amber-600"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Apply Publication Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: ADMIN PASSCODE                                */}
        {/* ==================================================== */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 space-y-4">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                  ADMIN PASSCODE & CREDENTIALS
                </span>
                <h3 className="font-serif text-xl font-bold text-foreground">Update Admin Passcode</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  Change the root administrative access code for the on-site desk.
                </p>
              </div>

              {passMsg && (
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-400 text-emerald-800 dark:text-emerald-300 text-xs font-mono">
                  {passMsg}
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold mb-1">
                    New Admin Passcode
                  </label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Enter at least 4 characters..."
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 font-mono text-xs text-foreground focus:outline-none focus:border-amber-600"
                    required
                  />
                  <p className="text-[10px] font-mono text-zinc-400 mt-1">Current default passcode: <code>paen123</code></p>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-mono text-xs uppercase tracking-wider font-bold"
                >
                  Update Passcode
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
