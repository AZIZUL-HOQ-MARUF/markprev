import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
            code: ({ className, children, ...props }) => {
              const isInline = !className;
              const match = /language-(\w+)/.exec(className || '');
              const lang = match ? match[1] : '';

              // Render embedded Mermaid diagram inside Markdown!
              if (!isInline && (lang === 'mermaid' || lang === 'mmd')) {
                return (
                  <MermaidBlock
                    code={String(children).replace(/\n$/, '')}
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
                <div className="relative my-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xs">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400 font-mono">
                    <span>{lang || 'code'}</span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-100 leading-relaxed">
                    <code {...props}>{children}</code>
                  </pre>
                </div>
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
