import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PersonaForge — Forje personas de IA que conversam",
  description:
    "Studio para criar, refinar e conversar com personas de IA detalhadas. Discovery estruturado, painel de qualidade e chat em tempo real.",
  keywords: [
    "PersonaForge",
    "AI persona",
    "character creation",
    "LLM",
    "prompt engineering",
    "Next.js",
  ],
  authors: [{ name: "PersonaForge" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "PersonaForge",
    description: "Forje personas de IA que conversam.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <Toaster position="top-center" richColors closeButton />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
