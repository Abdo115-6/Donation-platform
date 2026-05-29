'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { hasSupabaseEnv } from '@/lib/supabase/config'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import { Menu, X, Heart, LogIn, UserPlus } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Campaigns' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/donations', label: 'Donations' },
  { href: '/dashboard/profile', label: 'Profile' },
  { href: '/dashboard/settings', label: 'Settings' },
]

export default function Navbar() {
  const router = useRouter()
  const supabaseEnabled = hasSupabaseEnv()
  const supabase = supabaseEnabled ? createClient() : null
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(supabaseEnabled)

  // Get user on mount
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [supabase])

  const handleLogout = async () => {
    if (!supabase) return

    await supabase.auth.signOut()
    setUser(null)
    setIsOpen(false)
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 text-foreground shadow-sm shadow-slate-950/5 backdrop-blur-xl dark:shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 ring-1 ring-border/70 shadow-sm shadow-slate-950/5">
              <Heart className="w-5 h-5 fill-primary text-primary" />
            </span>
            <span className="text-xl font-bold tracking-tight">DonationFlow</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            {user ? (
              <>
                <span className="max-w-44 truncate text-sm text-muted-foreground">{user.email}</span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-border/70 bg-card/80 shadow-sm shadow-slate-950/5 hover:bg-accent/80 dark:shadow-black/10"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent hover:text-foreground">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="sm" className="bg-primary text-primary-foreground shadow-sm shadow-red-950/15 hover:bg-primary/90">
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              className="border-border/70 bg-card/80 shadow-sm shadow-slate-950/5 hover:bg-accent/80 dark:shadow-black/10"
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div
          id="mobile-navigation"
          className={cn(
            'md:hidden overflow-hidden border-t border-border/70 transition-[max-height,opacity] duration-300',
            isOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          <div className="space-y-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/80 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 border-t border-border/60 pt-3">
              {user ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-border/60 bg-card/80 px-3 py-2 shadow-sm shadow-slate-950/5 dark:shadow-black/10">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Connected as</p>
                    <p className="mt-1 truncate text-sm font-medium">{user.email}</p>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="w-full border-border/70 bg-card/80 shadow-sm shadow-slate-950/5 hover:bg-accent/80 dark:shadow-black/10"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-foreground hover:bg-accent hover:text-foreground"
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up" onClick={() => setIsOpen(false)}>
                    <Button
                      size="sm"
                      className="w-full justify-start bg-primary text-primary-foreground shadow-sm shadow-red-950/15 hover:bg-primary/90"
                    >
                      <UserPlus className="w-4 h-4" />
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
