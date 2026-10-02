# BulkResize | Free 100% Client-Side Bulk Image Resizer & Compressor

[![License: MIT](https://img.shields.io/badge/License-MIT-4C4541.svg)](LICENSE)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro%205-F2C46A.svg)](https://astro.build)
[![Powered by React](https://img.shields.io/badge/Islands-React%2019-AEAC78.svg)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-4C4541.svg)](https://tailwindcss.com)
[![Google Analytics](https://img.shields.io/badge/Analytics-gtag.js%20(G--QRXJ44Z82J)-F2C46A.svg)](https://marketingplatform.google.com/about/analytics/)
[![SEO Score](https://img.shields.io/badge/Technical%20SEO-100%25%20Verified-AEAC78.svg)](#-technical-seo-architecture)
[![Support Developer](https://img.shields.io/badge/Support-Buy%20Me%20a%20Coffee-F2C46A.svg)](https://buymeacoffee.com/kisharadilz)

A privacy-first, zero-server batch image resizer, compressor, and format converter built with **Astro**, **React Islands**, and **Tailwind CSS**. Resize, compress, and convert hundreds of images simultaneously directly in your browser with zero file uploads and infinite confidentiality.

- 🌐 **Live Website:** [https://bulkresize.github.io](https://bulkresize.github.io)
- 📚 **Educational Guide:** [https://bulkresize.github.io/how-to-bulk-resize-compress-images-free/](https://bulkresize.github.io/how-to-bulk-resize-compress-images-free/)
- ☕ **Developer Support:** [buymeacoffee.com/kisharadilz](https://buymeacoffee.com/kisharadilz)

---

## 🎨 Custom Design System & Color Palette

BulkResize features a refined, distraction-free aesthetic with high-contrast typography, soft natural tones, and smooth light/dark mode transitions:

| Token | Hex Code | Visual Swatch | Role |
| :--- | :--- | :--- | :--- |
| **Cream** | `#FCF0DA` | `[  Cream  ]` | Light theme workspace background, soft card surfaces, and dark text highlights |
| **Sage Olive** | `#AEAC78` | `[SageOlive]` | Badges, secondary icons, breadcrumbs, accents, and borders |
| **Honey Gold** | `#F2C46A` | `[HoneyGold]` | Primary brand accent, progress bars, active sliders, buttons, and focus rings |
| **Deep Charcoal** | `#4C4541` | `[ Charcoal]` | Core typography, high-contrast buttons, dropzone icons, and dark theme bases |

---

## 🌟 Key Features

### 1. 100% Client-Side Privacy & Security
- **Zero Server Uploads:** Photos never leave your device. All scaling, format encoding, and compression take place exclusively in local browser RAM using the HTML5 Canvas API and Web Workers.
- **Enterprise & GDPR Safe:** Safe for personal photos, confidential business assets, receipts, and sensitive documents.

### 2. High-Performance Batch Processing
- **Multi-Threaded Web Workers:** Non-blocking hardware acceleration runs concurrent resizing jobs across device CPU cores.
- **Large Batch Support:** Scale dozens or hundreds of images in a single session without memory leaks or browser crashes.

### 3. Versatile Scaling Modes
- **Percentage Scaling:** Quick 25%, 50%, 75%, 100% shortcuts or granular 5% to 150% slider adjustments.
- **Exact Pixel Dimensions:** Set custom pixel width & height with an interactive aspect-ratio lock toggle and dimension-swap button.
- **Preset Dimensions:** Pre-configured dimensions for:
  - **Instagram:** Square (1080×1080), Portrait (1080×1350), Story/Reels (1080×1920)
  - **YouTube:** Video Thumbnail (1280×720), Channel Banner (2560×1440)
  - **Shopify & Ecommerce:** High-res Product (2048×2048)
  - **Twitter / X:** In-stream Post (1200×675), Header (1500×500)
  - **Web Optimization:** Hero Banner (1920×1080), 4K UHD (3840×2160), 2K QHD (2560×1440), Favicon (32×32)

### 4. Smart Compression & Format Conversion
- **Modern WebP:** Convert legacy JPGs and PNGs to modern WebP for 75%–90% byte reduction.
- **Adjustable Quality Slider (1% to 100%):** Perceptual quality calibration with instant before vs. after file size comparison and savings percentages.
- **Lossless PNG & Universal JPEG:** Full transparency preservation or legacy fallback support.

### 5. 1-Click ZIP Packaging
- Automated in-browser packaging powered by `jszip`.
- Custom output file prefix naming.
- Zero server wait queues.

### 6. Mobile & Tablet Icons-Only Navigation
- Ultra-clean header for small screens displaying only minimal action icons (Language selector, Theme toggle, BuyMeACoffee, Menu toggle).
- Animated slide-down mobile drawer with quick navigation links to the workspace, features, educational guide, and FAQ.

### 7. Multi-Language Subpath Routing (i18n)
Full static localized routes across 6 major languages:
- English (`/`)
- Español (`/es/`)
- Português (`/pt/`)
- Deutsch (`/de/`)
- Français (`/fr/`)
- 日本語 (`/ja/`)

---

## 🔍 Technical SEO Architecture (100% Verified)

The project adheres to 100% technical SEO standards:

- **Unified Schema.org `@graph` Payload:**
  - `Organization` & `WebSite` connected entity schemas
  - `BreadcrumbList` (with Schema.org microdata in HTML)
  - `WebApplication` & `SoftwareApplication` (`MultimediaApplication`)
  - `HowTo` schema with 4-step execution data
  - `TechArticle` schema on educational pillar pages
  - `FAQPage` rich snippets
- **100% White-Hat Compliance:** Zero fake reviews or artificial ratings, eliminating manual action penalties.
- **OpenGraph & Twitter Cards:** Complete 1200×630 OpenGraph card (`og-image.png`), type declarations (`website` and `article`), and secure URL references.
- **Robots & Sitemaps:** Automated static generation of `sitemap-index.xml`, `sitemap-0.xml`, and strict `robots.txt`.
- **Hreflang Tags:** Bidirectional alternate hreflang cluster for all locales plus `x-default`.
- **Accessibility & ARIA:** Complete semantic landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<details>`, `<table>`), strictly ordered headings (1 `<h1>`, 4 `<h2>`, 14 `<h3>`), and 100% ARIA label coverage on all interactive form controls (WCAG 2.1 AA).
- **Core Web Vitals:** Cumulative Layout Shift (CLS: 0.00) with inline SVGs, zero initial image waterfalls, and LCP < 0.6s.

---

## 📚 Educational Content

BulkResize features an in-depth educational resource:

👉 **[How to Bulk Resize & Compress Images Free](https://bulkresize.github.io/how-to-bulk-resize-compress-images-free/)**
- Position 0 Featured Snippet Quick Answer Box
- Mathematical aspect ratio equations: $\text{Height} = \text{Width} \times \left(\frac{\text{Original Height}}{\text{Original Width}}\right)$
- Lossy vs. Lossless compression mechanisms (Huffman/DEFLATE vs. Discrete Cosine Transform)
- WebP vs. JPEG vs. PNG feature comparison matrix
- Interactive live practice sandbox embedding the resizer island directly into the lesson

---

## 🛠️ Tech Stack

- **Static Site Generator:** [Astro 5](https://astro.build)
- **Interactive Islands:** [React 19](https://react.dev)
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com)
- **ZIP Bundler:** [JSZip](https://stuk.github.io/jszip/)
- **Icons:** Custom optimized inline SVGs
- **Analytics:** Google Tag (gtag.js) `G-QRXJ44Z82J`
- **Celebration Effects:** Canvas Confetti

---

## 📁 Project Structure

```text
bulkresize.github.io/
├── public/
│   ├── favicon.svg             # Vector SVG favicon (brand colors)
│   ├── favicon.ico             # Fallback ICO icon
│   ├── og-image.png            # 1200x630 OpenGraph social sharing card
│   ├── robots.txt              # Search crawler directives
│   └── site.webmanifest        # Progressive Web App manifest
├── src/
│   ├── components/
│   │   ├── BreadcrumbNav.astro # Accessible breadcrumbs with Schema microdata
│   │   ├── BulkResizer.tsx     # React island: batch canvas resizer engine
│   │   ├── FaqSection.astro    # Accessible FAQ accordions
│   │   ├── FeaturesSection.astro# Privacy, speed, and format feature cards
│   │   ├── Footer.astro        # Semantic footer with navigation links
│   │   ├── Header.astro        # Responsive icons-only navbar & mobile drawer
│   │   ├── Hero.astro          # Landing hero with breadcrumb integration
│   │   ├── HowItWorks.astro    # 3-step workflow diagram
│   │   ├── PresetsCheatSheet.astro # Dimensions reference table
│   │   ├── SeoHead.astro       # Dynamic metadata & unified @graph schemas
│   │   └── ThemeScript.astro   # Zero-flicker light/dark mode persistence
│   ├── i18n/
│   │   ├── ui.ts               # Localized translations (en, es, pt, de, fr, ja)
│   │   └── utils.ts            # Subpath URL resolution utilities
│   ├── layouts/
│   │   └── Layout.astro        # Master HTML layout with gtag.js & font loading
│   ├── pages/
│   │   ├── 404.astro           # Custom 404 error page
│   │   ├── index.astro         # English root homepage (/)
│   │   ├── de/index.astro      # German localized homepage (/de/)
│   │   ├── es/index.astro      # Spanish localized homepage (/es/)
│   │   ├── fr/index.astro      # French localized homepage (/fr/)
│   │   ├── ja/index.astro      # Japanese localized homepage (/ja/)
│   │   ├── pt/index.astro      # Portuguese localized homepage (/pt/)
│   │   └── how-to-bulk-resize-compress-images-free.astro # Educational guide
│   ├── styles/
│   │   └── global.css          # Custom palette theme tokens & animations
│   └── utils/
│       └── imageEngine.ts      # Canvas scaling, aspect ratios & blob conversion
├── scripts/
│   ├── generate-og-image.mjs   # OpenGraph PNG generator script
│   ├── seo-audit-report.mjs    # Homepage 100% technical SEO audit verifier
│   └── verify-guide-seo.mjs    # Educational guide SEO validator
├── astro.config.mjs            # Astro configuration with i18n and sitemap
├── package.json
├── tailwind.config.mjs         # Tailwind palette design tokens
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.0.0+`, `v20.0.0+`, or `v22.0.0+`
- npm `v9+` or `v10+`

### Installation

```bash
# Clone the repository
git clone https://github.com/bulkresize/bulkresize.github.io.git
cd bulkresize.github.io

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```
Open `http://localhost:4321` in your browser.

### Production Build & SEO Verification

```bash
# Compile static production files
npm run build

# Verify homepage SEO compliance (100% score)
node scripts/seo-audit-report.mjs

# Verify educational guide SEO compliance
node scripts/verify-guide-seo.mjs
```

### Local Preview

```bash
npm run preview
```

---

## 📦 Deployment to GitHub Pages

The repository contains an automated GitHub Actions deployment workflow at `.github/workflows/deploy.yml`.

1. Go to your repository **Settings > Pages**.
2. Under **Build and deployment > Source**, choose **GitHub Actions**.
3. Push commits to `main`:
   ```bash
   git add .
   git commit -m "Deploy BulkResize"
   git push origin main
   ```
4. The site will automatically build and publish to `https://bulkresize.github.io`.

---

## ☕ Support the Developer

If BulkResize saved you time, storage, or bandwidth, please consider supporting the project:

👉 **[Buy Me a Coffee](https://buymeacoffee.com/kisharadilz)**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
