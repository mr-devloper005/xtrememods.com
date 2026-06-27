import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Curated bookmarks, collections & resources',
      description:
        'Discover hand-picked links, tools and references organized into clean collections. Save what matters and find it again in seconds.',
      openGraphTitle: 'Curated bookmarks, collections & resources',
      openGraphDescription:
        'A curated home for the links, tools and resources worth keeping — organized into collections for effortless discovery.',
      keywords: ['social bookmarking', 'curated collections', 'saved links', 'resource library', 'bookmark manager', 'content discovery'],
    },
    hero: {
      badge: 'Curated collections, updated daily',
      title: ['Every link worth keeping,', 'curated in one place.'],
      description:
        'Browse hand-picked bookmarks, tools and references — neatly organized into collections so the resources you need are always a click away.',
      primaryCta: { label: 'Browse collections', href: '/sbm' },
      secondaryCta: { label: 'Search resources', href: '/search' },
      searchPlaceholder: 'Search bookmarks, tools, topics…',
      focusLabel: 'Focus',
      featureCardBadge: 'fresh saves',
      featureCardTitle: 'The latest saves shape what surfaces on the homepage.',
      featureCardDescription: 'Recently curated resources stay front and center, so discovery always feels current.',
    },
    intro: {
      badge: 'About the library',
      title: 'A calmer way to save, organize and rediscover the web.',
      paragraphs: [
        'Instead of scattering links across tabs, notes and chats, this platform keeps the good stuff in clean, browsable collections.',
        'Every saved resource carries just enough context — a source, a category, a short note — so you remember why it mattered.',
        'Start from a topic, a collection, or a single search, and keep discovering related resources without friction.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Collections that group related links, tools and references together.',
        'Clean cards with source, category and a short curator note.',
        'Fast search across every saved resource on the platform.',
        'A discovery rhythm built for browsing, not just bookmarking.',
      ],
      primaryLink: { label: 'Browse collections', href: '/sbm' },
      secondaryLink: { label: 'Search resources', href: '/search' },
    },
    cta: {
      badge: 'Start curating',
      title: 'Found something worth keeping? Add it to the collection.',
      description: 'Suggest a link, tool or reference and help grow a library the whole community can browse.',
      primaryCta: { label: 'Submit a link', href: '/contact' },
      secondaryCta: { label: 'Browse collections', href: '/sbm' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest saves in this collection.',
    },
  },
  about: {
    badge: 'Our Story',
    title: 'A calmer, clearer way to curate the web.',
    description: `${slot4BrandConfig.siteName} is a social bookmarking platform built to make saving, organizing and rediscovering great resources feel effortless.`,
    paragraphs: [
      'Instead of letting useful links disappear into bookmarks folders and open tabs, we keep them in clean, browsable collections anyone can explore.',
      'Whether you arrive for a single tool or stay to browse an entire topic, the goal is the same: help you find what matters and keep discovering more.',
    ],
    values: [
      {
        title: 'Curation over clutter',
        description: 'Every collection is organized with intent, so the signal stays high and the noise stays out.',
      },
      {
        title: 'Context that lasts',
        description: 'Source, category and a short note travel with each save — so a resource still makes sense months later.',
      },
      {
        title: 'Built for discovery',
        description: 'Topics, collections and search connect resources together so one good link leads to the next.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Suggest a resource, or tell us how to make the library better.',
    description:
      'Have a link, tool or collection worth adding? Spotted something to fix? Tell us what you need and we will route it to the right place.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search bookmarks, collections, tools and resources across the library.',
    },
    hero: {
      badge: 'Search the library',
      title: 'Find the right resource, faster.',
      description: 'Search across every saved link by keyword, topic or category and jump straight to what you need.',
      placeholder: 'Search by keyword, topic, tool or title',
    },
    resultsTitle: 'Latest saved resources',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Save and submit new resources to the library.',
    },
    locked: {
      badge: 'Curator access',
      title: 'Sign in to save resources.',
      description: 'Use your account to open the curation workspace and add new links, tools and collections to the library.',
    },
    hero: {
      badge: 'Curation workspace',
      title: 'Add a resource to the collection.',
      description: 'Pick a collection, paste the link, add a short note and a few tags — and keep the library growing.',
    },
    formTitle: 'Resource details',
    submitLabel: 'Save resource',
    successTitle: 'Resource saved successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login to your curation account.',
      badge: 'Member access',
      title: 'Welcome back to your library.',
      description: 'Sign in to keep browsing, manage your saves and add new resources from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create your curation account.',
      badge: 'Curator access',
      title: 'Create your account and start curating.',
      description: 'Create an account to save resources, build collections and contribute to the library.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related resources',
      fallbackTitle: 'Resource details',
    },
    listing: {
      relatedTitle: 'Related resources',
      fallbackTitle: 'Resource details',
    },
    image: {
      relatedTitle: 'Related resources',
      fallbackTitle: 'Resource details',
    },
    profile: {
      relatedTitle: 'More from this curator',
      fallbackDescription: 'Curator details will appear here once available.',
      visitButton: 'Visit website',
    },
  },
} as const
