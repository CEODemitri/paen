export type Category = "tech" | "science" | "politics" | "culture" | "finance";

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  category: Category;
  author: string;
  authorImage: string;
  authorBio: string;
  imageUrl: string;
  date: string;
  readTime: string;
  sources: string[];
  factChecked: boolean;
  objectivityRating: number;
  likes: number;
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
