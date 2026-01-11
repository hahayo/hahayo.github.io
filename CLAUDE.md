# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

n8n 個人作品集網站，用於展示 n8n 自動化專案、AI 應用與技能經歷。

- **技術**：純 HTML + CSS + JavaScript（無框架）
- **部署**：GitHub Pages
- **設計**：深色科技風、單頁式、RWD

## 開發指令

```bash
# 本地預覽（直接開啟 index.html 或使用 live server）
npx live-server

# 部署（push 到 GitHub 後自動部署）
git push origin main
```

## 檔案結構

```
├── index.html              # 主頁面
├── css/style.css           # 樣式表
├── js/
│   ├── main.js             # 導覽、滾動、動畫
│   └── projects.js         # 專案載入、篩選、Modal
└── assets/
    ├── data/projects.json  # 專案資料（新增專案改這裡）
    ├── images/projects/    # 專案圖片
    ├── videos/             # MP4 影片
    └── workflows/          # n8n JSON 下載檔
```

## 專案資料結構 (projects.json)

```json
{
  "id": "專案ID",
  "category": "n8n | github | ai | tool",
  "name": "專案名稱",
  "desc": "一句話描述",
  "metrics": ["成效1", "成效2"],
  "tags": ["標籤1", "標籤2"],
  "cover": "封面圖.png",
  "images": ["截圖1.png", "截圖2.png"],
  "video": "YouTube embed URL 或 MP4 檔名",
  "github": "GitHub 連結",
  "workflow": "n8n JSON 檔名",
  "details": "詳細說明，用 \\n 換行"
}
```

## 新增專案流程

1. 準備素材（封面圖、截圖、影片、n8n JSON）
2. 圖片放入 `assets/images/projects/`，影片放入 `assets/videos/`，JSON 放入 `assets/workflows/`
3. 編輯 `assets/data/projects.json` 新增專案物件
4. git push

## 圖片命名規則

- 封面圖：`{專案id}-cover.png`
- 截圖：`{專案id}-flow1.png`, `{專案id}-flow2.png`
- 架構圖：`{專案id}-architecture.png`

## 分類標籤

| category | 顯示名稱 | 顏色 |
|----------|----------|------|
| n8n | n8n 自動化 | #ff6b35 |
| github | GitHub | #6e5494 |
| ai | AI 應用 | #00d4aa |
| tool | 工具/腳本 | #3b82f6 |

## 第三方套件

- Swiper.js（輪播）
- ScrollReveal（滾動動畫）
- Google Fonts（Inter、Noto Sans TC）

## 規格書

完整規格請參考 `portfolio-spec.md`
