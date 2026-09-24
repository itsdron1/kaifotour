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

## Карта и отзывы

- Точка на Google Картах: профиль «KAIFO Bali | Tours & Activities», короткая ссылка `https://maps.app.goo.gl/HK4zf7YeTPh8icdv6`, координаты `-8.8018513,115.2129072`.
- Встраивание карты, ссылка на точку, ссылка «Оставить отзыв» и координаты для маршрута лежат в `lib/site.ts` → `googleMaps`. Там же адрес (`address`) и рейтинг Google (`googleRating`): пока пустые, бейдж и строка адреса без них не показываются.
- Отзывы — в `data/reviews.ts`. Только реальные отзывы, опубликованные с согласия гостя, слово в слово; придуманных и примерных быть не должно.
- Если появится Content-Security-Policy, в `frame-src` нужно добавить `https://www.google.com` и `https://maps.google.com`, иначе карта не загрузится.

## Языки

- Английский по умолчанию: английская версия в корне (`/`, `/tours`, `/legal/...`), русская под `/ru`. Язык браузера не определяем.
- Переключатель языка пишет выбор в cookie `NEXT_LOCALE` на год, `middleware.ts` читает её и отдаёт `/ru` при заходе на корень. Внутренние адреса не редиректятся: присланная EN-ссылка открывается на английском.
- Пути собираем через `localizedPath` из `lib/i18n.ts`, языковые префиксы руками не пишем.

## Тексты

Все интерфейсные тексты RU и EN — в `lib/dictionaries.ts`, тексты туров — в `data/tours.ts`.
Русский текст в JSX не хардкодим: новые строки добавляем в оба словаря.
