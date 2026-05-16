import { ModeManager } from './mode.js';
import { Storage } from './storage.js';

const storage = new Storage('llm-101-v1');
const mode = new ModeManager(storage);

function syncToggleState() {
  document.querySelectorAll('[data-mode="theme"]').forEach(button => {
    const active = button.dataset.value === mode.get('theme');
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

document.querySelectorAll('[data-mode="theme"]').forEach(button => {
  button.addEventListener('click', () => {
    mode.set('theme', button.dataset.value);
    syncToggleState();
  });
});

syncToggleState();
