import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResizableSplitPane } from '../ResizableSplitPane';

describe('ResizableSplitPane', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders both left and right panel contents', () => {
    render(
      <ResizableSplitPane
        left={<div data-testid="left-content">Left Editor</div>}
        right={<div data-testid="right-content">Right Preview</div>}
      />
    );

    expect(screen.getByTestId('left-content')).toBeInTheDocument();
    expect(screen.getByTestId('right-content')).toBeInTheDocument();
  });

  it('defaults to 50% split width', () => {
    render(
      <ResizableSplitPane
        left={<div data-testid="left">Left</div>}
        right={<div data-testid="right">Right</div>}
      />
    );

    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-valuenow', '50');
  });

  it('resets to 50% upon double click on separator', () => {
    localStorage.setItem('markprev_split_ratio', '70');

    render(
      <ResizableSplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
      />
    );

    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-valuenow', '70');

    fireEvent.doubleClick(separator);
    expect(separator).toHaveAttribute('aria-valuenow', '50');
  });

  it('hides left panel and expands right panel when showLeft is false', () => {
    render(
      <ResizableSplitPane
        showLeft={false}
        left={<div data-testid="left-content">Left Editor</div>}
        right={<div data-testid="right-content">Right Preview</div>}
      />
    );

    expect(screen.queryByTestId('left-content')).not.toBeInTheDocument();
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    expect(screen.getByTestId('right-content')).toBeInTheDocument();
  });
});
