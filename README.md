# 周詳程式筆記

以 [Fuwari](https://github.com/saicaca/fuwari) 建置。

網址：**https://blog.chouhsiang.tw**

## 使用

```bash
npm install
npm run dev      # http://localhost:4321/
npm run dev:tina # 含 TinaCMS 後台，編輯 Markdown 用
npm run build
npm run preview
```

## 用 TinaCMS 編輯文章（本機）

```bash
npm run dev:tina
```

- 部落格：`http://localhost:4321/`
- Tina 後台：`http://localhost:4321/admin/index.html`
- 我的演講：`#/collections/mySpeech`
- 我的證照：`#/collections/myCertificate`
- 我的 CVE：`#/collections/myCve`
- NIST 零信任：`#/collections/nistZerotrust`
- Cloudflare：`#/collections/cloudflare`
- Entra ID：`#/collections/entraId`
- Azure DevOps：`#/collections/azureDevops`
- 一般文章：`#/collections/post`

Local mode 直接寫入 `src/content/`，不需 Tina Cloud。`/admin` 僅本機開發可用，不會部署到正式站。

## 設定

- `src/config.ts` — 網站名稱、導覽、個人資料
- `astro.config.mjs` — `site`（正式網域）

## 新增文章

```bash
npm run new-post my-post
```

或參考 `src/content/posts/welcome.md` 手動建立。

## 部署（Cloudflare Pages）

1. 在 [Cloudflare Dashboard](https://dash.cloudflare.com/) 建立 Pages 專案，連結 GitHub repo `chouhsiang/blog`
2. 建置設定：
   - **Framework preset**：Astro
   - **Build command**：`npm run build`
   - **Build output directory**：`dist`
   - **Node.js version**：`22`（Environment variables → `NODE_VERSION` = `22`）
3. 自訂網域：在 Pages 專案加入 `blog.chouhsiang.tw`，並依指示設定 DNS（通常為 CNAME 指向 `*.pages.dev`）

推送到 `main` 後，Cloudflare Pages 會自動建置並部署。
