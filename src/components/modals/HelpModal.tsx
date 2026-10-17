import React, { useState } from 'react';
import { X, BookOpen, GitFork, Image, Database, Check } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'markdown' | 'mermaid' | 'export' | 'storage'>('markdown');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  if (!isOpen) return null;

  const copySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                MarkPrev Help & Syntax Guide
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quick reference cheat sheet for Markdown styling, Mermaid diagrams, and high-res export
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/30 dark:bg-slate-950/30">
          <button
            onClick={() => setActiveTab('markdown')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'markdown'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Markdown Styling</span>
          </button>
          <button
            onClick={() => setActiveTab('mermaid')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'mermaid'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>Mermaid Syntax</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'export'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>High-DPI Export</span>
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'storage'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Local Storage</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300">
          {activeTab === 'markdown' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Headings & Typography
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400"># Heading 1</span><br />
                    <span className="text-slate-400">## Heading 2</span><br />
                    <span className="text-slate-400">### Heading 3</span>
                  </div>
                  <div>
                    <span className="text-slate-400">**Bold text**</span><br />
                    <span className="text-slate-400">*Italic text*</span><br />
                    <span className="text-slate-400">~~Strikethrough~~</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Tables (GFM)
                </h3>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs">
                  <pre className="text-slate-600 dark:text-slate-400">
{`| Column 1 | Column 2 | Status |
| :---     | :---:    | ---:   |
| Left     | Center   | Right  |`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Task Lists & Blockquotes
                </h3>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs space-y-1">
                  <div>- [x] Completed task</div>
                  <div>- [ ] Pending task</div>
                  <div className="text-indigo-600 dark:text-indigo-400">&gt; This is an accented blockquote</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Fenced Code Blocks
                </h3>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs">
                  <pre className="text-slate-600 dark:text-slate-400">
{`\`\`\`typescript
const greeting: string = "Hello, World!";
console.log(greeting);
\`\`\``}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mermaid' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Flowchart Types & Orientations
                </h3>
                <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-600 dark:text-slate-400">
                  <li><strong className="text-slate-800 dark:text-slate-200">graph TD</strong> or <strong className="text-slate-800 dark:text-slate-200">flowchart TD</strong>: Top-to-Bottom hierarchy</li>
                  <li><strong className="text-slate-800 dark:text-slate-200">flowchart LR</strong>: Left-to-Right sequence flow</li>
                  <li><strong className="text-slate-800 dark:text-slate-200">sequenceDiagram</strong>: Actor & participant message interchange</li>
                  <li><strong className="text-slate-800 dark:text-slate-200">classDiagram</strong>: Object classes, properties, methods</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Node Shapes
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div><code>A[Rectangle]</code></div>
                  <div><code>B(Rounded edges)</code></div>
                  <div><code>C([Stadium / Pill])</code></div>
                  <div><code>D[(Database cylinder)]</code></div>
                  <div><code>E((Circle))</code></div>
                  <div><code>F&#123;Rhombus / Decision&#125;</code></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Quick Sample (Click to Copy)
                  </h3>
                  <button
                    onClick={() =>
                      copySnippet(
                        `graph TD\n  Start([Start]) --> Check{Is Valid?}\n  Check -- Yes --> Success[Approved]\n  Check -- No --> Error[Show Error]`,
                        'sample1'
                      )
                    }
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                  >
                    {copiedSnippet === 'sample1' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <span>Copy Sample</span>
                    )}
                  </button>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs">
                  <pre className="text-slate-600 dark:text-slate-400">
{`graph TD
  Start([Start]) --> Check{Is Valid?}
  Check -- Yes --> Success[Approved]
  Check -- No --> Error[Show Error]`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-900/50">
                <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
                  Why High-DPI Export Matters
                </h4>
                <p className="text-xs text-indigo-800/80 dark:text-indigo-300 leading-relaxed">
                  When diagramming complex architectures, standard screenshot captures pixelate upon zooming. MarkPrev exports at up to <strong>300+ DPI (3x / 4x canvas scaling)</strong> or <strong>mathematically lossless SVG</strong> vector format so your presentations and documents look crystal sharp at any zoom level.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    SVG (Vector)
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    Zero pixels. Infinite resolution. Perfect for embedding into documentation websites, Figma, Illustrator, or LaTeX reports.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    PNG (3x High-DPI)
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    Rendered with 3x device-pixel density with anti-aliasing and white background fill. Perfect for Slack, email, and Google Slides.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/50">
                <h4 className="font-semibold text-emerald-900 dark:text-emerald-200 mb-1">
                  Browser-Based Offline Storage
                </h4>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-300 leading-relaxed">
                  Your files are stored safely in your browser&apos;s <strong>IndexedDB</strong> database (<code className="px-1 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 rounded font-mono">markprev-db</code>). No cloud servers or databases are used, ensuring total privacy and instant offline access.
                </p>
              </div>

              <ul className="text-xs space-y-2 list-disc list-inside text-slate-600 dark:text-slate-400">
                <li>Documents auto-save automatically as you type.</li>
                <li>You can create unlimited diagrams and markdown notes.</li>
                <li>Easily rename or delete documents from the left navigation panel.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
