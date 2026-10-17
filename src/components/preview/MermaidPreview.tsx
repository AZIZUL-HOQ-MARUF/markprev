import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { validateMermaid, renderMermaidSvg } from '../../services/mermaidValidator';
import { ErrorNotice } from './ErrorNotice';
import type { ValidationResult } from '../../types/document';

interface MermaidPreviewProps {
  code: string;
  isDark?: boolean;
  onSvgReady?: (svg: SVGElement | null) => void;
  onResetToTemplate?: () => void;
}

export const MermaidPreview: React.FC<MermaidPreviewProps> = ({
  code,
  isDark = false,
  onSvgReady,
  onResetToTemplate,
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, error: null });
  const [isRendering, setIsRendering] = useState(false);
  
  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  // Render diagram whenever code or dark mode changes
  useEffect(() => {
    let isCancelled = false;

    const render = async () => {
      setIsRendering(true);
      
      const valResult = await validateMermaid(code);
      if (isCancelled) return;

      setValidation(valResult);

      if (!valResult.isValid) {
        setSvgContent('');
        onSvgReady?.(null);
        setIsRendering(false);
        return;
      }

      try {
        const svg = await renderMermaidSvg('mermaid_diagram', code, isDark);
        if (isCancelled) return;
        setSvgContent(svg);
      } catch (err: unknown) {
        if (isCancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        setValidation({
          isValid: false,
          error: msg,
          errorDetails: 'Rendering failed. Check for unsupported diagram features or invalid formatting.',
        });
        setSvgContent('');
        onSvgReady?.(null);
      } finally {
        if (!isCancelled) {
          setIsRendering(false);
        }
      }
    };

    render();

    return () => {
      isCancelled = true;
    };
  }, [code, isDark, onSvgReady]);

  // Notify parent of SVG element when DOM is updated
  useEffect(() => {
    if (contentWrapperRef.current && svgContent) {
      const svgEl = contentWrapperRef.current.querySelector('svg');
      onSvgReady?.(svgEl);
    } else {
      onSvgReady?.(null);
    }
  }, [svgContent, onSvgReady]);

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.3));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with left mouse button when not clicking buttons
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

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-slate-50/50 dark:bg-slate-950/70 select-none ${
        isPanning ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Zoom / Controls Floating Toolbar */}
      {validation.isValid && svgContent && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-1 p-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg text-slate-700 dark:text-slate-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn();
            }}
            title="Zoom In"
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-medium px-1.5 min-w-[42px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoomOut();
            }}
            title="Zoom Out"
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleResetZoom();
            }}
            title="Reset Zoom & Pan"
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Invalid Syntax Screen */}
      {!validation.isValid ? (
        <div className="w-full h-full overflow-y-auto cursor-default">
          <ErrorNotice
            validation={validation}
            onResetToTemplate={onResetToTemplate}
          />
        </div>
      ) : (
        /* Valid Diagram Preview with Pan and Zoom */
        <div
          ref={contentWrapperRef}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.15s ease-out',
          }}
          className={`flex items-center justify-center p-8 max-w-none ${
            isRendering ? 'opacity-50' : 'opacity-100'
          }`}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )}
    </div>
  );
};
