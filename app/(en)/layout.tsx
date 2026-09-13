import type { Metadata, Viewport } from "next";
import "../globals.css";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: site.name,
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
};

export default function EnglishRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-palette={site.palette} className={fontVariables}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
