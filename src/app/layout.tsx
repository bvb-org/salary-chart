import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grafic Salarii - Analiză Salarială",
  description: "Vizualizează și analizează evoluția salariilor tale în România",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider defaultTheme="system">
          <div className="bg-yellow-50 dark:bg-yellow-950 p-2 text-center">
            <p className="text-yellow-800 dark:text-yellow-200">
              ⚠️ România, a doua cea mai mare rată anuală a inflației din UE, în luna Ianuarie, {" "}
              <a
                href="https://www.economica.net/romania-pe-locul-doi-in-topul-tarilor-din-ue-cu-cele-mai-ridicate-rate-anuale-ale-inflatiei-in-ianuarie_813089.html"
                className="underline hover:text-yellow-600 dark:hover:text-yellow-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                știre aici
              </a>
            </p>
          </div>
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
