import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { fontInter, fontJakarta, fontMono } from "@/lib/fonts";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProjectForge AI — Gera specs de projeto com IA",
  description:
    "Briefing → análise de nicho, paleta, tipografia, design tokens, layout, skills/MCP e prompts prontos a copiar. Powered by GLM-4.6.",
  keywords: [
    "ProjectForge",
    "AI",
    "Next.js",
    "Design System",
    "MCP",
    "Framer Motion",
  ],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
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
          {children}
          <Toaster />
          <SonnerToaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
