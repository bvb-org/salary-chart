"use client"

import { useTheme } from "@/components/theme-provider"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 group"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span className="sr-only">
        Switch to {theme === "dark" ? "light" : "dark"} mode
      </span>
      <div className="relative w-6 h-6 overflow-hidden">
        {/* Sun icon */}
        <svg
          className={`w-6 h-6 text-amber-500 absolute top-0 left-0 transition-transform duration-500 ease-in-out ${
            theme === "dark" ? "translate-y-0 rotate-0" : "translate-y-10 rotate-90"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        
        {/* Moon icon */}
        <svg
          className={`w-6 h-6 text-indigo-500 absolute top-0 left-0 transition-transform duration-500 ease-in-out ${
            theme === "dark" ? "translate-y-10 rotate-90" : "translate-y-0 rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>
      
      {/* Tooltip */}
      <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        {theme === "dark" ? "Schimba la modul de zi" : "Schimba la modul de noapte"}
      </span>
    </button>
  )
}