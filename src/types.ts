export type Category = "tech" | "science" | "politics" | "culture" | "finance";

export type UserRole = "user" | "author" | "admin";
export type UserStatus = "approved" | "pending_approval" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  bio?: string;
  avatarUrl?: string;
  institution?: string;
  createdAt: string;
  requestedRole?: UserRole;
}

export type ArticleStatus = "published" | "pending_review" | "draft";

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  category: Category;
  author: string;
  authorId?: string;
  authorImage: string;
  authorBio: string;
  imageUrl: string;
  date: string;
  readTime: string;
  sources: string[];
  factChecked: boolean;
  objectivityRating: number; // e.g., 98%
  likes: number;
  status?: ArticleStatus;
  editorialNotes?: string;
  submittedAt?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  category: Category;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  date: string;
  author: string;
}

export interface Comment {
  id: string;
  articleId: string;
  author: string;
  text: string;
  date: string;
}

export type ReadingTheme = "standard" | "high-contrast" | "editorial-sepia";
export type TextSize = "sm" | "base" | "lg" | "xl";
