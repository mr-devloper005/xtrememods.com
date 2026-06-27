'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, UserPlus, LogIn, X, PlusCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

// Essential public navigation only — sourced from editable content. No profile
// items and no raw task-archive links; discovery stays focused on collections.
const NAV_ITEMS = globalContent.nav.primaryLinks

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  // Sticky-shrink: condense padding + add elevation once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  const firstName = session?.name?.split(' ')[0] || session?.name

  return (
    <header
      className={`sticky top-0 z-50 border-b text-[var(--editable-nav-text)] backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? 'border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/90 shadow-[0_8px_30px_-18px_rgba(16,24,32,0.45)]'
          : 'border-transparent bg-[var(--editable-nav-bg)]/80'
      }`}
    >
      <nav
        className={`mx-auto flex w-full max-w-[var(--editable-container)] items-center gap-4 px-4 transition-[min-height] duration-300 sm:px-6 lg:px-8 ${
          scrolled ? 'min-h-[60px]' : 'min-h-[76px]'
        }`}
      >
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--slot4-accent)] text-[var(--slot4-on-accent)] shadow-[0_8px_20px_-8px_rgba(154,52,18,0.8)] transition group-hover:scale-105">
            <img src="/favicon.ico" alt="Logo" className="h-10 w-10" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="editable-display block max-w-[220px] truncate text-lg font-bold leading-none tracking-[-0.01em]">{SITE_CONFIG.name}</span>
            <span className="mt-1 block max-w-[220px] truncate text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </span>
          </span>
        </Link>

        <div className="ml-2 hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                data-active={active}
                className={`editable-navlink rounded-md px-3 py-2 text-[13px] font-semibold tracking-[0.01em] transition ${
                  active ? 'text-[var(--slot4-accent)]' : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <form action="/search" className="mx-auto hidden min-w-0 max-w-sm flex-1 md:flex">
          <label className="flex w-full items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-4 py-2 transition focus-within:border-[var(--slot4-accent)] focus-within:bg-[var(--slot4-surface-bg)]">
            <Search className="h-4 w-4 shrink-0 text-[var(--slot4-muted-text)]" />
            <input
              name="q"
              type="search"
              placeholder="Search resources"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--slot4-muted-text)]"
            />
          </label>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-1.5 rounded-full bg-[var(--editable-cta-bg)] px-4 py-2 text-[12px] font-semibold text-[var(--editable-cta-text)] transition hover:bg-[var(--slot4-accent-strong)] sm:inline-flex"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Save
              </Link>
              <span className="hidden max-w-[120px] truncate text-[13px] font-semibold text-[var(--slot4-page-text)] sm:inline">{firstName}</span>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center rounded-full border border-[var(--editable-border)] px-3 py-2 text-[12px] font-semibold text-[var(--slot4-muted-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-full border border-[var(--editable-border)] px-4 py-2 text-[12px] font-semibold text-[var(--slot4-muted-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
              >
                <LogIn className="h-3.5 w-3.5" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-1.5 rounded-full bg-[var(--editable-cta-bg)] px-4 py-2 text-[12px] font-semibold text-[var(--editable-cta-text)] transition hover:bg-[var(--slot4-accent-strong)] sm:inline-flex"
              >
                <UserPlus className="h-3.5 w-3.5" /> Sign up
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-lg border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-2 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-4 py-5 lg:hidden">
          <form action="/search" className="mb-5 flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-4 py-2.5">
            <Search className="h-4 w-4 text-[var(--slot4-muted-text)]" />
            <input name="q" type="search" placeholder="Search resources" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-muted-text)]" />
          </form>
          <div className="grid gap-1">
            {[
              ...NAV_ITEMS,
              ...(session ? [{ label: 'Save a resource', href: '/create' }] : [{ label: 'Sign in', href: '/login' }, { label: 'Sign up', href: '/signup' }]),
            ].map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg border-l-2 px-4 py-3 text-sm font-semibold tracking-[0.01em] ${
                    active
                      ? 'border-[var(--slot4-accent)] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'
                      : 'border-transparent text-[var(--slot4-muted-text)] hover:border-[var(--slot4-accent)]/40 hover:bg-[var(--slot4-panel-bg)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? (
              <button
                type="button"
                onClick={() => { logout(); setOpen(false) }}
                className="rounded-lg border-l-2 border-transparent px-4 py-3 text-left text-sm font-semibold text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-panel-bg)]"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
