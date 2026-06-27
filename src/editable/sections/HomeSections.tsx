import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Bookmark, Compass, ExternalLink, Globe, Search, Tag } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

/* ------------------------------- helpers -------------------------------- */
function getContent(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
}
function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = getContent(post)
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary || ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}
function categoryOf(post?: SitePost | null) {
  const content = getContent(post)
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}
function getUrl(post?: SitePost | null) {
  const content = getContent(post)
  for (const key of ['website', 'url', 'link', 'source']) {
    const value = content[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}
function cleanDomain(url: string) {
  return url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/.*$/, '')
}
function faviconFor(url: string) {
  const domain = cleanDomain(url)
  return domain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64` : ''
}
function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}
const FALLBACK_DOMAINS = ['github.com', 'figma.com', 'medium.com', 'notion.so', 'dribbble.com', 'stripe.com', 'vercel.com', 'arxiv.org']
function sourceDomains(posts: SitePost[], max = 10) {
  const seen = new Set<string>()
  for (const post of posts) {
    const url = getUrl(post)
    if (!url) continue
    const d = cleanDomain(url)
    if (d) seen.add(d)
    if (seen.size >= max) break
  }
  return (seen.size ? [...seen] : FALLBACK_DOMAINS).slice(0, max)
}
const FALLBACK_TOPICS = ['Technology', 'Business', 'Design', 'Finance', 'Education', 'Marketing', 'Science', 'Productivity']
function topTopics(posts: SitePost[], max = 10) {
  const counts = new Map<string, number>()
  for (const post of posts) {
    const c = categoryOf(post)
    if (!c) continue
    counts.set(c.trim(), (counts.get(c.trim()) || 0) + 1)
  }
  const derived = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }))
  return (derived.length ? derived : FALLBACK_TOPICS.map((name) => ({ name, count: 0 }))).slice(0, max)
}
function topicHref(route: string, name: string) {
  return `${route}?category=${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`
}

/* ------------------------------ shared bits ----------------------------- */
function Eyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.3em] ${onDark ? 'text-[var(--slot4-dark-text)]/55' : 'text-[var(--slot4-muted-text)]'}`}>
      <span className="h-[6px] w-[6px] rounded-full bg-[var(--slot4-accent)]" />
      {children}
    </span>
  )
}

function DomainTag({ url, category }: { url: string; category?: string }) {
  const domain = url ? cleanDomain(url) : ''
  const favicon = url ? faviconFor(url) : ''
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
        {favicon ? <img src={favicon} alt="" className="h-4 w-4" loading="lazy" /> : <Globe className="h-3.5 w-3.5" />}
      </span>
      <span className="min-w-0 truncate text-xs font-medium text-[var(--slot4-muted-text)]">{domain || category || 'Saved resource'}</span>
    </div>
  )
}

// Standard cream resource card (used in time-window grids).
function BookmarkCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const url = getUrl(post)
  const category = categoryOf(post)
  const image = getEditablePostImage(post)
  const hasImage = image && !image.includes('placeholder')

  return (
    <Link
      href={href}
      data-reveal
      style={{ '--reveal-delay': `${(index % 4) * 70}ms` } as React.CSSProperties}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-30px_rgba(28,24,19,0.4)]"
    >
      {hasImage ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]" loading="lazy" />
          {category ? <span className="absolute left-4 top-4 rounded-full bg-[var(--slot4-surface-bg)]/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--slot4-page-text)]">{category}</span> : null}
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <DomainTag url={url} category={category} />
        <h3 className="mt-3.5 line-clamp-2 text-lg font-bold leading-snug text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{getExcerpt(post, 110)}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--slot4-accent)]">
          Open resource <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}

/* ----------------------- 1 · Editorial masthead hero -------------------- */
export function EditableHomeHero({ primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const heroTitle = pagesContent.home.hero.title?.join(' ') || `Curated bookmarks on ${SITE_CONFIG.name}`
  const topics = topTopics(pool, 6)
  const domains = sourceDomains(pool, 8)
  const cta = pagesContent.home.hero

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_0%,rgba(154,52,18,0.45),transparent_70%)]" />
      <div className={`relative flex flex-col items-center py-20 text-center sm:py-28 ${container}`}>
        <div data-reveal className="flex flex-col items-center">
          <Eyebrow onDark>The curated web · Updated daily</Eyebrow>
          <h1 className="editable-display mt-7 max-w-4xl text-balance text-[2.9rem] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[5rem]">
            {heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--slot4-dark-text)]/70">{cta.description}</p>

          {/* Search pill */}
          <form action="/search" className="mt-9 flex w-full max-w-xl items-center gap-2 rounded-full bg-[var(--slot4-surface-bg)] p-2 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
            <Search className="ml-3 h-5 w-5 shrink-0 text-[var(--slot4-muted-text)]" />
            <input
              name="q"
              placeholder={cta.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
            />
            <button className="shrink-0 rounded-full bg-[var(--slot4-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:bg-[var(--slot4-accent-strong)]">Search</button>
          </form>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            {topics.map((topic) => (
              <Link key={topic.name} href={topicHref(primaryRoute, topic.name)} className="rounded-full border border-[var(--slot4-dark-text)]/15 px-4 py-1.5 text-sm font-medium text-[var(--slot4-dark-text)]/80 transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-dark-text)]">
                {topic.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Source row */}
        <div data-reveal className="mt-14 w-full border-t border-[var(--slot4-dark-text)]/10 pt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-dark-text)]/40">Saved from the best sources on the web</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {domains.map((domain) => (
              <span key={domain} className="inline-flex items-center gap-2 text-[var(--slot4-dark-text)]/55">
                <img src={faviconFor(domain)} alt="" className="h-5 w-5 opacity-80" loading="lazy" />
                <span className="text-sm font-medium">{domain}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------- 2 · Bento featured collection --------------------- */
function BentoLarge({ post, href }: { post: SitePost; href: string }) {
  const url = getUrl(post)
  const domain = url ? cleanDomain(url) : ''
  const favicon = url ? faviconFor(url) : ''
  const image = getEditablePostImage(post)
  const hasImage = image && !image.includes('placeholder')
  return (
    <Link href={href} data-reveal className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-dark-bg)] p-8 text-[var(--slot4-dark-text)] sm:col-span-2 sm:p-9 lg:col-span-2 lg:row-span-2">
      {hasImage ? (
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-500 group-hover:scale-105 group-hover:opacity-75" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_20%_0%,rgba(154,52,18,0.5),transparent_60%)]" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,24,19,0.2),rgba(28,24,19,0.94))]" />
      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
          {favicon ? <img src={favicon} alt="" className="h-4 w-4 rounded" /> : <Bookmark className="h-3.5 w-3.5 text-[var(--slot4-accent)]" />}
          {domain || categoryOf(post) || 'Featured'}
        </span>
        <h3 className="editable-display mt-5 max-w-xl text-3xl font-semibold leading-[1.08] tracking-[-0.01em] sm:text-4xl">{post.title}</h3>
        <p className="mt-3 max-w-lg text-sm leading-7 text-[var(--slot4-dark-text)]/75">{getExcerpt(post, 150)}</p>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-surface-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--slot4-ink)]">
          Open resource <ExternalLink className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

function BentoSmall({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const url = getUrl(post)
  const category = categoryOf(post)
  return (
    <Link
      href={href}
      data-reveal
      style={{ '--reveal-delay': `${(index % 4) * 60}ms` } as React.CSSProperties}
      className="group flex flex-col justify-between rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-30px_rgba(28,24,19,0.4)]"
    >
      <div>
        <DomainTag url={url} category={category} />
        <h3 className="mt-3.5 line-clamp-3 text-base font-bold leading-snug text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
      </div>
      <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--slot4-accent)]">
        Open <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const all = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  if (!all.length) return null
  const [featured, ...rest] = all
  const small = rest.slice(0, 4)

  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`py-20 sm:py-24 ${container}`}>
        <div className="flex items-end justify-between gap-4" data-reveal>
          <div>
            <Eyebrow>Editor&apos;s selection</Eyebrow>
            <h2 className="editable-display mt-5 text-4xl font-semibold tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-5xl">Featured this week</h2>
          </div>
          <Link href={primaryRoute} className="hidden items-center gap-1.5 text-sm font-semibold text-[var(--slot4-accent)] hover:underline sm:inline-flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          <BentoLarge post={featured} href={postHref(primaryTask, featured, primaryRoute)} />
          {small.map((post, index) => (
            <BentoSmall key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------- 3 · Topic ribbon ----------------------------- */
export function EditableStoryRail({ primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const topics = topTopics(pool, 12)
  if (!topics.length) return null
  const sizeFor = (i: number) => (i < 2 ? 'text-2xl sm:text-3xl' : i < 5 ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl')

  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-warm)]">
      <div className={`py-20 sm:py-24 ${container}`}>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div data-reveal>
            <Eyebrow>Explore by topic</Eyebrow>
            <h2 className="editable-display mt-5 text-4xl font-semibold tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-5xl">A shelf for every subject.</h2>
            <p className="mt-4 max-w-md text-base leading-7 text-[var(--slot4-muted-text)]">Follow a topic to surface the resources, tools and references worth keeping.</p>
            <Link href={primaryRoute} className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-6 py-3 text-sm font-semibold text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
              Browse all collections <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div data-reveal className="flex flex-wrap gap-x-6 gap-y-3 lg:justify-end">
            {topics.map((topic, index) => (
              <Link
                key={topic.name}
                href={topicHref(primaryRoute, topic.name)}
                className={`editable-display inline-flex items-baseline gap-1.5 font-semibold tracking-[-0.01em] text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)] ${sizeFor(index)}`}
              >
                {topic.name}
                {topic.count > 0 ? <span className="text-xs font-medium text-[var(--slot4-soft-muted-text)]">{topic.count}</span> : null}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------ 4 · Latest saves (index list + grid) ---------------- */
function IndexRow({ post, href, n }: { post: SitePost; href: string; n: number }) {
  const url = getUrl(post)
  const domain = url ? cleanDomain(url) : ''
  const favicon = url ? faviconFor(url) : ''
  const category = categoryOf(post)
  return (
    <Link
      href={href}
      data-reveal
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-[var(--editable-border)] py-6 transition hover:bg-[var(--slot4-surface-bg)]/60"
    >
      <span className="editable-display w-12 text-2xl font-semibold tracking-[-0.02em] text-[var(--slot4-soft-muted-text)] transition group-hover:text-[var(--slot4-accent)] sm:w-16 sm:text-3xl">{String(n).padStart(2, '0')}</span>
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
            {favicon ? <img src={favicon} alt="" className="h-3.5 w-3.5" loading="lazy" /> : <Globe className="h-3 w-3" />}
          </span>
          <span className="truncate text-xs font-medium uppercase tracking-[0.1em] text-[var(--slot4-muted-text)]">{domain || category || 'Resource'}</span>
        </div>
        <h3 className="editable-display mt-2 line-clamp-2 text-xl font-semibold tracking-[-0.01em] text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)] sm:text-2xl">{post.title}</h3>
      </div>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-muted-text)] transition group-hover:border-[var(--slot4-accent)] group-hover:bg-[var(--slot4-accent)] group-hover:text-[var(--slot4-on-accent)]">
        <ArrowUpRight className="h-5 w-5" />
      </span>
    </Link>
  )
}

const windowCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'Fresh this week', title: 'The latest saves' },
  browse: { eyebrow: 'Trending', title: 'Popular this month' },
  index: { eyebrow: 'Evergreen', title: 'From the archive' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, sIndex) => {
        const copy = windowCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore' }
        const asList = sIndex === 0
        return (
          <section key={section.key} className={`border-b border-[var(--editable-border)] ${sIndex % 2 === 0 ? 'bg-[var(--slot4-page-bg)]' : 'bg-[var(--slot4-warm)]'}`}>
            <div className={`py-20 sm:py-24 ${container}`}>
              <div className="flex items-end justify-between gap-4" data-reveal>
                <div>
                  <Eyebrow>{copy.eyebrow}</Eyebrow>
                  <h2 className="editable-display mt-5 text-3xl font-semibold tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-5xl">{copy.title}</h2>
                </div>
                <Link href={section.href || primaryRoute} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[var(--slot4-accent)] hover:underline">
                  See all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {asList ? (
                <div className="mt-8 border-t border-[var(--editable-border)]">
                  {section.posts.slice(0, 6).map((post, index) => (
                    <IndexRow key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} n={index + 1} />
                  ))}
                </div>
              ) : (
                <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {section.posts.slice(0, 8).map((post, index) => (
                    <BookmarkCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )
      })}
    </>
  )
}

/* ---------------------- 5 · Why / value trio ---------------------------- */
const VALUES = [
  { icon: Bookmark, title: 'Curation, not clutter', body: 'Every resource is saved with intent, so the signal stays high and the noise stays out.' },
  { icon: Tag, title: 'Context that lasts', body: 'Source, topic and a short note travel with each save — it still makes sense months later.' },
  { icon: Compass, title: 'Built for discovery', body: 'Topics, collections and search connect resources so one good link leads to the next.' },
]

export function EditableFeatureGrid() {
  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
      <div className={`py-20 sm:py-24 ${container}`}>
        <div className="max-w-2xl" data-reveal>
          <Eyebrow>Why {SITE_CONFIG.name}</Eyebrow>
          <h2 className="editable-display mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-5xl">A calmer way to keep the web&apos;s best.</h2>
        </div>
        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-3">
          {VALUES.map((value, index) => (
            <div key={value.title} data-reveal style={{ '--reveal-delay': `${index * 80}ms` } as React.CSSProperties} className="border-t border-[var(--slot4-page-text)]/15 pt-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]"><value.icon className="h-5 w-5" /></span>
              <h3 className="mt-6 text-xl font-bold text-[var(--slot4-page-text)]">{value.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{value.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------- 6 · Process -------------------------------- */
const STEPS = [
  { n: '01', title: 'Discover', body: 'Find a link, tool or reference worth keeping.' },
  { n: '02', title: 'Save', body: 'Add it to the library in a single click.' },
  { n: '03', title: 'Organize', body: 'Sort into collections with tags and notes.' },
  { n: '04', title: 'Rediscover', body: 'Search or browse to find it the moment you need it.' },
]

export function EditableProcess() {
  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-warm)]">
      <div className={`py-20 sm:py-24 ${container}`}>
        <div className="max-w-2xl" data-reveal>
          <Eyebrow>How it works</Eyebrow>
          <h2 className="editable-display mt-5 text-3xl font-semibold tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-5xl">From a link to a library, in four steps.</h2>
        </div>
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div key={step.n} data-reveal style={{ '--reveal-delay': `${index * 70}ms` } as React.CSSProperties} className="border-t-2 border-[var(--slot4-accent)] pt-5">
              <span className="editable-display text-3xl font-semibold tracking-[-0.03em] text-[var(--slot4-accent)]">{step.n}</span>
              <h3 className="mt-4 text-lg font-bold text-[var(--slot4-page-text)]">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------- 7 · Stats band ----------------------------- */
export function EditableStatsBand({ posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const resourceCount = pool.length
  const topicCount = new Set(pool.map((post) => categoryOf(post)).filter(Boolean)).size

  const stats = [
    { value: resourceCount > 0 ? `${resourceCount}+` : '100+', label: 'Saved resources' },
    { value: topicCount > 0 ? `${topicCount}` : '20+', label: 'Topics & collections' },
    { value: 'Daily', label: 'Fresh additions' },
    { value: 'Free', label: 'To browse & discover' },
  ]

  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className={`py-16 sm:py-20 ${container}`}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4" data-reveal>
          {stats.map((stat) => (
            <div key={stat.label} className="border-l-2 border-[var(--slot4-accent)] pl-5">
              <span className="editable-display block text-5xl font-semibold tracking-[-0.03em] text-[var(--slot4-page-text)] sm:text-6xl">{stat.value}</span>
              <span className="mt-2 block text-xs font-medium uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------- 8 · CTA band ------------------------------- */
export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section id="get-app" className="scroll-mt-24 bg-[var(--slot4-page-bg)]">
      <div className={`pb-20 pt-4 sm:pb-24 ${container}`}>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[var(--slot4-dark-bg)] px-6 py-16 text-center text-[var(--slot4-dark-text)] sm:px-10 sm:py-20" data-reveal>
          <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(154,52,18,0.4),transparent_70%)]" />
          <div className="relative flex flex-col items-center gap-6">
            <Eyebrow onDark>{cta.badge}</Eyebrow>
            <h2 className="editable-display max-w-3xl text-3xl font-semibold tracking-[-0.02em] sm:text-6xl">{cta.title}</h2>
            <p className="max-w-xl text-base text-[var(--slot4-dark-text)]/70 sm:text-lg">{cta.description}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={cta.primaryCta.href} className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:bg-[var(--slot4-accent-strong)]">
                {cta.primaryCta.label} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={cta.secondaryCta.href} className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-dark-text)]/25 px-7 py-3.5 text-sm font-semibold text-[var(--slot4-dark-text)] transition hover:bg-white/10">
                {cta.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
