import { useState, useEffect, useRef, useCallback } from 'react';
import type { DocumentRecord, DocumentType, PngScale } from './types/document';
import {
  seedInitialDocuments,
  saveDocument,
  createDocument,
  renameDocument,
  deleteDocument,
  getLastActiveDocId,
  setLastActiveDocId,
} from './services/storage';
import { exportSvg, exportHighDpiPng, exportRawFile } from './services/exportService';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ResizableSplitPane } from './components/layout/ResizableSplitPane';
import { CodeEditor } from './components/editor/CodeEditor';
import { PreviewContainer } from './components/preview/PreviewContainer';
import { HelpModal } from './components/modals/HelpModal';

export function App() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [activeDocId, setActiveDocId] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [mermaidSvg, setMermaidSvg] = useState<SVGElement | null>(null);

  // Editor panel visibility with localStorage persistence
  const [isEditorVisible, setIsEditorVisible] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('markprev_show_editor');
      if (saved !== null) {
        return saved === 'true';
      }
    } catch {
      // Ignore
    }
    return true;
  });

  const handleToggleEditor = () => {
    setIsEditorVisible((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('markprev_show_editor', next.toString());
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Dark mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('markprev_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('markprev_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('markprev_theme', 'light');
    }
  }, [isDark]);

  // Load initial documents from IndexedDB
  useEffect(() => {
    const init = async () => {
      const docs = await seedInitialDocuments();
      setDocuments(docs);

      const lastId = getLastActiveDocId();
      const initialDoc = docs.find((d) => d.id === lastId) || docs[0];
      if (initialDoc) {
        setActiveDocId(initialDoc.id);
      }
    };
    init();
  }, []);

  const activeDoc = documents.find((d) => d.id === activeDocId);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Debounced Auto-save to IndexedDB (350ms)
  const saveTimeoutRef = useRef<number | null>(null);

  const handleContentChange = useCallback(
    (newContent: string) => {
      if (!activeDoc) return;

      const updatedDoc: DocumentRecord = {
        ...activeDoc,
        content: newContent,
        updatedAt: Date.now(),
      };

      // Immediate state update for responsive 60fps typing
      setDocuments((prev) =>
        prev.map((d) => (d.id === activeDoc.id ? updatedDoc : d))
      );

      setSaveStatus('saving');

      // Debounce saving to IndexedDB (350ms) to preserve performance
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = window.setTimeout(async () => {
        await saveDocument(updatedDoc);
        setSaveStatus('saved');
      }, 350);
    },
    [activeDoc]
  );

  const handleSelectDoc = (id: string) => {
    // Flush pending save if any
    if (saveTimeoutRef.current && activeDoc) {
      window.clearTimeout(saveTimeoutRef.current);
      saveDocument(activeDoc);
      setSaveStatus('saved');
    }
    setActiveDocId(id);
    setLastActiveDocId(id);
  };

  const handleCreateDoc = async (type: DocumentType) => {
    const newDoc = await createDocument(type);
    setDocuments((prev) => [newDoc, ...prev]);
    setActiveDocId(newDoc.id);
    setLastActiveDocId(newDoc.id);
  };

  const handleRenameDoc = async (id: string, newTitle: string) => {
    const updated = await renameDocument(id, newTitle);
    if (updated) {
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? updated : d))
      );
    }
  };

  const handleDeleteDoc = async (id: string) => {
    await deleteDocument(id);
    const remaining = documents.filter((d) => d.id !== id);
    setDocuments(remaining);
    if (activeDocId === id && remaining.length > 0) {
      setActiveDocId(remaining[0].id);
      setLastActiveDocId(remaining[0].id);
    }
  };

  const handleResetToTemplate = () => {
    if (!activeDoc) return;
    const defaultTemplate =
      activeDoc.type === 'mermaid'
        ? 'graph TD\n  Start --> End'
        : '';
    handleContentChange(defaultTemplate);
  };

  // Export handlers
  const getCleanFilename = () => {
    if (!activeDoc) return 'diagram';
    return activeDoc.title.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  };

  const handleExportSvg = () => {
    if (!mermaidSvg) return;
    exportSvg(mermaidSvg, `${getCleanFilename()}.svg`);
  };

  const handleExportPng = async (scale: PngScale) => {
    if (!mermaidSvg) return;
    await exportHighDpiPng(mermaidSvg, `${getCleanFilename()}.png`, scale);
  };

  const handleExportRaw = () => {
    if (!activeDoc) return;
    exportRawFile(activeDoc.content, getCleanFilename(), activeDoc.type);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">
      {/* Top Header */}
      <Header
        currentType={activeDoc?.type || 'mermaid'}
        isEditorVisible={isEditorVisible}
        onToggleEditor={handleToggleEditor}
        onExportSvg={handleExportSvg}
        onExportPng={handleExportPng}
        onExportRaw={handleExportRaw}
        onOpenHelp={() => setIsHelpOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        isMermaidSvgAvailable={Boolean(mermaidSvg)}
      />

      {/* Main Workspace with Sidebar and Resizable Split Pane */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Navigation Sidebar */}
        <Sidebar
          documents={documents}
          activeDocId={activeDocId}
          onSelectDoc={handleSelectDoc}
          onCreateDoc={handleCreateDoc}
          onRenameDoc={handleRenameDoc}
          onDeleteDoc={handleDeleteDoc}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Resizable 50/50 Split View */}
        <main className="flex-1 h-full overflow-hidden">
          {activeDoc ? (
            <ResizableSplitPane
              initialPercent={50}
              showLeft={isEditorVisible}
              left={
                <CodeEditor
                  content={activeDoc.content}
                  onChange={handleContentChange}
                  type={activeDoc.type}
                  onResetToTemplate={handleResetToTemplate}
                  saveStatus={saveStatus}
                />
              }
              right={
                <PreviewContainer
                  type={activeDoc.type}
                  content={activeDoc.content}
                  isDark={isDark}
                  onSvgReady={setMermaidSvg}
                  onResetToTemplate={handleResetToTemplate}
                />
              }
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              Loading document...
            </div>
          )}
        </main>
      </div>

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}

export default App;
