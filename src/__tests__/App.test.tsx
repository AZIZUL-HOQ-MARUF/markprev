import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { getDB, resetDBCache } from '../services/storage';

describe('App Component Integration', () => {
  beforeEach(async () => {
    resetDBCache();
    const db = await getDB();
    await db.clear('documents');
    localStorage.clear();
  });

  it('renders application header, sidebar, and initial split view', async () => {
    render(<App />);

    // Brand title
    expect(screen.getByText('MarkPrev')).toBeInTheDocument();

    // Sidebar document creation buttons
    expect(screen.getByText('+ Mermaid')).toBeInTheDocument();
    expect(screen.getByText('+ Markdown')).toBeInTheDocument();

    // Wait for initial documents to seed and load
    await waitFor(() => {
      expect(screen.getByText('Documentation & Guide')).toBeInTheDocument();
    });

    // Check that split view separator is present
    const separator = screen.getByTitle(/Drag to resize panels/i);
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('aria-valuenow', '50');
  });
});
