# Women's Hack Day — landing page

Landing page for Women's Hack Day, the annual three-round team competition
organized by the NU ACM-W Student Chapter.

It is built from two existing projects:

- **Structure and features** come from `hacknu-2026` — the section composition
  (fixed navbar → hero → when/where/how band → about → … → footer CTA), the
  `react-i18next` setup, the animated hexagon hero backdrop, the `DecryptedText`
  scramble-on-scroll headings, the WebGL cursor trail, and the UI primitives.
- **Design, copy and content** come from `acm@nu/WHD` — the pink-on-black palette
  (`#BB046C`), Montserrat, the illustrations and partner logos, and every string
  in all three languages.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on port 3000 |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Editing content

**All copy lives in `src/i18n/locales/{en,ru,kk}.json`.** The three files share an
identical key structure — add a key to one and add it to all three.

Two inline tags are available inside any string:

```
<pink>emphasised</pink>
<link href="https://...">label</link>
```

They are rendered by `parseTextWithLinks` in `src/lib/text.tsx`, which keeps
emphasis and links in the hands of translators rather than hard-coded in JSX.

**Links, dates and other non-text settings live in `src/lib/event.ts`** —
registration URL, the countdown deadline, the map link, and the social links.

> The countdown targets `REGISTRATION_DEADLINE`, currently WHD 2025's deadline
> of 22 October 2025. Because that date has passed, the hero shows the
> `countdown.ended` message instead of a timer. Point that constant at the next
> edition's deadline to bring the countdown back.

## Sections

| Component | Section | Notes |
| --- | --- | --- |
| `Navbar` | — | Fixed pink bar, anchor links, language switcher, mobile drawer |
| `Hero` | `#top` | Hexagon backdrop, countdown, registration CTA |
| `InfoCards` | `#info` | When / Where / How, in oversized type |
| `About` | `#about` | Three stat cards plus the description and organiser blurb |
| `Timeline` | `#timeline` | Registration → confirmation → event day |
| `Schedule` | `#schedule` | The event-day running order |
| `Benefits` | `#benefits` | Prize pool, packages, certificates, coaching |
| `FAQ` | `#faq` | WHD's ten questions, grouped into four categories |
| `Partners` | `#partners` | General sponsor plus info partners |
| `Footer` | `#registration` | Closing CTA, socials, copyright |

Schedule times and the section ordering are structural and live in the
components; everything a reader sees as words lives in the locale files.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · react-i18next · Motion ·
React Three Fiber (cursor trail only, lazily loaded)

React is pinned to the 19.2 line because `@react-three/fiber` declares a
`>=19 <19.3` peer range.
