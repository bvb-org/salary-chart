import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Calculatorul de Salariu și Inflație | Analiză Salarială",
  description: "Vizualizează și analizează evoluția salariilor tale în raport cu inflația din România",
  keywords: "salariu, inflație, calculator, analiză salarială, România",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider defaultTheme="light">
          <div className="sticky top-0 z-50 bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-900 shadow-sm">
            <div className="container mx-auto py-2 px-4">
              <p className="text-amber-800 dark:text-amber-200 text-sm md:text-base font-medium flex items-center justify-center">
                <span className="mr-2">⚠️</span>
                România, a doua cea mai mare rată anuală a inflației din UE, în luna Ianuarie,{" "}
                <a
                  href="https://www.economica.net/romania-pe-locul-doi-in-topul-tarilor-din-ue-cu-cele-mai-ridicate-rate-anuale-ale-inflatiei-in-ianuarie_813089.html"
                  className="ml-1 underline decoration-amber-400 underline-offset-2 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  știre aici
                </a>
              </p>
            </div>
          </div>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
              {children}
            </main>
            <footer className="mt-12 py-6 bg-muted/50">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} Calculatorul de Salariu și Inflație</p>
                <p className="mt-1">Toate calculele se fac direct în browser-ul tău, fără a stoca date personale.</p>
              </div>
            </footer>
          </div>
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
