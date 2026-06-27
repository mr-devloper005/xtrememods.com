import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-panel-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div data-reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{pagesContent.auth.login.badge}</span>
            <h1 className="editable-display mt-5 max-w-xl text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{pagesContent.auth.login.title}</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[var(--slot4-muted-text)]">{pagesContent.auth.login.description}</p>
          </div>
          <div data-reveal className="rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 shadow-[0_24px_60px_-36px_rgba(16,24,32,0.4)] sm:p-9">
            <h2 className="editable-display text-2xl font-bold tracking-[-0.01em]">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">New here? <Link href="/signup" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link></p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
