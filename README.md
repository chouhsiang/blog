# 周詳程式筆記

個人技術部落格，以 [Astro Paper](https://github.com/satnaing/astro-paper) 建置。

網址：**https://chouhsiang.github.io/blog/**

## 使用

```bash
npm install
npm run dev      # http://localhost:4321/blog/
npm run build
npm run preview  # http://localhost:4321/blog/
```

## 設定

編輯 `astro-paper.config.ts`。

## 新增文章

在 `src/content/posts/` 建立 `.md` 檔案，參考 `welcome.md`。

```md
---
title: 文章標題
description: 摘要
pubDatetime: 2025-05-29
tags:
  - javascript
---
```

草稿：`draft: true`

## 部署到 GitHub Pages

使用 repo **`chouhsiang/blog`**，網址為 `https://chouhsiang.github.io/blog/`。

### 1. 啟用 GitHub Pages

1. 推送程式到 `main` 分支
2. 到 repo **Settings → Pages**
3. **Build and deployment → Source** 選 **GitHub Actions**

### 2. 自動部署

推送到 `main` 會觸發 `.github/workflows/deploy.yml`，建置完成後網站即會更新。

也可在 GitHub **Actions** 分頁手動執行 **Deploy to GitHub Pages**。
