import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Yelp-style task surfaces.

  Every task (archive + detail) now shares one cohesive premium identity:
  clean white surfaces, the signature Yelp red accent, hairline gray borders
  and a single crisp sans-serif — exactly like Yelp. Per-task copy (kicker /
  note) still varies so each section keeps a little voice, but the visual
  language is unified. Tokens are delivered via CSS variables (`--tk-*`).
*/

export type TaskTheme = {
  /** short flavour word shown as an eyebrow kicker */
  kicker: string
  /** one-line mood note for the page intro */
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const BODY_FONT = "'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
const DISPLAY_FONT = "'Fraunces', 'Plus Jakarta Sans', Georgia, 'Times New Roman', serif"

// Shared premium palette — every task inherits this; only kicker/note differ.
// Mirrors editableRootStyle (design-contract.ts) so archives + detail pages
// stay perfectly in sync with the rest of the site.
const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#f3f0e9',
  surface: '#fbf9f4',
  raised: '#efeade',
  text: '#1c1813',
  muted: '#6b6456',
  line: '#e2dccd',
  accent: '#9a3412',
  accentSoft: '#f0e2d6',
  onAccent: '#fbf9f4',
  glow: 'rgba(154,52,18,0.08)',
  radius: '1.1rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Articles', note: 'In-depth reads, guides and stories worth your time.' },
  listing: { ...base, kicker: 'Businesses', note: 'Find, compare and connect with local businesses.' },
  classified: { ...base, kicker: 'Marketplace', note: 'Fresh offers and listings, ready to act on.' },
  image: { ...base, kicker: 'Photos', note: 'A visual feed of standout images and galleries.' },
  sbm: { ...base, kicker: 'Collections', note: 'A curated library of links, tools and resources worth saving.' },
  pdf: { ...base, kicker: 'Documents', note: 'Downloadable guides, reports and references.' },
  profile: { ...base, kicker: 'Curator', note: 'A curator and the collections they keep.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    // Re-point the shared article-body accent vars so post HTML (headings,
    // links) inherits this task's accent instead of the global site accent.
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
