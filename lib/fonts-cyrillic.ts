import { Sofia_Sans, Sofia_Sans_Condensed } from "next/font/google";

/**
 * Кириллический компаньон для Barlow / Barlow Condensed (в них нет кириллицы).
 * Подключается только в русской версии и стоит в стеке после Barlow,
 * поэтому латиница остаётся в Barlow, а кириллица рендерится в Sofia Sans.
 */
export const sofiaSans = Sofia_Sans({
  subsets: ["cyrillic"],
  weight: ["400", "500"],
  variable: "--font-sofia",
  display: "swap",
});

export const sofiaSansCondensed = Sofia_Sans_Condensed({
  subsets: ["cyrillic"],
  weight: ["400", "600"],
  variable: "--font-sofia-condensed",
  display: "swap",
});

export const cyrillicFontVariables = [sofiaSans.variable, sofiaSansCondensed.variable].join(" ");
