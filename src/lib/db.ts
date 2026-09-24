import { Article, Video, Comment, User } from "../types";
import { INITIAL_ARTICLES, INITIAL_VIDEOS } from "../data/initialData";

const ARTICLES_KEY = "paen_articles_v2";
const VIDEOS_KEY = "paen_videos_v2";
const COMMENTS_KEY = "paen_comments_v2";
const BOOKMARKS_KEY = "paen_bookmarks_v2";
const USERS_KEY = "paen_users_v2";
const CURRENT_USER_KEY = "paen_current_user_v2";
const ADMIN_PASSWORD_KEY = "paen_admin_password_v2";

export const DEFAULT_ADMIN_PASS = "paen123";

export const INITIAL_USERS: User[] = [
  {
    id: "usr-admin-1",
    name: "Editor-in-Chief",
    email: "admin@paen.earth",
    password: DEFAULT_ADMIN_PASS,
    role: "admin",
    status: "approved",
    bio: "Chief Editorial Director of Paen Natura Botanical & Earth Systems Journal.",
    institution: "Paen Natura Press Board",
    createdAt: "August 1, 2026",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: "usr-author-1",
    name: "Dr. Alastair Vance",
    email: "alastair@bioacoustic.org",
    password: "author123",
    role: "author",
    status: "approved",
    bio: "Senior Field Acoustician & Amazonian Biodiversity Fellow.",
    institution: "Juruá Bioacoustics Observatory",
    createdAt: "August 3, 2026",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: "usr-author-2",
    name: "Miranda Vance",
    email: "miranda@climateledger.int",
    password: "author123",
    role: "author",
    status: "approved",
    bio: "Satellite Telemetry & Global Carbon Registry Specialist.",
    institution: "Global Carbon Observation Network",
    createdAt: "August 5, 2026",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: "usr-applicant-1",
    name: "Linus Thorne",
    email: "linus.thorne@abyssal.res",
    password: "applicant123",
    role: "user",
    requestedRole: "author",
    status: "pending_approval",
    bio: "Submersible explorer investigating hydrothermal vent ecological microclimates.",
    institution: "Pacific Trench Marine Station",
    createdAt: "August 12, 2026",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: "usr-reader-1",
    name: "Eleanor Wright",
    email: "eleanor@library.earth",
    password: "reader123",
    role: "user",
    status: "approved",
    bio: "Botanical archivist and lifelong reader of ecological journals.",
    createdAt: "August 14, 2026",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
  }
];

export function emitDataSync(entity: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("paen_data_sync", { detail: { entity, timestamp: Date.now() } }));
  }
}

export function loadUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) {
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  emitDataSync("users");
}

export function loadCurrentUser(): User | null {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function getCurrentUser(): User | null {
  return loadCurrentUser();
}

export function saveCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  emitDataSync("currentUser");
}

export function setCurrentUser(user: User | null) {
  saveCurrentUser(user);
}

export function logoutUser() {
  saveCurrentUser(null);
}

export function getAdminPassword(): string {
  return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_ADMIN_PASS;
}

export function setAdminPassword(newPass: string) {
  localStorage.setItem(ADMIN_PASSWORD_KEY, newPass);
  localStorage.setItem("paen_has_changed_password", "true");
  // Also synchronize in the admin user record in users list
  const users = loadUsers();
  const updatedUsers = users.map((u) =>
    u.role === "admin" ? { ...u, password: newPass } : u
  );
  saveUsers(updatedUsers);
}

// Seed initial comments
const INITIAL_COMMENTS: Comment[] = [
  {
    id: "com-1",
    articleId: "art-1",
    author: "Dr. Charles G.",
    text: "This is a masterpiece of environmental reporting. Bioacoustics provides a completely objective metric for biodiversity. We've seen similar patterns in marine biomes where sonar tracks reef health prior to bleaching.",
    date: "August 18, 2026, 4:12 PM"
  },
  {
    id: "com-2",
    articleId: "art-1",
    author: "Miranda V.",
    text: "Fascinating point about the 'silent migration'. If a forest becomes biologically dead but structurally standing, satellites will continue reporting it as preserved. This is a severe gap in existing carbon-credit tracking models.",
    date: "August 18, 2026, 8:45 PM"
  },
  {
    id: "com-3",
    articleId: "art-2",
    author: "Linus_K",
    text: "Diamond semiconductors are the ultimate endgame. The main hurdle has always been lattice matching when depositing on silicon. The Ulm team's direct gallium-nitride bonding is a massive breakthrough. Excited for the future of processing.",
    date: "August 16, 2026, 11:30 AM"
  },
  {
    id: "com-4",
    articleId: "art-4",
    author: "RetroCoder88",
    text: "The Lumina Registry is doing sacred work. I was active in several web forums in 2003, and looking back, those were some of the most intellectually honest digital spaces. Losing them to domain decay is a tragedy. Thank you for this.",
    date: "August 11, 2026, 9:02 AM"
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
  emitDataSync("articles");
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
  emitDataSync("videos");
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
  emitDataSync("comments");
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
  emitDataSync("bookmarks");
}
