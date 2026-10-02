# BulkResize | Free 100% Client-Side Bulk Image Resizer & Compressor

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](LICENSE)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-ff5d01.svg)](https://astro.build)
[![Powered by React](https://img.shields.io/badge/Islands-React-61dafb.svg)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind-38bdf8.svg)](https://tailwindcss.com)
[![Support Developer](https://img.shields.io/badge/Support-Buy%20Me%20a%20Coffee-FFDD00.svg)](https://buymeacoffee.com/kisharadilz)

A privacy-first, zero-server batch image resizer built with **Astro**, **React Islands**, and **Tailwind CSS**. Resize, compress, and convert hundreds of images simultaneously directly in your browser with zero file uploads.

**Live Website:** [https://bulkresize.github.io](https://bulkresize.github.io)  
**Developer Support:** [buymeacoffee.com/kisharadilz](https://buymeacoffee.com/kisharadilz)

---

## 🌟 Key Features

- **100% Client-Side Privacy:** Your photos never leave your device. All image processing, canvas operations, and ZIP bundling occur strictly inside local browser memory.
- **Hardware-Accelerated Speed:** Multi-threaded parallel processing using HTML5 Canvas & Web Workers.
- **Versatile Resizing Modes:**
  - **Percentage Scaling:** Instant 25%, 50%, 75%, 100% or granular 5% to 150% scaling.
  - **Exact Pixel Dimensions:** Set custom width & height with an aspect ratio lock toggle and dimension-swapping.
  - **Social & Display Presets:** Pre-configured formats for Instagram (Square, Story, Landscape), X/Twitter (Header, Post), YouTube (Thumbnail, Banner), Facebook, LinkedIn, Full HD, 2K, 4K, Web Hero, and Favicon.
- **Smart Format Conversion:** Convert between original format, modern lightweight **WebP**, **JPEG**, and lossless **PNG**.
- **Adjustable Compression Slider:** Fine-tune image quality from 10% to 100% with real-time before vs. after file size comparison and percentage savings.
- **1-Click Instant ZIP Export:** Client-side packaging powered by `jszip` with customizable file prefix naming and no cloud waiting queues.
- **Mobile Optimized & Touch Ready:** Full drag-and-drop support with mobile photo picker fallback, clipboard paste (Ctrl+V) listener, and responsive preview lightbox.
- **Dark & Light Mode:** Seamless theme toggle with zero-flicker client-side persistence.
- **Internationalization (i18n):** Static subpath localized routing across 6 languages:
  - English (`/`)
  - Español (`/es/`)
  - Português (`/pt/`)
  - Deutsch (`/de/`)
  - Français (`/fr/`)
  - 日本語 (`/ja/`)
- **Technical SEO Architected:**
  - `og:site_name` and social graph meta tags.
  - Structured data JSON-LD schemas: `WebApplication`, `SoftwareApplication` (`MultimediaApplication`), and `FAQPage`.
  - Full bidirectional `hreflang` tags across all language alternates and `x-default`.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** [Astro 5](https://astro.build) (Static Site Generation for sub-second load times)
- **UI Islands:** [React 19](https://react.dev)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) (Zinc & Indigo design tokens)
- **Archive Engine:** [JSZip](https://stuk.github.io/jszip/)
- **Icons:** [Lucide React](https://lucide.dev)
- **Celebration Effects:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+` or `v20+` or `v22+`
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

Visit `http://localhost:4321` in your browser.

### Static Production Build

```bash
npm run build
```

The compiled static site will be generated inside the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 📦 Deployment to GitHub Pages

The repository includes a ready-to-use GitHub Actions workflow (`.github/workflows/deploy.yml`).

1. In your GitHub repository, go to **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Push changes to the `main` branch:
   ```bash
   git add .
   git commit -m "Deploy BulkResize"
   git push origin main
   ```
4. GitHub Actions will automatically build and publish the site to `https://bulkresize.github.io`.

---

## ☕ Support the Developer

If BulkResize saved you time or server bandwidth, consider supporting the developer:

👉 **[Buy Me a Coffee](https://buymeacoffee.com/kisharadilz)**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
