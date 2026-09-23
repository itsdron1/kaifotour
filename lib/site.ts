/** Подтверждённые контакты и бренд (docs/tz-main.md, раздел 2) */
export const site = {
  name: "KAIFO",
  url: "https://kaifotour-bali.com",
  /** Палитра из docs/tz-main.md, раздел 4: "deep-ocean-brass" | "basalt-copper" | "jungle-gold" */
  palette: "deep-ocean-brass",
  /** Цвет интерфейса браузера на мобильных = тёмная база палитры */
  themeColor: "#0F2230",
  whatsapp: {
    display: "+62 851-9010-1270",
    number: "6285190101270",
  },
  instagram: {
    handle: "@kaifo.bali",
    url: "https://instagram.com/kaifo.bali",
  },
  email: "kaifotourbali@gmail.com",
} as const;
