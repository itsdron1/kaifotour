import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

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
  const fonts = await loadFonts();

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
          <div style={{ display: "flex", fontFamily: "Sofia Sans Condensed", fontSize: 26, letterSpacing: 6, color: colors.accent }}>
            KAIFO
          </div>
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
