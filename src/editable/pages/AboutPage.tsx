import Link from 'next/link'
import { ArrowRight, Bookmark, Compass, Layers, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const valueIcons = [Layers, Bookmark, Compass]

export default function AboutPage() {
  const about = pagesContent.about
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[var(--slot4-dark-bg)] text-white">
          <div className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(154,52,18,0.4),transparent_70%)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-6 sm:py-24 lg:px-8" data-reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80">
              <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {about.badge}
            </span>
            <h1 className="editable-display mt-6 max-w-3xl text-balance text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">{about.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">{about.description}</p>
          </div>
        </section>

        {/* Story + values */}
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <article data-reveal className="rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 shadow-[0_1px_2px_rgba(16,24,32,0.05)] lg:p-12">
              <h2 className="editable-display text-2xl font-bold tracking-[-0.02em] sm:text-3xl">About {SITE_CONFIG.name}</h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-[var(--slot4-muted-text)]">
                {about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <Link href="/sbm" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-6 py-3 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:bg-[var(--slot4-accent-strong)]">
                Browse collections <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
            <aside className="space-y-4">
              {about.values.map((value, index) => {
                const Icon = valueIcons[index % valueIcons.length]
                return (
                  <div key={value.title} data-reveal style={{ '--reveal-delay': `${index * 80}ms` } as React.CSSProperties} className="rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]"><Icon className="h-5 w-5" /></span>
                    <h3 className="editable-display mt-4 text-xl font-bold tracking-[-0.01em]">{value.title}</h3>
                    <p className="mt-2.5 text-sm leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                  </div>
                )
              })}
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
