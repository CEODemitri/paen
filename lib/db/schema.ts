import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const articles = pgTable("articles", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  authorImage: text("author_image").notNull(),
  authorBio: text("author_bio").notNull(),
  imageUrl: text("image_url").notNull(),
  date: text("date").notNull(),
  readTime: text("read_time").notNull(),
  sources: text("sources").array().notNull().default([]),
  factChecked: boolean("fact_checked").notNull().default(true),
  objectivityRating: integer("objectivity_rating").notNull().default(100),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const videos = pgTable("videos", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  duration: text("duration").notNull(),
  date: text("date").notNull(),
  author: text("author").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: text("id").primaryKey(),
  articleId: text("article_id").notNull(),
  author: text("author").notNull(),
  text: text("text").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
