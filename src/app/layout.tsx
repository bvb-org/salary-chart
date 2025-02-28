import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
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
  keywords: "salariu, inflație, calculator, analiză salarială, România, putere de cumpărare, economie",
  authors: [{ name: "Calculatorul de Salariu și Inflație" }],
  openGraph: {
    title: "Calculatorul de Salariu și Inflație | Analiză Salarială",
    description: "Vizualizează și analizează evoluția salariilor tale în raport cu inflația din România",
    url: "https://salariu-inflatie.ro",
    siteName: "Calculatorul de Salariu și Inflație",
    locale: "ro_RO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning className="scroll-smooth transition-colors duration-300">
      <body className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="light" attribute="class">
          <AuthProvider>
            {/* Banner with proper theme support */}
            <div className="z-50 bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-900 shadow-sm transition-colors duration-300">
              <div className="container mx-auto py-2 px-4">
                <p className="text-amber-800 dark:text-amber-200 text-sm md:text-base font-medium flex items-center justify-center transition-colors duration-300">
                  <span className="mr-2">⚠️</span>
                  România, a doua cea mai mare rată anuală a inflației din UE, în luna Ianuarie.{" "}
                  <a href="https://www.economica.net/romania-pe-locul-doi-in-topul-tarilor-din-ue-cu-cele-mai-ridicate-rate-anuale-ale-inflatiei-in-ianuarie_813089.html" className="ml-1 underline decoration-amber-400 underline-offset-2 hover:text-amber-600 dark:hover:text-amber-300 transition-colors" target="_blank" rel="noopener noreferrer">
                    știre aici
                  </a>
                </p>
              </div>
            </div>
            {children}
            <ThemeToggle />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}