import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import "./globals.css"
import { getSettingsAction } from "@/actions/settings.actions"
import ConditionalLayout from "@/components/conditionalLyaout"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

// generateMetadata remplace export const metadata
// Elle peut être async et lire la base de données
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsAction()

  return {
    title: {
      default: settings.siteName || "Vaan Photographie | Photographe Professionnel",
      template: `%s | ${settings.siteName || "Ouedrdraogo Photographie"}`,
    },
    description: settings.siteDescription || "Photographe professionnel spécialisé en mariage, portrait, mode et événementiel.",
    keywords: ["photographe", "mariage", "portrait", "mode", "événementiel", "professionnel"],
    icons: {
      icon: [
        { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
        { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-icon.png",
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F8F8" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0F0F" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSettingsAction()

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ConditionalLayout
            navbar={<Navbar />}
            footer={<Footer settings={settings} />}
          >
            <main>
              {children}
              <Toaster position="top-center" />
            </main>
          </ConditionalLayout>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}