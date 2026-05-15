import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');

describe('accessibility safeguards', () => {
  const app = read('app.js');
  const tabs = read('lib/tabs.js');
  const appCss = read('app.css');
  const presentationCss = read('presentation.css');

  it('adds semantic tab roles and selected states', () => {
    expect(tabs).toContain("role', 'tablist'");
    expect(tabs).toContain("role', 'tab'");
    expect(tabs).toContain("role', 'tabpanel'");
    expect(tabs).toContain('aria-selected');
    expect(tabs).toContain('tabIndex');
  });

  it('exposes current slide and TOC position to assistive tech', () => {
    expect(app).toContain('aria-current');
    expect(app).toContain('aria-live');
    expect(app).toContain('aria-label');
  });

  it('respects reduced motion preferences', () => {
    expect(appCss).toContain('@media (prefers-reduced-motion: reduce)');
    expect(presentationCss).toContain('@media (prefers-reduced-motion: reduce)');
  });
});
