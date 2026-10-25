import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MarkdownPreview } from '../MarkdownPreview';

describe('MarkdownPreview', () => {
  it('renders standard markdown elements like headings, lists, and tables', () => {
    const md = `# Title\n\nSome paragraph\n\n| Col1 | Col2 |\n|---|---|\n| Val1 | Val2 |`;
    render(<MarkdownPreview content={md} />);

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Some paragraph')).toBeInTheDocument();
    expect(screen.getByText('Val1')).toBeInTheDocument();
  });

  it('syntax highlights fenced code blocks with the VS Code grammars', () => {
    const md = `~~~java
public class Main { }
Math.min(a, b);
~~~`;
    const { container } = render(<MarkdownPreview content={md} />);

    const spans = Array.from(container.querySelectorAll('pre.shiki span'));
    const token = (t: string) => spans.some((s) => s.textContent === t);

    expect(spans.length).toBeGreaterThan(0);
    expect(token('public')).toBe(true);
    // highlight.js left this one plain, the real Java grammar tokenizes it
    expect(token('Math')).toBe(true);
    expect(screen.getByText('java')).toBeInTheDocument();
  });

  it('renders embedded Mermaid diagrams when code blocks use language-mermaid', async () => {
    const mdWithMermaid = `# Architecture Note\n\n\`\`\`mermaid\ngraph TD\n  Client --> Server\n\`\`\``;
    render(<MarkdownPreview content={mdWithMermaid} />);

    // Should render Mermaid Diagram header badge
    await waitFor(() => {
      expect(screen.getByText('Mermaid Diagram')).toBeInTheDocument();
    });
  });

  it('renders multiple embedded Mermaid diagrams independently', async () => {
    const mdWithMultipleMermaid = `
# Section 1
\`\`\`mermaid
graph TD
  A --> B
\`\`\`

# Section 2
\`\`\`mermaid
flowchart LR
  X --> Y
\`\`\`
`;
    render(<MarkdownPreview content={mdWithMultipleMermaid} />);

    await waitFor(() => {
      const diagramBadges = screen.getAllByText('Mermaid Diagram');
      expect(diagramBadges.length).toBe(2);
    });
  });
});
