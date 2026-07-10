import { Article, Video, Comment } from "../types";
import { INITIAL_ARTICLES, INITIAL_VIDEOS } from "../data/initialData";

const ARTICLES_KEY = "paen_articles";
const VIDEOS_KEY = "paen_videos";
const COMMENTS_KEY = "paen_comments";
const BOOKMARKS_KEY = "paen_bookmarks";

// Seed initial comments
const INITIAL_COMMENTS: Comment[] = [
  {
    id: "com-1",
    articleId: "art-1",
    author: "Dr. Charles G.",
    text: "This is a masterpiece of environmental reporting. Bioacoustics provides a completely objective metric for biodiversity. We've seen similar patterns in marine biomes where sonar tracks reef health prior to bleaching.",
    date: "July 5, 2026, 4:12 PM"
  },
  {
    id: "com-2",
    articleId: "art-1",
    author: "Miranda V.",
    text: "Fascinating point about the 'silent migration'. If a forest becomes biologically dead but structurally standing, satellites will continue reporting it as preserved. This is a severe gap in existing carbon-credit tracking models.",
    date: "July 5, 2026, 8:45 PM"
  },
  {
    id: "com-3",
    articleId: "art-2",
    author: "Linus_K",
    text: "Diamond semiconductors are the ultimate endgame. The main hurdle has always been lattice matching when depositing on silicon. The Ulm team's direct gallium-nitride bonding is a massive breakthrough. Excited for the future of processing.",
    date: "July 4, 2026, 11:30 AM"
  },
  {
    id: "com-4",
    articleId: "art-4",
    author: "RetroCoder88",
    text: "The Lumina Registry is doing sacred work. I was active in several web forums in 2003, and looking back, those were some of the most intellectually honest digital spaces. Losing them to domain decay is a tragedy. Thank you for this.",
    date: "June 26, 2026, 9:02 AM"
  }
];

export function loadArticles(): Article[] {
  const data = localStorage.getItem(ARTICLES_KEY);
  if (!data) {
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(INITIAL_ARTICLES));
    return INITIAL_ARTICLES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_ARTICLES;
  }
}

export function saveArticles(articles: Article[]) {
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
}

export function loadVideos(): Video[] {
  const data = localStorage.getItem(VIDEOS_KEY);
  if (!data) {
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(INITIAL_VIDEOS));
    return INITIAL_VIDEOS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_VIDEOS;
  }
}

export function saveVideos(videos: Video[]) {
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
}

export function loadComments(): Comment[] {
  const data = localStorage.getItem(COMMENTS_KEY);
  if (!data) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(INITIAL_COMMENTS));
    return INITIAL_COMMENTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_COMMENTS;
  }
}

export function saveComments(comments: Comment[]) {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

export function loadBookmarks(): string[] {
  const data = localStorage.getItem(BOOKMARKS_KEY);
  if (!data) {
    return [];
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveBookmarks(bookmarks: string[]) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}
