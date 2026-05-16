import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { LEARNING_PATHS } from '../lib/learning-paths.js';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');

describe('learning path compass', () => {
  const index = read('index.html');
  const app = read('app.js');
  const document = new JSDOM(index).window.document;
  const slideIds = Array.from(document.querySelectorAll('.slide')).map(slide => slide.dataset.slideId);

  it('exposes a learner-facing path panel from the main deck', () => {
    expect(document.querySelector('#path-toggle')?.textContent).toContain('Lernpfad');
    expect(document.querySelector('#path-panel')?.getAttribute('aria-label')).toBe('Lernpfad-Kompass');
    expect(document.querySelector('#path-status')).toBeTruthy();
  });

  it('defines multiple paths that can be completed independently', () => {
    expect(LEARNING_PATHS.map(path => path.id)).toEqual([
      'einsteiger',
      'praxis',
      'power-user',
      'governance'
    ]);

    LEARNING_PATHS.forEach(path => {
      expect(path.stations.length).toBeGreaterThanOrEqual(7);
      path.stations.forEach(id => expect(slideIds).toContain(id));
    });
  });

  it('stores progress locally and lets learners switch paths', () => {
    expect(app).toContain("storage.get('learningPaths')");
    expect(app).toContain("storage.set('learningPaths'");
    expect(app).toContain('activePathId');
    expect(app).toContain('data-path-start');
    expect(app).toContain('data-path-pause');
    expect(app).toContain('data-path-reset-all');
    expect(app).toContain('function pauseActivePath');
    expect(app).toContain('function resetAllPaths');
    expect(app).toContain('Fortschritt zurücksetzen');
  });

  it('lets learners pause the active path or reset all path progress', () => {
    expect(app).toContain('Aktiven Pfad pausieren');
    expect(app).toContain('Alle Fortschritte zurücksetzen');
    expect(app).toContain('pathState.activePathId = null');
    expect(app).toContain('pathState.completed = {}');
    expect(app).toContain('window.confirm');
  });

  it('turns on useful learner modes when a path starts', () => {
    expect(app).toContain("mode.set('llm', true)");
    expect(app).toContain("mode.set('exercises', true)");
  });
});
