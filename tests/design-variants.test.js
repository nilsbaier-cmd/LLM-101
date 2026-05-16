import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');
const html = read('design-variants.html');
const css = read('design-variants.css');
const readme = read('README.md');

describe('design variants preview', () => {
  it('keeps the prototype isolated from the production deck', () => {
    expect(readme).toContain('design-variants.html');
    expect(html).toContain('tokens.css?v=');
    expect(html).toContain('design-variants.css?v=');
    expect(html).not.toContain('app.js');
    expect(html).not.toContain('React');
  });

  it('offers two variants with five example slides each', () => {
    expect(html).toContain('data-variant-panel="ambient"');
    expect(html).toContain('data-variant-panel="ops"');
    expect(html.match(/class="preview-slide/g)).toHaveLength(10);
    expect(html).toContain('Ambient Workspace');
    expect(html).toContain('Operational Dashboard');
  });

  it('supports light and dark mode without changing the deck fonts', () => {
    expect(html).toContain('data-theme="light"');
    expect(html).toContain('id="theme-toggle"');
    expect(css).toContain('body[data-theme="dark"]');
    expect(css).toContain('var(--font-sans)');
    expect(css).toContain('var(--font-mono)');
  });

  it('documents the inspiration sources without using external assets', () => {
    expect(html).toContain('https://dribbble.com/shots/27373742-Claro-Concept-Branding');
    expect(html).toContain('https://dribbble.com/shots/27355193-Restaurant-Analytics-Dashboard');
    expect(html).not.toContain('<img');
    expect(css).not.toContain('url(http');
  });
});
