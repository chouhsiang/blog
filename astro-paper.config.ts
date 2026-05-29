import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://chouhsiang.github.io", // 網域；實際網址為 /blog/
    title: "周詳程式筆記",
    description: "周詳的程式開發筆記與學習心得。",
    author: "周詳",
    profile: "https://github.com/chouhsiang",
    ogImage: "default-og.jpg",
    lang: "zh-TW",
    timezone: "Asia/Taipei",
  },
  posts: {
    perPage: 10,
    perIndex: 5,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: false,
    showBackButton: true,
    editPost: { enabled: false },
    search: false,
  },
  socials: [{ name: "github", url: "https://github.com/chouhsiang" }],
  shareLinks: [],
});
