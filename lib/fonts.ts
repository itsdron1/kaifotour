import { Barlow, Barlow_Condensed, Playfair_Display } from "next/font/google";

/** Курсивный serif для крупных заголовков (docs/editorial-style.md, раздел 1) */
export const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["500", "600"],
  variable: "--font-playfair",
  display: "swap",
});

/**
 * Barlow и Barlow Condensed не содержат кириллицу. Метрический фолбэк отключён,
 * иначе кириллические глифы уходили бы в подогнанный Arial вместо Sofia Sans.
 */
export const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-barlow",
  display: "swap",
  adjustFontFallback: false,
});

export const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-barlow-condensed",
  display: "swap",
  adjustFontFallback: false,
});

export const fontVariables = [playfair.variable, barlow.variable, barlowCondensed.variable].join(" ");
