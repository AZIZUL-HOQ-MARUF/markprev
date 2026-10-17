import { describe, it, expect, beforeEach } from 'vitest';
import { validateMermaid, cleanMermaidErrorMessage, initMermaid } from '../mermaidValidator';

describe('mermaidValidator', () => {
  beforeEach(() => {
    initMermaid(false);
  });

  it('validates a correct graph TD definition', async () => {
    const validGraph = `graph TD
      A[Start] --> B[Finish]`;
    const result = await validateMermaid(validGraph);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('validates a correct flowchart LR definition', async () => {
    const validFlow = `flowchart LR
      User --> App --> Database`;
    const result = await validateMermaid(validFlow);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('validates a sequence diagram definition', async () => {
    const sequence = `sequenceDiagram
      Alice->>Bob: Hello Bob
      Bob-->>Alice: Hi Alice`;
    const result = await validateMermaid(sequence);
    expect(result.isValid).toBe(true);
  });

  it('detects missing or unrecognized diagram header when user pastes arbitrary text', async () => {
    const randomText = `This is some random text that is not a diagram`;
    const result = await validateMermaid(randomText);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Missing or unrecognized diagram definition');
    expect(result.errorLine).toBe(1);
  });

  it('detects empty input', async () => {
    const result = await validateMermaid('   \n  ');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Input is empty');
  });

  it('catches syntax errors such as broken arrows or unclosed brackets', async () => {
    const brokenGraph = `graph TD
      A[Unclosed bracket --> B`;
    const result = await validateMermaid(brokenGraph);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
    expect(result.errorDetails).toBeTruthy();
  });

  it('cleans up raw error messages to be user-friendly', () => {
    const rawError = 'Error: Parse error on line 3: ... Expecting EOF\nsome internal stack trace';
    const cleaned = cleanMermaidErrorMessage(rawError);
    expect(cleaned).not.toContain('\nsome internal stack');
    expect(cleaned.startsWith('Error:')).toBe(false);
  });
});
