import type { PluralForms } from "@/lib/format";
import type { Locale } from "@/lib/i18n";

/** Формы множественного числа: в русском 4 формы, в английском 2 */
const pf = (forms: PluralForms): PluralForms => forms;

/**
 * Интерфейсные тексты RU / EN.
 * Английские заголовки секций и подписи взяты из docs/editorial-style.md,
 * русские варианты там, где они даны, оттуда же; остальное переведено
 * и требует редактуры заказчика (см. раздел 4 editorial-style.md).
 */
const ru = {
  meta: {
    homeTitle: "KAIFO: лодки, серфинг, ATV, джип-туры и экскурсии на Бали",
    homeDescription:
      "Лодочные прогулки, серфинг, снорклинг, ATV, джип и Harley-туры, однодневные экскурсии. Организуем безопасные и атмосферные приключения на Бали.",
    toursTitle: "Туры на Бали: каталог маршрутов",
    toursDescription:
      "Морские прогулки, бездорожье, экскурсии и прокат с гидом на Бали. Фильтры по типу активности, цене и длительности.",
    tourSuffix: "Бронирование в WhatsApp.",
    legalDescription: "Документ KAIFO находится в подготовке.",
  },
  a11y: {
    skip: "Перейти к содержанию",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
    mainNav: "Основная навигация",
    footerNav: "Разделы сайта",
    language: "Язык сайта",
    breadcrumbs: "Навигационная цепочка",
    newTab: "откроется в новой вкладке",
    toursList: "Список туров",
    categories: "Категории туров",
    gallery: "Фотографии тура",
  },
  nav: {
    stories: "Истории",
    tours: "Туры",
    about: "О нас",
    contact: "Контакты",
    faq: "Вопросы",
    home: "Главная",
  },
  cta: {
    book: "Забронировать в WhatsApp",
    bookShort: "Забронировать",
    message: "Написать в WhatsApp",
    explore: "Смотреть туры",
    exploreAll: "Все туры",
    details: "Подробнее",
    instagram: "Написать в Instagram",
    consult: "Получить консультацию",
  },
  whatsapp: {
    general: "Здравствуйте! Хочу подобрать тур на Бали",
    question: "Здравствуйте! У меня вопрос о турах на Бали",
    consult: "Здравствуйте! Помогите, пожалуйста, выбрать тур на Бали",
  },
  price: {
    from: "от",
    onRequest: "Цена по запросу",
    disclaimer: "Цены ориентировочные и уточняются до брони",
  },
  hero: {
    title: "Бали, который останется с тобой",
    captionLeft: "Мы продумываем каждый маршрут так, чтобы вы вспоминали его годами",
    captionRight: "Рассвет, который вы чуть не проспали. Риф, о котором знают только местные.",
    scrollHint: "Листайте вниз",
  },
  ride: {
    title: "Разные маршруты, одно настроение",
    intro: "Лодки, джипы, байки и пешие тропы. Выберите, каким вы хотите увидеть остров.",
    sectors: {
      ocean: {
        title: "Морские прогулки",
        caption: "Деревянные лодки, тихие бухты и вода, сквозь которую видно дно",
      },
      offroad: {
        title: "Бездорожье",
        caption: "Вулканические тропы, дороги через джунгли, пыль и смотровые точки",
      },
      sunset: {
        title: "Круизы на закате",
        caption: "Ужин на палубе, огненное шоу и небо, которое каждый вечер разное",
      },
      rentals: {
        title: "Прокат с гидом",
        caption: "Своя техника и гид, который знает дороги",
      },
    },
  },
  catalog: {
    homeTitle: "Туры, ради которых стоит приехать",
    pageTitle: "Каждый тур продуман до мелочей",
    pageIntro: "{count} по Бали: океан, бездорожье, экскурсии и прокат с гидом.",
    all: "Все",
    routes: pf({ one: "{n} маршрут", few: "{n} маршрута", many: "{n} маршрутов", other: "{n} маршрута" }),
    found: pf({ one: "Найден {n} тур", few: "Найдено {n} тура", many: "Найдено {n} туров", other: "Найдено {n} тура" }),
    filters: {
      environment: "Стихия",
      environmentAny: "Любая",
      water: "Вода",
      land: "Суша",
      price: "Цена",
      priceAny: "Любая",
      priceUnder500: "до 500K IDR",
      price500to1500: "500K-1.5M IDR",
      priceOver1500: "от 1.5M IDR",
      priceOnRequest: "По запросу",
      duration: "Длительность",
      durationAny: "Любая",
      hours: "Несколько часов",
      fullDay: "Весь день",
      extended: "Больше дня",
      sort: "Сортировка",
      popular: "Популярные",
      priceAsc: "Сначала дешевле",
      priceDesc: "Сначала дороже",
      reset: "Сбросить фильтры",
    },
    clearCollection: "Убрать подборку",
    emptyTitle: "Под эти фильтры туров нет",
    emptyText: "Измените условия или напишите нам, и мы подберём маршрут вручную.",
  },
  tour: {
    duration: "Длительность",
    difficulty: "Сложность",
    price: "Стоимость",
    category: "Категория",
    difficultyLevels: {
      easy: "Лёгкий",
      medium: "Средний",
      hard: "Высокий",
      unknown: "Уточняйте у менеджера",
    },
    includes: "Что включено",
    variants: "Ещё маршрут в этом туре",
    gallery: "Как это выглядит",
    related: "Похожие туры",
    badgeNew: "Новинка",
    consultTitle: "Не знаете, что выбрать?",
    consultText: "Расскажем, какой тур подойдёт именно вам, подберём даты и соберём программу под ваши пожелания.",
  },
  stories: {
    titleTop: "Больше, чем бронь",
    titleBottom: "Ближе к моменту",
    intro:
      "Мы собираем маршруты ради момента, который остаётся с вами после поездки. Скоро здесь появятся истории наших гостей.",
    stats: [
      { value: "[X]", label: "туров проведено" },
      { value: "[X]", label: "довольных гостей" },
      { value: "[X]", label: "лет работы" },
    ],
    catalogStat: pf({
      one: "маршрут в каталоге",
      few: "маршрута в каталоге",
      many: "маршрутов в каталоге",
      other: "маршрута в каталоге",
    }),
    storyLabel: "История гостя",
    storyQuote: "[Здесь появится короткая цитата гостя после первой опубликованной истории]",
    storyLink: "Истории гостей в Instagram",
  },
  faq: {
    title: "Вопросы перед поездкой",
    stillQuestions: "Остались вопросы? Мы на связи.",
    items: [
      {
        q: "Нужен ли опыт для серфинга, ATV или эндуро?",
        a: "Зависит от маршрута. Серфинг проходит в малых группах с гидом, ATV-туры тоже сопровождает гид. Для эндуро и мототуров свой опыт лучше заранее обсудить с менеджером: он подберёт маршрут под ваш уровень.",
      },
      {
        q: "Что входит в стоимость тура?",
        a: "Список «Что включено» есть на странице каждого тура: например, снаряжение, гид, трансфер или еда. Цены на сайте ориентировочные, точную стоимость менеджер подтвердит до бронирования.",
      },
      {
        q: "Как оплатить бронирование: предоплата или на месте?",
        a: "Условия оплаты зависят от тура. Менеджер сообщит их в WhatsApp до того, как вы подтвердите бронь.",
      },
      {
        q: "Можно ли поехать с детьми?",
        a: "Требования к возрасту зависят от тура: ATV, эндуро и восхождения на вулканы требуют больше подготовки, чем морские прогулки и экскурсии. Напишите возраст детей, и менеджер предложит подходящие варианты.",
      },
      {
        q: "Что делать при плохой погоде?",
        a: "Безопасность для нас на первом месте. Если погода делает маршрут небезопасным, менеджер свяжется с вами и предложит варианты: другую дату или другой маршрут.",
      },
      {
        q: "Как вы заберёте меня из отеля?",
        a: "Трансфер входит во многие туры, это указано на странице тура. При бронировании пришлите адрес отеля или виллы, и менеджер согласует время и место встречи.",
      },
      {
        q: "Какое снаряжение взять с собой?",
        a: "Основное снаряжение для активности входит в тур, например снасти для рыбалки или снаряжение для восхождения на Агунг. С собой возьмите солнцезащитный крем, воду и удобную одежду, а на рассветные восхождения ещё и тёплую кофту: на вершине прохладно.",
      },
      {
        q: "Как связаться с гидом в день тура?",
        a: "Пишите нам в WhatsApp: +62 851-9010-1270. Контакт гида и детали встречи менеджер пришлёт перед поездкой.",
      },
    ],
  },
  plan: {
    title: "Спланируйте поездку на Бали",
    subtitle: "Расскажите, что хотите увидеть, и мы соберём маршрут под вас",
    name: "Имя",
    namePlaceholder: "Как к вам обращаться",
    dates: "Даты поездки",
    dateFrom: "С",
    dateTo: "По",
    tourType: "Какой тур интересует",
    tourTypes: {
      ocean: "Океан",
      offroad: "Бездорожье",
      sunset: "Круиз на закате",
      dayTours: "Экскурсии",
      rides: "Прокат с гидом",
      unsure: "Пока не знаю",
    },
    submit: "Отправить в WhatsApp",
    helper: "Откроется WhatsApp с готовым сообщением. Отправка ни к чему не обязывает.",
    replyTime: "Обычно отвечаем в течение 10-15 минут",
    errorName: "Напишите, как к вам обращаться",
    errorDates: "Дата окончания не может быть раньше даты начала",
    datesRange: "{from} - {to}",
    dateFromOnly: "с {from}",
    dateToOnly: "до {to}",
    sent: "Сообщение готово. Если WhatsApp не открылся,",
    openWhatsapp: "откройте его по ссылке",
    message: {
      greeting: "Здравствуйте! Меня зовут {name}.",
      dates: "Даты поездки: {dates}.",
      type: "Интересует: {type}.",
    },
  },
  footer: {
    tagline: "Настоящий Бали: от океана до бездорожья",
    navTitle: "Разделы",
    contactsTitle: "Контакты",
    legalTitle: "Документы",
    disclaimer:
      "Информация на сайте носит ознакомительный характер и не является публичной офертой. Цены ориентировочные и подтверждаются менеджером до бронирования.",
    rights: "Все права защищены",
  },
  legal: {
    documents: {
      privacy: "Политика конфиденциальности",
      offer: "Публичная оферта",
      cookies: "Политика cookie",
    },
    pending: "Документ готовится и будет опубликован на этой странице.",
    contact: "По вопросам пишите на",
  },
  notFound: {
    title: "Страница не найдена",
    text: "Возможно, ссылка устарела или тур переехал в другой раздел.",
    home: "На главную",
  },
};

export type Dictionary = typeof ru;

const en: Dictionary = {
  meta: {
    homeTitle: "KAIFO: boat trips, surfing, ATV, jeep tours and day tours in Bali",
    homeDescription:
      "Boat trips, surfing, snorkeling, ATV, jeep and Harley tours, plus day tours across the island. Scenic, safe and real Bali experiences.",
    toursTitle: "Bali Tours: the Full Catalog",
    toursDescription:
      "Ocean trips, off-road rides, day tours and guided rentals in Bali. Filter by activity, price and duration.",
    tourSuffix: "Book via WhatsApp.",
    legalDescription: "This KAIFO document is being prepared.",
  },
  a11y: {
    skip: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mainNav: "Main navigation",
    footerNav: "Site sections",
    language: "Site language",
    breadcrumbs: "Breadcrumbs",
    newTab: "opens in a new tab",
    toursList: "Tour list",
    categories: "Tour categories",
    gallery: "Tour photos",
  },
  nav: {
    stories: "Stories",
    tours: "Tours",
    about: "About",
    contact: "Contact",
    faq: "FAQ",
    home: "Home",
  },
  cta: {
    book: "Book via WhatsApp",
    bookShort: "Book",
    message: "Message on WhatsApp",
    explore: "Explore tours",
    exploreAll: "Explore all tours",
    details: "Details",
    instagram: "Message on Instagram",
    consult: "Get advice",
  },
  whatsapp: {
    general: "Hello! I'd like to choose a tour in Bali",
    question: "Hello! I have a question about your Bali tours",
    consult: "Hello! Could you help me choose a tour in Bali?",
  },
  price: {
    from: "from",
    onRequest: "Price on request",
    disclaimer: "Prices are for reference only",
  },
  hero: {
    title: "Find the Bali That Stays With You",
    captionLeft: "We plan each route so you remember it years later",
    captionRight: "The sunrise you almost slept through. The reef only locals know.",
    scrollHint: "Scroll to explore",
  },
  ride: {
    title: "How We Ride & Explore",
    intro: "Boats, jeeps, bikes and hiking trails. Choose how you want to see the island.",
    sectors: {
      ocean: {
        title: "Ocean Trips",
        caption: "Wooden boats, quiet coves, water you can see through",
      },
      offroad: {
        title: "Off-Road Rides",
        caption: "Volcanic trails, jungle roads, dust and viewpoints",
      },
      sunset: {
        title: "Sunset Cruises",
        caption: "Dinner on deck, fire show, the sky doing its thing",
      },
      rentals: {
        title: "Guided Rentals",
        caption: "Your own machine, a guide who knows the roads",
      },
    },
  },
  catalog: {
    homeTitle: "Tours Worth Riding",
    pageTitle: "Every Tour, Thought Through",
    pageIntro: "{count} across Bali: ocean trips, off-road rides, day tours and guided rentals.",
    all: "All",
    routes: pf({ one: "{n} route", other: "{n} routes" }),
    found: pf({ one: "{n} tour found", other: "{n} tours found" }),
    filters: {
      environment: "Setting",
      environmentAny: "Any",
      water: "Water",
      land: "Land",
      price: "Price",
      priceAny: "Any",
      priceUnder500: "Under 500K IDR",
      price500to1500: "500K-1.5M IDR",
      priceOver1500: "1.5M IDR and up",
      priceOnRequest: "On request",
      duration: "Duration",
      durationAny: "Any",
      hours: "A few hours",
      fullDay: "Full day",
      extended: "More than a day",
      sort: "Sort",
      popular: "Popular",
      priceAsc: "Price: low to high",
      priceDesc: "Price: high to low",
      reset: "Reset filters",
    },
    clearCollection: "Clear collection",
    emptyTitle: "No tours match these filters",
    emptyText: "Try different filters or message us and we will put a route together for you.",
  },
  tour: {
    duration: "Duration",
    difficulty: "Difficulty",
    price: "Price",
    category: "Category",
    difficultyLevels: {
      easy: "Easy",
      medium: "Moderate",
      hard: "Challenging",
      unknown: "Ask our manager",
    },
    includes: "What's included",
    variants: "Another route in this tour",
    gallery: "What it looks like",
    related: "More tours like this",
    badgeNew: "New",
    consultTitle: "Not sure what to choose?",
    consultText: "We will tell you which tour suits you, help with dates and put together a plan around your wishes.",
  },
  stories: {
    titleTop: "Beyond the Booking",
    titleBottom: "Into the Moment",
    intro:
      "We build every route around the moment that stays with you after the trip. Guest stories will appear here soon.",
    stats: [
      { value: "[X]", label: "tours completed" },
      { value: "[X]", label: "happy travelers" },
      { value: "[X]", label: "years in business" },
    ],
    catalogStat: pf({ one: "route in the catalog", other: "routes in the catalog" }),
    storyLabel: "Guest story",
    storyQuote: "[A short guest quote will appear here after the first published story]",
    storyLink: "Guest stories on Instagram",
  },
  faq: {
    title: "Questions Before You Go",
    stillQuestions: "Still have questions? We're here.",
    items: [
      {
        q: "Do I need experience for surfing, ATV or enduro?",
        a: "It depends on the route. Surfing is done in small groups with a guide, and ATV tours come with a guide too. For enduro and motorcycle tours, talk your riding experience through with our manager first so they can match the route to your level.",
      },
      {
        q: "What is included in the price?",
        a: "Every tour page has a “What's included” list, such as gear, a guide, transfer or food. Prices on the site are for reference only, and our manager confirms the exact price before you book.",
      },
      {
        q: "How do I pay: prepayment or on the day?",
        a: "Payment terms depend on the tour. Our manager will share them on WhatsApp before you confirm your booking.",
      },
      {
        q: "Can I bring my children?",
        a: "Age requirements depend on the tour: ATV, enduro and volcano climbs ask more of you than boat trips and day tours. Tell us your children's ages and our manager will suggest suitable options.",
      },
      {
        q: "What happens if the weather is bad?",
        a: "Safety comes first. If the weather makes a route unsafe, our manager will contact you with options: another date or another route.",
      },
      {
        q: "How do you pick me up from my hotel?",
        a: "Transfer is included in many tours, as noted on each tour page. When you book, send us your hotel or villa address and our manager will agree on the pickup time and place.",
      },
      {
        q: "What should I bring?",
        a: "The main gear for each activity is included, for example fishing gear or climbing gear for Mount Agung. Bring sunscreen, water and comfortable clothes, plus a warm layer for sunrise climbs: it gets cool at the summit.",
      },
      {
        q: "How do I reach my guide on the day of the tour?",
        a: "Message us on WhatsApp at +62 851-9010-1270. Our manager will send you the guide's contact and meeting details before the trip.",
      },
    ],
  },
  plan: {
    title: "Plan Your Bali Trip",
    subtitle: "Tell us what you're dreaming of, and we'll shape the route around you",
    name: "Name",
    namePlaceholder: "How should we call you",
    dates: "Travel dates",
    dateFrom: "From",
    dateTo: "To",
    tourType: "Which tour are you interested in",
    tourTypes: {
      ocean: "Ocean",
      offroad: "Off-Road",
      sunset: "Sunset Cruise",
      dayTours: "Day Tours",
      rides: "Guided Rentals",
      unsure: "Not sure yet",
    },
    submit: "Send via WhatsApp",
    helper: "WhatsApp will open with a ready-made message. Sending it doesn't commit you to anything.",
    replyTime: "We usually reply within 10-15 minutes",
    errorName: "Please tell us your name",
    errorDates: "The end date can't be earlier than the start date",
    datesRange: "{from} - {to}",
    dateFromOnly: "from {from}",
    dateToOnly: "until {to}",
    sent: "Your message is ready. If WhatsApp didn't open,",
    openWhatsapp: "use this link",
    message: {
      greeting: "Hello! My name is {name}.",
      dates: "Travel dates: {dates}.",
      type: "Interested in: {type}.",
    },
  },
  footer: {
    tagline: "Scenic, safe and real Bali experiences, from ocean trips to off-road adventures",
    navTitle: "Sections",
    contactsTitle: "Contacts",
    legalTitle: "Documents",
    disclaimer:
      "Information on this site is for reference only and does not constitute a public offer. Prices are for reference only and are confirmed by our manager before booking.",
    rights: "All rights reserved",
  },
  legal: {
    documents: {
      privacy: "Privacy Policy",
      offer: "Public Offer",
      cookies: "Cookie Policy",
    },
    pending: "This document is being prepared and will be published on this page.",
    contact: "For questions, email",
  },
  notFound: {
    title: "Page not found",
    text: "The link may be out of date, or the tour has moved to another section.",
    home: "Back to home",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { ru, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
