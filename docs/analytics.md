# Аналитика KAIFO: Google Analytics 4, согласие на cookies и события

## Что стоит на сайте

| Что | Где в коде | Как включается |
|---|---|---|
| **Vercel Web Analytics** — посещения без cookies | `<Analytics />` в `app/(en\|ru\|id)/layout.tsx` | Vercel → проект → **Analytics → Enable** |
| **Google Analytics 4** `G-JPJBY0H6VS` (прямой gtag.js) | `components/analytics/SiteAnalytics.tsx`, ID — `GA_MEASUREMENT_ID` в `lib/site.ts` | всегда, но только на боевом адресе |
| **Согласие на cookies** (Consent Mode v2) и баннер | `lib/analytics.ts`, `components/analytics/CookieBanner.tsx` | вместе с GA4 |
| **События конверсий** | один общий обработчик `components/analytics/AnalyticsEvents.tsx` | вместе с GA4 |

- GA4, баннер и события работают **только на `www.kaifotour-bali.com` и `kaifotour-bali.com`** (`ANALYTICS_HOSTS` в `lib/site.ts`). На `localhost` и `*.vercel.app` ничего не грузится и баннера нет — тестовые заходы не портят статистику.
- Просмотры страниц GA4 считает сам, в том числе при переходах внутри сайта (расширенная статистика, «изменения в истории браузера»). Вручную `page_view` не отправляем — иначе двойной счёт.
- **GA4 и GTM одновременно не грузятся.** Если когда-нибудь задать `NEXT_PUBLIC_GTM_ID`, сайт вместо gtag.js загрузит контейнер GTM, и GA4 нужно настроить внутри GTM (раздел в конце). Иначе визиты посчитаются дважды.

## События

| Событие | Когда | Параметры |
|---|---|---|
| `whatsapp_click` | клик по любой ссылке на WhatsApp и отправка формы «Plan Your Bali Trip». **Главная цель** | `tour_slug`, `placement`, `locale` |
| `plan_form_submit` | отправка формы «Plan Your Bali Trip» | `tour_type`, `locale` |
| `instagram_click` | клик по ссылке на Instagram | `placement`, `locale` |
| `phone_click` | клик по номеру телефона (`tel:`) | `placement`, `locale` |
| `email_click` | клик по почте (`mailto:`) | `placement`, `locale` |

- **`tour_slug`** — какой тур: `batur-sunrise-trekking`, `atv`… Если кнопка не относится к туру (шапка, hero, футер, форма) — `general`.
- **`locale`** — язык страницы: `en`, `ru`, `id`.
- **`tour_type`** — что выбрали в форме: `ocean`, `offroad`, `sunset`, `dayTours`, `rides`, `unsure`.
- **`placement`** — где кнопка:

| placement | Кнопка WhatsApp |
|---|---|
| `header` | кнопка WhatsApp в шапке (на компьютере) |
| `menu` | WhatsApp в мобильном меню |
| `hero` | «Задать вопрос» на первом экране |
| `hero_deck` | «Book via WhatsApp» у колоды туров (второй экран) |
| `hero_stack` | оборот карточки тура в колоде на втором экране |
| `tour_circle` | оборот карточки в круге туров на главной |
| `tour_card` | карточка тура в каталоге `/tours` и в блоке «Похожие туры» |
| `tour_page` | кнопки брони на странице тура (первый экран, варианты тура) |
| `tour_consult` | блок «Не знаете, что выбрать?» на странице тура |
| `sticky_book` | нижняя панель «Забронировать» на мобильном |
| `catalog` | «Написать нам», если в каталоге ничего не нашлось |
| `faq` | «Написать в WhatsApp» у вопросов на главной |
| `reviews` | «Оставить отзыв», пока на сайте нет отзывов |
| `form` | форма «Plan Your Bali Trip» |
| `footer` | номер WhatsApp и кнопка в футере |

Как это устроено: у блоков страницы стоят атрибуты `data-placement` и `data-tour-slug`, а один обработчик на весь документ ловит клики по ссылкам и сам определяет, что это за ссылка и откуда клик. **Новую кнопку WhatsApp отслеживать отдельно не нужно** — она попадёт в события автоматически; чтобы у неё было своё место, поставьте `data-placement` на её блок.

События уходят через `gtag('event', …)` с `transport_type: 'beacon'`, поэтому успевают отправиться, даже если ссылка уводит со страницы. Пока аналитика не загружена, хелпер `track()` молча ничего не делает.

## Согласие на cookies (Consent Mode v2)

- Первым на странице выполняется встроенный скрипт `analytics-init`: согласие по умолчанию **denied** для `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`, затем сохранённый выбор (если гость уже нажимал «Принять»), затем `gtag('js')` и `gtag('config')`. Сам gtag.js грузится после этого.
- Баннер — светлая полоса внизу экрана на трёх языках: **Accept / Decline**, **Принять / Отклонить**, **Terima / Tolak**, ссылка на `/legal/cookies`. Кнопки одного размера. На странице тура на мобильном баннер встаёт над панелью брони, на главной не закрывает колоду карточек и кнопки первого экрана.
- Выбор хранится в cookie `kaifo_consent` на 6 месяцев. «Принять» — всё `granted`, «Отклонить» — всё остаётся `denied`.
- В футере, в колонке документов, есть ссылка **Cookie settings / Настройки cookie / Pengaturan cookie** — она снова открывает баннер.
- При отказе GA4 всё равно получает обезличенные пинги без cookies, и Google достраивает по ним статистику — так работает Consent Mode v2.

---

## Проверить, что данные идут

### Сразу после деплоя (5 минут)

1. Откройте [analytics.google.com](https://analytics.google.com) → **Отчёты → В режиме реального времени**.
2. В другом окне откройте `https://www.kaifotour-bali.com` **в режиме инкогнито** (Ctrl+Shift+N). Внизу появится баннер — нажмите **Accept**.
3. В отчёте реального времени в течение минуты появится 1 пользователь.
4. Нажмите на сайте любую кнопку WhatsApp (открывшуюся вкладку можно закрыть). Через минуту в блоке «Количество событий» появится `whatsapp_click`.

Если пользователь не появился:
- Ctrl+U (код страницы) → Ctrl+F `G-JPJBY0H6VS` — ID должен найтись внутри скрипта `analytics-init`, после строки `consent','default'`.
- F12 → **Консоль** → введите `dataLayer` и Enter: первыми идут `consent default`, потом `js` и `config`. После «Accept» добавится `consent update` с `granted`.
- Проверьте сайт через [tagassistant.google.com](https://tagassistant.google.com) и пришлите скриншот.

### DebugView: каждое событие с параметрами

1. Откройте [tagassistant.google.com](https://tagassistant.google.com) → **Add domain** → `https://www.kaifotour-bali.com` → **Connect**. Сайт откроется в новой вкладке в режиме отладки.
2. Нажмите **Accept** в баннере и несколько кнопок: WhatsApp на карточке тура, Instagram в футере, отправьте форму.
3. GA4 → **Администратор → Отображение данных → DebugView**. Слева выберите своё устройство: в ленте видны `page_view`, `whatsapp_click`, `plan_form_submit`… Нажмите на событие — справа будут `tour_slug`, `placement`, `locale`.

### Отметить ключевые события (на следующий день)

1. GA4 → **Администратор → Отображение данных → События**. События появятся в списке в течение суток после первых срабатываний.
2. У `whatsapp_click` и `plan_form_submit` включите переключатель **Отметить как ключевое событие**.

### Чтобы параметры были видны в отчётах

GA4 → **Администратор → Отображение данных → Пользовательские определения → Создать специальный параметр**, область «Событие». По одному: `tour_slug`, `placement`, `tour_type`. Через сутки по ним можно будет строить отчёты: какие туры и какие кнопки приносят обращения.

### Связать с Google Ads

1. GA4 → **Администратор → Связь с Google Ads** → связать аккаунт Google Ads.
2. Google Ads → **Цели → Конверсии → Создать → Импорт → Google Analytics 4** → отметить `whatsapp_click` и `plan_form_submit`.
3. Основной целью для кампаний оставьте `whatsapp_click`.

### Не считать свои заходы (по желанию)

GA4 → **Администратор → Потоки данных** → поток сайта → **Настроить параметры тега → Определить внутренний трафик** → добавьте свой IP-адрес. Потом **Администратор → Фильтры данных** → включите фильтр «Internal Traffic».

---

## Если когда-нибудь понадобится GTM

1. Создайте контейнер на [tagmanager.google.com](https://tagmanager.google.com) и скопируйте его ID `GTM-XXXXXXX`.
2. Внутри GTM: тег **Google Тег** с ID `G-JPJBY0H6VS`, триггер **Initialization – All Pages**; переменные уровня данных `tour_slug`, `placement`, `locale`, `tour_type`; по триггеру «Особое событие» и тегу «Google Аналитика: событие GA4» на каждое из пяти событий.
3. Vercel → **Settings → Environment Variables** → `NEXT_PUBLIC_GTM_ID` = `GTM-XXXXXXX` → **Redeploy**.

После этого сайт перестанет грузить gtag.js напрямую и загрузит GTM. Баннер и согласие работают так же, а события уходят в `dataLayer` как `{event: 'whatsapp_click', …}` — их подхватывают триггеры GTM.
