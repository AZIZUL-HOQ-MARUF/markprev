import { createHighlighterCoreSync } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import darkPlus from '@shikijs/themes/dark-plus';
import lightPlus from '@shikijs/themes/light-plus';
import bash from '@shikijs/langs/bash';
import c from '@shikijs/langs/c';
import cpp from '@shikijs/langs/cpp';
import csharp from '@shikijs/langs/csharp';
import css from '@shikijs/langs/css';
import go from '@shikijs/langs/go';
import html from '@shikijs/langs/html';
import java from '@shikijs/langs/java';
import javascript from '@shikijs/langs/javascript';
import json from '@shikijs/langs/json';
import kotlin from '@shikijs/langs/kotlin';
import markdown from '@shikijs/langs/markdown';
import python from '@shikijs/langs/python';
import rust from '@shikijs/langs/rust';
import sql from '@shikijs/langs/sql';
import tsx from '@shikijs/langs/tsx';
import typescript from '@shikijs/langs/typescript';
import xml from '@shikijs/langs/xml';
import yaml from '@shikijs/langs/yaml';

// The real VS Code grammars + Light+/Dark+ themes, so code blocks match the editor.
// Fences in a language that is not registered here are left as plain text.
export const highlighter = createHighlighterCoreSync({
  themes: [lightPlus, darkPlus],
  langs: [
    bash, c, cpp, csharp, css, go, html, java, javascript, json, kotlin,
    markdown, python, rust, sql, tsx, typescript, xml, yaml,
  ],
  // forgiving: a grammar the JS engine cannot fully compile degrades instead of throwing
  engine: createJavaScriptRegexEngine({ forgiving: true }),
});

export const SHIKI_OPTIONS = {
  themes: { light: 'light-plus', dark: 'dark-plus' },
  // colors come from CSS vars so the app's .dark class can switch themes (see index.css)
  defaultColor: false,
  defaultLanguage: 'text',
  addLanguageClass: true,
} as const;
