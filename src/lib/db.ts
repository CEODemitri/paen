import { Article, Video, Comment, User, ShopItem, ShopEvent, CartItem } from "../types";
import { INITIAL_ARTICLES, INITIAL_VIDEOS } from "../data/initialData";
import { INITIAL_SHOP_ITEMS, INITIAL_SHOP_EVENTS } from "../data/shopData";
import { db, handleFirestoreError, OperationType } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

const ARTICLES_KEY = "paen_articles_v7";
const VIDEOS_KEY = "paen_videos_v5";
const COMMENTS_KEY = "paen_comments_v5";
const BOOKMARKS_KEY = "paen_bookmarks_v5";
const USERS_KEY = "paen_users_v5";
const CURRENT_USER_KEY = "paen_current_user_v5";
const ADMIN_PASSWORD_KEY = "paen_admin_password_v5";
const SHOP_ITEMS_KEY = "paen_shop_items_v2";
const SHOP_EVENTS_KEY = "paen_shop_events_v2";
const CART_KEY = "paen_cart_v2";

export const DEFAULT_ADMIN_PASS = "paen123";

export const INITIAL_USERS: User[] = [
  {
    id: "usr-demitri",
    name: "ceoDemitri",
    email: "demitri@paen.earth",
    password: DEFAULT_ADMIN_PASS,
    role: "admin",
    status: "approved",
    bio: "Founder & Chief Explorer at Paen. Investigating the convergence of technology, natural biomes, planetary finance, and creative discovery.",
    institution: "Paen Planetary Institute",
    createdAt: "September 24, 2026",
    avatarUrl: "https://github.com/ceoDemitri.png",
  },
  {
    id: "usr-author-demitri",
    name: "ceoDemitri",
    email: "author@paen.earth",
    password: "author123",
    role: "author",
    status: "approved",
    bio: "Founder & Chief Explorer at Paen. Investigating the convergence of technology, natural biomes, planetary finance, and creative discovery.",
    institution: "Paen Editorial Board",
    createdAt: "September 24, 2026",
    avatarUrl: "https://github.com/ceoDemitri.png",
  },
  {
    id: "usr-reader-1",
    name: "Eleanor Wright",
    email: "eleanor@library.earth",
    password: "reader123",
    role: "user",
    status: "approved",
    bio: "Botanical archivist and lifelong reader of ecological journals.",
    createdAt: "September 24, 2026",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
  },
];

export function emitDataSync(entity: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("paen_data_sync", { detail: { entity, timestamp: Date.now() } })
    );
  }
}

// ----------------------------------------------------
// Real-Time Firestore Synchronization Engine
// ----------------------------------------------------
let isFirestoreInitialized = false;

export function initFirestoreRealtimeSync() {
  if (isFirestoreInitialized || typeof window === "undefined") return;
  isFirestoreInitialized = true;

  try {
    // 1. Articles Sync Listener
    const articlesCol = collection(db, "articles");
    onSnapshot(
      articlesCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteArticles: Article[] = [];
          snapshot.forEach((docSnap) => {
            remoteArticles.push(docSnap.data() as Article);
          });
          // Ensure all 5 core category articles from INITIAL_ARTICLES are present
          const remoteIds = new Set(remoteArticles.map((a) => a.id));
          let hasMissing = false;
          for (const initArt of INITIAL_ARTICLES) {
            if (!remoteIds.has(initArt.id)) {
              remoteArticles.push(initArt);
              hasMissing = true;
            }
          }
          // Filter to only the 5 official articles plus any author-created articles (removing extra test articles)
          const initialIds = new Set(INITIAL_ARTICLES.map((a) => a.id));
          const cleanedArticles = remoteArticles.filter(
            (a) => initialIds.has(a.id) || a.authorId
          );
          if (hasMissing) {
            seedInitialFirestoreArticles();
          }
          localStorage.setItem(ARTICLES_KEY, JSON.stringify(cleanedArticles));
          emitDataSync("articles");
        } else {
          // If Firestore is empty, seed initial data to cloud
          seedInitialFirestoreArticles();
        }
      },
      (error) => {
        console.warn("Firestore articles listener status:", error.message);
      }
    );

    // 2. Videos Sync Listener
    const videosCol = collection(db, "videos");
    onSnapshot(
      videosCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteVideos: Video[] = [];
          snapshot.forEach((docSnap) => {
            remoteVideos.push(docSnap.data() as Video);
          });
          localStorage.setItem(VIDEOS_KEY, JSON.stringify(remoteVideos));
          emitDataSync("videos");
        } else {
          seedInitialFirestoreVideos();
        }
      },
      (error) => {
        console.warn("Firestore videos listener status:", error.message);
      }
    );

    // 3. Comments Sync Listener
    const commentsCol = collection(db, "comments");
    onSnapshot(
      commentsCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteComments: Comment[] = [];
          snapshot.forEach((docSnap) => {
            remoteComments.push(docSnap.data() as Comment);
          });
          localStorage.setItem(COMMENTS_KEY, JSON.stringify(remoteComments));
          emitDataSync("comments");
        }
      },
      (error) => {
        console.warn("Firestore comments listener status:", error.message);
      }
    );
  } catch (err) {
    console.warn("Firestore sync initialization warning: ", err);
  }
}

async function seedInitialFirestoreArticles() {
  try {
    for (const art of INITIAL_ARTICLES) {
      await setDoc(doc(db, "articles", art.id), art, { merge: true });
    }
    // Delete any of the extra test articles from Firestore if present
    for (let i = 2; i <= 5; i++) {
      for (const cat of ["science", "tech", "politics", "culture", "finance"]) {
        const extraId = `art-${cat}-${i}`;
        try {
          await deleteDoc(doc(db, "articles", extraId));
        } catch {
          // Document may not exist in cloud
        }
      }
    }
  } catch (error) {
    console.warn("Initial article seed note:", error);
  }
}

async function seedInitialFirestoreVideos() {
  try {
    for (const vid of INITIAL_VIDEOS) {
      await setDoc(doc(db, "videos", vid.id), vid);
    }
  } catch (error) {
    console.warn("Initial video seed note:", error);
  }
}

// Automatically initiate sync on module import
initFirestoreRealtimeSync();

// ----------------------------------------------------
// CMS Article Operations
// ----------------------------------------------------
export function loadArticles(): Article[] {
  const data = localStorage.getItem(ARTICLES_KEY);
  if (!data) {
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(INITIAL_ARTICLES));
    return INITIAL_ARTICLES;
  }
  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const initialIds = new Set(INITIAL_ARTICLES.map((a) => a.id));
      // Keep only the 5 official articles and any custom author articles
      const filtered = parsed.filter((a: Article) => initialIds.has(a.id) || a.authorId);
      const existingIds = new Set(filtered.map((a: Article) => a.id));
      const result = [...filtered];
      let hasMissing = false;
      for (const initArt of INITIAL_ARTICLES) {
        if (!existingIds.has(initArt.id)) {
          result.push(initArt);
          hasMissing = true;
        }
      }
      if (hasMissing || filtered.length !== parsed.length) {
        localStorage.setItem(ARTICLES_KEY, JSON.stringify(result));
      }
      return result;
    }
    return INITIAL_ARTICLES;
  } catch {
    return INITIAL_ARTICLES;
  }
}

export function saveArticles(articles: Article[]) {
  const previousArticles = loadArticles();
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  emitDataSync("articles");

  // Sync mutations to Firestore in background
  (async () => {
    try {
      // Find deleted articles
      const currentIds = new Set(articles.map((a) => a.id));
      for (const prev of previousArticles) {
        if (!currentIds.has(prev.id)) {
          await deleteDoc(doc(db, "articles", prev.id));
        }
      }
      // Upsert new or modified articles
      for (const art of articles) {
        await setDoc(doc(db, "articles", art.id), art, { merge: true });
      }
    } catch (err) {
      console.warn("Firestore article write note:", err);
    }
  })();
}

export async function saveSingleArticleToCloud(article: Article) {
  try {
    await setDoc(doc(db, "articles", article.id), article, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `articles/${article.id}`);
  }
}

export async function deleteArticleFromCloud(articleId: string) {
  try {
    await deleteDoc(doc(db, "articles", articleId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `articles/${articleId}`);
  }
}

// ----------------------------------------------------
// CMS Video Operations
// ----------------------------------------------------
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
  const prevVideos = loadVideos();
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
  emitDataSync("videos");

  // Cloud sync
  (async () => {
    try {
      const currentIds = new Set(videos.map((v) => v.id));
      for (const prev of prevVideos) {
        if (!currentIds.has(prev.id)) {
          await deleteDoc(doc(db, "videos", prev.id));
        }
      }
      for (const vid of videos) {
        await setDoc(doc(db, "videos", vid.id), vid, { merge: true });
      }
    } catch (err) {
      console.warn("Firestore video write note:", err);
    }
  })();
}

// ----------------------------------------------------
// Comments Operations
// ----------------------------------------------------
const INITIAL_COMMENTS: Comment[] = [
  {
    id: "com-1",
    articleId: "art-1",
    author: "Dr. Charles G.",
    text: "This is a masterpiece of environmental reporting. Bioacoustics provides a completely objective metric for biodiversity. We've seen similar patterns in marine biomes where sonar tracks reef health prior to bleaching.",
    date: "August 18, 2026, 4:12 PM",
  },
  {
    id: "com-2",
    articleId: "art-1",
    author: "Miranda V.",
    text: "Fascinating point about the 'silent migration'. If a forest becomes biologically dead but structurally standing, satellites will continue reporting it as preserved. This is a severe gap in existing carbon-credit tracking models.",
    date: "August 18, 2026, 8:45 PM",
  },
  {
    id: "com-3",
    articleId: "art-2",
    author: "Linus_K",
    text: "Diamond semiconductors are the ultimate endgame. The main hurdle has always been lattice matching when depositing on silicon. The Ulm team's direct gallium-nitride bonding is a massive breakthrough. Excited for the future of processing.",
    date: "August 16, 2026, 11:30 AM",
  },
  {
    id: "com-4",
    articleId: "art-4",
    author: "RetroCoder88",
    text: "The Lumina Registry is doing sacred work. I was active in several web forums in 2003, and looking back, those were some of the most intellectually honest digital spaces. Losing them to domain decay is a tragedy. Thank you for this.",
    date: "August 11, 2026, 9:02 AM",
  },
];

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

  (async () => {
    try {
      for (const com of comments) {
        await setDoc(doc(db, "comments", com.id), com, { merge: true });
      }
    } catch (err) {
      console.warn("Firestore comment write note:", err);
    }
  })();
}

// ----------------------------------------------------
// Bookmarks & Preferences
// ----------------------------------------------------
export function loadBookmarks(): string[] {
  const data = localStorage.getItem(BOOKMARKS_KEY);
  if (!data) return [];
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

// ----------------------------------------------------
// User Accounts & Authentication
// ----------------------------------------------------
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
  const users = loadUsers();
  const updatedUsers = users.map((u) =>
    u.role === "admin" ? { ...u, password: newPass } : u
  );
  saveUsers(updatedUsers);
}

// ----------------------------------------------------
// Shop & Provisions Placeholders
// ----------------------------------------------------
export function loadShopItems(): ShopItem[] {
  const data = localStorage.getItem(SHOP_ITEMS_KEY);
  if (!data) {
    localStorage.setItem(SHOP_ITEMS_KEY, JSON.stringify(INITIAL_SHOP_ITEMS));
    return INITIAL_SHOP_ITEMS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_SHOP_ITEMS;
  }
}

export function saveShopItems(items: ShopItem[]) {
  localStorage.setItem(SHOP_ITEMS_KEY, JSON.stringify(items));
  emitDataSync("shop_items");
}

export function loadShopEvents(): ShopEvent[] {
  const data = localStorage.getItem(SHOP_EVENTS_KEY);
  if (!data) {
    localStorage.setItem(SHOP_EVENTS_KEY, JSON.stringify(INITIAL_SHOP_EVENTS));
    return INITIAL_SHOP_EVENTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_SHOP_EVENTS;
  }
}

export function saveShopEvents(events: ShopEvent[]) {
  localStorage.setItem(SHOP_EVENTS_KEY, JSON.stringify(events));
  emitDataSync("shop_events");
}

export function loadCart(): CartItem[] {
  const data = localStorage.getItem(CART_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  emitDataSync("cart");
}
