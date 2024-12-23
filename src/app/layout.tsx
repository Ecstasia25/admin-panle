import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Providers } from "../providers/providers"
import { EB_Garamond } from "next/font/google"
import { cn } from "@/utils"
import NextTopLoader from 'nextjs-toploader';
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/sonner"

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sans",
});

const eb_garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: "Ecstasia Panel",
  description: "Ecstasia is the annual cultural extravaganza of the University of Engineering and Management (UEM), Kolkata. This highly anticipated fest ignites the campus with excitement, fostering camaraderie and offering a vibrant celebration of traditions.",
  manifest: "manifest.json",
  icons: {
    icon: "/logos/logo.png",
    apple: "/maskable.png",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {


  return (
    <ClerkProvider>
      <html lang="en" className={cn(poppins.variable, eb_garamond.variable)}>
        <body className="min-h-[calc(100vh-1px)] flex flex-col font-sans antialiased">
        <NextTopLoader showSpinner={false} color="#DDB49F" />
          <main className="relative flex-1 flex flex-col">
            <Providers
            >{children}
            <Toaster />
            </Providers>
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
