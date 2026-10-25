import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import { highlighter, SHIKI_OPTIONS } from '../../services/highlighter';
import { MermaidBlock } from './MermaidBlock';

interface MarkdownPreviewProps {
  content: string;
  isDark?: boolean;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, isDark = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto p-8 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 select-text"
    >
      <div className="mx-auto prose dark:prose-invert prose-indigo">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          // mermaid is deliberately not a registered language, so those fences stay raw
          // text for the MermaidBlock hand-off below
          rehypePlugins={[[rehypeShikiFromHighlighter, highlighter, SHIKI_OPTIONS]]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 pb-3 mb-6 border-b border-slate-200 dark:border-slate-800">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 pb-2 mt-8 mb-4 border-b border-slate-100 dark:border-slate-800">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-3">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="leading-7 text-slate-700 dark:text-slate-300 mb-4">
                {children}
              </p>
            ),
            blockquote: ({ children }) => (
              <blockquote className="pl-4 py-1 my-4 border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-slate-700 dark:text-slate-300 rounded-r-lg italic">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-6 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <table className="w-full text-left text-sm border-collapse">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800">
                {children}
              </thead>
            ),
            th: ({ children }) => (
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
                {children}
              </td>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-outside pl-6 my-4 space-y-1 text-slate-700 dark:text-slate-300">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-outside pl-6 my-4 space-y-1 text-slate-700 dark:text-slate-300">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
            pre: ({ className, children, node, ...props }) => {
              // shiki replaced this <pre>, so the language lives on the inner <code>
              const codeEl = node?.children?.[0];
              const codeClass =
                codeEl && codeEl.type === 'element'
                  ? String(codeEl.properties?.class ?? codeEl.properties?.className ?? '')
                  : '';
              const lang = /language-([a-zA-Z0-9-]+)/.exec(`${className ?? ''} ${codeClass}`)?.[1] ?? '';

              // Mermaid fences render a diagram, not code: no <pre>, no chrome
              if (lang === 'mermaid' || lang === 'mmd') return <>{children}</>;

              return (
                <div className="relative my-4 rounded-xl overflow-hidden border border-[#E5E5E5] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] text-[#000000] dark:text-[#D4D4D4] shadow-xs">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#F3F3F3] dark:bg-[#252526] border-b border-[#E5E5E5] dark:border-[#2D2D2D] text-xs text-[#616161] dark:text-[#CCCCCC] font-mono">
                    <span>{lang && lang !== 'text' ? lang : 'code'}</span>
                  </div>
                  <pre
                    className={`${className ?? ''} p-4 overflow-x-auto text-xs font-mono leading-relaxed`}
                    {...props}
                  >
                    {children}
                  </pre>
                </div>
              );
            },
            code: ({ className, children, node: _node, ...props }) => {
              const isInline = !className;
              const lang = /language-([a-zA-Z0-9-]+)/.exec(className ?? '')?.[1] ?? '';

              // Render embedded Mermaid diagram inside Markdown!
              if (!isInline && (lang === 'mermaid' || lang === 'mmd')) {
                return (
                  <MermaidBlock
                    code={String(children).trimEnd()}
                    isDark={isDark}
                  />
                );
              }

              if (isInline) {
                return (
                  <code
                    className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            input: ({ type, checked, ...props }) => {
              if (type === 'checkbox') {
                return (
                  <input
                    type="checkbox"
                    checked={checked}
                    readOnly
                    className="mr-2 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    {...props}
                  />
                );
              }
              return <input type={type} {...props} />;
            },
            hr: () => (
              <hr className="my-8 border-t border-slate-200 dark:border-slate-800" />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};
