export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { seedIfEmpty } from "@/lib/actions/seed";
import { getArticles } from "@/lib/actions/articles";
import { getVideos } from "@/lib/actions/videos";
import { getComments } from "@/lib/actions/comments";
import FrontpageClient from "@/components/FrontpageClient";
import type { Article, Video, Comment } from "@/types";

async function FrontpageContent() {
  let articles: Article[] = [];
  let videos: Video[] = [];

  try {
    // Seed database if empty
    await seedIfEmpty();

    // Fetch all data from DB
    const results = await Promise.all([
      getArticles() as Promise<Article[]>,
      getVideos() as Promise<Video[]>,
    ]);
    
    articles = results[0];
    videos = results[1];
  } catch (error) {
    console.error("[v0] Failed to load data:", error);
    // Fall back to empty data on error
    articles = [];
    videos = [];
  }
  
  // Comments will be fetched per-article in the client when clicked
  const comments: Comment[] = [];

  return (
    <FrontpageClient
      initialArticles={articles}
      initialVideos={videos}
      initialComments={comments}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <FrontpageContent />
    </Suspense>
  );
}
