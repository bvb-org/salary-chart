"use client";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { useState } from "react";

export const Header = () => {
  const { user, signIn, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-slate-900 sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 mr-2 text-indigo-600 dark:text-indigo-400"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Calculatorul de Salariu și Inflație</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/#calculator" className="text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 font-medium">
              Calculator
            </Link>
            <Link href="/#faq" className="text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 font-medium">
              FAQ
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">Bună, {user.user_metadata?.full_name?.split(' ').slice(0, -1).join(' ') || 'utilizator'}</span>
                <button onClick={signOut} className="btn btn-primary">Logout</button>
              </>
            ) : (
              <button onClick={signIn} className="btn btn-primary">Login with Google</button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-slate-700 dark:text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-200 dark:border-slate-700">
            <nav className="flex flex-col space-y-4 mt-4">
              <Link
                href="/#calculator"
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Calculator
              </Link>
              <Link
                href="/#faq"
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">Bună, {user.user_metadata?.full_name?.split(' ').slice(0, -1).join(' ') || 'utilizator'}</span>
                  <button onClick={signOut} className="btn btn-primary w-full">Logout</button>
                </>
              ) : (
                <button onClick={signIn} className="btn btn-primary w-full">Login with Google</button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}