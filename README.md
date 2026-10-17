# MarkPrev — Live Mermaid & Markdown Previewer

<p align="center">
  <img src="./docs/screenshots/markprev-preview.png" alt="MarkPrev — Live Mermaid & Markdown Previewer Showcase" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);" />
</p>

<p align="center">
  <strong>A high-performance, offline-first live editor and previewer for Mermaid diagrams and GitHub Flavored Markdown.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61dafb?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.0-646cff?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Storage-IndexedDB-green" alt="IndexedDB" />
  <img src="https://img.shields.io/badge/Tests-Vitest-yellow?logo=vitest" alt="Vitest" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel" alt="Vercel" />
</p>

---

## ✨ Features

- **⚡ Real-Time Split Preview**: Fluid 50/50 resizable split view with draggable center divider and double-click to re-center.
- **📊 Embedded Mermaid in Markdown**: Seamlessly write and render ```` ```mermaid ```` code blocks inside markdown documents with full syntax highlighting.
- **🔍 Interactive Pan, Zoom & Fullscreen**:
  - Pan by dragging the diagram canvas.
  - Zoom in/out with precision controls or double-click to reset.
  - In-app **Full Screen modal** expansion for complex, large-scale architectures.
- **👁️ Focus & Presentation Mode**: One-click **Hide Editor** toggle in the header that expands the live preview to 100% width for distraction-free reading or presenting.
- **💾 100% Offline Persistence**:
  - Multi-document management (Create, Rename, Delete, Switch) backed by browser **IndexedDB** (`markprev-db`).
  - View states, split ratio, editor visibility, and theme preferences saved automatically in `localStorage`.
- **🎨 High-DPI Lossless Export**:
  - **SVG Vector Image**: Infinite zoom, perfect for documentation and vector editors.
  - **High-DPI PNG**: Crisp 3x and 4x resolutions (300+ DPI quality).
  - **Raw Code**: Export `.md` or `.mmd` source files directly.
- **🛡️ Real-Time Syntax Validation**: Instant syntax linting and diagnostic feedback when invalid Mermaid diagram syntax is entered.
- **🌓 Dark & Light Modes**: Seamless switching with custom Tailwind v4 palette.
- **📖 In-App Styling Cheat Sheet**: Built-in interactive cheat sheet covering GFM tables, task lists, code blocks, and Mermaid flowchart/sequence/state diagram syntax.

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 4. Run Automated Test Suite
```bash
npm test
```
Runs unit and integration tests across storage, export services, split pane, editor toggles, and Mermaid validator suites.

### 5. Check Linting
```bash
npm run lint
```

### 6. Build for Production
```bash
npm run build
```
Generates a minified, production-ready static bundle in the `dist/` directory.

---

## 🏗️ Project Architecture

```
markprev/
├── docs/
│   └── screenshots/         # UI showcase screenshots
│       └── markprev-preview.png
├── public/
│   └── favicon.svg          # Custom SVG favicon
├── src/
│   ├── components/
│   │   ├── editor/          # Code editor panel & status bar
│   │   ├── layout/          # Header, Sidebar, ResizableSplitPane
│   │   ├── modals/          # Help & styling guide modal
│   │   └── preview/         # Live Markdown & Mermaid preview with pan/zoom
│   ├── services/
│   │   ├── exportService.ts # SVG & High-DPI PNG generation
│   │   ├── mermaidValidator.ts # Mermaid syntax validation
│   │   └── storage.ts       # IndexedDB database service
│   ├── types/               # TypeScript data models & schemas
│   ├── App.tsx              # Application root state & layout orchestration
│   └── main.tsx             # React DOM entry point
└── package.json
```

---

## 🌐 Deploy to Vercel

MarkPrev is a 100% client-side Single Page Application (SPA) with zero external database dependencies. It deploys to **Vercel** effortlessly:

1. Push this repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. If your project is inside a subfolder, set the **Root Directory** to `markprev`.
5. Vercel automatically detects the Vite configuration:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**. Your live previewer is instantly deployed worldwide on Vercel's Edge Network!

---

## 📄 License

MIT © [MarkPrev](https://github.com)
