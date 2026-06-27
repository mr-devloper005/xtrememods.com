import type { CSSProperties } from 'react'

/*
  ────────────────────────────────────────────────────────────────────────
  PREMIUM DESIGN TOKENS — single source of truth for the whole site.

  Change the palette here and it cascades everywhere (home, archives,
  detail pages, nav, footer, cards). Every visible surface consumes these
  CSS variables, so one edit re-skins the platform.

  Direction: a premium curation/bookmarking aesthetic — crisp light
  surfaces, deep "ink" near-black for dark moments (hero, CTA, footer
  band), a confident teal primary accent, and a warm amber highlight used
  sparingly. Spacious, contained (not edge-to-edge), strong type hierarchy.
  ────────────────────────────────────────────────────────────────────────
*/
export const editableRootStyle = {
  // Core surfaces — warm "gallery paper" light theme (premium, editorial)
  '--slot4-page-bg': '#f3f0e9',
  '--slot4-page-text': '#1c1813',
  '--slot4-panel-bg': '#eae4d8',
  '--slot4-surface-bg': '#fbf9f4',
  '--slot4-muted-text': '#6b6456',
  '--slot4-soft-muted-text': '#9a9385',

  // Accent system (deep terracotta primary + restrained complements)
  '--slot4-accent': '#9a3412',
  '--slot4-accent-fill': '#9a3412',
  '--slot4-accent-strong': '#7c2d12',
  '--slot4-accent-soft': '#f0e2d6',
  '--slot4-on-accent': '#fbf9f4',
  '--slot4-ink': '#1c1813',
  '--slot4-teal': '#1f6f5c',
  '--slot4-teal-soft': '#dde9e3',
  '--slot4-gold': '#b07d2a',
  '--slot4-gold-soft': '#f3e9d4',

  // Deep espresso "ink" bands (mastheads, stats, CTA, footer)
  '--slot4-dark-bg': '#1c1813',
  '--slot4-dark-2': '#2a251d',
  '--slot4-dark-text': '#f3f0e9',

  // Neutrals
  '--slot4-media-bg': '#e6e0d4',
  '--slot4-cream': '#fbf9f4',
  '--slot4-warm': '#efeade',
  '--slot4-lavender': '#fbf9f4',
  '--slot4-gray': '#eae4d8',
  '--slot4-body-gradient': 'none',

  // Editable shell aliases
  '--editable-page-bg': '#f3f0e9',
  '--editable-page-text': '#1c1813',
  '--editable-container': '1200px',
  '--editable-border': '#e2dccd',
  '--editable-nav-bg': '#f3f0e9',
  '--editable-nav-text': '#1c1813',
  '--editable-nav-active': '#9a3412',
  '--editable-nav-active-text': '#fbf9f4',
  '--editable-cta-bg': '#9a3412',
  '--editable-cta-text': '#fbf9f4',
  '--editable-search-bg': '#fbf9f4',
  '--editable-footer-bg': '#1c1813',
  '--editable-footer-text': '#f3f0e9',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_2px_4px_rgba(28,24,19,0.04),0_18px_44px_-28px_rgba(28,24,19,0.30)]',
  shadowStrong: 'shadow-[0_40px_90px_-40px_rgba(28,24,19,0.45)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(28,24,19,0.05),rgba(28,24,19,0.82))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-16 sm:py-20 lg:py-24',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[150px] shrink-0 snap-start sm:w-[170px]',
  },
  type: {
    eyebrow: 'text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]',
    heroTitle: 'editable-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.5rem]',
    sectionTitle: 'editable-display text-3xl font-semibold tracking-[-0.025em] sm:text-4xl',
    body: 'text-base leading-relaxed',
  },
  surface: {
    card: `rounded-2xl border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-2xl border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-2xl ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-semibold tracking-[0.01em] text-[var(--slot4-on-accent)] transition duration-300 hover:bg-[var(--slot4-accent-strong)] active:scale-[0.98]`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-6 py-3 text-sm font-semibold tracking-[0.01em] text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] active:scale-[0.98]`,
    accent: `inline-flex items-center justify-center gap-2 rounded-full ${editablePalette.accentBg} px-6 py-3 text-sm font-semibold text-[var(--slot4-on-accent)] transition duration-300 hover:bg-[var(--slot4-accent-strong)] active:scale-[0.98]`,
  },
  media: {
    frame: `relative overflow-hidden rounded-2xl ${editablePalette.mediaBg}`,
    ratio: 'aspect-[2/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(16,24,32,0.30)]',
    fade: 'transition duration-300 hover:opacity-80',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; all sections consume those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so the whole home experience can be redesigned in one file.',
  'Use wide readable grids; never create skinny columns for paragraphs or cards.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
  'Center the public experience on bookmarks/collections/resources; never surface profile listings.',
] as const
