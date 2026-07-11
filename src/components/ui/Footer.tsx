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
            Paen Natura is an independent global press body dedicated to the objective monitoring of ecological conservation, biological systems synthesis, planetary climatology, and indigenous environmental culture. Supported by a world-wide network of naturalists and botanical sensor telemetry.
          </p>
          <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 flex items-center gap-1.5 mt-4">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> DECRYPTION KEY COGNITIVE ACTIVE
          </div>
        </div>

        {/* Newsletter subscription */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-500 font-bold">THE DAILY BULLETIN</span>
          <h4 className="font-serif font-medium text-xl text-white">Subscribe to the Peer-Reviewed Ledger</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-sans font-light">
            Receive major ecological updates, planetary science briefs, and botanical disclosures directly to your terminal. Delivered weekly.
          </p>

          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mt-2 border-b border-emerald-950 pb-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="OPERATOR@DOMAIN.COM"
              className="bg-transparent border-none text-xs text-white placeholder-zinc-700 focus:outline-none flex-1 font-mono uppercase tracking-widest"
            />
            <button
              type="submit"
              className="bg-emerald-600 text-white px-5 py-2 text-[10px] uppercase tracking-widest font-mono font-bold hover:bg-emerald-700 transition-colors shrink-0"
            >
              {subscribed ? "ACTIVE" : "SUBSCRIBE"}
            </button>
          </form>
          {subscribed && (
            <span className="text-[9px] font-mono text-emerald-500 animate-pulse mt-2 block">
              ✓ Address registered. Your digital credentials have been deployed.
            </span>
          )}
        </div>

        {/* Links Grid */}
        <div className="md:col-span-3 grid grid-cols-2 gap-6 text-xs font-sans">
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest font-bold">CHANNELS</span>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Eco-Tech Ledger</a>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Planetary Science</a>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Earth Polity</a>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Ecological Culture</a>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Green Finance</a>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest font-bold">RESOURCES</span>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Press Credentials</a>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Acoustic Feeds</a>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Satellite Maps</a>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Source Crypt</a>
            <a href="#" className="hover:text-emerald-500 transition-colors text-zinc-500 text-xs font-light">Privacy Charter</a>
          </div>
        </div>
      </div>

      {/* Sub-footer metadata */}
      <div className="w-full px-6 md:px-10 xl:px-16 border-t border-zinc-900 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-600">
        <div className="text-center md:text-left font-light">
          Copyright © {new Date().getFullYear()} Paen Natura. All rights reserved under the Global Press Accord.
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="#" className="hover:text-amber-500 transition-colors">Fact-Check Charter</a>
          <span>•</span>
          <a href="#" className="hover:text-amber-500 transition-colors">Objectivity Metrics</a>
          <span>•</span>
          <a href="#" className="hover:text-amber-500 transition-colors">Operator Panel</a>
        </div>
      </div>
    </footer>
  );
}
export { Footer };
