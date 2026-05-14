// lib/tabs.js — LLM-Tab-Komponente mit optionaler Synchronisation
export function initTabs(root) {
  root.querySelectorAll('[data-llm-tabs]').forEach(group => {
    group.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        activateTab(btn.dataset.tab, group.dataset.syncGroup, group);
      });
    });
  });
}

function activateTab(tabName, syncGroup, originGroup) {
  const targets = syncGroup
    ? document.querySelectorAll(`[data-llm-tabs][data-sync-group="${syncGroup}"]`)
    : [originGroup];

  for (const group of targets) {
    group.querySelectorAll('[data-tab]').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabName);
    });
    group.querySelectorAll('[data-tab-panel]').forEach(p => {
      p.hidden = p.dataset.tabPanel !== tabName;
    });
  }
}
