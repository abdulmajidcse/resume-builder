# Inkwell — Resume & CV Builder

A privacy-first resume builder. Ten print-ready templates, a live editor that shows the
real printed page, and a one-click PDF. No account, no backend, no upload — the document
lives in the browser and never leaves the device.

---

## Quick start

```bash
# Local development
npm install
npm run dev            # http://localhost:3000

# Docker
docker compose up --build   # http://localhost:3000
```

## Scripts

| Command             | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Development server with fast refresh                |
| `npm run build`     | Production build (`standalone` output)              |
| `npm start`         | Serve the production build                          |
| `npm test`          | Run the test suite once                             |
| `npm run typecheck` | `tsc --noEmit`, strict mode                         |
| `npm run lint`      | ESLint over the whole project                       |
| `npm run verify`    | typecheck + lint + tests — the gate before shipping |

---

## Architecture

The codebase is sliced by **feature**, not by file type. A slice owns its state, its UI
and its rules, and exposes a narrow surface to the rest of the app.

```
src/
  app/                    routes only — landing, /templates, /builder, /api/health
  entities/resume/        the domain: Zod schema, types, factories, sample data
  features/
    templates/            template contract, shared section bodies, registry, 10 templates
    editor/               store, hooks, and one form per section
    export/               page geometry, print pipeline, JSON import/export
  shared/
    ui/                   design-system primitives (Button, Field, Segmented, …)
    lib/                  storage adapter, formatting, measurement hook
  tests/                  unit and structural tests
```

### The three decisions that shape everything

**1. One document, validated in one place.**
`entities/resume/schema.ts` is the only definition of what a resume _is_. The editor
mutates it, templates render it, storage persists it, import validates against it.
Every field is optional-or-defaulted, because a resume under construction is a real
resume — which is what makes "start from blank" the same code path as "start from an
example", rather than a special case that rots.

**2. A template is a pure function of the document.**

```ts
type TemplateComponent = (props: { resume: Resume }) => ReactNode;
```

Templates never read the store, never fetch, and hold no state. `templates/registry.ts`
is the single source of truth for which templates exist. Adding an eleventh means
writing one component and one registry entry — nothing else in the codebase changes.

Because layouts differ far more in _design_ than in how a job entry is structured, the
section bodies live once in `templates/body.tsx` and are parameterised (heading
component, date placement, skill presentation, colours). Each template file is then a
masthead plus a heading style, and stays readable.

**3. The preview is the printed page.**

There is no PDF renderer. `ResumeDocument` renders the sheet at exact print pixels
(794×1123 for A4 at 96 DPI); the screen wraps it in a CSS transform to fit the pane, and
print CSS drops the transform and hides everything marked `data-print="hide"`. The export
_is_ the preview — WYSIWYG by construction, not by maintenance — and the resulting PDF
has selectable text at a fraction of the size of a rasterised one.

Print roles are structural, and the tests assert them:

| Attribute                  | Meaning                                        |
| -------------------------- | ---------------------------------------------- |
| `data-print="hide"`        | Application chrome — never printed             |
| `data-print="surface"`     | The editor shell holding the panes             |
| `data-print="pane"`        | The one pane whose contents _are_ the document |
| `data-print="passthrough"` | Sizing wrapper that collapses around the sheet |
| `data-print="scaler"`      | Screen-fit transform, zeroed for print         |

### State

Zustand with the `persist` middleware, written through a `StorageAdapter` interface
rather than `localStorage` directly — so a server-backed adapter can be introduced later
without the editor changing. Persisted documents are re-validated through the schema on
load, so a corrupt or outdated record degrades to a fresh document instead of a crash.

Undo/redo keeps snapshots outside the persisted slice. Edits that share a _coalesce key_
within 700 ms collapse into one history entry, so undo steps back by edit rather than by
keystroke.

### Performance

- Server components for everything static; only the editor ships as client JS.
- Templates are `memo`'d; theme changes repaint through CSS custom properties without
  re-rendering template subtrees.
- Gallery thumbnails render a fixed-size aspect box before measuring, so the page has no
  layout shift.
- Route budget: landing **134 kB** first load, builder **165 kB**.

---

## Data & privacy

Everything is client-side. There is no database, no analytics, no third-party request at
runtime, and the only API route is a container healthcheck. Resumes are stored in
`localStorage` under `resume-builder:document:v1` and can be exported to JSON at any time
— which is also the backup and transfer path between devices.

Storage is accessed defensively: private-browsing mode and blocked site data both throw,
and the app falls back to in-memory storage for the session rather than failing.

---

## Docker

Three stages — dependencies, build, runtime — so the published image carries only Next.js'
standalone server output: no npm, no dev dependencies, no source.

- Base `node:22-alpine`; final image ≈ 312 MB, of which ≈ 66 MB is the application
- Runs as the unprivileged `nextjs` user
- `HEALTHCHECK` against `/api/health`
- Compose runs the container read-only with `no-new-privileges`, since the app keeps no
  server-side state

```bash
docker compose up --build       # build and run
docker compose up -d            # detached
docker compose logs -f web
```

Configuration is `.env`-driven; see `.env.example`. No secrets are required.

---

## Testing

69 tests covering the layers where breakage would be invisible or expensive:

- **Schema** — empty documents are valid, defaults fill in, bad accents are rejected, and
  documents round-trip through JSON without loss.
- **Templates** — every template in the registry renders a populated resume _and_ a blank
  one, honours hidden sections, and honours renamed headings. Parameterised over the
  registry, so a new template is covered the moment it is registered.
- **Store** — undo, redo, keystroke coalescing, snapshot isolation, and history clearing.
- **Print structure** — the document reaches exactly one printable pane, the form never
  does, and every wrapper between the pane and the sheet is one print CSS can collapse.
- **Import** — valid documents load; unreadable files, malformed JSON and foreign JSON
  each produce their own accurate message.

```bash
npm run verify
```

---

## Adding a template

1. Create `src/features/templates/components/<id>.tsx`, default-exporting a
   `memo`'d component that takes `{ resume }`.
2. Use `standardRenderers` / `renderSections` from `../body` for section bodies, or write
   your own if the layout genuinely differs.
3. Add one entry to `TEMPLATES` in `registry.ts`.

The registry tests will immediately exercise it against full, empty, hidden-section and
renamed-heading documents.

---

## Licence

MIT.
