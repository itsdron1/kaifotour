import type { Metadata, Viewport } from "next";
import "../globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SiteAnalytics } from "@/components/analytics/SiteAnalytics";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { fontVariables } from "@/lib/fonts";
import { rootMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: site.themeColor,
};

export default function EnglishRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-palette={site.palette} className={fontVariables}>
      <body>
        <SiteAnalytics locale="en" />
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
