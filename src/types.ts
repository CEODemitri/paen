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

export type ShopCategory = "live-books" | "ebooks" | "merch" | "events";

export interface ShopItem {
  id: string;
  category: "live-books" | "ebooks" | "merch";
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  authorOrCreator?: string;
  format?: string;
  stockCount?: number;
  featured?: boolean;
  pagesOrSpecs?: string;
  tags: string[];
}

export interface ShopEvent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  time: string;
  address: string;
  city: string;
  venueName: string;
  price: number;
  ticketsLeft: number;
  totalTickets: number;
  imageUrl: string;
  attractions: string[];
  speakers: { name: string; role: string; avatarUrl?: string }[];
  tags: string[];
}

export interface CartItem {
  id: string;
  type: "item" | "event";
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  variant?: string;
}

