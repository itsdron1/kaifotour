import type { MediaKey } from "@/data/media";
import type { Locale, Localized } from "@/lib/i18n";

/**
 * Каталог туров KAIFO.
 *
 * Источники:
 * - 10 текущих категорий: docs/tz-main.md, раздел 3.4 (таблица каталога);
 * - 7 Day Tours и расширения B1 / B2: docs/new-tours-content.md, блоки A и B;
 * - Nusa Lembongan (A8) и Sumba (блок C): published: false до решения заказчика.
 *
 * Порядок массива = нумерация 01-17 в секции «Tours Worth Riding»
 * (docs/editorial-style.md, раздел 3) и сортировка «Популярные».
 * Все цены «от» и требуют подтверждения у заказчика перед запуском.
 */

export type TourCategory = "ocean" | "offroad" | "day-tours" | "rides";
/** Фильтр «вода / суша» из docs/tz-main.md, раздел 3.4 */
export type Environment = "water" | "land";
export type Difficulty = "easy" | "medium" | "hard";
/** null: длительность не указана в ТЗ и уточняется у заказчика */
export type DurationBucket = "hours" | "full-day" | "extended";
/** Подборки для коллажа «How We Ride & Explore» */
export type Collection = "sunset";
export type Badge = "new";

export interface TourVariant {
  id: string;
  title: string;
  lead: Localized;
  durationLabel?: Localized;
  priceFromIDR: number;
  includes: Localized<string[]>;
  note?: Localized;
  ctaWhatsappText: Localized;
  image: MediaKey;
}

export interface Tour {
  slug: string;
  title: string;
  category: TourCategory;
  kicker: Localized;
  lead: Localized;
  durationLabel: Localized;
  duration: DurationBucket | null;
  /** null: «по запросу» */
  priceFromIDR: number | null;
  priceToIDR?: number;
  includes: Localized<string[]>;
  /** null: сложность не указана в ТЗ */
  difficulty: Difficulty | null;
  difficultyNote?: Localized;
  badge: Badge | null;
  ctaWhatsappText: Localized;
  environment: Environment;
  collections: Collection[];
  image: MediaKey;
  gallery: MediaKey[];
  /** Дополнительные маршруты внутри тура (docs/new-tours-content.md, блок B) */
  variants: TourVariant[];
  isMultiDay: boolean;
  published: boolean;
}

/** Формат из docs/tz-main.md, раздел 5 */
const interestQuoted = (title: string): Localized => ({
  ru: `Здравствуйте! Интересует тур «${title}»`,
  en: `Hello! I'm interested in the "${title}" tour`,
  id: `Halo! Saya tertarik dengan tur "${title}".`,
});

/** Формат готовых ссылок из docs/new-tours-content.md */
const interest = (title: string): Localized => ({
  ru: `Здравствуйте! Интересует тур ${title}`,
  en: `Hello! I'm interested in the ${title} tour`,
  id: `Halo! Saya tertarik dengan tur ${title}.`,
});

const onRequest: Localized = { ru: "По запросу", en: "On request" , id: "Sesuai permintaan"};
const oneDay: Localized = { ru: "1 день", en: "1 day" , id: "1 hari"};

export const categories: { id: TourCategory; label: Localized }[] = [
  { id: "ocean", label: { ru: "Океан", en: "Ocean" , id: "Laut"} },
  { id: "offroad", label: { ru: "Бездорожье", en: "Off-road" , id: "Off-Road"} },
  // Между Off-road и Rides: docs/new-tours-content.md, «Куда добавлять на сайте»
  { id: "day-tours", label: { ru: "Экскурсии", en: "Day Tours" , id: "Wisata Harian"} },
  { id: "rides", label: { ru: "Прокат с гидом", en: "Rides" , id: "Sewa Kendaraan"} },
];

export const tours: Tour[] = [
  {
    slug: "traditional-boat",
    title: "Traditional Boat",
    category: "ocean",
    kicker: { ru: "01 / Океан", en: "01 / Ocean" , id: "01 / Laut"},
    lead: {
      ru: "Закатные и вечерние круизы на традиционной лодке: ужин на борту, живая музыка и огненное шоу.",
      en: "Sunset and evening cruises on a traditional boat, with dinner on board, live music and a fire show.",
      id: "Pelayaran senja dan malam dengan perahu tradisional, lengkap dengan makan malam di kapal, musik live, dan fire show.",
    },
    durationLabel: { ru: "Вечерний круиз", en: "Evening cruise" , id: "Pelayaran malam"},
    duration: "hours",
    priceFromIDR: 850_000,
    includes: {
      ru: ["Закатный или вечерний круиз", "Ужин на борту", "Живая музыка", "Огненное шоу"],
      en: ["Sunset or evening cruise", "Dinner on board", "Live music", "Fire show"],
      id: ["Pelayaran senja atau malam", "Makan malam di kapal", "Musik live", "Fire show"],
    },
    difficulty: "easy",
    badge: null,
    ctaWhatsappText: interestQuoted("Traditional Boat"),
    environment: "water",
    collections: ["sunset"],
    image: "traditional-boat",
    gallery: ["boat-dusk", "sunset-boats"],
    variants: [],
    isMultiDay: false,
    published: true,
  },
  {
    slug: "beat-boat",
    title: "Beat Boat",
    category: "ocean",
    kicker: { ru: "02 / Океан", en: "02 / Ocean" , id: "02 / Laut"},
    lead: {
      ru: "Трёхчасовой круиз с остановками для купания. На борту бар, DJ и вышка для прыжков в воду.",
      en: "A three-hour cruise with swim stops. On board: a bar, a DJ and a tower for jumping into the sea.",
      id: "Pelayaran tiga jam dengan berhenti untuk berenang. Di kapal: bar, DJ, dan menara untuk melompat ke laut.",
    },
    durationLabel: { ru: "3 часа", en: "3 hours" , id: "3 jam"},
    duration: "hours",
    priceFromIDR: 350_000,
    includes: {
      ru: [
        "Круиз 3 часа",
        "Остановки для купания",
        "Бар и DJ на борту",
        "Вышка для прыжков в воду",
        "Дневной выход 10:00-13:00 или вечерний 15:00-18:30",
      ],
      en: [
        "3-hour cruise",
        "Swim stops",
        "Bar and DJ on board",
        "Jumping tower",
        "Day trip 10:00-13:00 or evening trip 15:00-18:30",
      ],
      id: [
        "Pelayaran 3 jam",
        "Berhenti untuk berenang",
        "Bar dan DJ di kapal",
        "Menara lompat",
        "Trip siang 10.00-13.00 atau trip sore 15.00-18.30",
      ],
    },
    difficulty: "easy",
    badge: null,
    ctaWhatsappText: interestQuoted("Beat Boat"),
    environment: "water",
    collections: ["sunset"],
    image: "beat-boat",
    gallery: ["boat-turquoise", "sunset-boats"],
    variants: [],
    isMultiDay: false,
    published: true,
  },
  {
    slug: "fishing",
    title: "Fishing",
    category: "ocean",
    kicker: { ru: "03 / Океан", en: "03 / Ocean" , id: "03 / Laut"},
    lead: {
      ru: "Рыбалка в океане в двух форматах: локальная и профессиональная. Снаряжение и еда уже включены в стоимость.",
      en: "Ocean fishing in two formats, local or professional. Gear and food are included in the price.",
      id: "Memancing di laut dalam dua pilihan, lokal atau profesional. Perlengkapan dan makanan sudah termasuk dalam harga.",
    },
    durationLabel: onRequest,
    duration: null,
    priceFromIDR: 490_000,
    priceToIDR: 1_800_000,
    includes: {
      ru: ["Локальная рыбалка", "Профессиональная рыбалка", "Снаряжение", "Еда"],
      en: ["Local fishing trip", "Professional fishing trip", "Fishing gear", "Food"],
      id: ["Trip memancing lokal", "Trip memancing profesional", "Perlengkapan pancing", "Makanan"],
    },
    difficulty: "easy",
    badge: null,
    ctaWhatsappText: interestQuoted("Fishing"),
    environment: "water",
    collections: [],
    image: "fishing",
    gallery: ["fishing-boats", "boat-turquoise"],
    variants: [],
    isMultiDay: false,
    published: true,
  },
  {
    slug: "surfing",
    title: "Surfing",
    category: "ocean",
    kicker: { ru: "04 / Океан", en: "04 / Ocean" , id: "04 / Laut"},
    lead: {
      ru: "Серфинг на секретных пляжах: малые группы и сопровождение гида.",
      en: "Surfing on secret beaches, in small groups and with a guide.",
      id: "Surfing di pantai-pantai rahasia, dalam grup kecil dan bersama pemandu.",
    },
    durationLabel: onRequest,
    duration: null,
    priceFromIDR: 200_000,
    includes: {
      ru: ["Споты на секретных пляжах", "Малые группы", "Сопровождение гида"],
      en: ["Spots on secret beaches", "Small groups", "Guide"],
      id: ["Spot di pantai rahasia", "Grup kecil", "Pemandu"],
    },
    difficulty: null,
    badge: null,
    ctaWhatsappText: interestQuoted("Surfing"),
    environment: "water",
    collections: [],
    image: "surfing",
    gallery: ["surf-wave", "bukit-cliffs"],
    variants: [],
    isMultiDay: false,
    published: true,
  },
  {
    slug: "snorkeling",
    title: "Snorkeling",
    category: "ocean",
    kicker: { ru: "05 / Океан", en: "05 / Ocean" , id: "05 / Laut"},
    lead: {
      ru: "Снорклинг на стандартных спотах или премиум-выход к мантам. Самый длинный вариант занимает полный день на Нуса-Пенида.",
      en: "Snorkeling at standard spots or a premium trip to see manta rays. The longest option is a full day on Nusa Penida.",
      id: "Snorkeling di spot standar atau trip premium untuk melihat pari manta. Pilihan terpanjang: seharian penuh di Nusa Penida.",
    },
    durationLabel: { ru: "До 9 часов", en: "Up to 9 hours" , id: "Sampai 9 jam"},
    duration: null,
    priceFromIDR: 250_000,
    priceToIDR: 1_000_000,
    includes: {
      ru: ["Стандартные споты", "Премиум-выход с мантами", "Полный день на Нуса-Пенида, около 9 часов"],
      en: ["Standard spots", "Premium trip with manta rays", "Full day on Nusa Penida, about 9 hours"],
      id: ["Spot standar", "Trip premium dengan pari manta", "Seharian di Nusa Penida, sekitar 9 jam"],
    },
    difficulty: null,
    badge: null,
    ctaWhatsappText: interestQuoted("Snorkeling"),
    environment: "water",
    collections: [],
    image: "snorkeling",
    gallery: ["manta", "reef"],
    variants: [
      {
        // B2: docs/new-tours-content.md
        id: "nusa-penida-full-day",
        title: "Nusa Penida Full Day",
        lead: {
          ru: "Полный день на Нуса-Пенида: снорклинг с мантами плюс главные смотровые точки острова, Kelingking Cliff и Broken Beach.",
          en: "A full day on Nusa Penida: snorkeling with manta rays plus the island's main viewpoints, Kelingking Cliff and Broken Beach.",
          id: "Seharian penuh di Nusa Penida: snorkeling bersama pari manta plus titik pandang utama pulau ini, Kelingking Cliff dan Broken Beach.",
        },
        durationLabel: { ru: "1 день, около 9 часов", en: "1 day, about 9 hours" , id: "1 hari, sekitar 9 jam"},
        priceFromIDR: 2_100_000,
        includes: {
          ru: ["Снорклинг с мантами", "Kelingking Cliff", "Broken Beach", "Трансфер на лодке туда и обратно", "Гид"],
          en: ["Snorkeling with manta rays", "Kelingking Cliff", "Broken Beach", "Return boat transfer", "Guide"],
          id: ["Snorkeling bersama pari manta", "Kelingking Cliff", "Broken Beach", "Transfer kapal pulang pergi", "Pemandu"],
        },
        ctaWhatsappText: interest("Nusa Penida Full Day"),
        image: "kelingking",
      },
    ],
    isMultiDay: false,
    published: true,
  },
  {
    slug: "atv",
    title: "ATV Tours",
    category: "offroad",
    kicker: { ru: "01 / Бездорожье", en: "01 / Off-road" , id: "01 / Off-Road"},
    lead: {
      ru: "Маршруты на квадроциклах от 1 до 4 часов. Новая техника, сопровождение гида и трансфер.",
      en: "ATV routes from 1 to 4 hours, with new vehicles, a guide and transfer.",
      id: "Rute ATV dari 1 sampai 4 jam, dengan kendaraan baru, pemandu, dan transfer.",
    },
    durationLabel: { ru: "1-4 часа", en: "1-4 hours" , id: "1-4 jam"},
    duration: "hours",
    priceFromIDR: null,
    includes: {
      ru: ["Маршруты от 1 до 4 часов", "Новая техника", "Гид", "Трансфер"],
      en: ["Routes from 1 to 4 hours", "New vehicles", "Guide", "Transfer"],
      id: ["Rute dari 1 sampai 4 jam", "Kendaraan baru", "Pemandu", "Transfer"],
    },
    difficulty: null,
    badge: null,
    ctaWhatsappText: interestQuoted("ATV Tours"),
    environment: "land",
    collections: [],
    image: "atv",
    gallery: ["atv-river", "ubud-terraces"],
    variants: [],
    isMultiDay: false,
    published: true,
  },
  {
    slug: "enduro",
    title: "Enduro Tours",
    category: "offroad",
    kicker: { ru: "02 / Бездорожье", en: "02 / Off-road" , id: "02 / Off-Road"},
    lead: {
      ru: "Эндуро по маршрутам Kintamani, Tabanan и Secret Forest на мотоциклах Yamaha, Honda и KTM.",
      en: "Enduro rides on the Kintamani, Tabanan and Secret Forest routes on Yamaha, Honda and KTM bikes.",
      id: "Perjalanan enduro di rute Kintamani, Tabanan, dan Secret Forest dengan motor Yamaha, Honda, dan KTM.",
    },
    durationLabel: onRequest,
    duration: null,
    priceFromIDR: 1_500_000,
    includes: {
      ru: ["Мотоциклы Yamaha, Honda и KTM", "Маршрут Kintamani", "Маршрут Tabanan", "Маршрут Secret Forest"],
      en: ["Yamaha, Honda and KTM bikes", "Kintamani route", "Tabanan route", "Secret Forest route"],
      id: ["Motor Yamaha, Honda, dan KTM", "Rute Kintamani", "Rute Tabanan", "Rute Secret Forest"],
    },
    difficulty: null,
    badge: null,
    ctaWhatsappText: interestQuoted("Enduro Tours"),
    environment: "land",
    collections: [],
    image: "enduro",
    gallery: ["enduro-trail", "batur-crater"],
    variants: [],
    isMultiDay: false,
    published: true,
  },
  {
    slug: "jeep",
    title: "Jeep Tours",
    category: "offroad",
    kicker: { ru: "03 / Бездорожье", en: "03 / Off-road" , id: "03 / Off-Road"},
    lead: {
      ru: "Джип-туры к рассветам и вулканам. Маршруты: Batur и Kintamani, Ubud, Jatiluwih и Bedugul, Munduk.",
      en: "Jeep tours to sunrises and volcanoes. Routes: Batur and Kintamani, Ubud, Jatiluwih and Bedugul, Munduk.",
      id: "Tur jeep ke matahari terbit dan gunung berapi. Rute: Batur dan Kintamani, Ubud, Jatiluwih dan Bedugul, Munduk.",
    },
    durationLabel: onRequest,
    duration: null,
    priceFromIDR: 1_250_000,
    includes: {
      ru: ["Рассвет у вулкана", "Маршрут Batur / Kintamani", "Маршрут Ubud", "Маршрут Jatiluwih / Bedugul", "Маршрут Munduk"],
      en: ["Sunrise by the volcano", "Batur / Kintamani route", "Ubud route", "Jatiluwih / Bedugul route", "Munduk route"],
      id: ["Matahari terbit di dekat gunung berapi", "Rute Batur / Kintamani", "Rute Ubud", "Rute Jatiluwih / Bedugul", "Rute Munduk"],
    },
    difficulty: "easy",
    badge: null,
    ctaWhatsappText: interestQuoted("Jeep Tours"),
    environment: "land",
    collections: [],
    image: "jeep",
    gallery: ["jeep-volcano", "batur-sunrise"],
    variants: [
      {
        // B1: docs/new-tours-content.md
        id: "batur-sunrise-jeep-safari",
        title: "Batur Sunrise Jeep Safari",
        lead: {
          ru: "Джип-сафари по застывшим лавовым полям вулкана Батур: встреча рассвета, завтрак и купание в природных горячих источниках. Без пешего восхождения.",
          en: "A jeep safari across the frozen lava fields of Mount Batur: sunrise, breakfast and a swim in natural hot springs. No hiking involved.",
          id: "Safari jeep melintasi hamparan lava beku Gunung Batur: matahari terbit, sarapan, dan berendam di sumber air panas alami. Tanpa mendaki.",
        },
        priceFromIDR: 1_300_000,
        includes: {
          ru: ["Рассвет на смотровой точке", "Джип по чёрной лаве", "Завтрак или ланч", "Горячие источники"],
          en: ["Sunrise at a viewpoint", "Jeep ride over black lava", "Breakfast or lunch", "Hot springs"],
          id: ["Matahari terbit di titik pandang", "Perjalanan jeep di atas lava hitam", "Sarapan atau makan siang", "Sumber air panas"],
        },
        note: {
          ru: "В отличие от Batur Sunrise Trekking, здесь нет пешего подъёма: весь маршрут проходит на джипе. Подходит тем, кто не готов к треккингу.",
          en: "Unlike Batur Sunrise Trekking, there is no hike: the whole route is by jeep. A good fit if you are not up for trekking.",
          id: "Berbeda dengan Batur Sunrise Trekking, di sini tidak ada pendakian: seluruh rute ditempuh dengan jeep. Cocok kalau Anda tidak ingin trekking.",
        },
        ctaWhatsappText: interest("Batur Sunrise Jeep Safari"),
        image: "jeep-volcano",
      },
    ],
    isMultiDay: false,
    published: true,
  },
  {
    slug: "jet-ski",
    title: "Jet Ski Tours",
    category: "rides",
    kicker: { ru: "01 / Прокат с гидом", en: "01 / Rides" , id: "01 / Sewa Kendaraan"},
    lead: {
      ru: "Прогулки на гидроциклах от 30 минут до 6 часов. Локации: Sanur, Jimbaran, Nusa Dua и Uluwatu.",
      en: "Jet ski rides from 30 minutes to 6 hours. Locations: Sanur, Jimbaran, Nusa Dua and Uluwatu.",
      id: "Jet ski dari 30 menit sampai 6 jam. Lokasi: Sanur, Jimbaran, Nusa Dua, dan Uluwatu.",
    },
    durationLabel: { ru: "30 мин - 6 ч", en: "30 min - 6 h" , id: "30 menit - 6 jam"},
    duration: "hours",
    priceFromIDR: null,
    includes: {
      ru: ["Прогулка от 30 минут до 6 часов", "Sanur или Jimbaran", "Nusa Dua или Uluwatu"],
      en: ["Rides from 30 minutes to 6 hours", "Sanur or Jimbaran", "Nusa Dua or Uluwatu"],
      id: ["Sesi dari 30 menit sampai 6 jam", "Sanur atau Jimbaran", "Nusa Dua atau Uluwatu"],
    },
    difficulty: null,
    badge: null,
    ctaWhatsappText: interestQuoted("Jet Ski Tours"),
    environment: "water",
    collections: [],
    image: "jet-ski",
    gallery: ["jet-ski-aerial", "uluwatu"],
    variants: [],
    isMultiDay: false,
    published: true,
  },
  {
    slug: "harley",
    title: "Harley Tours",
    category: "rides",
    kicker: { ru: "02 / Прокат с гидом", en: "02 / Rides" , id: "02 / Sewa Kendaraan"},
    lead: {
      ru: "Туры на Harley-Davidson: пять моделей на выбор, гид на маршруте, фото и видео поездки.",
      en: "Harley-Davidson tours with five models to choose from, a guide on the route, and photos and video of the ride.",
      id: "Tur Harley-Davidson dengan lima model pilihan, pemandu sepanjang rute, serta foto dan video perjalanan.",
    },
    durationLabel: onRequest,
    duration: null,
    priceFromIDR: 600_000,
    includes: {
      ru: ["5 моделей: Dyna, Sportster, Fat Bob, Heritage, Softail", "Гид", "Фото и видео"],
      en: ["5 models: Dyna, Sportster, Fat Bob, Heritage, Softail", "Guide", "Photos and video"],
      id: ["5 model: Dyna, Sportster, Fat Bob, Heritage, Softail", "Pemandu", "Foto dan video"],
    },
    difficulty: null,
    badge: null,
    ctaWhatsappText: interestQuoted("Harley Tours"),
    environment: "land",
    collections: [],
    image: "harley",
    gallery: ["coastal-ride", "ubud-terraces"],
    variants: [],
    isMultiDay: false,
    published: true,
  },
  {
    slug: "ubud-culture-day",
    title: "Ubud Culture Day",
    category: "day-tours",
    kicker: { ru: "01 / Экскурсии", en: "01 / Day Tours" , id: "01 / Wisata Harian"},
    lead: {
      ru: "Однодневный культурный маршрут по сердцу Бали: рисовые террасы, храмы, ремесленные деревни. Маршрут собирается под ваш интерес, можно выбрать из нескольких комбинаций локаций.",
      en: "A one-day cultural route through the heart of Bali: rice terraces, temples and craft villages. The route is built around your interests, with several combinations of locations to choose from.",
      id: "Rute budaya sehari melewati jantung Bali: terasering, pura, dan desa kerajinan. Rutenya disusun sesuai minat Anda, dengan beberapa kombinasi lokasi yang bisa dipilih.",
    },
    durationLabel: oneDay,
    duration: "full-day",
    priceFromIDR: 1_600_000,
    includes: {
      ru: [
        "Личный гид и трансфер на весь день",
        "Рисовые террасы Тегалаланг",
        "Храмовый комплекс на выбор",
        "Ремесленные деревни (серебро, дерево, батик)",
        "Выбор из 4 вариантов состава локаций",
      ],
      en: [
        "Private guide and transfer for the whole day",
        "Tegallalang rice terraces",
        "A temple complex of your choice",
        "Craft villages (silver, wood, batik)",
        "4 location combinations to choose from",
      ],
      id: [
        "Pemandu pribadi dan transfer seharian",
        "Terasering Tegallalang",
        "Kompleks pura pilihan Anda",
        "Desa kerajinan (perak, kayu, batik)",
        "4 kombinasi lokasi yang bisa dipilih",
      ],
    },
    difficulty: "easy",
    badge: "new",
    ctaWhatsappText: interest("Ubud Culture Day"),
    environment: "land",
    collections: [],
    image: "ubud-terraces",
    gallery: ["ubud-craft", "ubud-gate"],
    variants: [],
    isMultiDay: false,
    published: true,
  },
  {
    slug: "batur-sunrise-trekking",
    title: "Batur Sunrise Trekking",
    category: "day-tours",
    kicker: { ru: "02 / Экскурсии", en: "02 / Day Tours" , id: "02 / Wisata Harian"},
    lead: {
      ru: "Пеший подъём на вершину вулкана Батур в темноте, чтобы встретить рассвет над облаками. Потом спуск, завтрак и купание в природных горячих источниках.",
      en: "A hike to the summit of Mount Batur in the dark to watch the sunrise above the clouds, followed by the descent, breakfast and a swim in natural hot springs.",
      id: "Pendakian ke puncak Gunung Batur dalam gelap untuk menyaksikan matahari terbit di atas awan, lalu turun, sarapan, dan berendam di sumber air panas alami.",
    },
    durationLabel: { ru: "1 день, ночной старт", en: "1 day, night start" , id: "1 hari, berangkat malam"},
    duration: "full-day",
    priceFromIDR: 1_300_000,
    includes: {
      ru: [
        "Гид-проводник, фонари, трансфер",
        "Восхождение к рассвету",
        "Завтрак на вершине",
        "Купание в горячих источниках после спуска",
      ],
      en: ["Trekking guide, flashlights, transfer", "Sunrise ascent", "Breakfast at the summit", "Hot springs swim after the descent"],
      id: ["Pemandu trekking, lampu senter, transfer", "Pendakian menuju matahari terbit", "Sarapan di puncak", "Berendam air panas setelah turun"],
    },
    difficulty: "medium",
    difficultyNote: { ru: "пеший подъём около 2 часов", en: "about 2 hours of uphill hiking" , id: "sekitar 2 jam pendakian menanjak"},
    badge: null,
    ctaWhatsappText: interest("Batur Sunrise Trekking"),
    environment: "land",
    collections: [],
    image: "batur-sunrise",
    gallery: ["batur-crater", "agung-sunrise"],
    variants: [],
    isMultiDay: false,
    published: true,
  },
  {
    slug: "mount-agung-sunrise-climb",
    title: "Mount Agung Sunrise Climb",
    category: "day-tours",
    kicker: { ru: "03 / Экскурсии", en: "03 / Day Tours" , id: "03 / Wisata Harian"},
    lead: {
      ru: "Восхождение на высшую точку Бали, 3 145 метров. Для тех, кто хочет более серьёзный вызов, чем Батур: панорама на весь остров с рассветом на вершине.",
      en: "A climb to Bali's highest point at 3,145 metres. For those who want a bigger challenge than Batur: a view over the whole island with sunrise at the summit.",
      id: "Pendakian ke titik tertinggi di Bali, 3.145 meter. Untuk Anda yang ingin tantangan lebih besar daripada Batur: pemandangan seluruh pulau dengan matahari terbit di puncak.",
    },
    durationLabel: { ru: "1,5 дня, ночной выезд", en: "1.5 days, night departure" , id: "1,5 hari, berangkat malam"},
    duration: "extended",
    priceFromIDR: 2_200_000,
    includes: {
      ru: [
        "Опытный гид, снаряжение для восхождения",
        "Трансфер и логистика ночного старта",
        "Рассвет на высоте 3 145 м",
        "Панорамные виды на весь остров",
      ],
      en: [
        "Experienced guide, climbing gear",
        "Transfer and night-start logistics",
        "Sunrise at 3,145 m",
        "Panoramic views over the whole island",
      ],
      id: [
        "Pemandu berpengalaman, perlengkapan pendakian",
        "Transfer dan pengaturan keberangkatan malam",
        "Matahari terbit di ketinggian 3.145 m",
        "Pemandangan panorama seluruh pulau",
      ],
    },
    difficulty: "hard",
    difficultyNote: { ru: "требует физической подготовки", en: "requires good fitness" , id: "butuh kondisi fisik yang baik"},
    badge: null,
    ctaWhatsappText: interest("Mount Agung Sunrise Climb"),
    environment: "land",
    collections: [],
    image: "agung-sunrise",
    gallery: ["agung-clouds", "agung-gates"],
    variants: [],
    isMultiDay: false,
    published: true,
  },
  {
    slug: "temples-purification-ritual",
    title: "Temples & Purification Ritual",
    category: "day-tours",
    kicker: { ru: "04 / Экскурсии", en: "04 / Day Tours" , id: "04 / Wisata Harian"},
    lead: {
      ru: "Погружение в духовную сторону Бали: церемония очищения Мелукат в святом источнике и посещение одного из главных храмов острова.",
      en: "A journey into Bali's spiritual side: a Melukat purification ceremony at a holy spring and a visit to one of the island's main temples.",
      id: "Perjalanan ke sisi spiritual Bali: upacara penyucian Melukat di mata air suci dan kunjungan ke salah satu pura utama pulau ini.",
    },
    durationLabel: oneDay,
    duration: "full-day",
    priceFromIDR: 1_600_000,
    includes: {
      ru: [
        "Церемония Мелукат (ритуальное очищение водой)",
        "Посещение главного храмового комплекса",
        "Традиционная одежда (саронг) для входа в храм",
        "Гид, знающий культурный контекст церемоний",
      ],
      en: [
        "Melukat ceremony (ritual water purification)",
        "Visit to a major temple complex",
        "Traditional sarong for entering the temple",
        "A guide who knows the cultural context of the ceremonies",
      ],
      id: [
        "Upacara Melukat (ritual penyucian dengan air)",
        "Kunjungan ke kompleks pura besar",
        "Kain sarung tradisional untuk masuk pura",
        "Pemandu yang memahami latar budaya upacaranya",
      ],
    },
    difficulty: "easy",
    badge: "new",
    ctaWhatsappText: interest("Temples & Purification Ritual"),
    environment: "land",
    collections: [],
    image: "purification",
    gallery: ["water-temple", "ubud-gate"],
    variants: [],
    isMultiDay: false,
    published: true,
  },
  {
    slug: "east-bali-explorer",
    title: "East Bali Explorer",
    category: "day-tours",
    kicker: { ru: "05 / Экскурсии", en: "05 / Day Tours" , id: "05 / Wisata Harian"},
    lead: {
      ru: "Самые живописные точки востока острова за один день: легендарные Врата Рая, водные дворцы и смотровая площадка с видом на вулкан Агунг.",
      en: "The most scenic spots of East Bali in one day: the famous Gates of Heaven, water palaces and a viewpoint facing Mount Agung.",
      id: "Tempat-tempat terindah di Bali Timur dalam sehari: Gerbang Surga (Pura Lempuyang) yang terkenal, taman air, dan titik pandang menghadap Gunung Agung.",
    },
    durationLabel: oneDay,
    duration: "full-day",
    priceFromIDR: 1_700_000,
    includes: {
      ru: [
        "Врата Рая (Lempuyang, «Gates of Heaven»)",
        "Водный дворец Тирта Ганга",
        "Смотровая площадка с видом на Агунг",
        "Трансфер и гид на весь день",
      ],
      en: [
        "Gates of Heaven at Lempuyang",
        "Tirta Gangga water palace",
        "Viewpoint facing Mount Agung",
        "Transfer and guide for the whole day",
      ],
      id: [
        "Gerbang Surga (Pura Lempuyang)",
        "Taman air Tirta Gangga",
        "Titik pandang menghadap Gunung Agung",
        "Transfer dan pemandu seharian",
      ],
    },
    difficulty: "easy",
    badge: null,
    ctaWhatsappText: interest("East Bali Explorer"),
    environment: "land",
    collections: [],
    image: "lempuyang",
    gallery: ["tirta-gangga", "agung-gates"],
    variants: [],
    isMultiDay: false,
    published: true,
  },
  {
    slug: "bukit-peninsula-day",
    title: "Bukit Peninsula Day",
    category: "day-tours",
    kicker: { ru: "06 / Экскурсии", en: "06 / Day Tours" , id: "06 / Wisata Harian"},
    lead: {
      ru: "Однодневный маршрут по южному полуострову Букит: райский пляж, бич-клаб со стеклянным бассейном над океаном, самая высокая статуя Индонезии и закат у храма на скале.",
      en: "A one-day route around the southern Bukit Peninsula: a dream beach, a beach club with a glass pool above the ocean, Indonesia's tallest statue and sunset at a clifftop temple.",
      id: "Rute sehari keliling Semenanjung Bukit di selatan: pantai impian, beach club dengan kolam kaca di atas laut, patung tertinggi di Indonesia, dan matahari terbenam di pura di atas tebing.",
    },
    durationLabel: oneDay,
    duration: "full-day",
    priceFromIDR: 1_800_000,
    includes: {
      ru: [
        "Один из лучших пляжей полуострова",
        "Бич-клаб с инфинити или стеклянным бассейном",
        "Статуя Гаруда Вишну Кенчана",
        "Закат у храма Улувату на скале",
      ],
      en: [
        "One of the peninsula's best beaches",
        "Beach club with an infinity or glass pool",
        "Garuda Wisnu Kencana statue",
        "Sunset at the clifftop Uluwatu Temple",
      ],
      id: [
        "Salah satu pantai terbaik di semenanjung ini",
        "Beach club dengan kolam infinity atau kolam kaca",
        "Patung Garuda Wisnu Kencana",
        "Matahari terbenam di Pura Uluwatu di atas tebing",
      ],
    },
    difficulty: "easy",
    badge: null,
    ctaWhatsappText: interest("Bukit Peninsula Day"),
    environment: "land",
    collections: [],
    image: "uluwatu",
    gallery: ["bukit-cliffs", "gwk"],
    variants: [],
    isMultiDay: false,
    published: true,
  },
  {
    slug: "dolphins-waterfalls",
    title: "Dolphins & Waterfalls",
    category: "day-tours",
    kicker: { ru: "07 / Экскурсии", en: "07 / Day Tours" , id: "07 / Wisata Harian"},
    lead: {
      ru: "Поездка на север острова: утренняя лодка к диким дельфинам в открытом море и купание у одного из самых живописных водопадов Бали.",
      en: "A trip to the north of the island: a morning boat ride to wild dolphins in the open sea and a swim at one of Bali's most scenic waterfalls.",
      id: "Perjalanan ke utara pulau: naik perahu pagi-pagi menemui lumba-lumba liar di laut lepas dan berenang di salah satu air terjun terindah di Bali.",
    },
    durationLabel: { ru: "1 день, ранний старт", en: "1 day, early start" , id: "1 hari, berangkat pagi buta"},
    duration: "full-day",
    priceFromIDR: 1_800_000,
    includes: {
      ru: ["Утренний выход в море к дельфинам", "Посещение водопада, купание", "Трансфер и гид на весь день"],
      en: ["Morning boat trip to see dolphins", "Waterfall visit and swim", "Transfer and guide for the whole day"],
      id: ["Trip perahu pagi untuk melihat lumba-lumba", "Kunjungan dan berenang di air terjun", "Transfer dan pemandu seharian"],
    },
    difficulty: "easy",
    badge: null,
    ctaWhatsappText: interest("Dolphins & Waterfalls"),
    environment: "water",
    collections: [],
    image: "dolphins",
    gallery: ["waterfall", "waterfall-twin"],
    variants: [],
    isMultiDay: false,
    published: true,
  },
  {
    // A8: первый мультидневный формат, требует решения по бизнес-модели.
    // Категория условная, уточняется при публикации.
    slug: "nusa-lembongan-ceningan",
    title: "Nusa Lembongan & Ceningan",
    category: "day-tours",
    kicker: { ru: "08 / Экскурсии", en: "08 / Day Tours" , id: "08 / Wisata Harian"},
    lead: {
      ru: "Двухдневный маршрут по островам Лембонган и Ченинган: визитные локации, снорклинг, каякинг.",
      en: "A two-day route around Nusa Lembongan and Nusa Ceningan: signature spots, snorkeling and kayaking.",
      id: "Rute dua hari keliling Nusa Lembongan dan Nusa Ceningan: spot andalan, snorkeling, dan kayak.",
    },
    durationLabel: { ru: "2 дня / 1 ночь", en: "2 days / 1 night" , id: "2 hari / 1 malam"},
    duration: "extended",
    priceFromIDR: 2_600_000,
    includes: {
      ru: ["Визитные локации островов", "Снорклинг", "Каякинг"],
      en: ["Signature island spots", "Snorkeling", "Kayaking"],
      id: ["Spot andalan pulau", "Snorkeling", "Kayak"],
    },
    difficulty: null,
    badge: null,
    ctaWhatsappText: interest("Nusa Lembongan & Ceningan"),
    environment: "water",
    collections: [],
    image: "reef",
    gallery: [],
    variants: [],
    isMultiDay: true,
    published: false,
  },
  {
    // Блок C: другой остров, выходит за модель «Бали за один день».
    // Контент не пишется до решения заказчика о расширении бизнеса.
    slug: "sumba-island",
    title: "Sumba Island",
    category: "day-tours",
    kicker: { ru: "Sumba", en: "Sumba" , id: "Sumba" },
    lead: { ru: "", en: "" , id: "" },
    durationLabel: { ru: "3 дня / 2 ночи", en: "3 days / 2 nights" , id: "3 hari / 2 malam"},
    duration: "extended",
    priceFromIDR: null,
    includes: { ru: [], en: [] , id: [] },
    difficulty: null,
    badge: null,
    ctaWhatsappText: interest("Sumba Island"),
    environment: "land",
    collections: [],
    image: "sunset-boats",
    gallery: [],
    variants: [],
    isMultiDay: true,
    published: false,
  },
];

export const publishedTours: Tour[] = tours.filter((tour) => tour.published);

export function getPublishedTour(slug: string): Tour | undefined {
  return publishedTours.find((tour) => tour.slug === slug);
}

/** Сквозной номер тура в каталоге: "01" ... "17" */
export function tourNumber(tour: Tour): string {
  return String(publishedTours.indexOf(tour) + 1).padStart(2, "0");
}

export function categoryLabel(category: TourCategory, locale: Locale): string {
  return categories.find((item) => item.id === category)?.label[locale] ?? category;
}
