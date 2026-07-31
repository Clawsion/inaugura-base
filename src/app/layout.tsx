import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { fontInter, fontJakarta, fontMono } from "@/lib/fonts";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inaugura-Base — Forge spec-driven projects with AI",
  description:
    "Briefing → análise de nicho, paleta, tipografia, design tokens, layout, skills/MCP e prompts prontos a copiar.",
  keywords: [
    "Inaugura-Base",
    "AI",
    "Next.js",
    "Design System",
    "MCP",
    "Motion",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fontInter.variable} ${fontJakarta.variable} ${fontMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>
            {children}
          </TooltipProvider>
          <Toaster />
          <SonnerToaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
