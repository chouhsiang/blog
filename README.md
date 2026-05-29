# 周詳程式筆記

以 [Fuwari](https://github.com/saicaca/fuwari) 建置。

網址：**https://chouhsiang.github.io/blog/**

## 使用

```bash
npm install
npm run dev      # http://localhost:4321/blog/
npm run build
npm run preview
```

## 設定

- `src/config.ts` — 網站名稱、導覽、個人資料
- `astro.config.mjs` — `site`、`base`（GitHub Pages 路徑）

## 新增文章

```bash
npm run new-post my-post
```

或參考 `src/content/posts/welcome.md` 手動建立。

## 部署

推送到 `main`，GitHub Actions 自動部署。  
repo **Settings → Pages → Source** 選 **GitHub Actions**。
