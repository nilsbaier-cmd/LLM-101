import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (path) => readFileSync(join(process.cwd(), path), 'utf8');

describe('governance content', () => {
  const index = read('index.html');
  const explainer = read('explainer/f-bund-erlaubt.html');

  it('frames federal AI guidance as controlled competence building', () => {
    expect(index).toContain('Von Warnlogik zu Nutzungskompetenz');
    expect(index).toContain('Kompetenzen aufbauen');
    expect(index).toContain('Vertrauen verdienen');
    expect(index).toContain('Effizienz steigern');
    expect(index).toContain('KI-Anlaufstelle seit Februar 2026');
  });

  it('keeps current federal source links visible', () => {
    expect(index).toContain('bk/de/home/digitale-transformation-ikt-lenkung/kuenstliche_intelligenz/kinetzwerk.html');
    expect(index).toContain('sb021-strategie-einsatz-von-ki-systemen-in-der-bundesverwaltung.html');
    expect(index).toContain('Stand 15.05.2026');
  });

  it('distinguishes allowed, conditional and forbidden DeepL examples', () => {
    expect(explainer).toContain('DeepL Pro Translate für veröffentlichte Texte nutzen');
    expect(explainer).toContain('DeepL Write für unkritische Formulierungen nutzen');
    expect(explainer).toContain('DeepL Write mit Personaldossier füttern');
    expect(explainer).toContain('KI-Anlaufstelle');
  });
});
