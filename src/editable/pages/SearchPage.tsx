import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { Ads } from '@/lib/ads'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
// Strip HTML tags + decode common entities so card summaries render as clean
// plain text (post.summary/description can contain stored HTML markup).
const cleanText = (value: string) => stripHtml(value)
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/\s+/g, ' ')
  .trim()
const summaryOf = (post: SitePost) => cleanText(post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || '')

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  // Route from the task config (e.g. /sbm/<slug>); buildPostUrl can fall back
  // to /posts for tasks missing from the enabled taskViews map, which 404s.
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'sbm'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Resource'
  const strong = index % 5 === 0

  return (
    <Link
      href={href}
      data-reveal
      style={{ '--reveal-delay': `${(index % 3) * 60}ms` } as React.CSSProperties}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] shadow-[0_1px_2px_rgba(16,24,32,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[var(--slot4-accent)]/40 hover:shadow-[0_24px_50px_-24px_rgba(16,24,32,0.3)] ${strong ? 'md:col-span-2' : ''}`}
    >
      {/* Media area is always rendered (with a branded fallback) so the card's
          structure is invariant and can't diverge during hydration. */}
      <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${strong ? 'aspect-[16/7]' : 'aspect-[16/9]'}`}>
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_30%_20%,var(--slot4-accent-soft),transparent_70%)]" />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-[var(--slot4-surface-bg)]/95 px-3 py-1 text-[11px] font-semibold text-[var(--slot4-page-text)] shadow-sm">{taskLabel}</span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h2 className="mt-1 line-clamp-2 text-xl font-bold leading-snug tracking-[-0.01em] text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
        {summary ? <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--slot4-muted-text)]">{summary}</p> : null}
        <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--slot4-accent)]">Open result <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  // Profiles stay out of the public UI — never surface them as search results
  // or as a selectable content type. The master feed can return the same post
  // more than once; dedupe so React keys stay unique (duplicate keys cause
  // hydration mismatches).
  const limit = normalized ? 80 : 36
  const seenKeys = new Set<string>()
  const results: SitePost[] = []
  for (const post of posts) {
    if (getPostTaskKey(post) === 'profile') continue
    if (!matches(post, normalized, category, task)) continue
    const dedupeKey = post.id || post.slug || ''
    if (dedupeKey && seenKeys.has(dedupeKey)) continue
    if (dedupeKey) seenKeys.add(dedupeKey)
    results.push(post)
    if (results.length >= limit) break
  }
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled && item.key !== 'profile')

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Search hero */}
        <section className="relative overflow-hidden bg-[var(--slot4-dark-bg)] text-white">
          <div className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(154,52,18,0.4),transparent_70%)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{pagesContent.search.hero.badge}</p>
            <h1 className="editable-display mt-4 max-w-2xl text-balance text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{pagesContent.search.hero.title}</h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/70">{pagesContent.search.hero.description}</p>

            <form action="/search" className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-3.5">
                <Search className="h-5 w-5 text-white/55" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-medium text-white outline-none placeholder:text-white/40" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <label className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-3">
                  <Filter className="h-4 w-4 text-white/55" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/40" />
                </label>
                <select name="task" defaultValue={task} className="rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white outline-none">
                  <option className="text-[var(--slot4-page-text)]" value="">All content types</option>
                  {enabledTasks.map((item) => <option className="text-[var(--slot4-page-text)]" key={item.key} value={item.key}>{item.label}</option>)}
                </select>
                <button className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--slot4-accent)] px-7 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:bg-[var(--slot4-accent-strong)]" type="submit">Search</button>
              </div>
            </form>
          </div>
        </section>

              <div className="mt-10">
        <Ads slot="article-bottom" showLabel className="mx-auto w-full" />
      </div>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4" data-reveal>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{results.length} results</p>
              <h2 className="editable-display mt-2 text-2xl font-bold tracking-[-0.02em] sm:text-3xl">{query ? `Results for “${query}”` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/sbm" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">Browse collections <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={`${post.id || post.slug || 'r'}-${index}`} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-12 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--slot4-muted-text)]" />
              <p className="editable-display mt-4 text-2xl font-bold tracking-[-0.02em]">No matching resources found.</p>
              <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">Try a different keyword, content type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
