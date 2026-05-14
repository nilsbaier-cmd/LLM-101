// lib/notes-export.js — Reflexionsantworten zu Markdown
const CHAPTER_LABELS = {
  verwaltung: 'Verwaltung & KI',
  claude: 'Claude 101',
  context: 'Context',
  usecase: 'Use Cases',
  skills: 'Skills',
  ladder: 'Skill-Ladder',
  chat: 'Chat vs. Project',
  next: 'Next Level',
  einstieg: 'Einstieg'
};

export function renderNotesMarkdown(notes) {
  const lines = ['# Meine Notizen', '', '_Aus der Claude-Einführung exportiert._', ''];
  if (notes.length === 0) {
    lines.push('Noch keine Notizen.');
    return lines.join('\n');
  }
  const byChapter = {};
  for (const n of notes) (byChapter[n.chapter] ??= []).push(n);
  for (const chapter of Object.keys(byChapter)) {
    const label = CHAPTER_LABELS[chapter] || chapter;
    lines.push(`## ${label}`, '');
    for (const n of byChapter[chapter]) {
      const date = new Date(n.ts).toISOString().slice(0, 10);
      lines.push(`### Übung ${n.ex} — ${date}`, '', n.antwort, '');
    }
  }
  return lines.join('\n');
}

export function downloadMarkdown(filename, content) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
