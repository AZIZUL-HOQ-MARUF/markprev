import React, { useRef, useState } from 'react';
import { Copy, Check, Trash2, Code2, RotateCcw, AlertCircle } from 'lucide-react';
import type { DocumentType } from '../../types/document';

interface CodeEditorProps {
  content: string;
  onChange: (value: string) => void;
  type: DocumentType;
  onResetToTemplate?: () => void;
  saveStatus?: 'saved' | 'saving';
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  content,
  onChange,
  type,
  onResetToTemplate,
  saveStatus = 'saved',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Calculate line numbers
  const linesCount = Math.max(content.split('\n').length, 1);
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);

  // Sync scrolling between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Support Tab key for 2-space indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '  ';

      const newContent =
        content.substring(0, start) + spaces + content.substring(end);
      onChange(newContent);

      // Move cursor after inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleConfirmClear = () => {
    onChange('');
    setShowClearConfirm(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-slate-900 overflow-hidden">
      {/* Editor Sub-header Bar */}
      <div className="h-10 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 backdrop-blur-xs flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Code2 className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {type === 'mermaid' ? 'Mermaid Code Editor' : 'Markdown Editor'}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            ({linesCount} {linesCount === 1 ? 'line' : 'lines'})
          </span>

          {/* Debounced Save Status Indicator */}
          <div className="flex items-center space-x-1 pl-2 text-[10px] text-slate-400">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                saveStatus === 'saving'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-emerald-500'
              }`}
            />
            <span className="font-mono">
              {saveStatus === 'saving' ? 'Saving (350ms debounce)...' : 'Saved'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {showClearConfirm ? (
            <div className="flex items-center space-x-1.5 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-lg border border-rose-200 dark:border-rose-900/60 animate-fadeIn">
              <AlertCircle className="w-3 h-3 text-rose-500" />
              <span className="text-[11px] text-rose-700 dark:text-rose-300">Clear?</span>
              <button
                onClick={handleConfirmClear}
                className="px-1.5 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-semibold transition-colors cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] transition-colors cursor-pointer"
              >
                No
              </button>
            </div>
          ) : (
            <>
              {onResetToTemplate && (
                <button
                  onClick={onResetToTemplate}
                  title="Reset to starter template"
                  className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={handleCopy}
                title="Copy to clipboard"
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={() => setShowClearConfirm(true)}
                title="Clear editor"
                className="p-1.5 rounded-md text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Code Textarea with Line Numbers */}
      <div className="flex flex-1 overflow-hidden relative font-mono text-sm">
        {/* Line Numbers Column */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="w-12 py-3 pr-2.5 pl-2 text-right bg-slate-50/80 dark:bg-slate-950/60 border-r border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 select-none overflow-hidden text-xs leading-6"
        >
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          placeholder={
            type === 'mermaid'
              ? 'Enter Mermaid diagram syntax here (e.g. graph TD)...'
              : 'Enter Markdown content here...'
          }
          spellCheck={false}
          className="flex-1 h-full w-full p-3 bg-transparent text-slate-900 dark:text-slate-100 resize-none outline-none focus:outline-none border-none leading-6 font-mono text-xs overflow-y-auto"
        />
      </div>
    </div>
  );
};
