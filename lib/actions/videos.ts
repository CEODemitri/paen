"use server";

import { db } from "@/lib/db";
import { videos } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Video } from "@/types";

export async function getVideos(): Promise<Video[]> {
  const rows = await db.select().from(videos).orderBy(desc(videos.createdAt));
  return rows.map(rowToVideo);
}

export async function createVideo(data: Video): Promise<void> {
  await db.insert(videos).values({
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    videoUrl: data.videoUrl,
    thumbnailUrl: data.thumbnailUrl,
    duration: data.duration,
    date: data.date,
    author: data.author,
  });
  revalidatePath("/");
}

export async function updateVideo(id: string, data: Partial<Omit<Video, "id">>): Promise<void> {
  await db
    .update(videos)
    .set({
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
      ...(data.thumbnailUrl !== undefined && { thumbnailUrl: data.thumbnailUrl }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.author !== undefined && { author: data.author }),
    })
    .where(eq(videos.id, id));
  revalidatePath("/");
}

export async function deleteVideo(id: string): Promise<void> {
  await db.delete(videos).where(eq(videos.id, id));
  revalidatePath("/");
}

function rowToVideo(row: typeof videos.$inferSelect): Video {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category as Video["category"],
    videoUrl: row.videoUrl,
    thumbnailUrl: row.thumbnailUrl,
    duration: row.duration,
    date: row.date,
    author: row.author,
  };
}
