# Промт для Claude Code: подключить Google Analytics 4 (G-JPJBY0H6VS)

## Промт для вставки в Claude Code

```
Задача: подключить на сайт Google Analytics 4 с ID G-JPJBY0H6VS. Google
дал стандартный код:

  <script async src="https://www.googletagmanager.com/gtag/js?id=G-JPJBY0H6VS"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-JPJBY0H6VS');
  </script>

Не вставляй его сырым HTML. Встрой эквивалент правильно для Next.js App
Router. Сначала посмотри, что уже есть из прошлой задачи: код Google Tag
Manager (NEXT_PUBLIC_GTM_ID), баннер cookies, Consent Mode, хелпер
событий (whatsapp_click и др.). Покажи план, потом выполняй.

1. ПОДКЛЮЧЕНИЕ
- ID вынеси в константу GA_MEASUREMENT_ID = "G-JPJBY0H6VS" в lib/site.ts
  (это публичный ID, его можно хранить в коде).
- Подключи через @next/third-parties/google (GoogleAnalytics) или
  next/script со strategy="afterInteractive" — один раз в общем
  layout, чтобы работало на всех трёх языках (EN, RU, ID) и на всех
  страницах.
- Загружать аналитику только на боевом сайте: хост
  www.kaifotour-bali.com (или kaifotour-bali.com). На localhost и
  *.vercel.app не загружать, чтобы тестовые заходы не попадали в
  статистику.
- Просмотры страниц при переходах внутри сайта GA4 считает сам
  (Enhanced Measurement, «изменения страницы по истории браузера»).
  Вручную page_view не отправляй, иначе будет двойной счёт.
- Если в коде есть Google Tag Manager — GA4 и GTM одновременно
  загружаться не должны (двойной счёт). Сейчас NEXT_PUBLIC_GTM_ID не
  задан, поэтому работаем через прямой gtag. Запиши в CLAUDE.md: если
  когда-нибудь подключим GTM, GA4 переносится внутрь GTM, а прямой gtag
  убирается.

2. СОГЛАСИЕ НА COOKIES (Consent Mode v2)
- До загрузки gtag и до gtag('config') должен выполниться:
    gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500
    });
  Порядок важен: сначала consent default, потом js и config. Проверь
  это в итоговом HTML.
- Баннер cookies: если он уже есть с прошлой задачи — используй его,
  иначе сделай. Стиль сайта (бумажный фон #F4F1EB, тёмный текст,
  кнопка-акцент #C0913F), внизу экрана, не перекрывает кнопку
  WhatsApp и стопку в hero на мобильном. Тексты на EN / RU / ID.
  Две равноценные кнопки: "Accept" / "Decline" (RU «Принять» /
  «Отклонить», ID «Terima» / «Tolak»), ссылка на /legal/cookies.
- Accept → gtag('consent', 'update', всё 'granted'). Decline → всё
  остаётся 'denied'. Выбор хранится в cookie на 6 месяцев, баннер
  больше не показывается. При повторном заходе с сохранённым
  согласием сразу вызывай consent update до первых событий.
- В футере ссылка «Cookie settings» / «Настройки cookie» / «Pengaturan
  cookie» снова открывает баннер.

3. СОБЫТИЯ
- Важно: с gtag.js события надо отправлять через gtag('event', ...).
  Простой dataLayer.push({ event: '...' }) без GTM в GA4 НЕ попадёт.
  Переделай общий хелпер событий: если gtag есть — gtag('event'), если
  аналитика не загружена — тихо ничего не делать (без ошибок).
- События и параметры (названия строго такие):
    whatsapp_click    { tour_slug, placement, locale }
    plan_form_submit  { tour_type, locale }
    instagram_click   { placement, locale }
    phone_click       { placement, locale }
    email_click       { placement, locale }
  tour_slug — slug тура, если кнопка относится к туру, иначе "general".
  placement — место на странице: hero, hero_stack, tour_card,
  tour_page, sticky_book, reviews, about, form, footer и т.д.
- Проверь, что события срабатывают на ВСЕХ кнопках WhatsApp: hero,
  стопка в hero, карточки туров (лицо и оборот), круг, страница тура,
  липкая кнопка «Book», форма, футер, отзывы. Перечисли их в summary.
- Переход по ссылке WhatsApp открывается в новой вкладке, поэтому
  событие успевает уйти. Если где-то ссылка открывается в той же
  вкладке — используй transport_type: 'beacon'.

4. CONTENT-SECURITY-POLICY
Если в next.config или middleware задан CSP, добавь:
  script-src https://www.googletagmanager.com
  connect-src https://*.google-analytics.com
              https://*.analytics.google.com
              https://*.googletagmanager.com
  img-src https://*.google-analytics.com https://*.googletagmanager.com
Иначе аналитика будет молча заблокирована браузером.

5. ДОКУМЕНТАЦИЯ
Обнови docs/analytics.md: какие события есть, где срабатывают, как
проверить их в GA4 (Realtime и DebugView) и как отметить ключевые
события — простыми шагами для человека без опыта.

6. ПРОВЕРКА
- npm run build и npm run lint без ошибок.
- На localhost аналитика не грузится, сайт работает без ошибок в
  консоли.
- В итоговом HTML боевой сборки: consent default стоит раньше config.
- Баннер не ломает вёрстку на 375 / 768 / 1440, переводы на трёх
  языках.

Коммит: feat(analytics): GA4 G-JPJBY0H6VS with consent mode and events
В конце пришли summary: где подключено, список кнопок с событиями.
```

---

## После Claude Code

**1. Отправить на сайт**

```bash
cd "/c/Users/MSI/Desktop/claude kaifo"
git status
git add .
git commit -m "feat(analytics): GA4 with consent mode and events"
git push
```

**2. Проверить, что данные идут** (через 2–3 минуты после деплоя)

1. Открой [analytics.google.com](https://analytics.google.com) → **Отчёты → В режиме реального времени**.
2. В другом окне открой `https://www.kaifotour-bali.com` в режиме инкогнито и нажми **Accept** в баннере.
3. В отчёте реального времени должен появиться 1 пользователь.
4. Нажми на сайте любую кнопку WhatsApp. Через минуту в отчёте в блоке событий появится `whatsapp_click`.

Если пользователь не появляется, проверь сайт через [tagassistant.google.com](https://tagassistant.google.com) и пришли мне скриншот.

**3. Отметить ключевые события** (на следующий день, когда события накопятся)

GA4 → **Администратор → Отображение данных → События** → у `whatsapp_click` и `plan_form_submit` включи переключатель **«Отметить как ключевое событие»**. Именно их потом импортируешь в Google Ads как конверсии.

**4. Не считать свои заходы** (по желанию)

GA4 → **Администратор → Потоки данных** → твой поток → **Настроить параметры тега → Определить внутренний трафик** → добавь свой IP-адрес. Потом в **Администратор → Фильтры данных** включи фильтр «Internal Traffic». Так твои заходы и тесты не будут портить статистику.
