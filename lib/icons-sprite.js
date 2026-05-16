// lib/icons-sprite.js — Inline-Loader für das Codex-Icon-Sprite.
// Spec §4.1 — lädt assets/icons.svg einmalig und fügt es als erstes Kind
// in den Body ein, damit <use href="#i-NAME"/>-Referenzen funktionieren.
// Idempotent: Doppel-Aufrufe sind no-ops.

const SPRITE_URL = new URL('../assets/icons.svg', import.meta.url);
const SPRITE_ID = 'codex-icon-sprite';

/**
 * Lädt das Sprite und inlined es in document.body.
 * MUSS so früh wie möglich in der App-Initialisierung aufgerufen werden,
 * vor renderIcon()-Aufrufen, damit Symbol-References auflösen.
 *
 * @returns {Promise<HTMLDivElement|null>} Der eingefügte Wrapper, oder null
 *   wenn das Sprite nicht geladen werden konnte (z.B. file://-Protokoll).
 */
export async function initSprite() {
  if (typeof document === 'undefined') return null;
  const existing = document.getElementById(SPRITE_ID);
  if (existing) return existing;

  try {
    const res = await fetch(SPRITE_URL);
    if (!res.ok) {
      console.warn(`[icons-sprite] fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }
    const text = await res.text();
    const wrapper = document.createElement('div');
    wrapper.id = SPRITE_ID;
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    wrapper.innerHTML = text;
    document.body.prepend(wrapper);
    return wrapper;
  } catch (err) {
    console.warn('[icons-sprite] could not load sprite:', err);
    return null;
  }
}
