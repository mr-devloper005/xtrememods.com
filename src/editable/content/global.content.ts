import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Curated bookmarks & collections',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Curated bookmarks & collections',
    // Essential public pages only — no profile items, no raw task-archive links.
    primaryLinks: [
      { label: 'Home', href: '/' },
      { label: 'Collections', href: '/sbm' },
      { label: 'Search', href: '/search' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Browse collections', href: '/sbm' },
      secondary: { label: 'Submit a link', href: '/contact' },
    },
  },
  footer: {
    tagline: 'Save it once. Find it forever.',
    description:
      'A curated home for the links, tools and resources worth keeping — organized into clean collections so the good stuff is always one click away.',
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'All collections', href: '/sbm' },
          { label: 'Search resources', href: '/search' },
          { label: 'Submit a link', href: '/contact' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Built for clean discovery and effortless curation.',
  },
  commonLabels: {
    readMore: 'Open resource',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest saves',
    related: 'Related',
    published: 'Saved',
  },
} as const
