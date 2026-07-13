import { Suspense } from "react";
import { seedIfEmpty } from "@/lib/actions/seed";
import { getArticles } from "@/lib/actions/articles";
import { getVideos } from "@/lib/actions/videos";
import { getComments } from "@/lib/actions/comments";
import FrontpageClient from "@/components/FrontpageClient";
import type { Article, Video, Comment } from "@/types";

async function FrontpageContent() {
  // Seed database if empty
  await seedIfEmpty();

  // Fetch all data from DB
  const [articles, videos] = await Promise.all([
    getArticles() as Promise<Article[]>,
    getVideos() as Promise<Video[]>,
  ]);
  
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
