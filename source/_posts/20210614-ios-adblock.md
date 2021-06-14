---
title: 盤點 iOS 上那些擋廣告的機制
date: 2021-06-14 19:41:34
tags:
categories: Mobile App
toc: true
---
<!-- md mermaid.md -->
<style>
.fa-times {
  color: red;
}
.fa-check {
  color: green;
}
</style>

覺得手機上各種廣告很惱人嗎？今天我們來研究一下 iOS 上那些擋廣告 App 的原理，並看看要怎麼選擇

## 常見的擋廣告機制
以下四種是我整理出目前 iOS 上可以用的阻擋廣告機制
1. Safari 內容阻擋器
2. 瀏覽器
3. DNS
4. VPN + 根憑證

我們來看一下這幾種的比較

| 項目 | Safari 內容阻擋器 | 瀏覽器 | DNS | VPN + 根憑證 | 
| - | :-: | :-: | :-: | :-: | 
| 應用程式 | [Adguard](https://apps.apple.com/tw/app/adguard-adblock-privacy/id1047223162)<br>[AdBlock Pro for Safari](https://apps.apple.com/tw/app/adblock-pro-for-safari/id1018301773)<br>[Adblock Plus for Safari](https://apps.apple.com/tw/app/adblock-plus-for-safari-abp/id1028871868) | [Firefox Focus](https://apps.apple.com/tw/app/firefox-focus-privacy-browser/id1055677337)<br>[Brave](https://apps.apple.com/tw/app/brave-browser-fast-web-privacy/id1052879175)<br>[Opera](https://apps.apple.com/tw/app/opera-touch-web-browser/id1411869974) | [Adguard Pro ($330)](https://apps.apple.com/tw/app/adguard-pro-adblock/id1126386264)<br>[AdBlock ($70)](https://apps.apple.com/tw/app/adblock/id691121579)<br>[Blokada](https://apps.apple.com/tw/app/blokada/id1508341781)<br>[DNSCloak](https://apps.apple.com/tw/app/dnscloak-secure-dns-client/id1452162351)| [Luna VPN](https://emban-networks.com/) | 
| 阻擋範圍 | 僅 Safari | 僅該瀏覽器 | 絕大部分 App | 所有 App | 
| App 內嵌廣告 | <i class="fas fa-times"></i> | <i class="fas fa-times"></i> | <i class="fas fa-check"></i> | <i class="fas fa-check"></i> | 
| App 內嵌網頁 | <i class="fas fa-times"></i> | <i class="fas fa-times"></i> | <i class="fas fa-check"></i> | <i class="fas fa-check"></i> | 
| Youtube | <i class="fas fa-times"></i> | <i class="fas fa-times"></i> | <i class="fas fa-times"></i> | <i class="fas fa-check"></i> | 
| 安全性 | 高 | 高 | 高 | 低 |
| 耗電量 | 低 | 低 | 高 | 高 |


### 1. Safari 內容阻擋器

Safari 內容阻擋器是 Safari 內建就提供的功能，透過安裝第三方 App，能夠新增內容阻擋器，也可以選擇要過濾掉哪些內容，例如：廣告、隱私、社群小工具、提升安全性等。優點在於使用硬體效能較少，不太好點，且安全。

內容阻擋器主要是透過前端在渲染的過程，將不要的元素移除，但如果是在其他 App 中嵌入的網頁，就無法阻擋廣告。

我個人推薦使用 Adguard，除了有 Adguard 自行維護的廣告過濾器外，也有很多第三方過濾器可以選擇，更可以網址新增任意過濾器，還有進階的追蹤防護使瀏覽更安全、白名單網域等功能。

### 2. 瀏覽器

這些瀏覽器本身就提供阻擋廣告的功能，如：Firefox Focus、Brave、Opera，我個人習慣上還是使用 Safari 當作預設瀏覽器，所以不會當作我的選項。

題外話，iOS 的政策只容許 App 使用內建的 WebKit 框架以及 WebKit JavaScript 引擎，因此不論 Chrome 或 Firefox 的 iOS 版本，其實只是一個基於 Safari 換了介面，只能加入一些功能而無法使用自家設計的內核，以提升網頁瀏覽及執行 JavaScript 的性能。另外，其他瀏覽器是被迫使用舊的慢的 WebKit Javascript 引擎，而只有 Safari 可以使用最新最快的 Nitro Javascript 引擎。

### 3. DNS

什麼是 DNS？ DNS 也就是網域名稱系統，可以將網域 (如：www.google.com) 轉換為 IP 地址 (如：8.8.8.8)。

但是 DNS 跟擋廣告有什麼關係，原理是只要將廣告用的網域轉換成其他 IP，App 無法取得廣告內容就不會顯示出來。由於 iOS 政策關係，沒辦法選擇本機 DNS 伺服器，所以市面上的 DNS App 都是透過在手機本地建立 VPN 伺服器，以此來指定 DNS 伺服器。因為有此特性，有些 App 也會提供自定義本地 hosts 功能，或黑名單、白名單。自定義的 DNS 也可以選擇 DNS over TLS、DNS over HTTPS，提升使用上的安全性。

這種阻擋廣告的方式優點很多，可以擋下大部分的廣告，少部分廣告無法移除，如：Youtube、Spotify、巴哈姆特動畫瘋。也因為可以自定義 DNS，提升瀏覽上的安全性，可能會有的安全性問題在於，由於都是使用第三方的 DNS App，如果他在裡面對 DNS 加料，我們也不曉得，注意使用的網站是不是在 https 以保持安全。使用本方法會在本機背後開啟 VPN 伺服器，相對會比較耗電，我個人習慣是有需要用在打開 Adguard Pro，沒事就關閉，平常瀏覽網站有 Safari 內容阻擋器就很足夠。
```mermaid
graph LR
    subgraph iPhone
    A[Apps]-->|VPN|B[DNS App]
    end
    B-->|ad.google.com|C[DNS Server]
    C-->|127.0.0.1|B
    B-->D[Server]
```

### 4. VPN + 根憑證

```mermaid
graph LR
    subgraph iPhone
    A[Apps]
    end
    A-->|VPN|B[VPN Server]
    B-->C[Server]
```
