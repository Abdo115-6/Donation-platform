'use client'

import { MoonStar, SunMedium } from 'lucide-react'

import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ThemeToggleProps = {
  className?: string
  compact?: boolean
}

export function ThemeToggle({ className, compact = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'border-border/70 bg-card/80 text-foreground shadow-sm shadow-slate-950/5 transition-all hover:-translate-y-0.5 hover:border-border/80 hover:bg-accent/80 dark:shadow-black/10 dark:hover:border-red-500/30',
        compact ? 'w-full justify-start px-3' : 'px-3',
        className,
      )}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {isDark ? <SunMedium className="size-4" /> : <MoonStar className="size-4" />}
      <span className={cn('font-medium', compact ? 'text-sm' : 'hidden sm:inline')}>
        {isDark ? 'Mode clair' : 'Mode sombre'}
      </span>
    </Button>
  )
}
