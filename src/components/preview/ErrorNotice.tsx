import React from 'react';
import { AlertTriangle, Wrench, RefreshCw } from 'lucide-react';
import type { ValidationResult } from '../../types/document';

interface ErrorNoticeProps {
  validation: ValidationResult;
  onResetToTemplate?: () => void;
}

export const ErrorNotice: React.FC<ErrorNoticeProps> = ({
  validation,
  onResetToTemplate,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 h-full text-slate-800 dark:text-slate-100 max-w-xl mx-auto animate-fadeIn">
      <div className="w-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-6 shadow-sm">
        {/* Header Badge */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-200">
              Invalid Mermaid Syntax
            </h3>
            <p className="text-xs text-rose-700/80 dark:text-rose-400">
              {validation.errorLine
                ? `Syntax error detected near line ${validation.errorLine}`
                : 'Diagram could not be parsed'}
            </p>
          </div>
        </div>

        {/* Error Detail Box */}
        <div className="bg-white/80 dark:bg-slate-900/90 rounded-xl p-4 border border-rose-100 dark:border-rose-950 font-mono text-xs text-rose-800 dark:text-rose-300 break-words mb-4 leading-relaxed">
          {validation.error || 'Unknown syntax error occurred'}
        </div>

        {/* Actionable Suggestion */}
        {validation.errorDetails && (
          <div className="flex items-start space-x-2.5 text-xs text-slate-600 dark:text-slate-400 bg-white/40 dark:bg-slate-900/40 p-3 rounded-lg border border-rose-100/50 dark:border-rose-900/30 mb-5">
            <Wrench className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Suggestion: </span>
              {validation.errorDetails}
            </div>
          </div>
        )}

        {/* Helpful Quick Tips */}
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 mb-5 pl-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">Common Quick Fixes:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400">
            <li>Ensure the first line starts with <code className="px-1.5 py-0.5 bg-rose-100/70 dark:bg-rose-900/40 rounded text-rose-800 dark:text-rose-300">graph TD</code>, <code className="px-1.5 py-0.5 bg-rose-100/70 dark:bg-rose-900/40 rounded text-rose-800 dark:text-rose-300">flowchart LR</code>, or another valid diagram keyword.</li>
            <li>Check for matching brackets: <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">[ ]</code>, <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">( )</code>, or <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">&#123; &#125;</code>.</li>
            <li>Verify arrow connectors: <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">--&gt;</code>, <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">---</code>, or <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">==&gt;</code>.</li>
          </ul>
        </div>

        {/* Quick Reset action */}
        {onResetToTemplate && (
          <div className="flex items-center justify-end pt-2 border-t border-rose-100 dark:border-rose-900/40">
            <button
              onClick={onResetToTemplate}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Valid Starter Template</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
