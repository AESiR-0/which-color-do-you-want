import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "which-color-do-you-want",
  description: "A premium, interaction-first color palette generator for designers.",
  openGraph: {
    title: "which-color-do-you-want",
    description: "Generate harmonious, accessible color palettes. Export to CSS, Tailwind, SCSS, JSON.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
