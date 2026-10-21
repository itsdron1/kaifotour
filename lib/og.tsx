import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { resolveMedia } from "@/data/media";
import { getPublishedTour } from "@/data/tours";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Пропорции логотипа 4352 × 1228 */
const LOGO_WIDTH = 198;
const LOGO_HEIGHT = 56;

let logoPromise: Promise<string | null> | null = null;

/** Логотип для тёмной карточки: SVG из public/brand как data URI, next/og растеризует его сам */
function loadLogo(): Promise<string | null> {
  logoPromise ??= readFile(path.join(process.cwd(), "public", "brand", "kaifo-logo-light.svg"))
    .then((buffer) => `data:image/svg+xml;base64,${buffer.toString("base64")}`)
    .catch(() => null);
  return logoPromise;
}

/** next/og не понимает CSS-переменные, поэтому цвета палитры Deep Ocean & Brass продублированы из globals.css */
const colors = {
  deep: "#0F2230",
  accent: "#C0913F",
  onDark: "#EFE7DA",
  mist: "#B9C4CC",
};

interface OgFont {
  name: string;
  data: ArrayBuffer;
  style: "normal" | "italic";
  weight: 500 | 600;
}

const fontCache = new Map<string, Promise<ArrayBuffer | null>>();

/** Google Fonts отдаёт TTF клиентам без браузерного User-Agent: такой формат понимает next/og */
async function fetchFont(cssUrl: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(cssUrl)).text();
    const match = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
    if (!match) return null;
    const response = await fetch(match[1]);
    return response.ok ? await response.arrayBuffer() : null;
  } catch {
    return null;
  }
}

function loadFont(cssUrl: string): Promise<ArrayBuffer | null> {
  let pending = fontCache.get(cssUrl);
  if (!pending) {
    pending = fetchFont(cssUrl);
    fontCache.set(cssUrl, pending);
  }
  return pending;
}

async function loadFonts(): Promise<OgFont[]> {
  const [display, caps] = await Promise.all([
    loadFont("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,500"),
    // Sofia Sans Condensed вместо Barlow Condensed: в карточке бывает кириллица
    loadFont("https://fonts.googleapis.com/css2?family=Sofia+Sans+Condensed:wght@600"),
  ]);
  const fonts: OgFont[] = [];
  if (display) fonts.push({ name: "Playfair Display", data: display, style: "italic", weight: 500 });
  if (caps) fonts.push({ name: "Sofia Sans Condensed", data: caps, style: "normal", weight: 600 });
  return fonts;
}

interface OgCardOptions {
  title: string;
  kicker: string;
  photo?: string;
}

/** Карточка для соцсетей 1200x630: фото слева, курсивный заголовок на тёмной базе справа */
export async function renderOgImage({ title, kicker, photo }: OgCardOptions): Promise<ImageResponse> {
  const [fonts, logo] = await Promise.all([loadFonts(), loadLogo()]);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: colors.deep, color: colors.onDark }}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo.replace(/w=\d+/, "w=1000")}
            alt=""
            width={470}
            height={630}
            style={{ width: 470, height: 630, objectFit: "cover" }}
          />
        ) : null}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 64px",
          }}
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="KAIFO" width={LOGO_WIDTH} height={LOGO_HEIGHT} style={{ width: LOGO_WIDTH, height: LOGO_HEIGHT }} />
          ) : (
            <div style={{ display: "flex", fontFamily: "Sofia Sans Condensed", fontSize: 26, letterSpacing: 6, color: colors.accent }}>
              KAIFO
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: "Sofia Sans Condensed", fontSize: 24, letterSpacing: 3, color: colors.mist }}>
              {kicker.toUpperCase()}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 20,
                fontFamily: "Playfair Display",
                fontStyle: "italic",
                fontSize: 68,
                lineHeight: 1.1,
              }}
            >
              {title}
            </div>
          </div>
          <div style={{ display: "flex", width: 96, height: 4, backgroundColor: colors.accent }} />
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}

/** Метаданные карточки тура для соцсетей: og:image:alt — название тура, а не общее «KAIFO» */
export function tourOgImageMetadata(slug: string) {
  const tour = getPublishedTour(slug);
  return [{ id: "card", alt: tour ? tour.title : "KAIFO", size: ogSize, contentType: ogContentType }];
}

/** Карточка тура: фото тура, логотип, кикер и название; для неизвестного адреса — общая карточка сайта */
export function renderTourOgImage(locale: Locale, slug: string): Promise<ImageResponse> {
  const tour = getPublishedTour(slug);
  if (!tour) {
    const t = getDictionary(locale);
    return renderOgImage({ title: t.hero.title, kicker: t.footer.tagline });
  }
  return renderOgImage({ title: tour.title, kicker: tour.kicker[locale], photo: resolveMedia(tour.image, locale).src });
}
