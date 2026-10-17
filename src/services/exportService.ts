import type { PngScale } from '../types/document';

/**
 * Triggers a browser download for a Blob
 */
export function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Sanitizes and formats SVG string for export
 */
export function prepareStandaloneSvg(svgElement: SVGElement): string {
  const clone = svgElement.cloneNode(true) as SVGElement;

  if (!clone.getAttribute('xmlns')) {
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  if (!clone.getAttribute('xmlns:xlink')) {
    clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  }

  // Ensure viewBox exists
  let width = parseFloat(clone.getAttribute('width') || '0');
  let height = parseFloat(clone.getAttribute('height') || '0');

  if (!clone.getAttribute('viewBox') && width > 0 && height > 0) {
    clone.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }

  // If width/height are 100%, set concrete dimensions from bounding client rect if available
  const bbox = svgElement.getBoundingClientRect?.();
  if (bbox && bbox.width > 0 && bbox.height > 0) {
    if (!width || clone.getAttribute('width')?.includes('%')) {
      width = bbox.width;
      clone.setAttribute('width', String(bbox.width));
    }
    if (!height || clone.getAttribute('height')?.includes('%')) {
      height = bbox.height;
      clone.setAttribute('height', String(bbox.height));
    }
    if (!clone.getAttribute('viewBox')) {
      clone.setAttribute('viewBox', `0 0 ${bbox.width} ${bbox.height}`);
    }
  }

  // Embed font-family directly in style attribute
  const style = clone.getAttribute('style') || '';
  if (!style.includes('font-family')) {
    clone.setAttribute(
      'style',
      `${style}; font-family: Inter, system-ui, -apple-system, sans-serif; background-color: transparent;`
    );
  }

  return new XMLSerializer().serializeToString(clone);
}

/**
 * Export SVG vector (mathematically lossless, infinite zoom)
 */
export function exportSvg(svgElement: SVGElement, filename = 'diagram.svg'): void {
  const cleanFilename = filename.endsWith('.svg') ? filename : `${filename}.svg`;
  const svgString = prepareStandaloneSvg(svgElement);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  triggerFileDownload(blob, cleanFilename);
}

/**
 * Export High-DPI PNG (2x, 3x, 4x pixel density for razor-sharp presentation & zoom)
 */
export async function exportHighDpiPng(
  svgElement: SVGElement,
  filename = 'diagram.png',
  scale: PngScale = 3
): Promise<void> {
  const cleanFilename = filename.endsWith('.png') ? filename : `${filename}.png`;
  const svgString = prepareStandaloneSvg(svgElement);

  // Get base dimensions
  let width = parseFloat(svgElement.getAttribute('width') || '0');
  let height = parseFloat(svgElement.getAttribute('height') || '0');

  const bbox = svgElement.getBoundingClientRect?.();
  if (bbox && bbox.width > 0 && bbox.height > 0) {
    width = width || bbox.width;
    height = height || bbox.height;
  }

  // Fallback if dimensions are still missing
  const viewBoxAttr = svgElement.getAttribute('viewBox');
  if ((!width || !height) && viewBoxAttr) {
    const parts = viewBoxAttr.split(/[\s,]+/).map(Number);
    if (parts.length === 4) {
      width = width || parts[2];
      height = height || parts[3];
    }
  }

  width = width || 800;
  height = height || 600;

  // Compute scaled target size (e.g. 3x scale)
  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Failed to create 2D canvas context'));
      return;
    }

    // Enable high quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Sanitize SVG string: remove remote @import to prevent cross-origin canvas tainting
    const sanitizedSvg = svgString.replace(/@import\s+url\([^)]+\);?/gi, '');

    const img = new Image();
    img.crossOrigin = 'anonymous';

    // Use base64 data URI which avoids blob-origin canvas tainting in Chromium
    const base64Svg = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(sanitizedSvg)));

    img.onload = () => {
      try {
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        canvas.toBlob(
          (pngBlob) => {
            if (pngBlob) {
              triggerFileDownload(pngBlob, cleanFilename);
              resolve();
            } else {
              reject(new Error('Canvas toBlob conversion failed'));
            }
          },
          'image/png',
          1.0
        );
      } catch (drawErr) {
        reject(drawErr);
      }
    };

    img.onerror = (e) => {
      reject(new Error(`Failed to render SVG onto Canvas: ${e}`));
    };

    img.src = base64Svg;
  });
}

/**
 * Download raw code (.mmd or .md)
 */
export function exportRawFile(
  content: string,
  filename: string,
  type: 'mermaid' | 'markdown'
): void {
  const extension = type === 'mermaid' ? '.mmd' : '.md';
  const cleanFilename = filename.endsWith(extension) ? filename : `${filename}${extension}`;
  const mimeType = type === 'mermaid' ? 'text/vnd.mermaid' : 'text/markdown';
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  triggerFileDownload(blob, cleanFilename);
}
