"use server";

import { db } from "@/lib/db";
import { articles, videos, comments } from "@/lib/db/schema";
import { count } from "drizzle-orm";
import { INITIAL_ARTICLES, INITIAL_VIDEOS, INITIAL_COMMENTS } from "@/lib/data/initialData";

export async function seedIfEmpty(): Promise<void> {
  // Check article count
  const [{ value: articleCount }] = await db.select({ value: count() }).from(articles);

  if (Number(articleCount) === 0) {
    // Seed articles
    for (const art of INITIAL_ARTICLES) {
      await db.insert(articles).values({
        id: art.id,
        title: art.title,
        subtitle: art.subtitle,
        content: art.content,
        category: art.category,
        author: art.author,
        authorImage: art.authorImage,
        authorBio: art.authorBio,
        imageUrl: art.imageUrl,
        date: art.date,
        readTime: art.readTime,
        sources: art.sources,
        factChecked: art.factChecked,
        objectivityRating: art.objectivityRating,
        likes: art.likes,
      });
    }

    // Seed videos
    for (const vid of INITIAL_VIDEOS) {
      await db.insert(videos).values({
        id: vid.id,
        title: vid.title,
        description: vid.description,
        category: vid.category,
        videoUrl: vid.videoUrl,
        thumbnailUrl: vid.thumbnailUrl,
        duration: vid.duration,
        date: vid.date,
        author: vid.author,
      });
    }

    // Seed initial comments
    for (const com of INITIAL_COMMENTS) {
      await db.insert(comments).values({
        id: com.id,
        articleId: com.articleId,
        author: com.author,
        text: com.text,
        date: com.date,
      });
    }
  }
}
