# LLM 101 — Interaktive Präsentation

Hybrid Slide/Scroll-Präsentation als Einführung in Large Language Models mit konkreten Beispielen aus Claude, ChatGPT und Gemini. Statisches HTML/CSS/JS, kein Build-Step, self-hosted Fonts, DSGVO-konform.

## Inhalt

- `index.html` — Hauptpräsentation, 25 Folien in 7 Kapiteln, Vortrags- und Lesemodus, Hell/Dunkel/Auto-Theme, optional LLM-agnostische Tabs (Claude, ChatGPT und Gemini) und Übungen
- `meine-notizen.html` — Sammelseite für eigene Reflexionsantworten mit Markdown-Export
- `explainer/*.html` — Sieben standalone Concept-Explainer (A–G):
  - A — Context Window Simulator
  - B — Chat vs. Project
  - C — Skill-Architektur (Progressive Disclosure)
  - D — Skill-Ladder Selbsttest
  - E — Fünf Phasen der KI-Nutzung
  - F — Verwaltung & KI (erlaubt / bedingt / verboten)
  - G — Welches Modell für deine Aufgabe?

## Lokal starten

ES-Module funktionieren nicht über `file://` — du brauchst einen lokalen HTTP-Server:

```bash
cd claude-praesentation
python3 -m http.server 8765
# dann http://localhost:8765 im Browser öffnen
```

## Offline & Quellenstand

- `manifest.webmanifest` und `sw.js` machen die Präsentation nach dem ersten Laden offline-fähig. Der Service Worker funktioniert über HTTP(S), nicht direkt über `file://`.
- Für ZIP-Nutzung: Repo/Ordner vollständig mit `index.html`, `meine-notizen.html`, `app.js`, `lib/`, `explainer/`, `assets/`, CSS-Dateien, `manifest.webmanifest` und `sw.js` ausliefern; lokal per HTTP-Server öffnen.
- Für PDF/Handout: `index.html` im Browser öffnen und Drucken → Ziel „Als PDF sichern" wählen. `print.css` erzeugt 16:9-Seiten, zeigt alle Step-Reveals und blendet Navigations-UI aus.
- Volatile Folien sind im HTML mit `data-volatile="true"` und `data-checked` markiert. Stand der Anbieter- und Governance-Quellen: 16.05.2026.
- Offizielle Check-Links: [Claude-Pläne](https://support.claude.com/en/articles/11049762-choosing-a-claude-plan), [ChatGPT-Pläne](https://chatgpt.com/pricing/), [Gemini-Pläne](https://gemini.google/subscriptions/), [BK Kompetenznetzwerk KI](https://www.bk.admin.ch/bk/de/home/digitale-transformation-ikt-lenkung/kuenstliche_intelligenz/kinetzwerk.html), [SB021 KI-Teilstrategie](https://www.bk.admin.ch/bk/de/home/digitale-transformation-ikt-lenkung/vorgaben/sb021-strategie-einsatz-von-ki-systemen-in-der-bundesverwaltung.html).

## Entwicklung

```bash
npm install   # Vitest installieren (nur für Unit-Tests)
npm test      # Tests laufen lassen
```

Auslieferung bleibt build-frei. `node_modules/` und `tests/` sind Dev-Artefakte.

## Architektur

- **Vanilla JS, ES-Module** — kein Bundler
- **Design-Tokens** in `tokens.css`, Komponenten in `app.css` + `presentation.css`
- **Lib-Module** unter `lib/` (Storage, ModeManager, Icons, Tabs, Exercises, Notes-Export)
- **LocalStorage-Namespace** `llm-101-v1.*`
- **Hash-Routing** für direkte Folien-Verlinkung (`#einstieg-3`)
- **Self-hosted Fonts** in `assets/fonts/` (Hanken Grotesk, JetBrains Mono — latin + latin-ext)

## Hintergrund

Spec und Implementation-Plan unter [`docs/superpowers/`](docs/superpowers/) — historische Artefakte aus der Bauphase.

## Lizenz

Inhalte und Code zur freien Nutzung und Adaption für eigene Schulungs-Kontexte.
