import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';

describe('Header', () => {
  const defaultProps = {
    currentType: 'markdown' as const,
    isEditorVisible: true,
    onToggleEditor: vi.fn(),
    onExportSvg: vi.fn(),
    onExportPng: vi.fn(),
    onExportRaw: vi.fn(),
    onOpenHelp: vi.fn(),
    isDark: false,
    onToggleTheme: vi.fn(),
    isMermaidSvgAvailable: false,
  };

  it('renders "Hide Editor" button when editor is visible', () => {
    const onToggleEditor = vi.fn();
    render(<Header {...defaultProps} isEditorVisible={true} onToggleEditor={onToggleEditor} />);

    const toggleBtn = screen.getByRole('button', { name: /hide editor/i });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(onToggleEditor).toHaveBeenCalledTimes(1);
  });

  it('renders "Show Editor" button when editor is hidden', () => {
    const onToggleEditor = vi.fn();
    render(<Header {...defaultProps} isEditorVisible={false} onToggleEditor={onToggleEditor} />);

    const toggleBtn = screen.getByRole('button', { name: /show editor/i });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(onToggleEditor).toHaveBeenCalledTimes(1);
  });
});
