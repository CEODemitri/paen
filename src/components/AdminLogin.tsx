import { useState, useEffect } from "react";
import { KeyRound, Lock, ShieldCheck, X, Eye, EyeOff } from "lucide-react";

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLogin({ isOpen, onClose, onLoginSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const DEFAULT_PASS = "paen123";

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setSuccessMessage("");
      setIsFirstTimeSetup(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getStoredPassword = () => {
    return localStorage.getItem("paen_admin_password") || DEFAULT_PASS;
  };

  const getHasChangedPassword = () => {
    return localStorage.getItem("paen_has_changed_password") === "true";
  };

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const storedPassword = getStoredPassword();
    const hasChanged = getHasChangedPassword();

    if (password === storedPassword) {
      if (password === DEFAULT_PASS && !hasChanged) {
        // Force password change on first-time login
        setIsFirstTimeSetup(true);
      } else {
        // Normal successful login
        onLoginSuccess();
        onClose();
      }
    } else {
      setError("AUTHENTICATION REFUSED: Passcode signature mismatch.");
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 4) {
      setError("Passcode must be at least 4 characters.");
      return;
    }

    if (newPassword === DEFAULT_PASS) {
      setError("Cannot reuse the default temporary passcode.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passcodes do not match.");
      return;
    }

    // Save password
    localStorage.setItem("paen_admin_password", newPassword);
    localStorage.setItem("paen_has_changed_password", "true");
    
    setSuccessMessage("PASSCODE ROTATED SUCCESSFULLY");
    
    setTimeout(() => {
      onLoginSuccess();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#faf9f5] dark:bg-[#0c140f] border border-emerald-600/30 dark:border-emerald-500/20 shadow-2xl relative p-8 text-foreground"
        id="admin-login-modal"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-450 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
          title="Cancel Authentication"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-600/30 dark:border-emerald-500/20 flex items-center justify-center rounded-none">
            {isFirstTimeSetup ? (
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            ) : (
              <Lock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
        </div>

        {/* Modal Title */}
        <div className="text-center mb-8">
          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-450 font-bold block mb-1">
            {isFirstTimeSetup ? "CRYPTOGRAPHIC UPDATE" : "PORTAL ACCESS REQUIRED"}
          </span>
          <h3 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            {isFirstTimeSetup ? "Rotate Temporary Passcode" : "Press Portal Authentication"}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-light leading-relaxed max-w-xs mx-auto">
            {isFirstTimeSetup 
              ? "You are logging in with the default passcode. To secure environmental records, please choose a private passcode."
              : "Verify editorial security credentials to access the content publication system."}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono text-center uppercase tracking-wider">
            {error}
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono text-center uppercase tracking-wider animate-pulse">
            {successMessage}
          </div>
        )}

        {/* Forms */}
        {!isFirstTimeSetup ? (
          <form onSubmit={handleVerifyPassword} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                  PORTAL PASSCODE
                </label>
                <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500">
                  DEFAULT: paen123
                </span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 dark:text-zinc-500">
                  <KeyRound className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure passcode..."
                  className="w-full pl-10 pr-10 py-2.5 bg-background text-foreground border border-zinc-300 dark:border-zinc-800 focus:border-emerald-600 dark:focus:border-emerald-500 focus:outline-none text-sm font-mono tracking-widest rounded-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  title={showPassword ? "Hide Passcode" : "Show Passcode"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 py-3 font-mono uppercase text-xs tracking-widest font-bold border border-transparent transition-colors mt-2"
            >
              Verify Credentials
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                NEW PORTAL PASSCODE
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 dark:text-zinc-500">
                  <KeyRound className="w-4 h-4" />
                </span>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create personal passcode..."
                  className="w-full pl-10 pr-10 py-2.5 bg-background text-foreground border border-zinc-300 dark:border-zinc-800 focus:border-emerald-600 dark:focus:border-emerald-500 focus:outline-none text-sm font-mono tracking-widest rounded-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                CONFIRM NEW PASSCODE
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 dark:text-zinc-500">
                  <KeyRound className="w-4 h-4" />
                </span>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat passcode..."
                  className="w-full pl-10 pr-10 py-2.5 bg-background text-foreground border border-zinc-300 dark:border-zinc-800 focus:border-emerald-600 dark:focus:border-emerald-500 focus:outline-none text-sm font-mono tracking-widest rounded-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 py-3 font-mono uppercase text-xs tracking-widest font-bold border border-transparent transition-colors mt-2"
            >
              Rotate & Establish Session
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 text-center">
          <span className="text-[8px] font-mono text-zinc-400 dark:text-zinc-500 tracking-[0.15em] uppercase">
            SECURED ENDPOINT • SYSTEM PAEN NATURA
          </span>
        </div>
      </div>
    </div>
  );
}
