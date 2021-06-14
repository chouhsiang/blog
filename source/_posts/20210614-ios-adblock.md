---
title: 盤點 iOS 上那些擋廣告的機制
date: 2021-06-14 19:41:34
tags:
categories: Mobile App
---

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
| App 內嵌廣告 | <i class="fas fa-times" style="color:red"></i> | <i class="fas fa-times" style="color:red"></i> | <i class="fas fa-check" style="color:green"></i> | <i class="fas fa-check" style="color:green"></i> | 
| App 內嵌網頁 | <i class="fas fa-times" style="color:red"></i> | <i class="fas fa-times" style="color:red"></i> | <i class="fas fa-check" style="color:green"></i> | <i class="fas fa-check" style="color:green"></i> | 
| Spotify | <i class="fas fa-times" style="color:red"></i> | <i class="fas fa-times" style="color:red"></i> | <i class="fas fa-times" style="color:red"></i> | <i class="fas fa-check" style="color:green"></i> | 
| Youtube | <i class="fas fa-times" style="color:red"></i> | <i class="fas fa-times" style="color:red"></i> | <i class="fas fa-times" style="color:red"></i> | <i class="fas fa-check" style="color:green"></i> | 
| 安全性 | 高 | 高 | 高 | 低 |
| 耗電量 | 低 | 低 | 高 | 高 |