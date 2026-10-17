import React, { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  docTitle: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  docTitle,
  onConfirm,
  onClose,
}) => {
  // Listen for Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col space-y-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="delete-dialog-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                Delete Document
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                This action cannot be undone.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-slate-100">&ldquo;{docTitle}&rdquo;</span>? It will be permanently removed from your local browser database.
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm shadow-rose-600/20 cursor-pointer"
          >
            Delete Document
          </button>
        </div>
      </div>
    </div>
  );
};
