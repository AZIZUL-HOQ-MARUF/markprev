import { useState, useRef, useEffect } from 'react';
import {
  Download,
  Info,
  Sun,
  Moon,
  ChevronDown,
  GitFork,
  FileText,
  FileDown,
  Layers,
  Image as ImageIcon,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import type { DocumentType, PngScale } from '../../types/document';

interface HeaderProps {
  currentType: DocumentType;
  isEditorVisible: boolean;
  onToggleEditor: () => void;
  onExportSvg: () => void;
  onExportPng: (scale: PngScale) => void;
  onExportRaw: () => void;
  onOpenHelp: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isMermaidSvgAvailable: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentType,
  isEditorVisible,
  onToggleEditor,
  onExportSvg,
  onExportPng,
  onExportRaw,
  onOpenHelp,
  isDark,
  onToggleTheme,
  isMermaidSvgAvailable,
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0 select-none z-30 relative">
      {/* Brand & Title */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100">
              MarkPrev
            </span>
            <span className="px-1.5 py-0.2 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold border border-indigo-200/50 dark:border-indigo-800/50">
              v1.0
            </span>
          </div>
        </div>

        {/* Active Document Type Pill */}
        <div className="hidden sm:flex items-center pl-2">
          {currentType === 'mermaid' ? (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-medium">
              <GitFork className="w-3.5 h-3.5" />
              <span>Mermaid Diagram</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-medium">
              <FileText className="w-3.5 h-3.5" />
              <span>Markdown Document</span>
            </span>
          )}
        </div>
      </div>

      {/* Right Controls: Hide/Show Editor, Export, Help, Theme */}
      <div className="flex items-center space-x-2">
        {/* Toggle Editor Panel */}
        <button
          onClick={onToggleEditor}
          title={isEditorVisible ? 'Hide Editor Panel (Full Preview)' : 'Show Editor Panel'}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
            isEditorVisible
              ? 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              : 'bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
          }`}
        >
          {isEditorVisible ? (
            <PanelLeftClose className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          ) : (
            <PanelLeftOpen className="w-3.5 h-3.5 text-indigo-500" />
          )}
          <span>{isEditorVisible ? 'Hide Editor' : 'Show Editor'}</span>
        </button>

        {/* High-DPI Export Dropdown */}
        <div ref={exportMenuRef} className="relative">
          <button
            onClick={() => setIsExportOpen(!isExportOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-sm shadow-indigo-600/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
            <ChevronDown className="w-3 h-3 text-indigo-200" />
          </button>

          {isExportOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 z-40 animate-fadeIn">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                High-Resolution Export
              </div>

              {currentType === 'mermaid' ? (
                <>
                  <button
                    disabled={!isMermaidSvgAvailable}
                    onClick={() => {
                      onExportSvg();
                      setIsExportOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-indigo-500" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          SVG Vector Image
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Lossless, infinite zoom resolution
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      .svg
                    </span>
                  </button>

                  <button
                    disabled={!isMermaidSvgAvailable}
                    onClick={() => {
                      onExportPng(3);
                      setIsExportOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-purple-500" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          High-DPI PNG (3x)
                        </div>
                        <div className="text-[10px] text-slate-400">
                          300 DPI ultra-sharp raster
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 font-semibold">
                      Best
                    </span>
                  </button>

                  <button
                    disabled={!isMermaidSvgAvailable}
                    onClick={() => {
                      onExportPng(4);
                      setIsExportOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-purple-500" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          Ultra-Dense PNG (4x)
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Maximum print quality
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      4x
                    </span>
                  </button>
                </>
              ) : null}

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              <button
                onClick={() => {
                  onExportRaw();
                  setIsExportOpen(false);
                }}
                className="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <FileDown className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      Raw Source Code
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {currentType === 'mermaid' ? 'Mermaid (.mmd)' : 'Markdown (.md)'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {currentType === 'mermaid' ? '.mmd' : '.md'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Help Button (Info icon) */}
        <button
          onClick={onOpenHelp}
          title="Syntax & Styling Guide"
          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <Info className="w-4 h-4 text-indigo-500" />
        </button>

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={onToggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>
    </header>
  );
};
