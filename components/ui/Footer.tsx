"use client";

import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-[#0a100c] text-zinc-400 border-t border-[#1a2d21]/30 py-16 md:py-24 transition-colors duration-500" id="editorial-footer">
      <div className="w-full px-6 md:px-10 xl:px-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
        {/* Brand Block */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white">
            <span className="text-xl font-semibold font-serif tracking-tight text-white flex items-center gap-2">
              PAEN NATURA
              <span className="w-1.5 h-1.5 bg-emerald-500 block" />
            </span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed text-justify font-sans font-light">
            Paen Natura is an independent publication covering nature, science, culture, and the environment. We are funded by readers, not advertisers.
          </p>
          <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 flex items-center gap-1.5 mt-4">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Independent & Reader-Funded
          </div>
        </div>

        {/* Newsletter subscription */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-500 font-bold">NEWSLETTER</span>
          <h4 className="font-serif font-medium text-xl text-white">Get stories in your inbox</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-sans font-light">
            The best stories from Paen Natura, delivered to you once a week. No spam, no ads.
          </p>

          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mt-2 border-b border-emerald-950 pb-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-transparent border-none text-xs text-white placeholder-zinc-700 focus:outline-none flex-1 font-mono"
            />
            <button
              type="submit"
              className="bg-emerald-600 text-white px-5 py-2 text-[10px] uppercase tracking-widest font-mono font-bold hover:bg-emerald-700 transition-colors shrink-0"
            >
              {subscribed ? "DONE" : "SUBSCRIBE"}
            </button>
          </form>
          {subscribed && (
            <span className="text-[9px] font-mono text-emerald-500 animate-pulse mt-2 block">
              ✓ You&apos;re subscribed. We&apos;ll be in touch soon.
            </span>
          )}
        </div>

        {/* Links Grid */}
        <div className="md:col-span-3 grid grid-cols-2 gap-6 text-xs font-sans">
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest font-bold">TOPICS</span>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Technology</a>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Science</a>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Politics</a>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Culture</a>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Finance</a>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest font-bold">INFO</span>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">About Us</a>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Contact</a>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Advertise</a>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Tips & Leaks</a>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Privacy Policy</a>
          </div>
        </div>
      </div>

      {/* Sub-footer metadata */}
      <div className="w-full px-6 md:px-10 xl:px-16 border-t border-zinc-900 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-600">
        <div className="text-center md:text-left font-light">
          © {new Date().getFullYear()} Paen Natura. All rights reserved.
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-amber-500 transition-colors">Terms of Use</a>
          <span>•</span>
          <a href="#" className="hover:text-amber-500 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
export { Footer };
