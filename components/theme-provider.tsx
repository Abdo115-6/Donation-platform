'use client'

import * as React from 'react'

type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = Exclude<Theme, 'system'>

type ThemeProviderContextValue = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

export type ThemeProviderProps = {
  children: React.ReactNode
  attribute?: 'class' | `data-${string}`
  defaultTheme?: Theme
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  storageKey?: string
}

const ThemeProviderContext = React.createContext<
  ThemeProviderContextValue | undefined
>(undefined)

const MEDIA_QUERY = '(prefers-color-scheme: dark)'

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light'
}

function getStoredTheme(storageKey: string): Theme | null {
  try {
    const storedTheme = window.localStorage.getItem(storageKey)
    return storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
      ? storedTheme
      : null
  } catch {
    return null
  }
}

function applyTheme(attribute: ThemeProviderProps['attribute'], resolvedTheme: ResolvedTheme) {
  const root = document.documentElement

  if (attribute === 'class') {
    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)
  } else {
    root.setAttribute(attribute ?? 'data-theme', resolvedTheme)
  }

  root.style.colorScheme = resolvedTheme
}

function disableTransitionsTemporarily() {
  const style = document.createElement('style')
  style.appendChild(
    document.createTextNode(
      '*,*::before,*::after{transition:none!important}',
    ),
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    window.setTimeout(() => {
      document.head.removeChild(style)
    }, 1)
  }
}

export function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = false,
  storageKey = 'theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>('light')

  React.useLayoutEffect(() => {
    const storedTheme = getStoredTheme(storageKey)
    const nextTheme =
      storedTheme ?? (enableSystem ? defaultTheme : defaultTheme === 'system' ? 'light' : defaultTheme)
    const nextResolvedTheme =
      nextTheme === 'system' && enableSystem ? getSystemTheme() : nextTheme === 'system' ? 'light' : nextTheme

    setThemeState(nextTheme)
    setResolvedTheme(nextResolvedTheme)
    applyTheme(attribute, nextResolvedTheme)
  }, [attribute, defaultTheme, enableSystem, storageKey])

  React.useEffect(() => {
    if (!enableSystem) return

    const mediaQuery = window.matchMedia(MEDIA_QUERY)
    const handleChange = () => {
      if (theme !== 'system') return

      const nextResolvedTheme = getSystemTheme()
      setResolvedTheme(nextResolvedTheme)
      applyTheme(attribute, nextResolvedTheme)
    }

    handleChange()
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [attribute, enableSystem, theme])

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      const normalizedTheme =
        nextTheme === 'system' && !enableSystem ? 'light' : nextTheme
      const nextResolvedTheme =
        normalizedTheme === 'system' ? getSystemTheme() : normalizedTheme

      const restoreTransitions = disableTransitionOnChange
        ? disableTransitionsTemporarily()
        : null

      setThemeState(normalizedTheme)
      setResolvedTheme(nextResolvedTheme)
      applyTheme(attribute, nextResolvedTheme)

      try {
        window.localStorage.setItem(storageKey, normalizedTheme)
      } catch {}

      restoreTransitions?.()
    },
    [attribute, disableTransitionOnChange, enableSystem, storageKey],
  )

  const value = React.useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [resolvedTheme, setTheme, theme],
  )

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeProviderContext)

  if (!context) {
    throw new Error('useTheme must be used within a <ThemeProvider />')
  }

  return context
}
