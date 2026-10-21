# Аналитика KAIFO: события, Google Tag Manager и GA4

## Что уже стоит на сайте

| Что | Где в коде | Как включается |
|---|---|---|
| **Vercel Web Analytics** — посещения без cookies | `<Analytics />` в `app/(en\|ru\|id)/layout.tsx` | Vercel → проект → **Analytics → Enable** |
| **Google Tag Manager** | `components/analytics/SiteAnalytics.tsx` | переменная `NEXT_PUBLIC_GTM_ID` |
| **Согласие на cookies** (Consent Mode v2) и баннер | `lib/analytics.ts`, `components/analytics/CookieBanner.tsx` | вместе с GTM |
| **События конверсий** | один общий обработчик `components/analytics/AnalyticsEvents.tsx` | вместе с GTM |

Пока `NEXT_PUBLIC_GTM_ID` не задан, GTM, баннер и события **не загружаются** — сайт работает как раньше.

## События

Сайт сам кладёт события в `dataLayer`, их видит GTM:

| Событие | Когда | Параметры |
|---|---|---|
| `whatsapp_click` | клик по любой ссылке на WhatsApp и отправка формы «Plan Your Bali Trip». **Главная цель** | `tour_slug`, `placement`, `locale` |
| `plan_form_submit` | отправка формы «Plan Your Bali Trip» | `tour_type`, `locale` |
| `instagram_click` | клик по ссылке на Instagram | `placement`, `locale` |
| `phone_click` | клик по номеру телефона (`tel:`) | `placement`, `locale` |
| `email_click` | клик по почте (`mailto:`) | `placement`, `locale` |

- **`tour_slug`** — какой тур: `batur-sunrise-trekking`, `atv`… Пусто, если кнопка не относится к туру (шапка, футер, форма).
- **`placement`** — где кнопка: `header`, `menu`, `hero`, `tour_card` (карточка тура в круге, на обороте hero или в каталоге), `tour_page` (панель брони на странице тура), `sticky_book` (нижняя панель брони на мобильном), `tour_consult` (блок «Не знаете, что выбрать?» на странице тура), `footer`, `form`, а для остальных секций главной — их id: `reviews`, `faq`, `stories`, `tours`…
- **`locale`** — язык страницы: `en`, `ru`, `id`.
- **`tour_type`** — что выбрали в форме: `ocean`, `offroad`, `sunset`, `dayTours`, `rides`, `unsure`.

Как это устроено: у блоков страницы стоят атрибуты `data-placement` и `data-tour-slug`, а один обработчик на весь документ ловит клики по ссылкам и сам определяет, что это за ссылка и откуда клик. **Новую кнопку WhatsApp отслеживать отдельно не нужно** — она попадёт в события автоматически; чтобы у неё было своё место, поставьте `data-placement` на её блок.

## Согласие на cookies (Consent Mode v2)

- До загрузки GTM сайт выставляет согласие по умолчанию: `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization` = **denied** для всех.
- Баннер внизу экрана на трёх языках, кнопки **Accept** / **Decline** и ссылка на `/legal/cookies`. На странице тура на мобильном он встаёт над панелью брони и не закрывает её.
- Выбор сохраняется в браузере (`localStorage`, ключ `kaifo-consent`) и сразу отправляется в GTM как `gtag('consent', 'update', …)`. При следующих визитах баннера нет, выбор применяется ещё до загрузки GTM.
- При отказе GA4 всё равно получает обезличенные пинги без cookies, и Google достраивает по ним статистику — так работает Consent Mode v2.

---

## Настройка шаг за шагом

### 1. Создать GA4

1. Откройте [analytics.google.com](https://analytics.google.com) → **Администратор** (шестерёнка внизу слева) → **Создать → Ресурс**.
2. Название `KAIFO`, часовой пояс **Индонезия — Макассар (Бали)**, валюта **IDR**.
3. Платформа **Веб** → адрес `https://www.kaifotour-bali.com`, название потока `kaifotour-bali.com`.
4. Скопируйте **Идентификатор потока данных** вида `G-XXXXXXXXXX` — он понадобится в GTM.

### 2. Создать контейнер GTM

1. Откройте [tagmanager.google.com](https://tagmanager.google.com) → **Создать аккаунт**: аккаунт `KAIFO`, страна Индонезия, контейнер `kaifotour-bali.com`, платформа **Веб**.
2. Скопируйте ID контейнера вида `GTM-XXXXXXX` (он в шапке рядом с названием).
3. Окно с кодом установки закройте — код уже стоит на сайте.

### 3. Подключить GTM к сайту

1. Vercel → проект → **Settings → Environment Variables** → **Add**:
   - Key: `NEXT_PUBLIC_GTM_ID`
   - Value: `GTM-XXXXXXX`
   - Environments: **Production** и **Preview**.
2. **Deployments** → у последнего деплоя «⋯» → **Redeploy**. Без нового деплоя переменная не подхватится.
3. Для проверки на своём компьютере — файл `.env.local` в папке проекта со строкой `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX` (в репозиторий он не попадает).

### 4. Тег GA4 в GTM

1. В GTM: **Теги → Создать** → «Конфигурация тега» → **Google Тег**.
2. Идентификатор тега: `G-XXXXXXXXXX` из шага 1.
3. «Триггеры» → **Initialization – All Pages**.
4. Название `GA4 — Google Тег` → **Сохранить**.

### 5. Переменные для параметров событий

**Переменные → Пользовательские переменные → Создать → Переменная уровня данных.** Создайте четыре, имя переменной уровня данных — как в таблице событий:

| Название в GTM | Имя переменной уровня данных |
|---|---|
| `DLV — tour_slug` | `tour_slug` |
| `DLV — placement` | `placement` |
| `DLV — locale` | `locale` |
| `DLV — tour_type` | `tour_type` |

### 6. Триггеры на события

**Триггеры → Создать** → тип **Особое событие**. По одному на каждое событие:

| Название триггера | Имя события |
|---|---|
| `CE — whatsapp_click` | `whatsapp_click` |
| `CE — plan_form_submit` | `plan_form_submit` |
| `CE — instagram_click` | `instagram_click` |
| `CE — phone_click` | `phone_click` |
| `CE — email_click` | `email_click` |

«Это срабатывание происходит при» — **Всех особых событиях**.

### 7. Теги событий GA4

**Теги → Создать** → **Google Аналитика: событие GA4**. Для `whatsapp_click`:

- Идентификатор измерения: `G-XXXXXXXXXX`.
- Название события: `whatsapp_click`.
- Параметры события: `tour_slug` → `{{DLV — tour_slug}}`, `placement` → `{{DLV — placement}}`, `locale` → `{{DLV — locale}}`.
- Триггер: `CE — whatsapp_click`.

Так же для остальных четырёх событий (у `plan_form_submit` параметры `tour_type` и `locale`).

### 8. Проверить и опубликовать

1. В GTM: **Предварительный просмотр** → введите `https://www.kaifotour-bali.com`.
2. На открывшемся сайте нажмите **Accept** в баннере, затем кнопку WhatsApp на любой карточке тура.
3. В окне Tag Assistant слева появится `whatsapp_click`; у тега `GA4 — whatsapp_click` должно быть «Tags Fired».
4. В GA4: **Отчёты → В режиме реального времени** — событие появится в течение минуты.
5. В GTM: **Отправить → Опубликовать**.

### 9. Сделать события ключевыми (конверсиями)

1. GA4 → **Администратор → События**. События появятся в списке в течение суток после первых срабатываний.
2. У `whatsapp_click` и `plan_form_submit` включите переключатель **Отметить как ключевое событие**.

### 10. Связать с Google Ads

1. GA4 → **Администратор → Связь с Google Ads** → связать аккаунт Google Ads.
2. Google Ads → **Цели → Конверсии → Создать → Импорт → Google Analytics 4** → отметить `whatsapp_click` и `plan_form_submit`.
3. Основной целью для кампаний оставьте `whatsapp_click`.

---

## Проверка на сайте

- Без `NEXT_PUBLIC_GTM_ID` в исходном коде страницы нет `googletagmanager` и баннера.
- С ним: в исходном коде есть `consent-default` раньше скрипта GTM; в консоли браузера `dataLayer` после клика по WhatsApp содержит `{event: "whatsapp_click", tour_slug: …, placement: …, locale: …}`.
