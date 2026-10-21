import type { Metadata, Viewport } from "next";
import "../globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SiteAnalytics } from "@/components/analytics/SiteAnalytics";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { fontVariables } from "@/lib/fonts";
import { cyrillicFontVariables } from "@/lib/fonts-cyrillic";
import { rootMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: site.themeColor,
};

export default function RussianRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" data-palette={site.palette} className={`${fontVariables} ${cyrillicFontVariables}`}>
      <body>
        <SiteAnalytics locale="ru" />
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
