import { useState } from "react";
import { Article } from "../types";
import { X, Check, Copy, Download, BookOpen, Quote } from "lucide-react";

interface CitationExportModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
}

type CitationStyle = "APA" | "Chicago" | "MLA" | "BibTeX" | "JSON";

export default function CitationExportModal({ article, isOpen, onClose }: CitationExportModalProps) {
  const [activeStyle, setActiveStyle] = useState<CitationStyle>("APA");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const pubDate = article.date || "2026";

  const getCitationContent = (style: CitationStyle): string => {
    switch (style) {
      case "APA":
        return `${article.author}. (${pubDate}). ${article.title}: ${article.subtitle}. PAEN Dispatch Journal, 12(4), Article ${article.id}. https://paen.press/dispatch/${article.id}`;
      case "Chicago":
        return `${article.author}. "${article.title}: ${article.subtitle}." PAEN Dispatch Journal (Special Field Edition) ${pubDate}. https://paen.press/dispatch/${article.id}.`;
      case "MLA":
        return `${article.author}. "${article.title}: ${article.subtitle}." PAEN Journal of Empirical Studies, ${pubDate}, paen.press/dispatch/${article.id}. Accessed ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}.`;
      case "BibTeX":
        return `@article{paen_${article.id.replace(/[^a-zA-Z0-9]/g, "_")},\n  author    = {${article.author}},\n  title     = {${article.title}: ${article.subtitle}},\n  journal   = {PAEN Dispatch Journal},\n  year      = {${currentYear}},\n  url       = {https://paen.press/dispatch/${article.id}},\n  note      = {Objectivity Index: ${article.objectivityRating}%}\n}`;
      case "JSON":
        return JSON.stringify(
          {
            schema: "https://schema.org/ScholarlyArticle",
            headline: article.title,
            alternativeHeadline: article.subtitle,
            author: {
              "@type": "Person",
              name: article.author,
              description: article.authorBio,
            },
            datePublished: article.date,
            publisher: {
              "@type": "Organization",
              name: "PAEN Journal",
            },
            objectivityRating: `${article.objectivityRating}%`,
            sources: article.sources,
          },
          null,
          2
        );
      default:
        return "";
    }
  };

  const citationText = getCitationContent(activeStyle);

  const handleCopy = () => {
    navigator.clipboard.writeText(citationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeStyle === "JSON" ? "json" : activeStyle === "BibTeX" ? "bib" : "txt";
    const blob = new Blob([citationText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `citation-${article.id}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      id="citation-export-modal"
    >
      <div className="bg-[#faf7f2] dark:bg-[#0d1410] border border-zinc-300 dark:border-zinc-800 max-w-xl w-full p-6 shadow-2xl relative font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-5">
          <div className="flex items-center gap-2 text-foreground font-serif text-lg font-bold">
            <Quote className="w-4 h-4 text-emerald-600" />
            <span>Academic Citation & Export</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-foreground transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Style Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(["APA", "Chicago", "MLA", "BibTeX", "JSON"] as const).map((style) => (
            <button
              key={style}
              onClick={() => {
                setActiveStyle(style);
                setCopied(false);
              }}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider font-semibold border transition-colors ${
                activeStyle === style
                  ? "bg-emerald-700 text-white border-emerald-700 dark:bg-emerald-600 dark:border-emerald-600"
                  : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
              }`}
            >
              {style}
            </button>
          ))}
        </div>

        {/* Citation Box */}
        <div className="relative bg-white dark:bg-zinc-950/80 border border-zinc-250 dark:border-zinc-850 p-4 mb-5 font-mono text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
          {citationText}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Peer-Reviewed Attribution Standard</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-zinc-300 dark:border-zinc-700 hover:border-emerald-600 font-mono text-[10px] uppercase font-bold tracking-wider text-foreground transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Citation
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 font-mono text-[10px] uppercase font-bold tracking-wider transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
