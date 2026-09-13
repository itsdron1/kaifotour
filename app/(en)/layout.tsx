import type { Metadata } from "next";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "KAIFOTOUR BALI",
  icons: { icon: "/favicon.svg" },
};

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-palette={site.palette} className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
