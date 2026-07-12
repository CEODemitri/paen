"use server";

import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Comment } from "@/types";

export async function getComments(articleId: string): Promise<Comment[]> {
  const rows = await db
    .select()
    .from(comments)
    .where(eq(comments.articleId, articleId))
    .orderBy(desc(comments.createdAt));
  return rows.map(rowToComment);
}

export async function addComment(
  articleId: string,
  author: string,
  text: string
): Promise<Comment> {
  const id = `com-${Date.now()}`;
  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  await db.insert(comments).values({ id, articleId, author, text, date });
  revalidatePath("/");
  return { id, articleId, author, text, date };
}

function rowToComment(row: typeof comments.$inferSelect): Comment {
  return {
    id: row.id,
    articleId: row.articleId,
    author: row.author,
    text: row.text,
    date: row.date,
  };
}
