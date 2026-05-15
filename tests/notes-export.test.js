import { describe, it, expect } from 'vitest';
import { renderNotesMarkdown } from '../lib/notes-export.js';

describe('renderNotesMarkdown', () => {
  it('rendert leere notizen', () => {
    expect(renderNotesMarkdown([])).toContain('# Meine Notizen');
    expect(renderNotesMarkdown([])).toContain('Noch keine Notizen');
  });

  it('rendert eine reflexion mit kapitel-überschrift und datum', () => {
    const md = renderNotesMarkdown([
      { chapter: 'context', ex: 'u1', antwort: 'Aha.', ts: new Date('2026-05-12T10:00:00Z').getTime() }
    ]);
    expect(md).toContain('# Meine Notizen');
    expect(md).toContain('## Context');
    expect(md).toContain('Aha.');
    expect(md).toMatch(/2026-05-12/);
  });

  it('gruppiert mehrere reflexionen pro kapitel', () => {
    const md = renderNotesMarkdown([
      { chapter: 'context', ex: 'u1', antwort: 'A', ts: 1 },
      { chapter: 'context', ex: 'u2', antwort: 'B', ts: 2 },
      { chapter: 'skills', ex: 'u1', antwort: 'C', ts: 3 }
    ]);
    expect(md.match(/## Context/g).length).toBe(1);
    expect(md.match(/## Skills/g).length).toBe(1);
  });

  it('rendert usecases-notizen mit lesbarer kapitelüberschrift', () => {
    const md = renderNotesMarkdown([
      { chapter: 'usecases', ex: 'r2', antwort: 'Prompt-Labor getestet.', ts: 4 }
    ]);

    expect(md).toContain('## Use Cases');
    expect(md).not.toContain('## usecases');
  });
});
