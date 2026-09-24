/**
 * Общие кривые и длительности движения: одна кривая на весь сайт читается спокойнее,
 * чем несколько похожих. EASE_REVEAL совпадает с `editorial` из tailwind.config.ts,
 * поэтому CSS-переходы и анимации motion идут в одном ритме.
 */
export const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;
/** Мягкая кривая для наведения и переворота: плавный старт и длинный выход */
export const EASE_SOFT = [0.32, 0.72, 0, 1] as const;

export const DURATION_REVEAL = 0.6;
export const DURATION_HOVER = 0.6;
/** Шаг задержки в череде появляющихся карточек */
export const STAGGER_STEP = 0.07;
