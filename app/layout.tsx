import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Color System Explorer",
  description: "Generate, explore, and export color systems with design system thinking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
