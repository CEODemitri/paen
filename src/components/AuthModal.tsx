import React, { useState } from "react";
import { User, UserRole } from "../types";
import {
  loadUsers,
  saveUsers,
  saveCurrentUser,
  getAdminPassword,
} from "../lib/db";
import {
  X,
  Feather,
  Shield,
  BookOpen,
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User | null;
  onUserChange?: (user: User | null) => void;
  onLoginSuccess?: (user: User) => void;
  onOpenAdminPortal?: () => void;
  onOpenAuthorPortal?: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  onLoginSuccess,
  onOpenAdminPortal,
  onOpenAuthorPortal,
}: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [bio, setBio] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [errorMessage, setErrorMessage] = useState("");
  const [authorAlertBanner, setAuthorAlertBanner] = useState<string | null>(null);

  if (!isOpen) return null;

  const notifySuccess = (user: User) => {
    if (onLoginSuccess) onLoginSuccess(user);
    if (onUserChange) onUserChange(user);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const users = loadUsers();
    const adminPass = getAdminPassword();

    // Check for admin login with email or 'admin'
    const trimmedEmail = email.trim().toLowerCase();
    if (
      (trimmedEmail === "admin@paen.earth" || trimmedEmail === "admin") &&
      password === adminPass
    ) {
      const adminUser = users.find((u) => u.role === "admin") || {
        id: "usr-admin-1",
        name: "Editor-in-Chief (Admin)",
        email: "admin@paen.earth",
        role: "admin" as UserRole,
        status: "approved" as const,
        bio: "Chief Editorial Director of Paen Natura Press Board.",
        createdAt: "July 1, 2026",
      };
      saveCurrentUser(adminUser);
      notifySuccess(adminUser);
      onClose();
      return;
    }

    // Standard user match
    const found = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!found) {
      setErrorMessage("No credential found matching this correspondence address.");
      return;
    }

    // If matching user is admin, verify with adminPass
    if (found.role === "admin") {
      if (password === adminPass || password === found.password) {
        saveCurrentUser(found);
        notifySuccess(found);
        onClose();
      } else {
        setErrorMessage("AUTHENTICATION REFUSED: Admin passcode mismatch.");
      }
      return;
    }

    if (found.password && found.password !== password) {
      setErrorMessage("AUTHENTICATION REFUSED: Password signature mismatch.");
      return;
    }

    saveCurrentUser(found);
    notifySuccess(found);
    onClose();
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Please furnish your full name, correspondence address, and password.");
      return;
    }

    const users = loadUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      setErrorMessage("An account with this email address already exists. Please sign in.");
      return;
    }

    const isAuthorRequest = selectedRole === "author";
    const isReader = selectedRole === "user";

    // New user definition:
    // If author requested -> role is set to user initially with requestedRole='author' and status='pending_approval'
    // until Admin approves in Admin panel!
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: isReader ? "user" : "user", // Granted reader immediately, author is pending
      requestedRole: isAuthorRequest ? "author" : undefined,
      status: isAuthorRequest ? "pending_approval" : "approved",
      bio: bio.trim() || (isAuthorRequest ? "Field contributor awaiting editorial verification." : "Reader of botanical & planetary journals."),
      institution: institution.trim(),
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      avatarUrl: isAuthorRequest
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    saveCurrentUser(newUser);
    notifySuccess(newUser);

    if (isAuthorRequest) {
      setAuthorAlertBanner(
        "AUTHOR APPLICATION RECEIVED: Your request for Field Contributor privileges has been recorded. As with all academic journals, there will be a slight delay until an administrator approves your author credentials in the Admin panel. You have immediate Reader access in the interim."
      );
    } else {
      onClose();
    }
  };

  const handleQuickLogin = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
  };

  const handleSignOut = () => {
    saveCurrentUser(null);
    if (onUserChange) onUserChange(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#faf9f5] dark:bg-[#0c140f] border border-emerald-600/30 dark:border-emerald-500/20 shadow-2xl relative p-6 md:p-8 text-foreground"
        id="auth-identity-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-rose-500 transition-colors"
          title="Close Identity Window"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Current Active Account Overview if Logged In */}
        {currentUser ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
              <div className="w-14 h-14 bg-emerald-700/15 border border-emerald-600/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-serif font-bold text-xl rounded-full overflow-hidden">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  currentUser.name.charAt(0)
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl font-bold text-foreground">{currentUser.name}</h3>
                  <span
                    className={`text-[9px] font-mono uppercase px-2 py-0.5 font-bold tracking-wider rounded-none ${
                      currentUser.role === "admin"
                        ? "bg-amber-500 text-black"
                        : currentUser.role === "author"
                        ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-black"
                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {currentUser.role.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs font-mono text-zinc-500">{currentUser.email}</p>
                {currentUser.institution && (
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">{currentUser.institution}</p>
                )}
              </div>
            </div>

            {/* Author Status Alert if Pending */}
            {currentUser.requestedRole === "author" && currentUser.status === "pending_approval" && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-mono flex items-start gap-2.5">
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <strong className="block uppercase font-bold tracking-wider mb-0.5">Author Credential Pending</strong>
                  Your field author application is in the editorial review queue. An administrator will review and approve your role in the Admin Panel.
                </div>
              </div>
            )}

            {/* Quick Actions for Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentUser.role === "admin" && onOpenAdminPortal && (
                <button
                  onClick={() => {
                    onOpenAdminPortal();
                    onClose();
                  }}
                  className="col-span-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-black font-mono font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" /> Open Editorial Admin Panel
                </button>
              )}

              {currentUser.role === "author" && onOpenAuthorPortal && (
                <button
                  onClick={() => {
                    onOpenAuthorPortal();
                    onClose();
                  }}
                  className="col-span-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2"
                >
                  <Feather className="w-4 h-4" /> Open Field Desk (Composer)
                </button>
              )}

              <button
                onClick={handleSignOut}
                className="col-span-full py-2 px-4 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono uppercase text-xs tracking-wider"
              >
                Relinquish Session (Sign Out)
              </button>
            </div>
          </div>
        ) : authorAlertBanner ? (
          /* Prominent Author Application Delay Notification Banner */
          <div className="text-center py-4 space-y-5 animate-in fade-in">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-600">
              <Clock className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400 font-bold block mb-1">
                EDITORIAL VERIFICATION PROTOCOL
              </span>
              <h3 className="font-serif text-2xl font-semibold text-foreground">Author Application Submitted</h3>
            </div>
            <div className="p-4 bg-amber-500/10 border border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs font-mono text-left leading-relaxed">
              <p className="font-semibold mb-2">⏳ Slight Delay Notice for Authors:</p>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-300">
                To maintain botanical and scientific integrity, all author accounts require administrative assignment.
                Your profile is now registered with <strong>Reader privileges</strong> while your author request is evaluated in the Admin Panel.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 font-mono uppercase text-xs tracking-widest font-bold"
            >
              Continue to Journal as Reader
            </button>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <div>
            {/* Header branding */}
            <div className="text-center mb-6">
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-400 font-bold block mb-1">
                PAEN NATURA IDENTITY REGISTRY
              </span>
              <h3 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                {tab === "signin" ? "Sign In to Registry" : "Create Ecological Credential"}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-light">
                {tab === "signin"
                  ? "Access your saved archives, field submissions, or editorial controls."
                  : "Register as a journal Reader or apply for Field Author credentials."}
              </p>
            </div>

            {/* Tab switchers */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-5">
              <button
                onClick={() => {
                  setTab("signin");
                  setErrorMessage("");
                }}
                className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 ${
                  tab === "signin"
                    ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                    : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setTab("signup");
                  setErrorMessage("");
                }}
                className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 ${
                  tab === "signup"
                    ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                    : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                Register Account
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono text-center uppercase tracking-wider">
                {errorMessage}
              </div>
            )}

            {tab === "signin" ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                    Email / Address
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alastair@bioacoustic.org or admin"
                    className="px-3 py-2 bg-background text-foreground border border-zinc-300 dark:border-zinc-800 focus:border-emerald-600 focus:outline-none text-xs font-mono"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                      Password / Passcode
                    </label>
                    <span className="text-[9px] font-mono text-zinc-400">Admin default: paen123</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password..."
                      className="w-full px-3 py-2 bg-background text-foreground border border-zinc-300 dark:border-zinc-800 focus:border-emerald-600 focus:outline-none text-xs font-mono pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 font-mono uppercase text-xs tracking-widest font-bold mt-2"
                >
                  Authenticate Credential
                </button>

                {/* Preset Quick Login Buttons for Demo Convenience */}
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block mb-2 font-bold">
                    PRESET DEMO ACCOUNTS:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("admin@paen.earth", getAdminPassword())}
                      className="p-1.5 border border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-center"
                    >
                      🛡️ Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("alastair@bioacoustic.org", "author123")}
                      className="p-1.5 border border-emerald-600/40 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-center"
                    >
                      ✍️ Author
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("eleanor@library.earth", "reader123")}
                      className="p-1.5 border border-zinc-400/40 bg-zinc-500/5 hover:bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 font-bold text-center"
                    >
                      📖 Reader
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* Sign Up Form */
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Jane Goodall"
                      className="px-3 py-2 bg-background text-foreground border border-zinc-300 dark:border-zinc-800 focus:border-emerald-600 focus:outline-none text-xs font-mono"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                      Affiliation / Institution
                    </label>
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. Botanical Institute"
                      className="px-3 py-2 bg-background text-foreground border border-zinc-300 dark:border-zinc-800 focus:border-emerald-600 focus:outline-none text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. reporter@ecojournal.org"
                    className="px-3 py-2 bg-background text-foreground border border-zinc-300 dark:border-zinc-800 focus:border-emerald-600 focus:outline-none text-xs font-mono"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create secure passcode..."
                    className="px-3 py-2 bg-background text-foreground border border-zinc-300 dark:border-zinc-800 focus:border-emerald-600 focus:outline-none text-xs font-mono"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                    Bio Statement (Optional)
                  </label>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Field researcher, ecologist, or enthusiast..."
                    className="px-3 py-2 bg-background text-foreground border border-zinc-300 dark:border-zinc-800 focus:border-emerald-600 focus:outline-none text-xs font-mono"
                  />
                </div>

                {/* Role Selection with Clear Author Alert */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                    Requested Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedRole("user")}
                      className={`p-3 text-left border transition-all ${
                        selectedRole === "user"
                          ? "border-emerald-600 bg-emerald-500/10"
                          : "border-zinc-300 dark:border-zinc-800 opacity-65 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-foreground">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Reader
                      </div>
                      <span className="text-[10px] text-zinc-500 block mt-1 leading-tight">
                        Immediate public reading, bookmarks, and comments.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole("author")}
                      className={`p-3 text-left border transition-all ${
                        selectedRole === "author"
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-zinc-300 dark:border-zinc-800 opacity-65 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-foreground">
                        <Feather className="w-3.5 h-3.5 text-amber-600" /> Field Author
                      </div>
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 block mt-1 leading-tight font-medium">
                        Requires Admin Approval. (Approval delay applies)
                      </span>
                    </button>
                  </div>
                </div>

                {/* Explicit Notice when Author is selected */}
                {selectedRole === "author" && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] font-mono flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <strong className="block uppercase font-bold tracking-wider">Editorial Verification Required</strong>
                      Author roles are assigned in the Admin panel. You will be alerted upon sign-up of a slight delay until an editor reviews your credential.
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 font-mono uppercase text-xs tracking-widest font-bold mt-2"
                >
                  {selectedRole === "author" ? "Submit Author Registration" : "Register Reader Credential"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
