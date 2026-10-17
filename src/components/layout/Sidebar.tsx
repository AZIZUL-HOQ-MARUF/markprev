import React, { useState } from 'react';
import {
  FileText,
  GitFork,
  Trash2,
  Edit2,
  Search,
  Check,
  X,
  PanelLeftClose,
  ChevronRight,
  Clock
} from 'lucide-react';
import type { DocumentRecord, DocumentType } from '../../types/document';

import { DeleteModal } from '../modals/DeleteModal';

interface SidebarProps {
  documents: DocumentRecord[];
  activeDocId: string;
  onSelectDoc: (id: string) => void;
  onCreateDoc: (type: DocumentType) => void;
  onRenameDoc: (id: string, newTitle: string) => void;
  onDeleteDoc: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(timestamp).toLocaleDateString();
}

export const Sidebar: React.FC<SidebarProps> = ({
  documents,
  activeDocId,
  onSelectDoc,
  onCreateDoc,
  onRenameDoc,
  onDeleteDoc,
  isOpen,
  onToggle,
}) => {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  const startRename = (doc: DocumentRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(doc.id);
    setEditTitle(doc.title);
  };

  const saveRename = (id: string, e?: React.FormEvent) => {
    e?.preventDefault();
    if (editTitle.trim()) {
      onRenameDoc(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDeleteClick = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTarget({ id, title });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      onDeleteDoc(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  if (!isOpen) {
    return (
      <div className="w-12 h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-3 flex-shrink-0">
        <button
          onClick={onToggle}
          title="Open Document Navigator"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 h-full bg-slate-50/90 dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0 select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Documents ({documents.length})
          </span>
        </div>
        <button
          onClick={onToggle}
          title="Collapse Sidebar"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Action Buttons: Clear distinction between Mermaid Diagram vs Markdown Doc */}
      <div className="p-3 grid grid-cols-2 gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => onCreateDoc('mermaid')}
          title="Create a new Mermaid flowchart/diagram (.mmd)"
          className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>+ Mermaid</span>
        </button>
        <button
          onClick={() => onCreateDoc('markdown')}
          title="Create a new Markdown note/document (.md)"
          className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300/60 dark:border-slate-700/60 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>+ Markdown</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="px-3 pt-2 pb-1">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredDocs.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            {search ? 'No matching documents' : 'No documents yet'}
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isActive = doc.id === activeDocId;
            const isEditing = editingId === doc.id;

            return (
              <div
                key={doc.id}
                onClick={() => onSelectDoc(doc.id)}
                className={`group relative flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-medium shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
              >
                {/* Left icon & title */}
                <div className="flex items-center space-x-2 min-w-0 flex-1 mr-2">
                  <div
                    className={`p-1.5 rounded-lg flex-shrink-0 ${
                      isActive
                        ? 'bg-indigo-700/80 text-white'
                        : doc.type === 'mermaid'
                        ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
                        : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {doc.type === 'mermaid' ? (
                      <GitFork className="w-3.5 h-3.5" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {isEditing ? (
                    <form
                      onSubmit={(e) => saveRename(doc.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center space-x-1 flex-1 min-w-0"
                    >
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                        onBlur={() => saveRename(doc.id)}
                        className="w-full px-1.5 py-0.5 rounded text-xs text-slate-900 bg-white border border-indigo-400 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="p-1 text-emerald-300 hover:text-white"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelRename}
                        className="p-1 text-slate-300 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </form>
                  ) : (
                    <div className="truncate flex-1 min-w-0">
                      <div className="truncate font-medium">{doc.title}</div>
                      <div
                        className={`text-[10px] flex items-center space-x-1 mt-0.5 ${
                          isActive ? 'text-indigo-100' : 'text-slate-400'
                        }`}
                      >
                        <Clock className="w-2.5 h-2.5" />
                        <span>{formatRelativeTime(doc.updatedAt)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Action Icons (Rename & Delete) */}
                {!isEditing && (
                  <div
                    className={`flex items-center space-x-1 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    } transition-opacity`}
                  >
                    <button
                      onClick={(e) => startRename(doc, e)}
                      title="Rename document"
                      className={`p-1 rounded-md transition-colors ${
                        isActive
                          ? 'hover:bg-indigo-700 text-indigo-100'
                          : 'hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {documents.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteClick(doc.id, doc.title, e)}
                        title="Delete document"
                        className={`p-1 rounded-md transition-colors cursor-pointer ${
                          isActive
                            ? 'hover:bg-indigo-700 text-rose-200'
                            : 'hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600'
                        }`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Saved offline</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Saved locally in browser" />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        docTitle={deleteTarget?.title || ''}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
