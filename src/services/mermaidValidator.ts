import mermaid from 'mermaid';
import type { ValidationResult } from '../types/document';

let isInitialized = false;

export function initMermaid(isDark = false) {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: isDark ? 'dark' : 'default',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    flowchart: {
      useMaxWidth: false,
      htmlLabels: true,
      curve: 'basis'
    },
    themeVariables: isDark
      ? {
          darkMode: true,
          background: '#0f172a',
          primaryColor: '#6366f1',
          primaryTextColor: '#f8fafc',
          primaryBorderColor: '#818cf8',
          lineColor: '#94a3b8',
          secondaryColor: '#ec4899',
          tertiaryColor: '#1e293b'
        }
      : {
          background: '#ffffff',
          primaryColor: '#e0e7ff',
          primaryTextColor: '#1e293b',
          primaryBorderColor: '#6366f1',
          lineColor: '#64748b',
          secondaryColor: '#fce7f3',
          tertiaryColor: '#f1f5f9'
        }
  });
  isInitialized = true;
}

/**
 * Validates a Mermaid string asynchronously.
 * Returns isValid, error message, line number, and actionable suggestion.
 */
export async function validateMermaid(code: string): Promise<ValidationResult> {
  const trimmed = code.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Input is empty',
      errorDetails: 'Please enter valid Mermaid syntax such as "graph TD", "flowchart LR", or "sequenceDiagram".'
    };
  }

  // Common check: verify diagram header keyword exists
  const knownHeaders = [
    'graph',
    'flowchart',
    'sequencediagram',
    'classdiagram',
    'statediagram',
    'statediagram-v2',
    'erdiagram',
    'journey',
    'gantt',
    'pie',
    'gitgraph',
    'mindmap',
    'timeline',
    'quadrantchart',
    'sankey',
    'xychart',
    'block'
  ];

  const firstLine = trimmed.split('\n')[0].trim().toLowerCase();
  const startsWithKnownHeader = knownHeaders.some(header => firstLine.startsWith(header));

  if (!startsWithKnownHeader) {
    return {
      isValid: false,
      error: 'Missing or unrecognized diagram definition',
      errorDetails: `The code does not start with a recognized Mermaid diagram header. Try starting with "graph TD", "flowchart LR", or "sequenceDiagram". Found: "${firstLine.slice(0, 30)}..."`,
      errorLine: 1
    };
  }

  try {
    if (!isInitialized) {
      initMermaid();
    }
    await mermaid.parse(trimmed);
    return {
      isValid: true,
      error: null
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    
    // Extract line number if present
    const lineMatch = errorMsg.match(/line\s+(\d+)/i) || errorMsg.match(/on line\s+(\d+)/i);
    const lineNum = lineMatch ? parseInt(lineMatch[1], 10) : undefined;

    let suggestion = 'Check for syntax errors, unclosed brackets [ ], parentheses ( ), or unescaped characters.';
    if (errorMsg.includes('Expecting') || errorMsg.includes('got')) {
      suggestion = 'Check connection arrows (e.g., -->, ---, ==>, -.->) and ensure node labels have matching quotes or brackets.';
    }

    return {
      isValid: false,
      error: cleanMermaidErrorMessage(errorMsg),
      errorLine: lineNum,
      errorDetails: suggestion
    };
  }
}

/**
 * Clean up noisy stack traces or internal lexer messages for user display
 */
export function cleanMermaidErrorMessage(msg: string): string {
  // Strip out long lexer table / stack details
  const firstSentence = msg.split('\n')[0];
  return firstSentence.replace(/^Error:\s*/i, '').trim();
}

/**
 * Renders Mermaid diagram to SVG string
 */
export async function renderMermaidSvg(
  id: string,
  code: string,
  isDark = false
): Promise<string> {
  initMermaid(isDark);
  const cleanId = id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const { svg } = await mermaid.render(`mermaid_${cleanId}_${Date.now()}`, code);
  return svg;
}
