# KAIFO

Маркетинговый сайт туров и проката снаряжения на Бали: лодки, серфинг, снорклинг, ATV, эндуро, джипы, джетски, Harley и однодневные экскурсии.

Стек: Next.js 16 (App Router), TypeScript, Tailwind CSS 3.4, Motion (Framer Motion), иконки Phosphor.
Источник истины по контенту и дизайну: файлы в [`docs/`](docs/).

## Запуск

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # продакшен-сборка
npm run start      # запуск собранного сайта
npm run lint
npm run typecheck
```

## Структура

| Путь | Что внутри |
|---|---|
| `app/(ru)/` | Русская версия в корне: `/`, `/tours`, `/tours/[slug]`, `/legal/[doc]` |
| `app/(en)/en/` | Английская версия под `/en` |
| `app/sitemap.ts`, `app/robots.ts` | sitemap.xml и robots.txt |
| `data/tours.ts` | Каталог туров: 17 опубликованных и 2 скрытых (`published: false`) |
| `data/media.ts` | Реестр фотографий с alt-текстами RU/EN |
| `lib/dictionaries.ts` | Все тексты интерфейса RU/EN |
| `lib/site.ts` | Контакты, домен, активная палитра |
| `tailwind.config.ts`, `app/globals.css` | Дизайн-токены: палитры 01 Deep Ocean & Brass, 02 Basalt & Copper, 03 Jungle & Gold |
| `components/home/` | Секции главной: Hero, How We Ride & Explore, Tours Worth Riding, Beyond the Booking, FAQ, Plan Your Bali Trip |
| `components/catalog/`, `components/tour/` | Каталог с фильтрами и шаблон страницы тура |

## Что заменить перед запуском

1. **Фотографии.** Сейчас стоят временные стоковые фото Pexels. Положите свои файлы в `public/images/` и поменяйте `src` в `data/media.ts`.
2. **Цены.** Все цены «от» взяты из ТЗ и требуют подтверждения (`data/tours.ts`).
3. **Цифры компании.** Плейсхолдеры `[X]` в `lib/dictionaries.ts`, ключ `stories.stats`.
4. **История гостя.** Цитата-заглушка в `stories.storyQuote`.
5. **Юридические документы.** Страницы `/legal/privacy`, `/legal/offer`, `/legal/cookies` пока заглушки.
6. **Ответы FAQ.** Формулировки про оплату, детей, погоду, трансфер и связь с гидом написаны нейтрально, их нужно сверить с реальными правилами.
7. **Длительность и сложность.** Для туров, где ТЗ их не указывает, выводится «по запросу» (`duration: null`, `difficulty: null`).
8. **Время ответа.** Фраза «Обычно отвечаем в течение 10-15 минут» взята из примера в ТЗ.

## Частые задачи

- **Добавить тур:** новый объект в `data/tours.ts` и фото в `data/media.ts`. Страница `/tours/<slug>`, карточка в каталоге и пункт в sitemap появятся сами.
- **Опубликовать Nusa Lembongan или Sumba:** поставить `published: true` и проверить категорию и тексты.
- **Сменить палитру:** `palette` в `lib/site.ts` (`deep-ocean-brass`, `basalt-copper`, `jungle-gold`).
- **Изменить тексты интерфейса:** `lib/dictionaries.ts`, русский и английский блоки.
