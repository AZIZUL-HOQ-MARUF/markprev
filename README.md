# MarkPrev — Live Mermaid & Markdown Previewer

A fast, lightweight, and modern previewing tool for **Mermaid Diagrams** and **Markdown Documents**, featuring:
- **50/50 Resizable Split Pane**: Draggable center divider with double-click reset.
- **Real-Time Syntax Validation**: Instant error diagnostics and suggestions when invalid Mermaid code is entered.
- **Offline Browser Storage**: Complete persistence with **IndexedDB** (`markprev-db`) — no external database needed.
- **High-Density Export**:
  - **SVG Vector Image** (Lossless infinite zoom)
  - **High-DPI PNG** (3x / 4x resolution, 300+ DPI crisp quality)
  - **Raw Code** (`.mmd` / `.md`)
- **Help & Styling Cheat Sheet**: Modal guide accessible from the header info icon (`i`).
- **Dark / Light Mode**: Sleek theme support.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Run Automated Unit Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Deploy to Vercel

MarkPrev is a 100% client-side application and deploys to **Vercel** with zero configuration:

1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. If this project is inside a subfolder, set the **Root Directory** to `markprev`.
4. Vercel automatically detects the Vite framework preset:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**!
