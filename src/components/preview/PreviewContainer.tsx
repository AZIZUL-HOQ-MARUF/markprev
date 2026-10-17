import React from 'react';
import { MermaidPreview } from './MermaidPreview';
import { MarkdownPreview } from './MarkdownPreview';
import type { DocumentType } from '../../types/document';
import { Eye, CheckCircle2 } from 'lucide-react';

interface PreviewContainerProps {
  type: DocumentType;
  content: string;
  isDark?: boolean;
  onSvgReady?: (svg: SVGElement | null) => void;
  onResetToTemplate?: () => void;
}

export const PreviewContainer: React.FC<PreviewContainerProps> = ({
  type,
  content,
  isDark = false,
  onSvgReady,
  onResetToTemplate,
}) => {
  return (
    <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-950/50 border-l border-slate-200 dark:border-slate-800">
      {/* Top Preview Bar */}
      <div className="h-10 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Eye className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {type === 'mermaid' ? 'Mermaid Diagram Preview' : 'Markdown Live Preview'}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          {type === 'mermaid' ? (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
              <span>Vector Scalable</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
              <CheckCircle2 className="w-3 h-3" />
              <span>GFM Compliant</span>
            </span>
          )}
        </div>
      </div>

      {/* Preview Viewport */}
      <div className="flex-1 overflow-hidden relative">
        {type === 'mermaid' ? (
          <MermaidPreview
            code={content}
            isDark={isDark}
            onSvgReady={onSvgReady}
            onResetToTemplate={onResetToTemplate}
          />
        ) : (
          <MarkdownPreview content={content} isDark={isDark} />
        )}
      </div>
    </div>
  );
};
