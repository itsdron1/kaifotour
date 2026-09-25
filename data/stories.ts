import type { Localized } from "@/lib/i18n";

export type StoryKind = "guest" | "moment";
export type StorySource = "google" | "instagram" | "whatsapp";

export interface Story {
  id: string;
  kind: StoryKind;
  /** slug из data/tours.ts */
  tourSlug?: string;
  text: Localized;
  /** Подпись под историей гостя, например «— Гость KAIFO» */
  author?: Localized;
  location?: string;
  source?: StorySource;
  sourceUrl?: string;
}

/**
 * Карточки для стопки в секции «Мы создаём маршруты ради моментов…».
 *
 * kind: "guest" — только настоящие истории гостей, дословно и с их согласия на публикацию.
 * Выдуманных историй, имён и цитат здесь быть не должно: посетитель читает их как слова живого человека.
 * Новая настоящая история встаёт в начало массива.
 *
 * kind: "moment" — сцена с маршрута от лица KAIFO: без кавычек и без имени гостя, это не отзыв.
 * По одной на каждый опубликованный тур, в порядке data/tours.ts.
 */
export const stories: Story[] = [
  {
    id: "guest-week-in-bali",
    kind: "guest",
    author: { ru: "— Гость KAIFO", en: "— KAIFO guest" , id: "— Tamu KAIFO"},
    text: {
      ru: "Мы планировали просто съездить на Бали на неделю, но в итоге каждый день получался совершенно разным. Снорклинг, поездка к вулкану, ATV, закат на лодке — и всё без ощущения, что мы куда-то спешим. Наверное, именно таким Бали и запомнится больше всего.",
      en: "We planned just a week in Bali, but every day turned out completely different. Snorkeling, a trip to the volcano, ATVs, a sunset on a boat — and never the feeling that we were rushing anywhere. That's probably how we'll remember Bali most.",
      id: "Kami hanya berencana seminggu di Bali, tetapi setiap hari ternyata benar-benar berbeda. Snorkeling, perjalanan ke gunung berapi, ATV, matahari terbenam di atas kapal — dan tidak sekali pun terasa terburu-buru. Mungkin begitulah Bali akan paling kami kenang.",
    },
  },
  {
    id: "moment-traditional-boat",
    kind: "moment",
    tourSlug: "traditional-boat",
    text: {
      ru: "Солнце уходит в море, на палубе накрывают ужин, а огненное шоу начинается, когда зажигаются первые звёзды.",
      en: "The sun slips into the sea, dinner is served on deck, and the fire show begins as the first stars come out.",
      id: "Matahari turun ke laut, makan malam disajikan di dek, dan fire show dimulai saat bintang pertama muncul.",
    },
  },
  {
    id: "moment-beat-boat",
    kind: "moment",
    tourSlug: "beat-boat",
    text: {
      ru: "Музыка на палубе, остановка в прозрачной воде и прыжок с платформы, на который рано или поздно решаются все.",
      en: "Music on deck, a swim stop in clear water, and a jump from the platform that everyone takes sooner or later.",
      id: "Musik di dek, berhenti berenang di air jernih, dan lompatan dari menara yang cepat atau lambat dicoba semua orang.",
    },
  },
  {
    id: "moment-fishing",
    kind: "moment",
    tourSlug: "fishing",
    text: {
      ru: "Ранний выход, спокойное море, первая поклёвка — и обед на борту, пока снасть ждёт следующую.",
      en: "An early start, a calm sea, the first bite — and lunch on board while the line waits for the next one.",
      id: "Berangkat pagi buta, laut yang tenang, sambaran pertama — lalu makan siang di kapal sementara pancing menunggu yang berikutnya.",
    },
  },
  {
    id: "moment-surfing",
    kind: "moment",
    tourSlug: "surfing",
    text: {
      ru: "Спокойный спот без толпы, гид, который читает волну, и первая волна, о которой будешь рассказывать весь вечер.",
      en: "A quiet spot away from the crowds, a guide who reads the waves, and a first ride you'll talk about all evening.",
      id: "Spot tenang jauh dari keramaian, pemandu yang paham ombak, dan ombak pertama yang akan Anda ceritakan sepanjang malam.",
    },
  },
  {
    id: "moment-snorkeling",
    kind: "moment",
    tourSlug: "snorkeling",
    text: {
      ru: "Опускаешь лицо в воду — и, если океан в настроении, под тобой медленно проплывает манта, будто у неё весь день впереди.",
      en: "You put your face in the water and, if the ocean is kind, a manta glides past below — slowly, as if it has all day.",
      id: "Anda benamkan wajah ke air dan, kalau laut sedang baik, seekor pari manta melintas pelan di bawah, seolah punya waktu seharian.",
    },
  },
  {
    id: "moment-atv",
    kind: "moment",
    tourSlug: "atv",
    text: {
      ru: "Брызги грязи, открытые тропы и смех, которого не слышно за рёвом моторов.",
      en: "Mud splashes, open trails, and laughter nobody can hear over the engines.",
      id: "Cipratan lumpur, jalur terbuka, dan tawa yang tenggelam oleh suara mesin.",
    },
  },
  {
    id: "moment-enduro",
    kind: "moment",
    tourSlug: "enduro",
    text: {
      ru: "Чёрный вулканический песок Кинтамани под колёсами, а потом лесные дороги, где слышно только свой мотор.",
      en: "Black volcanic sand under the wheels in Kintamani, then forest roads where the only sound is your engine.",
      id: "Pasir vulkanik hitam Kintamani di bawah roda, lalu jalan hutan tempat yang terdengar hanya mesin Anda sendiri.",
    },
  },
  {
    id: "moment-jeep",
    kind: "moment",
    tourSlug: "jeep",
    text: {
      ru: "Фары в темноте, подъём по склону — и солнце встаёт над Батуром прямо перед тобой.",
      en: "Headlights in the dark, a climb up the slope, and the sun rising over Batur right in front of you.",
      id: "Lampu sorot dalam gelap, tanjakan di lereng — dan matahari terbit di atas Batur tepat di depan Anda.",
    },
  },
  {
    id: "moment-jet-ski",
    kind: "moment",
    tourSlug: "jet-ski",
    text: {
      ru: "Открытая вода, брызги в лицо и берег Бали, пролетающий мимо на полном газу.",
      en: "Open water, spray in your face, and the Bali coastline flying past at full throttle.",
      id: "Laut lepas, cipratan air di wajah, dan garis pantai Bali yang melesat melewati Anda.",
    },
  },
  {
    id: "moment-harley",
    kind: "moment",
    tourSlug: "harley",
    text: {
      ru: "Утренние дороги, низкий рокот мотора и гид, который точно знает, где остановиться ради вида.",
      en: "Morning roads, the low rumble of the engine, and a guide who knows exactly where to stop for the view.",
      id: "Jalan pagi, deru mesin yang rendah, dan pemandu yang tahu persis di mana harus berhenti demi pemandangan.",
    },
  },
  {
    id: "moment-ubud-culture-day",
    kind: "moment",
    tourSlug: "ubud-culture-day",
    text: {
      ru: "Террасы Тегалаланга в мягком утреннем свете, потом тихий двор храма и мастера за работой.",
      en: "The terraces of Tegallalang in soft morning light, then a quiet temple courtyard and artisans at work.",
      id: "Terasering Tegallalang dalam cahaya pagi yang lembut, lalu halaman pura yang tenang dan para perajin yang sedang bekerja.",
    },
  },
  {
    id: "moment-batur-sunrise-trekking",
    kind: "moment",
    tourSlug: "batur-sunrise-trekking",
    text: {
      ru: "Два часа подъёма в темноте с фонариком — и облака под тобой становятся розовыми.",
      en: "Two hours up in the dark by torchlight — and then the clouds below you turn pink.",
      id: "Dua jam mendaki dalam gelap dengan lampu kepala — lalu awan di bawah Anda berubah merah muda.",
    },
  },
  {
    id: "moment-mount-agung-sunrise-climb",
    kind: "moment",
    tourSlug: "mount-agung-sunrise-climb",
    text: {
      ru: "Самая высокая вершина острова — и на рассвете весь Бали лежит у тебя под ногами.",
      en: "The island's highest summit, and at sunrise all of Bali lies below you.",
      id: "Puncak tertinggi di pulau ini, dan saat matahari terbit seluruh Bali terhampar di bawah Anda.",
    },
  },
  {
    id: "moment-temples-purification-ritual",
    kind: "moment",
    tourSlug: "temples-purification-ritual",
    text: {
      ru: "Прохладная родниковая вода во время ритуала Мелукат и тишина, которой не ждёшь посреди дня.",
      en: "Cool spring water pouring over you during the Melukat ritual, and a stillness you don't expect in the middle of the day.",
      id: "Air mata air yang dingin mengguyur Anda dalam ritual Melukat, dan ketenangan yang tak Anda duga di tengah hari.",
    },
  },
  {
    id: "moment-east-bali-explorer",
    kind: "moment",
    tourSlug: "east-bali-explorer",
    text: {
      ru: "Врата Рая, в проёме которых стоит Агунг, а потом бассейны и фонтаны Тирта Ганги.",
      en: "The Gates of Heaven framing Mount Agung, then the pools and fountains of Tirta Gangga.",
      id: "Gerbang Surga (Pura Lempuyang) membingkai Gunung Agung, lalu kolam dan air mancur Tirta Gangga.",
    },
  },
  {
    id: "moment-bukit-peninsula-day",
    kind: "moment",
    tourSlug: "bukit-peninsula-day",
    text: {
      ru: "Бирюзовый пляж под скалами, бассейн над океаном и закат у храма Улувату.",
      en: "A turquoise beach below the cliffs, a pool above the ocean, and sunset at Uluwatu temple.",
      id: "Pantai tosca di bawah tebing, kolam di atas laut, dan matahari terbenam di Pura Uluwatu.",
    },
  },
  {
    id: "moment-dolphins-waterfalls",
    kind: "moment",
    tourSlug: "dolphins-waterfalls",
    text: {
      ru: "Рассвет в море, взгляд ищет плавники над водой, а потом прохладный водопад, после которого просыпаешься окончательно.",
      en: "Dawn on the water, eyes on the surface for fins, then a cold waterfall swim that wakes you up for good.",
      id: "Fajar di laut, mata mencari sirip di permukaan, lalu air terjun dingin yang membuat Anda benar-benar terjaga.",
    },
  },
];
