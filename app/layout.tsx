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
import { getServicesAction } from "@/actions/service.actions"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsAction()

  return {
    title: {
      default:  settings.siteName || "Vaan Photographie | Photographe Professionnel",
      template: `%s | ${settings.siteName || "Ouedraogo Photographie"}`,
    },
    description: settings.siteDescription || "Photographe professionnel spécialisé en mariage, portrait, mode et événementiel.",
    keywords: ["photographe", "mariage", "portrait", "mode", "événementiel", "professionnel"],
    icons: {
      icon:     [{ url: "/sno.png", type: "image/png" }],
      apple:    [{ url: "/sno.png", sizes: "180x180", type: "image/png" }],
      shortcut:  "/sno.png",
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F8F8" },
    { media: "(prefers-color-scheme: dark)",  color: "#0F0F0F" },
  ],
  width:        "device-width",
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // const settings = await getSettingsAction()
  const [settings, services] = await Promise.all([
    getSettingsAction(),
    getServicesAction(),
  ])

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon"             href="/sno.png" type="image/png" />
        <link rel="apple-touch-icon" href="/sno.png" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ConditionalLayout
            navbar={<Navbar />}
             footer={<Footer settings={settings} services={services}  />}
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