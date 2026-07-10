import React, { useState, useRef, useEffect } from "react";
import { Article, Comment, ReadingTheme, TextSize } from "../types";
import { ArrowLeft, BookMarked, MessageSquare, CheckCircle2, Calendar, Clock, Share2, Award, Heart, Wind, Pause, ChevronsDown } from "lucide-react";

const FIELD_BRIEFS: Record<string, string[]> = {
  "art-1": [
    "Acoustic micro-sensors continuously record biophonic density across a 50,000-square-kilometer Amazonian grid.",
    "A custom neural network (Aura) detects degradation by identifying sonic fragmentation and shifts in acoustic niches.",
    "Acoustic monitoring shows deep-forest indicator species retreat up to 3km from clearings long before physical trees are felled."
  ],
  "art-2": [
    "Ultra-pure synthetic diamonds grown via chemical vapor deposition are replacing silicon as computing substrates.",
    "Diamond's thermal conductivity is five times higher than copper, solving the cooling bottleneck for high-density processors.",
    "Synthetic diamond semiconductors have been classified as critical defense technologies, triggering supply chain controls."
  ],
  "art-3": [
    "Sovereign wealth funds are transitioning from passive stock index tracking to active strategic venture capitalists.",
    "Investment funding is now tightly linked to local infrastructure building and technological IP transfers.",
    "This nationalistic shift is creating isolated 'walled-garden' economies, reducing global liquidity for unaligned markets."
  ],
  "art-4": [
    "Early web forums, community hubs, and archives are rapidly dissolving due to domain rot and unmaintained servers.",
    "The preservation of interactive legacy web culture requires hardware-level emulation for obsolete formats.",
    "The shift to closed proprietary social databases leaves no public historical records for future digital archaeologists."
  ],
  "art-5": [
    "Thinning Arctic summer sea ice is transforming polar passages into highly active, contested commercial trade routes.",
    "A dramatic build-up of coastal military infrastructure threatens to permanently disrupt fragile marine ecosystems.",
    "Traditional diplomatic bodies are paralyzed, raising demands for a new binding polar demilitarization framework."
  ]
};

const JARGON_DICTIONARY: Record<string, { definition: string; category: string }> = {
  "acoustic monitoring arrays": {
    definition: "Sensory listening nodes equipped with precision microphones deployed to map vocalizations in wild ecosystems.",
    category: "ecology"
  },
  "biophonic density": {
    definition: "A metric of biodiversity measuring the cumulative volume and frequency distribution of wild animal calls in a biome.",
    category: "ecology"
  },
  "acoustic niche partitioning": {
    definition: "The evolutionary division of acoustic frequencies among species, allowing them to communicate simultaneously without sonic overlap.",
    category: "ecology"
  },
  "chemical vapor deposition": {
    definition: "An advanced gas-phase manufacturing technique used to grow highly pure synthetic diamond crystals atom-by-atom.",
    category: "technology"
  },
  "quantum tunneling": {
    definition: "A quantum physics state where subatomic particles bypass nanoscale physical barriers, threatening silicon semiconductor efficiency.",
    category: "technology"
  },
  "thermal conductivity": {
    definition: "A material's thermodynamic ability to conduct and dissipate heat. Diamond's is the highest of any known solid.",
    category: "technology"
  },
  "sovereign wealth": {
    definition: "State-owned capital funds derived from national surpluses, deployed directly into strategic long-term assets.",
    category: "finance"
  },
  "index funds": {
    definition: "Passive investment portfolios that automatically mimic a broad basket of publicly traded companies or bonds.",
    category: "finance"
  },
  "localization": {
    definition: "The structural requirement of transferring intellectual property or building local facilities as a condition of capital injection.",
    category: "finance"
  },
  "digital rot": {
    definition: "The systemic decay and sudden extinction of digital heritage due to unmaintained server spaces and obsolete formats.",
    category: "culture"
  },
  "proprietary platforms": {
    definition: "Closed commercial databases (like Instagram or TikTok) that shield cultural exchanges from public archives.",
    category: "culture"
  },
  "emulators": {
    definition: "Virtualized software frameworks designed to precisely mimic legacy systems and run obsolete interactive files.",
    category: "culture"
  },
  "high arctic": {
    definition: "The most northern polar zones, home to fragile seasonal ice and vital atmospheric feedback stabilizers.",
    category: "ecology"
  },
  "permafrost": {
    definition: "Sub-surface earth layers that remain frozen continuously for years, containing massive amounts of trapped climate-forcing gases.",
    category: "ecology"
  },
  "climate feedback loops": {
    definition: "Self-reinforcing natural loops, such as when warming melts reflective ice, exposing dark water which absorbs more heat.",
    category: "ecology"
  },
};

function JargonTerm({ term, definition, category }: { term: string; definition: string; category: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <span
      ref={containerRef}
      className="relative inline-block group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span 
        className="cursor-pointer border-b border-dashed border-emerald-600/60 dark:border-emerald-400/60 hover:border-emerald-700 dark:hover:border-emerald-300 hover:text-emerald-750 dark:hover:text-emerald-300 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.02] px-1 transition-colors font-medium rounded-sm"
        style={{ textDecoration: "none" }}
      >
        {term}
      </span>
      {isOpen && (
        <span 
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 block w-64 p-3.5 bg-[#faf9f5] dark:bg-[#0c140f] border border-emerald-600/30 dark:border-emerald-500/20 shadow-xl text-left select-none animate-in fade-in slide-in-from-bottom-1 duration-150 rounded-none"
          role="tooltip"
        >
          <span className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-2">
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-450 font-bold">
              FIELD NOTE REFERENCE
            </span>
            <span className="text-[7px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {category}
            </span>
          </span>
          <span className="block text-[11px] font-sans font-normal leading-relaxed text-zinc-700 dark:text-zinc-300 normal-case">
            {definition}
          </span>
          <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-[#faf9f5] dark:border-t-[#0c140f] -mt-[1px]" />
        </span>
      )}
    </span>
  );
}

function renderTextWithJargon(text: string) {
  const keys = Object.keys(JARGON_DICTIONARY).sort((a, b) => b.length - a.length);
  const regex = new RegExp(`\\b(${keys.join("|")})\\b`, "gi");
  
  const parts = text.split(regex);
  if (parts.length === 1) return text;
  
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      const lowerKey = part.toLowerCase();
      const match = JARGON_DICTIONARY[lowerKey];
      if (match) {
        return (
          <JargonTerm
            key={i}
            term={part}
            definition={match.definition}
            category={match.category}
          />
        );
      }
    }
    return part;
  });
}

interface ArticleDetailProps {
  article: Article;
  comments: Comment[];
  onAddComment: (text: string) => void;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  onBack: () => void;
  readingTheme: ReadingTheme;
  textSize: TextSize;
}

export default function ArticleDetail({
  article,
  comments,
  onAddComment,
  isBookmarked,
  onBookmarkToggle,
  onBack,
  readingTheme,
  textSize,
}: ArticleDetailProps) {
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(article.likes || 128);

  const [rhythmActive, setRhythmActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState("Inhale");
  const [driftActive, setDriftActive] = useState(false);
  const [driftSpeed, setDriftSpeed] = useState<"slow" | "medium" | "fast">("medium");
  const [briefExpanded, setBriefExpanded] = useState(false);

  useEffect(() => {
    if (!rhythmActive) return;
    let count = 0;
    const cycle = ["Inhale", "Hold", "Exhale", "Hold"];
    const intervals = [4000, 2000, 4000, 2000]; // 12 second total cycle
    
    let timeoutId: ReturnType<typeof setTimeout>;
    const tick = () => {
      setBreathPhase(cycle[count]);
      timeoutId = setTimeout(() => {
        count = (count + 1) % cycle.length;
        tick();
      }, intervals[count]);
    };
    tick();
    return () => clearTimeout(timeoutId);
  }, [rhythmActive]);

  useEffect(() => {
    if (!driftActive) return;

    let lastTime = performance.now();
    let animationId: number;

    const scrollSpeeds: Record<"slow" | "medium" | "fast", number> = {
      slow: 0.3,
      medium: 0.6,
      fast: 1.2,
    };

    const step = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      const distance = scrollSpeeds[driftSpeed] * (delta / 16.67);
      window.scrollBy(0, distance);

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        setDriftActive(false);
        return;
      }

      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [driftActive, driftSpeed]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText("");
  };

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  // Split text into paragraphs
  const paragraphs = article.content.split("\n\n");
  const firstPara = paragraphs[0] || "";
  const remainingParas = paragraphs.slice(1);

  // Setup drop cap
  const dropCapLetter = firstPara.charAt(0);
  const dropCapRest = firstPara.slice(1);

  const themeClasses: Record<ReadingTheme, string> = {
    standard: "bg-[#f4f3ec] text-zinc-900 border-zinc-200/60",
    "editorial-sepia": "bg-[#f5ebd6] text-[#3d2a13] border-[#dfcfb0] selection:bg-[#dfcfb0]/30",
    "high-contrast": "bg-[#060d09] text-zinc-100 border-zinc-800/60",
  };

  const fontSizes: Record<TextSize, string> = {
    sm: "text-sm md:text-base leading-relaxed font-light",
    base: "text-base md:text-lg leading-relaxed font-light",
    lg: "text-lg md:text-xl leading-relaxed font-light",
    xl: "text-xl md:text-2xl leading-relaxed font-light",
  };

  return (
    <div className={`min-h-screen transition-all duration-500 pb-16 ${themeClasses[readingTheme]}`} id="article-detail-container">
      {/* Top action bar */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-opacity-95 py-4 border-b border-inherit px-4 transition-colors">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            id="detail-back-button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] font-semibold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> BACK TO STORIES
          </button>

          <div className="flex items-center gap-4 md:gap-5">
            <button
              id="detail-rhythm-button"
              onClick={() => setRhythmActive(!rhythmActive)}
              className={`flex items-center gap-1.5 px-2 py-1 text-xs font-mono uppercase tracking-wider transition-all ${
                rhythmActive 
                  ? "text-emerald-600 dark:text-emerald-400 font-semibold" 
                  : "hover:text-emerald-600 dark:hover:text-emerald-400 text-zinc-500 dark:text-zinc-400"
              }`}
              title="Toggle reading focus breathing companion"
            >
              <Wind className={`w-4 h-4 ${rhythmActive ? "animate-[pulse_2s_infinite] text-emerald-600 dark:text-emerald-400" : ""}`} />
              <span className="hidden sm:inline">Rhythm</span>
            </button>

            <button
              id="detail-drift-button"
              onClick={() => setDriftActive(!driftActive)}
              className={`flex items-center gap-1.5 px-2 py-1 text-xs font-mono uppercase tracking-wider transition-all ${
                driftActive 
                  ? "text-emerald-600 dark:text-emerald-400 font-semibold" 
                  : "hover:text-emerald-600 dark:hover:text-emerald-400 text-zinc-500 dark:text-zinc-400"
              }`}
              title="Toggle hands-free auto-scroll"
            >
              <ChevronsDown className={`w-4 h-4 ${driftActive ? "animate-bounce text-emerald-600 dark:text-emerald-400" : ""}`} />
              <span className="hidden sm:inline">Drift</span>
            </button>

            <button
              id="detail-bookmark-button"
              onClick={onBookmarkToggle}
              className="flex items-center gap-1.5 px-2 py-1 text-xs font-mono uppercase tracking-wider hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
            >
              <BookMarked className={`w-4 h-4 ${isBookmarked ? "fill-emerald-600 text-emerald-600" : ""}`} />
              <span className="hidden sm:inline">{isBookmarked ? "Saved" : "Save"}</span>
            </button>
            <button
              id="detail-share-button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Article Link copied to clipboard!");
              }}
              className="flex items-center gap-1.5 px-2 py-1 text-xs font-mono uppercase tracking-wider hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
              title="Copy URL link"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-5 py-12 md:py-24">
        {/* Category Label */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <span className="px-3 py-1 bg-emerald-600 text-white font-mono uppercase text-[10px] tracking-widest font-bold">
            {article.category}
          </span>
          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {article.date}
          </span>
          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.readTime}
          </span>
        </div>

        {/* Big Editorial Headline */}
        <h1
          className="text-4xl md:text-5xl lg:text-[4.2rem] font-serif font-semibold tracking-tight text-foreground leading-[1.1] mb-6"
          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
          id="article-headline"
        >
          {article.title}
        </h1>

        {/* Subtitle with beautiful elegant border & spacing */}
        <p className="text-zinc-600 dark:text-zinc-300 text-xl md:text-2xl font-serif font-light mt-6 mb-10 leading-relaxed text-justify italic border-l-3 border-emerald-600/80 pl-6 py-2">
          {article.subtitle}
        </p>

        {/* Author Byline Profile - Clean Sophisticated Card */}
        <div className="flex items-center gap-5 py-6 my-10 border-t border-b border-zinc-200/60 dark:border-zinc-800/60">
          <img
            src={article.authorImage}
            alt={article.author}
            className="w-14 h-14 rounded-full object-cover border border-zinc-300 dark:border-zinc-700 shrink-0 shadow-sm"
          />
          <div>
            <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-1">CORRESPONDENT BYLINE</div>
            <div className="font-serif font-bold text-base text-foreground">{article.author}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl mt-1 leading-relaxed font-sans">{article.authorBio}</div>
          </div>
        </div>

        {/* Large Story Image with Offset Frame */}
        <div className="my-10 p-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 w-full overflow-hidden">
          <div className="aspect-[16/9] w-full overflow-hidden bg-black">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-101" />
          </div>
        </div>

        {/* Field Brief Takeaway Section - Collapsible and Sophisticated */}
        <div className="my-10 border border-zinc-250 dark:border-zinc-800/85 bg-zinc-50/30 dark:bg-zinc-950/20 shadow-sm" id="editorial-field-brief">
          <button
            onClick={() => setBriefExpanded(!briefExpanded)}
            className="w-full flex items-center justify-between p-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border-b border-zinc-200 dark:border-zinc-800/60"
          >
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-600 dark:bg-emerald-500 rounded-none" />
              {briefExpanded ? "COLLAPSE BRIEF RECORD" : "DECRYPT FIELD BRIEF [TAKEAWAYS]"}
            </span>
            <span className="text-xs">{briefExpanded ? "[-]" : "[+]"}</span>
          </button>
          
          <div 
            className={`transition-all duration-300 overflow-hidden ${
              briefExpanded ? "max-h-96 opacity-100 p-5 border-t-0" : "max-h-0 opacity-0"
            }`}
          >
            <ul className="space-y-3.5">
              {(FIELD_BRIEFS[article.id] || [
                "Scientific data logged and verified by local research councils.",
                "Objectivity verified with automated, immutable telemetry records.",
                "Subjected to strict two-stage peer fact-checking."
              ]).map((point, idx) => (
                <li key={idx} className="flex gap-3 text-xs leading-relaxed text-zinc-650 dark:text-zinc-350 font-sans font-light text-justify">
                  <span className="text-emerald-600 dark:text-emerald-450 font-mono text-[10px] mt-0.5 select-none font-bold">
                    0{idx + 1} //
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Article Body Content */}
        <div className={`mt-12 font-serif ${fontSizes[textSize]} select-text`} id="article-body-content">
          {/* First Paragraph with beautiful Drop Cap */}
          {firstPara && (
            <p className="text-justify mb-8 first-line:uppercase first-line:tracking-wide text-lg md:text-xl leading-relaxed">
              <span
                className="float-left text-6xl md:text-8xl font-bold font-serif leading-none mr-3 mt-1.5 text-emerald-600 align-top"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
              >
                {dropCapLetter}
              </span>
              {renderTextWithJargon(dropCapRest)}
            </p>
          )}

          {/* Remaining Paragraphs */}
          {remainingParas.map((para, idx) => {
            // Stylize header subheadings in article
            if (para.startsWith("###")) {
              return (
                <h3
                  key={idx}
                  className="text-2xl md:text-3xl font-serif font-semibold text-foreground mt-12 mb-5 tracking-tight border-b border-zinc-200/60 dark:border-zinc-800/60 pb-2"
                  style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
                >
                  {para.replace("###", "").trim()}
                </h3>
              );
            }

            return (
              <p key={idx} className="text-justify mb-8 leading-relaxed font-light">
                {renderTextWithJargon(para)}
              </p>
            );
          })}
        </div>

        {/* Elegant Centered Ornament Separator */}
        <div className="my-12 text-zinc-300 dark:text-zinc-800 text-center text-xl">
          ✦ ✦ ✦
        </div>

        {/* Support the reporter button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 my-10 border-t border-b border-zinc-200/60 dark:border-zinc-800/60">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-3 border font-mono text-xs uppercase tracking-widest font-bold transition-all ${
                liked
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-transparent hover:bg-rose-500/10 text-rose-500 border-rose-500/30"
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-white" : ""}`} />
              Recommend ({likesCount})
            </button>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Supporting journalistic integrity</span>
          </div>
        </div>

        {/* Editorial Transparency Board - Beautiful Double Line Box */}
        <div className="bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-250 dark:border-zinc-800/80 p-8 my-16 relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600" />
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400 mb-5 font-bold">
            <Award className="w-4 h-4" /> JOURNALISTIC TRANSPARENCY DECK
          </div>
          <h4 className="font-serif font-semibold text-xl text-foreground mb-4">Verification and Fact-Checking Logs</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div className="flex flex-col gap-1 md:border-r border-zinc-200 dark:border-zinc-800 md:pr-6">
              <span className="text-[9px] font-mono text-zinc-400 tracking-widest">CONFIDENCE INDEX</span>
              <div className="flex items-center gap-2.5 mt-1">
                <span className="text-3xl font-bold font-mono text-foreground">{article.objectivityRating}%</span>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 px-2 py-0.5 uppercase font-bold font-mono">
                  Very High
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2 text-justify font-sans font-light">
                This document contains no commercial promotional copy and aligns strictly with the BBC standards of multi-perspective objectivity.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-zinc-400 tracking-widest">FACT-CHECK CODE</span>
              <div className="text-xs font-mono flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mt-1 uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> PASSED DOUBLE PEER-REVIEW
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2 text-justify font-sans font-light">
                Checked and authenticated against the Mamirauá bio-records registry and satellite telemetry databases.
              </p>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-3 font-semibold">Primary Sources & Bibliographies</span>
            <ul className="list-inside text-xs text-zinc-600 dark:text-zinc-400 flex flex-col gap-2.5 leading-relaxed font-sans font-light">
              {article.sources.map((src, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-emerald-600 font-mono">[{i + 1}]</span>
                  <span className="text-justify">{src}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Readers Discussion (Comments) */}
        <section className="mt-16 border-t border-zinc-200/80 dark:border-zinc-800/80 pt-12" id="editorial-discussion">
          <h3 className="text-2xl font-serif font-semibold text-foreground mb-8 flex items-center gap-2.5">
            <MessageSquare className="w-5.5 h-5.5 text-emerald-600" /> Reader Discussion ({comments.length})
          </h3>

          {/* New Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-10 flex flex-col gap-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Contribute your analytical perspective on this report..."
              rows={4}
              className="w-full px-4 py-3 border bg-background text-foreground border-zinc-300 dark:border-zinc-800 focus:ring-1 focus:ring-emerald-600 focus:outline-none text-sm leading-relaxed rounded-none placeholder-zinc-400"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-emerald-700 text-white dark:bg-emerald-600 dark:text-white hover:bg-emerald-800 dark:hover:bg-emerald-700 px-7 py-3 font-mono uppercase text-xs tracking-widest font-bold border border-transparent transition-colors"
              >
                Submit Perspective
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="flex flex-col gap-8">
            {comments.length === 0 ? (
              <p className="text-zinc-400 font-serif text-sm italic">No commentary submitted yet. Start the discussion above.</p>
            ) : (
              comments.map((com) => (
                <div key={com.id} className="border-b border-zinc-200/50 dark:border-zinc-800/40 pb-6 text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-foreground font-serif text-base">{com.author}</span>
                    <span className="text-[9px] font-mono text-zinc-400 tracking-wider">{com.date}</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans text-justify font-light">
                    {com.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </article>

      {/* Floating Reading Assistance Widgets */}
      
      {/* 1. Breathing Pace Rhythm Companion */}
      {rhythmActive && (
        <div 
          className="fixed bottom-6 right-6 z-50 bg-[#faf9f5] dark:bg-[#0c140f] border border-emerald-600/30 dark:border-emerald-500/20 p-4 shadow-xl flex items-center gap-3.5 max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-300"
          id="rhythm-widget"
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full animate-ping duration-[4000ms]" />
            <div 
              className="w-6 h-6 bg-emerald-600 dark:bg-emerald-500 rounded-full" 
              style={{ 
                transform: breathPhase === 'Inhale' ? 'scale(1.3)' : breathPhase === 'Exhale' ? 'scale(0.8)' : 'scale(1.3)', 
                transition: `all ${breathPhase === "Hold" ? "2000ms" : "4000ms"} ease-in-out` 
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-450 font-bold">
              RHYTHM // {breathPhase}
            </span>
            <span className="text-[11px] font-sans font-light text-zinc-500 dark:text-zinc-400">
              Align breath to expand/contract pace.
            </span>
          </div>
        </div>
      )}

      {/* 2. Hands-Free Auto-Scroll Drift Panel */}
      {driftActive && (
        <div 
          className="fixed bottom-6 left-6 z-50 bg-[#faf9f5] dark:bg-[#0c140f] border border-emerald-600/30 dark:border-emerald-500/20 p-3.5 shadow-xl flex flex-wrap sm:flex-nowrap items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
          id="drift-widget"
        >
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setDriftActive(false)}
              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              title="Pause Scroll"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
            <div className="flex flex-col">
              <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-zinc-450 font-bold">DRIFT ACTUATOR</span>
              <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                Active Speed
              </span>
            </div>
          </div>
          <div className="hidden sm:block h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex gap-1 text-[8px] font-mono">
            {(["slow", "medium", "fast"] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => setDriftSpeed(spd)}
                className={`px-2 py-1 border ${
                  driftSpeed === spd
                    ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                    : "border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                } transition-colors uppercase`}
              >
                {spd}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
