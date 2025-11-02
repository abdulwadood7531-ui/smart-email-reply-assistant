import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Email Reply Assistant - AI-Powered Email Helper",
  description: "Generate professional email replies and summaries instantly with AI. Choose from friendly, professional, or concise tones. Powered by advanced AI technology.",
  keywords: ["email", "AI", "reply", "assistant", "automation", "productivity"],
  authors: [{ name: "Smart Email Reply Team" }],
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased h-full">
        {children}
      </body>
    </html>
  );
}
