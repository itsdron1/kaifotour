import type { Metadata, Viewport } from "next";
import "../globals.css";
import { Analytics } from "@vercel/analytics/next";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { fontVariables } from "@/lib/fonts";
import { rootMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: site.themeColor,
};

export default function IndonesianRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" data-palette={site.palette} className={fontVariables}>
      <body>
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
