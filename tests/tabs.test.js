// tests/tabs.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { initTabs } from '../lib/tabs.js';

describe('initTabs', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="llm-tabs" data-llm-tabs>
        <nav class="llm-tabs-nav">
          <button data-tab="claude" class="active">Claude</button>
          <button data-tab="chatgpt">ChatGPT</button>
          <button data-tab="gemini">Gemini</button>
        </nav>
        <div data-tab-panel="claude" class="active">CLAUDE-INHALT</div>
        <div data-tab-panel="chatgpt" hidden>CHATGPT-INHALT</div>
        <div data-tab-panel="gemini" hidden>GEMINI-INHALT</div>
      </div>`;
  });

  it('zeigt initial den aktiven tab', () => {
    initTabs(document.body);
    expect(document.querySelector('.llm-tabs-nav').getAttribute('role')).toBe('tablist');
    expect(document.querySelector('[data-tab="claude"]').getAttribute('role')).toBe('tab');
    expect(document.querySelector('[data-tab="claude"]').getAttribute('aria-selected')).toBe('true');
    expect(document.querySelector('[data-tab-panel="claude"]').getAttribute('role')).toBe('tabpanel');
    expect(document.querySelector('[data-tab-panel="claude"]').hidden).toBe(false);
    expect(document.querySelector('[data-tab-panel="chatgpt"]').hidden).toBe(true);
  });

  it('schaltet beim klick auf ein tab-button um', () => {
    initTabs(document.body);
    document.querySelector('[data-tab="chatgpt"]').click();
    expect(document.querySelector('[data-tab-panel="claude"]').hidden).toBe(true);
    expect(document.querySelector('[data-tab-panel="chatgpt"]').hidden).toBe(false);
    expect(document.querySelector('[data-tab="chatgpt"]').classList.contains('active')).toBe(true);
    expect(document.querySelector('[data-tab="chatgpt"]').getAttribute('aria-selected')).toBe('true');
    expect(document.querySelector('[data-tab="claude"]').tabIndex).toBe(-1);
  });

  it('synchronisiert mehrere tab-gruppen mit data-sync-group', () => {
    document.body.innerHTML = `
      <div data-llm-tabs data-sync-group="llm">
        <button data-tab="claude" class="active">C</button>
        <button data-tab="chatgpt">G</button>
        <div data-tab-panel="claude" class="active">A1</div>
        <div data-tab-panel="chatgpt" hidden>B1</div>
      </div>
      <div data-llm-tabs data-sync-group="llm">
        <button data-tab="claude" class="active">C</button>
        <button data-tab="chatgpt">G</button>
        <div data-tab-panel="claude" class="active">A2</div>
        <div data-tab-panel="chatgpt" hidden>B2</div>
      </div>`;
    initTabs(document.body);
    document.querySelectorAll('[data-tab="chatgpt"]')[0].click();
    const panels = document.querySelectorAll('[data-tab-panel="chatgpt"]');
    expect(panels[0].hidden).toBe(false);
    expect(panels[1].hidden).toBe(false);
  });

  it('wrappt Pfeiltasten nicht am Ende der Tabreihe', () => {
    initTabs(document.body);
    const tabs = Array.from(document.querySelectorAll('[data-tab]'));
    tabs[2].click();
    tabs[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    expect(document.querySelector('[data-tab-panel="gemini"]').hidden).toBe(false);
    expect(document.querySelector('[data-tab="gemini"]').getAttribute('aria-selected')).toBe('true');
  });
});
