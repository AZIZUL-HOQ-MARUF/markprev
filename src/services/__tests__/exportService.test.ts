import { describe, it, expect, vi, afterEach } from 'vitest';
import { prepareStandaloneSvg, exportRawFile } from '../exportService';

describe('exportService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('prepares standalone SVG with required namespaces and viewBox', () => {
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('width', '500');
    svgEl.setAttribute('height', '300');

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '100');
    rect.setAttribute('height', '100');
    svgEl.appendChild(rect);

    const serialized = prepareStandaloneSvg(svgEl);

    expect(serialized).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(serialized).toContain('xmlns:xlink="http://www.w3.org/1999/xlink"');
    expect(serialized).toContain('viewBox="0 0 500 300"');
    expect(serialized).toContain('<rect');
  });

  it('triggers download for raw mermaid code with .mmd extension', () => {
    const clickMock = vi.fn();
    const originalCreateElement = document.createElement.bind(document);

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const el = originalCreateElement(tagName);
      if (tagName === 'a') {
        el.click = clickMock;
      }
      return el;
    });

    exportRawFile('graph TD\n A-->B', 'my-diagram', 'mermaid');
    expect(clickMock).toHaveBeenCalled();
  });

  it('triggers download for raw markdown with .md extension', () => {
    const clickMock = vi.fn();
    const originalCreateElement = document.createElement.bind(document);

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const el = originalCreateElement(tagName);
      if (tagName === 'a') {
        el.click = clickMock;
      }
      return el;
    });

    exportRawFile('# Title\nSome content', 'document.md', 'markdown');
    expect(clickMock).toHaveBeenCalled();
  });
});
