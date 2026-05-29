import type { UIStrings } from "../types";

export default {
  nav: {
    home: "首頁",
    posts: "文章",
    tags: "標籤",
    about: "關於",
    archives: "歸檔",
    search: "搜尋",
  },
  post: {
    publishedAt: "發布於",
    updatedAt: "更新於",
    sharePostIntro: "分享這篇文章：",
    sharePostOn: "在 {{platform}} 分享",
    sharePostViaEmail: "以 Email 分享",
    tagLabel: "標籤",
    backToTop: "回到頂部",
    goBack: "返回",
    editPage: "編輯",
    previousPost: "上一篇",
    nextPost: "下一篇",
  },
  pagination: {
    prev: "上一頁",
    next: "下一頁",
    page: "第",
  },
  home: {
    socialLinks: "社群連結",
    featured: "精選",
    recentPosts: "最新文章",
    allPosts: "所有文章",
  },
  footer: {
    copyright: "版權",
    allRightsReserved: "保留所有權利。",
  },
  pages: {
    tagTitle: "標籤",
    tagDesc: "此標籤下的所有文章",

    tagsTitle: "標籤",
    tagsDesc: "所有文章標籤",

    postsTitle: "文章",
    postsDesc: "所有已發布的文章",

    archivesTitle: "歸檔",
    archivesDesc: "依時間歸檔的文章",

    searchTitle: "搜尋",
    searchDesc: "搜尋文章…",
  },
  a11y: {
    skipToContent: "跳至內容",
    openMenu: "開啟選單",
    closeMenu: "關閉選單",
    toggleTheme: "切換主題",
    searchPlaceholder: "搜尋文章…",
    noResults: "找不到結果",
    goToPreviousPage: "上一頁",
    goToNextPage: "下一頁",
  },
  notFound: {
    title: "404 找不到頁面",
    message: "找不到此頁面",
    goHome: "返回首頁",
  },
} satisfies UIStrings;
