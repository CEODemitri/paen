"use server";

import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Article } from "@/types";

export async function getArticles(): Promise<Article[]> {
  const rows = await db.select().from(articles).orderBy(desc(articles.createdAt));
  return rows.map(rowToArticle);
}

export async function createArticle(data: Omit<Article, "likes">): Promise<void> {
  await db.insert(articles).values({
    id: data.id,
    title: data.title,
    subtitle: data.subtitle,
    content: data.content,
    category: data.category,
    author: data.author,
    authorImage: data.authorImage,
    authorBio: data.authorBio,
    imageUrl: data.imageUrl,
    date: data.date,
    readTime: data.readTime,
    sources: data.sources,
    factChecked: data.factChecked,
    objectivityRating: data.objectivityRating,
    likes: 0,
  });
  revalidatePath("/");
}

export async function updateArticle(id: string, data: Partial<Omit<Article, "id">>): Promise<void> {
  await db
    .update(articles)
    .set({
      ...(data.title !== undefined && { title: data.title }),
      ...(data.subtitle !== undefined && { subtitle: data.subtitle }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.author !== undefined && { author: data.author }),
      ...(data.authorImage !== undefined && { authorImage: data.authorImage }),
      ...(data.authorBio !== undefined && { authorBio: data.authorBio }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.date !== undefined && { date: data.date }),
      ...(data.readTime !== undefined && { readTime: data.readTime }),
      ...(data.sources !== undefined && { sources: data.sources }),
      ...(data.factChecked !== undefined && { factChecked: data.factChecked }),
      ...(data.objectivityRating !== undefined && { objectivityRating: data.objectivityRating }),
    })
    .where(eq(articles.id, id));
  revalidatePath("/");
}

export async function deleteArticle(id: string): Promise<void> {
  await db.delete(articles).where(eq(articles.id, id));
  revalidatePath("/");
}

export async function likeArticle(id: string): Promise<void> {
  await db
    .update(articles)
    .set({ likes: sql`${articles.likes} + 1` })
    .where(eq(articles.id, id));
  revalidatePath("/");
}

// Map DB row to Article type
function rowToArticle(row: typeof articles.$inferSelect): Article {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    content: row.content,
    category: row.category as Article["category"],
    author: row.author,
    authorImage: row.authorImage,
    authorBio: row.authorBio,
    imageUrl: row.imageUrl,
    date: row.date,
    readTime: row.readTime,
    sources: row.sources,
    factChecked: row.factChecked,
    objectivityRating: row.objectivityRating,
    likes: row.likes,
  };
}
