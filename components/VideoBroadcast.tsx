"use client";

import { useState } from "react";
import { Video } from "@/types";
import { Play, Film, Calendar, User, Info, Shield } from "lucide-react";

interface VideoBroadcastProps {
  videos: Video[];
}

export default function VideoBroadcast({ videos }: VideoBroadcastProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(
    videos.length > 0 ? videos[0] : null
  );

  if (videos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <Film className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
        <h3 className="font-serif font-bold text-lg text-foreground">No broadcasts in transmission</h3>
        <p className="text-sm text-zinc-500 mt-2">The editorial room has not loaded any short footage today. Return later.</p>
      </div>
    );
  }

  const currentVid = selectedVideo || videos[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" id="documentary-theater-portal">
      {/* Editorial Label */}
      <div className="mb-6 flex items-center justify-between border-b-2 border-[#111] dark:border-amber-500/30 pb-3">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-500">PAEN BROADCASTS</span>
          <h2 className="text-2xl font-serif font-bold text-foreground">In Focus: Documentary Short Footage</h2>
        </div>
        <span className="text-xs font-mono bg-amber-500/10 text-amber-500 px-3 py-1 border border-amber-500/20 uppercase font-bold">
          Live Satellite Feed
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Theater Player Area */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="aspect-video relative bg-black border border-zinc-300 dark:border-zinc-850 rounded overflow-hidden shadow-lg group">
            {/* HTML5 Native Video Tag - Extremely robust and reliable */}
            <video
              key={currentVid.id}
              src={currentVid.videoUrl}
              poster={currentVid.thumbnailUrl}
              controls
              autoPlay
              muted
              className="w-full h-full object-cover"
            />

            {/* Top-right satellite watermark */}
            <div className="absolute top-4 right-4 bg-black/70 px-2.5 py-1 text-[10px] font-mono tracking-wider text-amber-400 font-bold uppercase rounded flex items-center gap-1">
              <Shield className="w-3 h-3 text-amber-500 animate-pulse" /> PAEN HD STREAM
            </div>
          </div>

          {/* Broadcast Metadata Card */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded">
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 mb-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">
                {currentVid.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Published: {currentVid.date}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Producer: {currentVid.author}
              </span>
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> Run time: {currentVid.duration}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {currentVid.title}
            </h3>

            <p className="text-zinc-600 dark:text-zinc-300 text-sm mt-3 leading-relaxed text-justify">
              {currentVid.description}
            </p>
          </div>
        </div>

        {/* Transmission List Area */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <Film className="w-4 h-4 text-amber-500" /> TRANSMISSIONS ({videos.length})
          </h3>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-2">
            {videos.map((vid) => {
              const isPlaying = vid.id === currentVid.id;
              return (
                <div
                  key={vid.id}
                  onClick={() => setSelectedVideo(vid)}
                  className={`cursor-pointer p-3 border rounded transition-all flex gap-3 ${
                    isPlaying
                      ? "bg-amber-500/10 border-amber-500 text-foreground shadow-sm"
                      : "bg-background border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
                  }`}
                  id={`video-item-${vid.id}`}
                >
                  {/* Small Thumbnail */}
                  <div className="w-24 aspect-video bg-zinc-800 shrink-0 relative overflow-hidden border border-zinc-200 dark:border-zinc-700">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 text-[8px] font-mono text-amber-500 font-bold rounded">
                      {vid.duration}
                    </span>
                    {isPlaying && (
                      <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                        <Play className="w-4 h-4 text-amber-500 fill-amber-500" />
                      </div>
                    )}
                  </div>

                  {/* Small Detail */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-500 font-bold">
                        {vid.category}
                      </span>
                      <h4 className="font-serif font-bold text-xs text-foreground line-clamp-1 leading-snug">
                        {vid.title}
                      </h4>
                      <p className="text-[10px] text-zinc-500 line-clamp-2 mt-0.5 leading-snug">
                        {vid.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
