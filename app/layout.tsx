import { Inter, JetBrains_Mono } from "next/font/google"
import Script from "next/script"

import "./globals.css"
import { cn } from "@/lib/utils"

const THEME_INIT_SCRIPT = `
try {
  const storageKey = "theme";
  const root = document.documentElement;
  const storedTheme = localStorage.getItem(storageKey);
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const theme = storedTheme === "light" || storedTheme === "dark"
    ? storedTheme
    : systemTheme;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
} catch {}
`

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", fontSans.variable, fontMono.variable)}
    >
      <body className="antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        {children}
      </body>
    </html>
  )
}
