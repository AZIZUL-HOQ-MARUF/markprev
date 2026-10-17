import { describe, it, expect, beforeEach } from 'vitest';
import {
  seedInitialDocuments,
  getAllDocuments,
  getDocumentById,
  saveDocument,
  createDocument,
  renameDocument,
  deleteDocument,
  getDB,
  resetDBCache
} from '../storage';

describe('storage service (IndexedDB)', () => {
  beforeEach(async () => {
    resetDBCache();
    const db = await getDB();
    await db.clear('documents');
  });

  it('seeds initial documents when empty', async () => {
    const docs = await seedInitialDocuments();
    expect(docs.length).toBe(2);
    expect(docs.some(d => d.type === 'mermaid')).toBe(true);
    expect(docs.some(d => d.type === 'markdown')).toBe(true);
  });

  it('creates a new document with correct type and defaults', async () => {
    const newDoc = await createDocument('mermaid', 'My Architecture Flow');
    expect(newDoc.id).toBeTruthy();
    expect(newDoc.title).toBe('My Architecture Flow');
    expect(newDoc.type).toBe('mermaid');
    expect(newDoc.content).toContain('graph TD');

    const fetched = await getDocumentById(newDoc.id);
    expect(fetched).toBeDefined();
    expect(fetched?.title).toBe('My Architecture Flow');
  });

  it('updates an existing document', async () => {
    const doc = await createDocument('markdown', 'Test Note', '# Initial Content');
    const updated = {
      ...doc,
      content: '# Modified Content',
    };
    await saveDocument(updated);

    const fetched = await getDocumentById(doc.id);
    expect(fetched?.content).toBe('# Modified Content');
  });

  it('renames a document', async () => {
    const doc = await createDocument('mermaid', 'Old Name');
    const renamed = await renameDocument(doc.id, 'New Stunning Name');
    expect(renamed?.title).toBe('New Stunning Name');

    const fetched = await getDocumentById(doc.id);
    expect(fetched?.title).toBe('New Stunning Name');
  });

  it('deletes a document', async () => {
    const doc = await createDocument('markdown', 'To Be Deleted');
    await deleteDocument(doc.id);

    const fetched = await getDocumentById(doc.id);
    expect(fetched).toBeUndefined();
  });

  it('retrieves all documents sorted by updatedAt descending', async () => {
    const doc1 = await createDocument('mermaid', 'First Doc');
    // slight delay
    await new Promise((r) => setTimeout(r, 10));
    const doc2 = await createDocument('markdown', 'Second Doc');

    const all = await getAllDocuments();
    expect(all[0].id).toBe(doc2.id);
    expect(all[1].id).toBe(doc1.id);
  });
});
