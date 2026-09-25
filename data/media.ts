import type { Locale, Localized } from "@/lib/i18n";

/**
 * Реестр фотографий сайта.
 *
 * Сейчас это ВРЕМЕННЫЕ стоковые фото Pexels (бесплатная лицензия, атрибуция
 * не обязательна: https://www.pexels.com/license/). Перед запуском их нужно
 * заменить собственными фото заказчика: положить файл в public/images/
 * и указать src: "/images/<file>.jpg". Ключи и alt-тексты менять не обязательно.
 */

export interface PhotoSource {
  src: string;
  alt: string;
  /** CSS object-position, если важная часть кадра не в центре */
  position?: string;
}

interface MediaItem {
  src: string;
  alt: Localized;
  position?: string;
  /** Страница оригинала на Pexels */
  source?: string;
}

function stock(id: number, alt: Localized, position?: string): MediaItem {
  return {
    src: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2000`,
    source: `https://www.pexels.com/photo/${id}/`,
    alt,
    position,
  };
}

export const media = {
  hero: stock(15030606, {
    ru: "Деревянная лодка у берега на закате",
    en: "A wooden boat by the shore at sunset",
    id: "Perahu kayu di tepi pantai saat matahari terbenam",
  }),
  "sunset-boats": stock(36340127, {
    ru: "Традиционные лодки на закате у берегов Бали",
    en: "Traditional boats at sunset off the coast of Bali",
    id: "Perahu tradisional saat senja di lepas pantai Bali",
  }),
  "traditional-boat": stock(39093855, {
    ru: "Традиционная лодка на пляже Бали на закате",
    en: "A traditional boat on a Bali beach at sunset",
    id: "Perahu tradisional di pantai Bali saat matahari terbenam",
  }),
  "boat-dusk": stock(36286076, {
    ru: "Лодки в сумерках на спокойной воде у Бали",
    en: "Boats at dusk on calm water in Bali",
    id: "Perahu saat senja di air yang tenang di Bali",
  }),
  "beat-boat": stock(1122462, {
    ru: "Прыжок с лодки в море",
    en: "Jumping from a boat into the sea",
    id: "Melompat dari perahu ke laut",
  }),
  "boat-turquoise": stock(8725928, {
    ru: "Лодка в бирюзовом море, вид сверху",
    en: "A boat in a turquoise sea seen from above",
    id: "Perahu di laut tosca dilihat dari atas",
  }),
  fishing: stock(3030045, {
    ru: "Лодка в открытом океане, вид сверху",
    en: "A boat in the open ocean seen from above",
    id: "Perahu di laut lepas dilihat dari atas",
  }),
  "fishing-boats": stock(36137289, {
    ru: "Рыбацкие лодки в океане на закате",
    en: "Fishing boats on the ocean at sunset",
    id: "Perahu nelayan di laut saat matahari terbenam",
  }),
  surfing: stock(4445105, {
    ru: "Серферы на волнах у побережья Бали",
    en: "Surfers riding waves off the coast of Bali",
    id: "Peselancar menaiki ombak di lepas pantai Bali",
  }),
  "surf-wave": stock(1654485, {
    ru: "Серфер заходит в трубу волны",
    en: "A surfer about to ride a wave barrel",
    id: "Peselancar bersiap masuk ke dalam ombak",
  }),
  "bukit-cliffs": stock(4534136, {
    ru: "Зелёные скалы Балангана над океаном",
    en: "The green Balangan cliffs above the ocean",
    id: "Tebing hijau Balangan di atas laut",
  }),
  snorkeling: stock(10802752, {
    ru: "Снорклинг в прозрачной морской воде",
    en: "Snorkeling in clear sea water",
    id: "Snorkeling di air laut yang jernih",
  }),
  manta: stock(7759191, {
    ru: "Манта плывёт в солнечных лучах под водой",
    en: "A manta ray swimming through sunlit water",
    id: "Pari manta berenang di air yang disinari matahari",
  }),
  reef: stock(35269346, {
    ru: "Прозрачная вода над коралловым рифом",
    en: "Clear water over a coral reef",
    id: "Air jernih di atas terumbu karang",
  }),
  kelingking: stock(6827322, {
    ru: "Пляж Келингкинг на Нуса-Пенида с высоты",
    en: "Kelingking Beach on Nusa Penida from above",
    id: "Pantai Kelingking di Nusa Penida dari atas",
  }),
  atv: stock(37585362, {
    ru: "Квадроцикл среди рисовых полей Бали",
    en: "An ATV among Bali's rice fields",
    id: "ATV di antara sawah Bali",
  }),
  "atv-river": stock(19995834, {
    ru: "Квадроцикл переезжает реку",
    en: "An ATV crossing a river",
    id: "ATV menyeberangi sungai",
  }),
  "ubud-terraces": stock(32855804, {
    ru: "Рисовые террасы Тегалаланг и пальмы",
    en: "Tegallalang rice terraces and palm trees",
    id: "Terasering Tegallalang dan pohon kelapa",
  }),
  enduro: stock(9545189, {
    ru: "Эндуро-мотоцикл на лесной тропе",
    en: "An enduro bike on a forest trail",
    id: "Motor enduro di jalur hutan",
  }),
  "enduro-trail": stock(3536269, {
    ru: "Райдер на кроссовом мотоцикле",
    en: "A rider on a dirt bike",
    id: "Pengendara di atas motor trail",
  }),
  "batur-crater": stock(35902963, {
    ru: "Вулкан Батур и кальдера с высоты",
    en: "Mount Batur and its caldera from above",
    id: "Gunung Batur dan kalderanya dari atas",
  }),
  jeep: stock(38722768, {
    ru: "Джипы на бездорожье на Бали",
    en: "Jeeps on an off-road trail in Bali",
    id: "Jeep di jalur off-road di Bali",
  }),
  "jeep-volcano": stock(36889690, {
    ru: "Джип у дымящегося вулкана",
    en: "A jeep near a steaming volcano",
    id: "Jeep di dekat gunung berapi yang berasap",
  }),
  "batur-sunrise": stock(3254728, {
    ru: "Рассвет над вулканом Батур",
    en: "Sunrise over Mount Batur",
    id: "Matahari terbit di atas Gunung Batur",
  }),
  "jet-ski": stock(18636559, {
    ru: "Гидроцикл в открытом море",
    en: "A jet ski on the open sea",
    id: "Jet ski di laut lepas",
  }),
  "jet-ski-aerial": stock(29850158, {
    ru: "Гидроцикл на бирюзовой воде, вид сверху",
    en: "A jet ski on turquoise water seen from above",
    id: "Jet ski di air tosca dilihat dari atas",
  }),
  uluwatu: stock(18609121, {
    ru: "Храм Улувату на скале над океаном",
    en: "Uluwatu Temple on a cliff above the ocean",
    id: "Pura Uluwatu di tebing di atas laut",
  }),
  harley: stock(20258883, {
    ru: "Поездка на Harley-Davidson по дороге",
    en: "Riding a Harley-Davidson on the road",
    id: "Berkendara dengan Harley-Davidson di jalan raya",
  }),
  "coastal-ride": stock(6015798, {
    ru: "Мотоцикл на извилистой дороге среди зелени Бали",
    en: "A motorcycle on a winding road through Bali's greenery",
    id: "Motor di jalan berkelok di antara hijaunya Bali",
  }),
  "riders-sunset": stock(18755364, {
    ru: "Силуэты мотоциклистов на фоне закатного неба Бали",
    en: "Motorcyclists silhouetted against the sunset sky in Bali",
    id: "Siluet pengendara motor di langit senja Bali",
  }),
  "ubud-craft": stock(32064709, {
    ru: "Балийский резчик по дереву за работой",
    en: "A Balinese wood carver at work",
    id: "Pengukir kayu Bali sedang bekerja",
  }),
  "ubud-gate": stock(33330756, {
    ru: "Резные ворота храма в Убуде",
    en: "A carved temple gateway in Ubud",
    id: "Gerbang pura berukir di Ubud",
  }),
  "agung-sunrise": stock(35753266, {
    ru: "Вулкан Агунг над облаками на рассвете",
    en: "Mount Agung above the clouds at sunrise",
    id: "Gunung Agung di atas awan saat matahari terbit",
  }),
  "agung-clouds": stock(30948081, {
    ru: "Вулкан Агунг и пальмы на рассвете",
    en: "Mount Agung and palm trees at sunrise",
    id: "Gunung Agung dan pohon kelapa saat matahari terbit",
  }),
  "agung-gates": stock(7565600, {
    ru: "Храмовые ворота с видом на вулкан Агунг",
    en: "Temple gates with Mount Agung in the distance",
    id: "Gerbang pura dengan Gunung Agung di kejauhan",
  }),
  purification: stock(17020467, {
    ru: "Ритуал очищения водой у храмовых источников",
    en: "A water purification ritual at temple spouts",
    id: "Ritual penyucian diri di pancuran pura",
  }),
  "water-temple": stock(35094737, {
    ru: "Храм отражается в воде священного источника",
    en: "A temple reflected in a sacred spring",
    id: "Pura yang terpantul di mata air suci",
  }),
  lempuyang: stock(28154007, {
    ru: "Врата Рая в храме Лемпуянг",
    en: "The Gates of Heaven at Lempuyang Temple",
    id: "Gerbang Surga di Pura Lempuyang",
  }),
  "tirta-gangga": stock(35144895, {
    ru: "Водный дворец Тирта Ганга с высоты",
    en: "Tirta Gangga water palace from above",
    id: "Taman air Tirta Gangga dari atas",
  }),
  gwk: stock(13334228, {
    ru: "Статуя Гаруда Вишну Кенчана",
    en: "The Garuda Wisnu Kencana statue",
    id: "Patung Garuda Wisnu Kencana",
  }),
  dolphins: stock(12661194, {
    ru: "Дельфины в открытом море, вид сверху",
    en: "Dolphins in the open sea seen from above",
    id: "Lumba-lumba di laut lepas dilihat dari atas",
  }),
  waterfall: stock(19137317, {
    ru: "Водопад Секумпул в джунглях Бали",
    en: "Sekumpul waterfall in the Bali jungle",
    id: "Air terjun Sekumpul di hutan Bali",
  }),
  "waterfall-twin": stock(29781197, {
    ru: "Водопады в тропических джунглях Бали",
    en: "Waterfalls in Bali's tropical jungle",
    id: "Air terjun di hutan tropis Bali",
  }),
  story: stock(20880764, {
    ru: "Путешественники встречают рассвет у вулкана Батур",
    en: "Travelers watching the sunrise over Mount Batur",
    id: "Wisatawan menyaksikan matahari terbit di Gunung Batur",
  }),
} satisfies Record<string, MediaItem>;

export type MediaKey = keyof typeof media;

export function resolveMedia(key: MediaKey, locale: Locale): PhotoSource {
  const item: MediaItem = media[key];
  return { src: item.src, alt: item.alt[locale], position: item.position };
}
