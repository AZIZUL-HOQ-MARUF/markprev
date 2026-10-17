import React, { useEffect, useState, useId, useRef, useCallback } from 'react';
import { renderMermaidSvg, validateMermaid } from '../../services/mermaidValidator';
import { exportSvg } from '../../services/exportService';
import {
  AlertTriangle,
  Copy,
  Check,
  Code,
  Eye,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import type { ValidationResult } from '../../types/document';

interface MermaidBlockProps {
  code: string;
  isDark?: boolean;
}

export const MermaidBlock: React.FC<MermaidBlockProps> = ({ code, isDark = false }) => {
  const uniqueId = useId().replace(/:/g, '_');
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, error: null });
  const [isLoading, setIsLoading] = useState(true);
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Zoom and Pan state for sub-mermaid graph
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  const cleanCode = code.trim();

  // Escape key to close in-app full screen view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    if (isFullScreen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  useEffect(() => {
    let isMounted = true;

    const render = async () => {
      setIsLoading(true);
      const val = await validateMermaid(cleanCode);
      if (!isMounted) return;

      setValidation(val);

      if (!val.isValid) {
        setSvgHtml('');
        setIsLoading(false);
        return;
      }

      try {
        const svg = await renderMermaidSvg(`block_${uniqueId}`, cleanCode, isDark);
        if (!isMounted) return;
        setSvgHtml(svg);
      } catch (err: unknown) {
        if (!isMounted) return;
        setValidation({
          isValid: false,
          error: err instanceof Error ? err.message : String(err),
          errorDetails: 'Failed to render embedded diagram.',
        });
        setSvgHtml('');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    render();

    return () => {
      isMounted = false;
    };
  }, [cleanCode, isDark, uniqueId]);

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.3));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan handlers (drag to move left, right, up, down)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    startPanRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning) return;
      setPan({
        x: e.clientX - startPanRef.current.x,
        y: e.clientY - startPanRef.current.y,
      });
    },
    [isPanning]
  );

  const handleMouseUp = () => setIsPanning(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  const handleDownloadSvg = () => {
    if (!contentWrapperRef.current) return;
    const svgEl = contentWrapperRef.current.querySelector('svg');
    if (svgEl) {
      exportSvg(svgEl, `embedded-diagram-${Date.now()}.svg`);
    }
  };

  // Controls toolbar
  const renderToolbar = () => (
    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 text-xs flex-shrink-0">
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-[11px] uppercase tracking-wider">
          {isFullScreen ? 'Mermaid Diagram — Full Screen View' : 'Mermaid Diagram'}
        </span>
        {validation.isValid && svgHtml && !showRaw && (
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block">
            (Pan & Zoom enabled)
          </span>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {/* Zoom controls */}
        {validation.isValid && svgHtml && !showRaw && (
          <div className="flex items-center space-x-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 mr-1.5">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1 min-w-[34px] text-center text-slate-600 dark:text-slate-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset Zoom & Pan"
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Click to Full Screen (In-App Modal View) */}
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          title={isFullScreen ? 'Close Full Screen View (Esc)' : 'Click to Full Screen (In-App)'}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {isFullScreen ? (
            <Minimize2 className="w-3.5 h-3.5 text-indigo-500" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          onClick={() => setShowRaw(!showRaw)}
          title={showRaw ? 'Show Rendered Diagram' : 'View Raw Mermaid Code'}
          className="flex items-center space-x-1 px-2 py-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-[11px] font-medium cursor-pointer"
        >
          {showRaw ? <Eye className="w-3.5 h-3.5 text-indigo-500" /> : <Code className="w-3.5 h-3.5" />}
          <span>{showRaw ? 'Diagram' : 'Code'}</span>
        </button>

        {validation.isValid && svgHtml && !showRaw && (
          <button
            onClick={handleDownloadSvg}
            title="Download this diagram as SVG"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={handleCopy}
          title="Copy diagram code"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>

        {isFullScreen && (
          <button
            onClick={() => setIsFullScreen(false)}
            title="Close Full Screen View (Esc)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  // Diagram content viewport
  const renderContent = (heightClass: string) => {
    if (showRaw) {
      return (
        <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950 leading-relaxed select-text flex-1">
          <code>{cleanCode}</code>
        </pre>
      );
    }

    if (!validation.isValid) {
      return (
        <div className="p-6 bg-rose-50/60 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 text-xs flex-1">
          <div className="flex items-center space-x-2 font-semibold mb-1 text-rose-900 dark:text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Mermaid Diagram Syntax Error</span>
          </div>
          <div className="font-mono text-[11px] bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/60 mt-1.5">
            {validation.error}
          </div>
          {validation.errorDetails && (
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-[11px]">
              {validation.errorDetails}
            </p>
          )}
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleResetZoom}
        className={`relative w-full ${heightClass} overflow-hidden bg-white dark:bg-slate-950/80 flex items-center justify-center flex-1 ${isPanning ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        title="Drag to move left/right/up/down • Double-click to reset"
      >
        <div className="absolute top-2 left-2 z-10 pointer-events-none opacity-60 hover:opacity-100 transition-opacity flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-[10px] text-slate-500 font-mono">
          <Move className="w-3 h-3" />
          <span>Drag to pan • Click full screen to expand</span>
        </div>

        <div
          ref={contentWrapperRef}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.15s ease-out',
          }}
          className={`flex items-center justify-center p-6 max-w-none transition-opacity ${isLoading ? 'opacity-40' : 'opacity-100'
            }`}
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
      </div>
    );
  };

  return (
    <>
      {/* Standard In-Flow Block */}
      <div className="my-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 overflow-hidden shadow-xs transition-all select-none">
        {renderToolbar()}
        {renderContent('h-[360px]')}
      </div>

      {/* In-App Full Screen Modal View (Not browser full screen) */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
          <div
            className="w-full h-full max-h-[92vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden select-none"
            role="dialog"
            aria-modal="true"
          >
            {renderToolbar()}
            {renderContent('h-full')}
          </div>
        </div>
      )}
    </>
  );
};
