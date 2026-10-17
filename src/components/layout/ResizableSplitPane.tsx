import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ResizableSplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  minLeftWidthPercent?: number;
  maxLeftWidthPercent?: number;
  initialPercent?: number;
  storageKey?: string;
}

export const ResizableSplitPane: React.FC<ResizableSplitPaneProps> = ({
  left,
  right,
  minLeftWidthPercent = 20,
  maxLeftWidthPercent = 80,
  initialPercent = 50,
  storageKey = 'markprev_split_ratio',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize split ratio: default 50/50
  const [leftPercent, setLeftPercent] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= minLeftWidthPercent && parsed <= maxLeftWidthPercent) {
          return parsed;
        }
      }
    } catch {
      // Fallback to default
    }
    return initialPercent;
  });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const rawPercent = (currentX / rect.width) * 100;

      // Clamp between min and max
      const clampedPercent = Math.min(
        Math.max(rawPercent, minLeftWidthPercent),
        maxLeftWidthPercent
      );

      setLeftPercent(clampedPercent);
    },
    [isDragging, minLeftWidthPercent, maxLeftWidthPercent]
  );

  const handlePointerUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      try {
        localStorage.setItem(storageKey, leftPercent.toString());
      } catch {
        // Ignore
      }
    }
  }, [isDragging, leftPercent, storageKey]);

  // Double click resets to 50%
  const handleDoubleClick = () => {
    setLeftPercent(50);
    try {
      localStorage.setItem(storageKey, '50');
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    } else {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full h-full overflow-hidden select-none"
    >
      {/* Left Panel */}
      <div
        style={{ width: `${leftPercent}%` }}
        className="h-full overflow-hidden flex flex-col min-w-0"
      >
        {left}
      </div>

      {/* Resizer Divider */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={leftPercent}
        title="Drag to resize panels (Double-click to reset to 50/50)"
        onPointerDown={handlePointerDown}
        onDoubleClick={handleDoubleClick}
        className={`relative z-10 flex-shrink-0 w-2.5 transition-colors cursor-col-resize flex items-center justify-center group ${
          isDragging
            ? 'bg-indigo-600'
            : 'bg-slate-200 dark:bg-slate-800 hover:bg-indigo-400 dark:hover:bg-indigo-500'
        }`}
      >
        {/* Subtle grip dots */}
        <div className="flex flex-col items-center justify-center space-y-1 py-2 px-0.5 rounded pointer-events-none group-hover:scale-110 transition-transform">
          <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 group-hover:bg-white" />
          <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 group-hover:bg-white" />
          <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 group-hover:bg-white" />
          <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 group-hover:bg-white" />
        </div>
      </div>

      {/* Right Panel */}
      <div
        style={{ width: `${100 - leftPercent}%` }}
        className="h-full overflow-hidden flex flex-col min-w-0"
      >
        {right}
      </div>
    </div>
  );
};
