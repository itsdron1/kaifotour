# KAIFO — заметки для будущих сессий

## Бренд

- **Название: KAIFO** (раньше KAIFOTOUR BALI). В видимом тексте, `<title>`, meta description, Open Graph, JSON-LD и alt-текстах — только KAIFO.
- **Не переименовывать:** домен `kaifotour-bali.com`, почтовый адрес, имя пакета `kaifotour-bali` в package.json, имя проекта в Vercel, имя dev-сервера `kaifotour-dev` в `.claude/launch.json`.
- **Логотип:** ожидается в `public/brand/kaifo-logo.svg`, светлая версия для тёмной шапки — `public/brand/kaifo-logo-light.svg`. Файлов пока нет, поэтому в шапке и футере стоит текстовый вордмарк «KAIFO» (Playfair Display italic). Когда файл появится: next/image, `alt="KAIFO"`, ссылка на `/`, высота 30px на десктопе и 24px на мобильном, без приписки «BALI» рядом; SVG скопировать в `app/icon.svg` как favicon.

## Контакты

| Канал | Значение |
|---|---|
| WhatsApp | +62 851-9010-1270 → `https://wa.me/6285190101270` |
| Instagram | @kaifo.bali → `https://instagram.com/kaifo.bali` |
| Email | kaifotourbali@gmail.com |
| Сайт | https://kaifotour-bali.com |

Контакты лежат в `lib/site.ts` — менять только там, компоненты берут их оттуда.

## Языки

- Английский по умолчанию: английская версия в корне (`/`, `/tours`, `/legal/...`), русская под `/ru`. Язык браузера не определяем.
- Переключатель языка пишет выбор в cookie `NEXT_LOCALE` на год, `middleware.ts` читает её и отдаёт `/ru` при заходе на корень. Внутренние адреса не редиректятся: присланная EN-ссылка открывается на английском.
- Пути собираем через `localizedPath` из `lib/i18n.ts`, языковые префиксы руками не пишем.

## Тексты

Все интерфейсные тексты RU и EN — в `lib/dictionaries.ts`, тексты туров — в `data/tours.ts`.
Русский текст в JSX не хардкодим: новые строки добавляем в оба словаря.
