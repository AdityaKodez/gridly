import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { appConfig } from "@/config";
import { generateThemeCSS } from "@/lib/theme-presets";
import { TRPCReactProvider } from "@/trpc/client";
import { DM_Sans } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
const themeCSS = generateThemeCSS(appConfig.theme, appConfig.radius);

const DmSans = DM_Sans({
fallback:["latin"],
variable: "--font-sans",
})
export const metadata: Metadata = {
  title: {
    default: appConfig.name,
    template: `%s | ${appConfig.name}`,
  },
  description: appConfig.description,
  metadataBase: new URL(appConfig.url),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
  },
  authors: [{ name: appConfig.creator.name, url: appConfig.creator.url }],
  keywords: [
    "SaaS",
    "Starter",
    "Kit",
    "Next.js",
    "TypeScript",
    "Prisma",
    "Stripe",
    "tRPC",
    "shadcn/ui",
    "Better Auth",
  ],
  openGraph: {
    title: appConfig.name,
    description: appConfig.description,
    siteName: appConfig.name,
    type: "website",
    url: appConfig.url,
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: appConfig.name,
    description: appConfig.description,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={` ${DmSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}
      suppressHydrationWarning
    >
      <head suppressHydrationWarning>
        <style
          dangerouslySetInnerHTML={{ __html: themeCSS }}
          suppressHydrationWarning
        />
      </head>
      <body className={`antialiased`}>
        <TRPCReactProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </TRPCReactProvider>
        <Analytics/>
      </body>
    </html>
  );
}
