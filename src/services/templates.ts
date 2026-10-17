import type { DocumentType } from '../types/document';

export interface TemplateItem {
  id: string;
  name: string;
  type: DocumentType;
  description: string;
  code: string;
}

export const STARTER_TEMPLATES: TemplateItem[] = [
  {
    id: 'mermaid-flowchart-td',
    name: 'Flowchart (Top to Bottom)',
    type: 'mermaid',
    description: 'Classic Top-Down flowchart with decisions and styles',
    code: `graph TD
    Start([User Initiates Request]) --> Validate{Is Input Valid?}
    
    Validate -- Yes --> Process[Process Request in Background]
    Validate -- No --> ShowError[Render Error in Right Panel]
    
    Process --> Store[(Save to IndexedDB)]
    Store --> RenderPreview[Render High-Res Preview]
    
    RenderPreview --> Download[/Download SVG or 3x PNG/]
    ShowError --> Retry[User Corrects Syntax]
    Retry --> Validate
    
    classDef success fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff;
    classDef error fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff;
    classDef highlight fill:#6366f1,stroke:#4f46e5,stroke-width:2px,color:#fff;
    
    class RenderPreview,Download success;
    class ShowError error;
    class Validate highlight;`
  },
  {
    id: 'mermaid-flowchart-lr',
    name: 'Flowchart (Left to Right)',
    type: 'mermaid',
    description: 'Horizontal system pipeline and processing flow',
    code: `flowchart LR
    A[Raw Code Input] --> B[Syntax Validator]
    B -->|Valid Syntax| C[Mermaid SVG Engine]
    B -->|Invalid Syntax| D[Error Diagnostics Banner]
    C --> E[Dynamic Zoom & Pan Canvas]
    E --> F[High-DPI 300 DPI Export]`
  },
  {
    id: 'mermaid-sequence',
    name: 'Sequence Diagram',
    type: 'mermaid',
    description: 'Component interaction, API calls and message flow',
    code: `sequenceDiagram
    autonumber
    actor User
    participant Editor as Code Editor
    participant Validator as Syntax Validator
    participant Preview as Preview Panel
    participant Storage as IndexedDB

    User->>Editor: Enters Mermaid or Markdown code
    Editor->>Storage: Debounced auto-save (300ms)
    Editor->>Validator: Validate code syntax
    alt Code is valid
        Validator-->>Preview: Render high-resolution diagram
    else Code is invalid
        Validator-->>Preview: Display detailed error message & hints
    end
    User->>Preview: Click Download (SVG / High-DPI PNG)
    Preview-->>User: Trigger crystal-clear file download`
  },
  {
    id: 'mermaid-class',
    name: 'Class Diagram',
    type: 'mermaid',
    description: 'Object-oriented schema and relationships',
    code: `classDiagram
    class DocumentRecord {
        +String id
        +String title
        +DocumentType type
        +String content
        +Number createdAt
        +Number updatedAt
        +save() void
        +export(format) Blob
    }
    class StorageService {
        +initDB()
        +getAllDocuments() List
        +saveDocument(doc)
        +deleteDocument(id)
    }
    class MermaidValidator {
        +validate(code) ValidationResult
        +render(id, code) SVGElement
    }
    StorageService ..> DocumentRecord : persists
    MermaidValidator ..> DocumentRecord : validates`
  },
  {
    id: 'markdown-guide',
    name: 'Markdown Comprehensive Guide',
    type: 'markdown',
    description: 'Full markdown showcase with formatting, tables, tasks, and code',
    code: `# MarkPrev — Live Markdown & Mermaid Previewer

Welcome to **MarkPrev**! A clean, distraction-free markdown and diagram editor built for speed, responsiveness, and crystal-clear visual export.

---

## 🚀 Key Features

- **Split View Editor**: Drag the center divider to adjust editor vs. preview width (default 50/50).
- **Mermaid & Markdown Support**: Seamlessly switch between diagram modeling and rich documentation.
- **Offline & Private**: Everything is saved directly in your browser's **IndexedDB**.
- **High-DPI Image Export**: Export diagrams and notes as **SVG vector** (lossless zoom) or **High-DPI PNG** (300 DPI).

---

## 📊 Formatted Table Example

| Feature | Support | Storage | Export Formats |
| :--- | :---: | :---: | :--- |
| **Mermaid Diagrams** | ✅ Full Syntax | IndexedDB | SVG, 2x/3x/4x PNG, .mmd |
| **GitHub Markdown** | ✅ GFM Spec | IndexedDB | HTML, Raw .md |
| **Pan & Zoom Canvas** | ✅ Interactive | Client Memory | Native SVG Scale |

---

## 📝 Interactive Task Checklist

- [x] Initial 50/50 split view with smooth resizer handle
- [x] Real-time Mermaid validation & instant error diagnostics
- [x] High-density vector (SVG) and raster (PNG) download
- [x] Local storage with IndexedDB document manager
- [ ] Try typing custom markdown or Mermaid graphs!

---

## 💻 Code Block Example

\`\`\`typescript
interface ExportOptions {
  format: 'svg' | 'png' | 'raw';
  scale: 1 | 2 | 3 | 4; // 3x = 300 DPI Ultra Sharp
  filename: string;
}
\`\`\`

> 💡 **Tip**: Use the **Export** button in the top navigation bar to download at up to 4x resolution for presentation slides and high-res printouts!
`
  }
];

export const DEFAULT_MERMAID_CODE = STARTER_TEMPLATES[0].code;
export const DEFAULT_MARKDOWN_CODE = STARTER_TEMPLATES[4].code;
