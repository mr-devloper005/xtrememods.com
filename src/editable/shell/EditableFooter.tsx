'use client'

import Link from 'next/link'
import { ArrowUpRight, Mail, Send } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

// Curated link columns from editable content — no profile links and no raw
// task-archive links. Everything points at the essential public surface.
const COLUMNS = globalContent.footer.columns

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="relative overflow-hidden bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[80%] -translate-x-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(154,52,18,0.22),transparent_70%)]" />

      <div className="relative mx-auto w-full max-w-[var(--editable-container)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--slot4-accent)] text-[var(--slot4-on-accent)]">
               <img src="/favicon.ico" alt="Logo" className="h-10 w-10" />
              </span>
              <span className="editable-display text-xl font-bold tracking-[-0.01em]">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">{globalContent.footer?.description || SITE_CONFIG.description}</p>
            <p className="mt-5 text-sm font-semibold text-white/80">{globalContent.footer?.tagline}</p>
          </div>

          {/* Curated link columns */}
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{column.title}</h3>
              <div className="mt-5 grid gap-2.5">
                {column.links.map((link) => (
                  <Link key={link.href} href={link.href} className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/65 transition hover:text-white">
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                ))}
                {session ? (
                  <button type="button" onClick={logout} className="text-left text-sm font-medium text-white/65 transition hover:text-white">Logout</button>
                ) : (
                  column.title === 'Site' ? (
                    <>
                      <Link href="/login" className="text-sm font-medium text-white/65 transition hover:text-white">Sign in</Link>
                      <Link href="/signup" className="text-sm font-medium text-white/65 transition hover:text-white">Sign up</Link>
                    </>
                  ) : null
                )}
              </div>
            </div>
          ))}

          {/* Newsletter / submit CTA */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="editable-display text-lg font-bold tracking-[-0.01em]">Add to the library</h3>
            <p className="mt-2 text-sm leading-6 text-white/55">Found a link worth keeping? Send it our way and help the collection grow.</p>
            <form action="/contact" className="mt-5">
              <label className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 transition focus-within:border-[var(--slot4-accent)]">
                <Mail className="h-4 w-4 shrink-0 text-white/50" />
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                />
              </label>
              <button
                type="submit"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:bg-[var(--slot4-accent-strong)]"
              >
                <Send className="h-4 w-4" /> Suggest a resource
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs font-medium tracking-[0.04em] text-white/45">© {year} {SITE_CONFIG.name}. All rights reserved.</p>
          <p className="text-xs font-medium tracking-[0.04em] text-white/45">{globalContent.footer?.bottomNote}</p>
        </div>
      </div>
    </footer>
  )
}
