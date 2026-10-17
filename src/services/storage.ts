import { openDB, type IDBPDatabase } from 'idb';
import type { DocumentRecord, DocumentType } from '../types/document';
import { DEFAULT_MERMAID_CODE, DEFAULT_MARKDOWN_CODE } from './templates';

const DB_NAME = 'markprev-db';
const DB_VERSION = 1;
const STORE_NAME = 'documents';
const LAST_ACTIVE_KEY = 'markprev_last_active_id';

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('by-updated', 'updatedAt');
          store.createIndex('by-type', 'type');
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Resets db promise cache (useful for testing)
 */
export function resetDBCache() {
  dbPromise = null;
}

/**
 * Seed initial sample documents if the database is newly opened
 */
export async function seedInitialDocuments(): Promise<DocumentRecord[]> {
  const db = await getDB();
  const count = await db.count(STORE_NAME);
  
  if (count === 0) {
    const now = Date.now();
    const defaultMermaid: DocumentRecord = {
      id: 'doc-default-mermaid',
      title: 'Request Lifecycle (graph TD)',
      type: 'mermaid',
      content: DEFAULT_MERMAID_CODE,
      createdAt: now - 1000,
      updatedAt: now - 1000,
    };

    const defaultMarkdown: DocumentRecord = {
      id: 'doc-default-markdown',
      title: 'Documentation & Guide',
      type: 'markdown',
      content: DEFAULT_MARKDOWN_CODE,
      createdAt: now,
      updatedAt: now,
    };

    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.store.put(defaultMermaid);
    await tx.store.put(defaultMarkdown);
    await tx.done;

    return [defaultMarkdown, defaultMermaid];
  }

  return getAllDocuments();
}

/**
 * Get all documents sorted by last updated descending
 */
export async function getAllDocuments(): Promise<DocumentRecord[]> {
  const db = await getDB();
  const docs = await db.getAll(STORE_NAME);
  return docs.sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * Get a single document by ID
 */
export async function getDocumentById(id: string): Promise<DocumentRecord | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}

/**
 * Save / Update a document
 */
export async function saveDocument(doc: DocumentRecord): Promise<void> {
  const db = await getDB();
  const updated: DocumentRecord = {
    ...doc,
    updatedAt: Date.now(),
  };
  await db.put(STORE_NAME, updated);
}

/**
 * Create a new document
 */
export async function createDocument(
  type: DocumentType,
  title?: string,
  content?: string
): Promise<DocumentRecord> {
  const db = await getDB();
  const id = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const defaultTitle = title || (type === 'mermaid' ? 'Untitled Diagram' : 'Untitled Document');
  const defaultContent =
    content !== undefined
      ? content
      : type === 'mermaid'
      ? 'graph TD\n  Start --> End'
      : '';

  const now = Date.now();
  const doc: DocumentRecord = {
    id,
    title: defaultTitle,
    type,
    content: defaultContent,
    createdAt: now,
    updatedAt: now,
  };

  await db.put(STORE_NAME, doc);
  return doc;
}

/**
 * Rename document
 */
export async function renameDocument(id: string, newTitle: string): Promise<DocumentRecord | undefined> {
  const db = await getDB();
  const doc = await db.get(STORE_NAME, id);
  if (!doc) return undefined;

  const updated: DocumentRecord = {
    ...doc,
    title: newTitle.trim() || 'Untitled',
    updatedAt: Date.now(),
  };

  await db.put(STORE_NAME, updated);
  return updated;
}

/**
 * Delete a document
 */
export async function deleteDocument(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

/**
 * Last active document persistence in localStorage
 */
export function getLastActiveDocId(): string | null {
  try {
    return localStorage.getItem(LAST_ACTIVE_KEY);
  } catch {
    return null;
  }
}

export function setLastActiveDocId(id: string): void {
  try {
    localStorage.setItem(LAST_ACTIVE_KEY, id);
  } catch {
    // Ignore storage quota or disabled errors
  }
}
