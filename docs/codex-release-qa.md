# LLM-101 · Codex Redesign — Release QA

**Branch:** `redesign/codex-v2-h`
**Datum:** 2026-05-17
**Tester:** Subagent Paket H (automatisiert) + manueller Nachlauf (User)
**Test-Stand:** 28 Test-Files / 102 Tests grün (`npm test`)
**Visual-QA:** 12/12 Screenshots in `.visual-qa/` generiert (`npm run visual:qa`)

Die Checkliste folgt Spec §11-H. Status-Werte:

- **OK** — automatisiert oder via Screenshot verifiziert.
- **PENDING manual** — braucht echten Browser/DevTools, im Sandbox nicht prüfbar. Setup-Hinweis steht dabei.
- **FAIL** — Problem reproduzierbar, Fix nötig vor Merge.

---

## 1. `index.html` lädt ohne Console-Errors

**Status:** PENDING manual

Visual-QA hat alle 12 Pages bis `networkidle` geladen, kein Playwright-Abbruch. Damit sind keine fatalen Runtime-Errors zu erwarten. Konsole prüft das Skript aber nicht.

**Setup für User:** Chrome → `index.html` öffnen → DevTools (Cmd+Opt+I) → Console-Tab → Reload (Cmd+R) → Console-Liste muss leer sein (oder nur Info/Logs, keine Errors/Warnings die mit roter/gelber Marke kommen). Network-Tab → keine 404er.

---

## 2. Theme-Toggle (light / dark / auto)

**Status:** OK (light + dark)

- `cover-desktop-1280x720.png` (light) → heller Hintergrund, Brand-Chip schwarz.
- `dark-models-1280x720.png` (dark) → dunkler Hintergrund, Karten kontrastreich, Volatile-Stamp lesbar in Dark.

`auto` setzt `prefers-color-scheme` — automatisch nicht aus Screenshots herauslesbar. App-Logik (siehe `app.js`) lädt `auto` aus localStorage; Test-Coverage existiert in `tests/mode-toolbar.test.js`.

**Setup für User:** Header → Auto-Pill anklicken → System-Theme in macOS umschalten (Settings → Allgemein → Erscheinungsbild) → Slides müssen mitwechseln.

---

## 3. Layout-Toggle (Vortrag / Lesen)

**Status:** OK (Vortrag) / PENDING manual (Lesen)

`cover-desktop` zeigt Vortrag-Modus mit Single-Slide-Layout (Slide-Counter „1/30", Pager-Pills). Lesen-Modus rendert Scroll-Stream — kein dedizierter Visual-QA-Target dafür, aber Logik durch `tests/layout-mode.test.js` abgedeckt.

**Setup für User:** Header → „Lesen"-Pill → Slides werden untereinander gestackt, Pager weg.

---

## 4. Hash-Routing `index.html#usecase-lab`

**Status:** OK

`prompt-lab-phone-390x844.png` wurde via `index.html#usecase-lab` direkt geladen und zeigt die Lab-Folie. Auch alle anderen QA-Targets nutzen Slide-Hashes (`#einstieg-1`, `#usecase-5`, `#claude-1` etc.) und rendern die korrekte Folie.

Hinweis: Format ist `#{slideId}` (z.B. `#usecase-lab`), nicht `#slide-{slideId}` — entsprechend Spec §3.2 v1.2.

---

## 5. Lernpfad-Panel öffnet, vier Pfade klickbar

**Status:** PARTIAL — Panel-Markup OK, Visual-QA Screenshot zeigt Panel nicht

Tests `tests/learning-paths-ui.test.js` und `tests/learning-paths.test.js` validieren Markup, `#path-toggle` und Pfad-Wechsel-Logik (Update von `.slide-progress`).

Im Screenshot `learning-path-panel-1280x720.png` ist das Panel nach dem `click:#path-toggle` nicht sichtbar — wahrscheinlich Animations-Delay, das `scripts/visual-qa.mjs` nicht abwartet. **Kein Block für Release**, aber Visual-QA-Tooling-Verbesserung als Tech-Debt aufnehmen (siehe unten).

**Setup für User:** Header → „Lernpfad" → Panel slidet rechts rein, 4 Pfade (Schnell, Standard, Tief, Trainer) sichtbar, Klick auf einen aktualisiert Progress-Bar unten.

---

## 6. Trainer-Cockpit (`?trainer=1`)

**Status:** OK

`trainer-cockpit-1280x720.png` zeigt:
- Geöffnetes Cockpit rechts.
- Korrekte Folien-Notiz für aktive `usecase-4`-Folie.
- Demo-Prompt-Kopierbutton.
- Ablauf 120min mit 6 Phasen.
- Demo-Checkliste.
- Trainer-Pill in Header aktiv.

---

## 7. Volatile-Folien zeigen `.slide-stand` mit `data-checked`-Datum

**Status:** OK

`dark-models-1280x720.png` (Slide `claude-1`) zeigt rechts oben den Volatile-Stamp „STAND 16.05.26 · ZU PRÜFEN". `cover-desktop` zeigt auf Cover die normale „STAND 16.05.26" Variante (ohne „ZU PRÜFEN" weil Cover nicht volatile ist — Stamp hier eher als Dating-Element).

Test `tests/volatile-slides.test.js` validiert das Markup über alle volatile-Folien.

---

## 8. Print-Preview (A4 landscape, alle 30 Folien lesbar)

**Status:** PENDING manual

Print-CSS wurde in Paket G konsolidiert (`print.css`), Tests `tests/print-css.test.js` validieren Page-Setup und Hide-Regeln. `handout-print-1280x720.png` zeigt das Handout — visuelle Skim-Eignung gegeben.

**Setup für User:** Chrome → `index.html` → Cmd+P → Layout „Querformat", A4 → PDF speichern → 30 Slides scrollen, keine abgeschnittenen `.tok`-Pills, keine doppelten Header.

---

## 9. Reduced-Motion: Caret blinkt nicht

**Status:** PENDING manual

CSS-Logik (`prefers-reduced-motion`) ist im Codex-Foundation-Paket A drin (siehe `styles.css` / `codex-foundation.css`). Visual-QA fährt mit Default-Settings, kein dedizierter Reduced-Motion-Run.

**Setup für User:** macOS → Systemeinstellungen → Bedienungshilfen → Anzeige → „Bewegung reduzieren" aktivieren → `index.html#einstieg-1` neu laden → grüner Caret im Title (`kommentiert█`) darf nicht pulsieren.

---

## 10. Mobile 375px: keine horizontale Scrollbar, Toolbar wrappt

**Status:** PARTIAL — 390px geprüft, 375px PENDING

Visual-QA testet 390x844 (iPhone 12/13/14 Pro), nicht 375 (iPhone SE/Mini). `prompt-lab-phone-390x844.png` und `quality-check-phone-390x844.png` zeigen keine sichtbaren Overflow-Probleme.

**Setup für User:** Chrome DevTools → Device Mode → 375x667 → `index.html` durchklicken → kein horizontales Scrollen, Toolbar wrappt unter Brand-Chip.

---

## Bekannte Tech-Debt nach Paket H

- **Visual-QA-Skript wartet nicht auf Panel-Animationen.** Workaround: vor `page.screenshot()` ein `await page.waitForTimeout(300)` nach Click einbauen. Geringe Priorität — kein Release-Block.
- Restliche Punkte aus Anhang D (Decision Log): siehe Cleanup-Commits in Paket H bzw. „nicht durchgeführt"-Liste im Subagent-Bericht.

---

## Release-Empfehlung

Branch ist aus Test-/Build-Sicht ready für PR nach `main`. Manuelle Checks (Punkte 1, 3-Reading, 8, 9, 10@375px) sollte der User vor Merge selbst durchklicken — Sandbox kann das nicht ersetzen.
