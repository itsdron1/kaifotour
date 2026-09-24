import type { Config } from "tailwindcss";

/**
 * Дизайн-токены KAIFO.
 *
 * Палитра Deep Ocean & Brass (docs/tz-main.md, раздел 4.1) задана CSS-переменными
 * в app/globals.css. Переключение на палитры 02/03 (раздел 4.2) меняет только
 * переменные, разметка не трогается.
 *
 * Стандартная палитра Tailwind заменена целиком, а не расширена: утилит white/black
 * нет, поэтому чистый #FFFFFF в разметку не попадёт (правило 4.3.1).
 */
const token = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

const config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      /** #F4F1EB: фон страницы вместо белого */
      paper: token("bg"),
      /** #0F2230: хедер, hero, тёмные секции */
      deep: token("surface-dark"),
      /** #14545C: полоса категорий, обводки вторичных кнопок, кикеры */
      secondary: token("surface-teal"),
      /** #C0913F: только CTA, цены, номера пунктов, активные вкладки */
      accent: token("accent"),
      /** Затемнённый акцент для мелкого текста на светлом фоне (контраст WCAG AA) */
      "accent-ink": token("accent-ink"),
      /** #D9CDBA: контакты, футер, светлые подложки */
      sand: token("sand"),
      /** #EFE7DA: текст на тёмном фоне */
      "on-dark": token("text-on-dark"),
      /** #0F2230: основной текст */
      ink: token("text"),
      /** #B9C4CC: пункты меню на тёмном фоне */
      mist: token("muted-on-dark"),
      /** #7E8E99: контур вторичных кнопок */
      steel: token("outline"),
      /** #C9C2B4: тонкие разделители */
      divider: token("divider"),
      /** #7B8A93: приписки на тёмном фоне */
      note: token("note"),
      /** #5C6B74: лейблы и приписки на светлом фоне */
      label: token("label"),
      /** Тень, тонированная в цвет тёмной базы */
      shade: token("shade"),
    },
    fontFamily: {
      display: ["var(--font-display)"],
      sans: ["var(--font-sans)"],
      condensed: ["var(--font-condensed)"],
    },
    extend: {
      maxWidth: {
        page: "88rem",
        prose: "65ch",
      },
      fontSize: {
        "display-2xl": ["clamp(2.75rem, 1.5rem + 4.8vw, 6.25rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "display-xl": ["clamp(2.5rem, 1.7rem + 3.2vw, 4.75rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "display-lg": ["clamp(2.125rem, 1.6rem + 2.2vw, 3.5rem)", { lineHeight: "1.12" }],
        "display-md": ["clamp(1.625rem, 1.35rem + 1.2vw, 2.375rem)", { lineHeight: "1.15" }],
      },
      letterSpacing: {
        kicker: "0.18em",
        caps: "0.12em",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        350: "350ms",
      },
      zIndex: {
        header: "40",
        menu: "50",
        cursor: "60",
        grain: "70",
      },
      keyframes: {
        /** Индикатор стопки историй: линия заполняется слева направо */
        "story-progress": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
      },
      animation: {
        /** 3000ms — столько же ждёт таймер в components/home/StoryStack.tsx */
        "story-progress": "story-progress 3000ms linear forwards",
      },
      boxShadow: {
        polaroid: "0 10px 18px rgb(var(--color-shade) / 0.45)",
        "polaroid-lift": "0 26px 40px rgb(var(--color-shade) / 0.6)",
        postcard: "0 22px 44px -22px rgb(var(--color-shade) / 0.7)",
        "postcard-lift": "0 34px 64px -24px rgb(var(--color-shade) / 0.75)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
