import type { Metadata } from "next";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import { cyrillicFontVariables } from "@/lib/fonts-cyrillic";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "KAIFOTOUR BALI",
  icons: { icon: "/favicon.svg" },
};

export default function RussianRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-palette={site.palette} className={`${fontVariables} ${cyrillicFontVariables}`}>
      <body>{children}</body>
    </html>
  );
}
