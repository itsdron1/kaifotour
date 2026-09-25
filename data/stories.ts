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
    author: { ru: "— Гость KAIFO", en: "— KAIFO guest" , id: "— KAIFO guest" },
    text: {
      ru: "Мы планировали просто съездить на Бали на неделю, но в итоге каждый день получался совершенно разным. Снорклинг, поездка к вулкану, ATV, закат на лодке — и всё без ощущения, что мы куда-то спешим. Наверное, именно таким Бали и запомнится больше всего.",
      en: "We planned just a week in Bali, but every day turned out completely different. Snorkeling, a trip to the volcano, ATVs, a sunset on a boat — and never the feeling that we were rushing anywhere. That's probably how we'll remember Bali most.",
      id: "We planned just a week in Bali, but every day turned out completely different. Snorkeling, a trip to the volcano, ATVs, a sunset on a boat — and never the feeling that we were rushing anywhere. That's probably how we'll remember Bali most.",
    },
  },
  {
    id: "moment-traditional-boat",
    kind: "moment",
    tourSlug: "traditional-boat",
    text: {
      ru: "Солнце уходит в море, на палубе накрывают ужин, а огненное шоу начинается, когда зажигаются первые звёзды.",
      en: "The sun slips into the sea, dinner is served on deck, and the fire show begins as the first stars come out.",
      id: "The sun slips into the sea, dinner is served on deck, and the fire show begins as the first stars come out.",
    },
  },
  {
    id: "moment-beat-boat",
    kind: "moment",
    tourSlug: "beat-boat",
    text: {
      ru: "Музыка на палубе, остановка в прозрачной воде и прыжок с платформы, на который рано или поздно решаются все.",
      en: "Music on deck, a swim stop in clear water, and a jump from the platform that everyone takes sooner or later.",
      id: "Music on deck, a swim stop in clear water, and a jump from the platform that everyone takes sooner or later.",
    },
  },
  {
    id: "moment-fishing",
    kind: "moment",
    tourSlug: "fishing",
    text: {
      ru: "Ранний выход, спокойное море, первая поклёвка — и обед на борту, пока снасть ждёт следующую.",
      en: "An early start, a calm sea, the first bite — and lunch on board while the line waits for the next one.",
      id: "An early start, a calm sea, the first bite — and lunch on board while the line waits for the next one.",
    },
  },
  {
    id: "moment-surfing",
    kind: "moment",
    tourSlug: "surfing",
    text: {
      ru: "Спокойный спот без толпы, гид, который читает волну, и первая волна, о которой будешь рассказывать весь вечер.",
      en: "A quiet spot away from the crowds, a guide who reads the waves, and a first ride you'll talk about all evening.",
      id: "A quiet spot away from the crowds, a guide who reads the waves, and a first ride you'll talk about all evening.",
    },
  },
  {
    id: "moment-snorkeling",
    kind: "moment",
    tourSlug: "snorkeling",
    text: {
      ru: "Опускаешь лицо в воду — и, если океан в настроении, под тобой медленно проплывает манта, будто у неё весь день впереди.",
      en: "You put your face in the water and, if the ocean is kind, a manta glides past below — slowly, as if it has all day.",
      id: "You put your face in the water and, if the ocean is kind, a manta glides past below — slowly, as if it has all day.",
    },
  },
  {
    id: "moment-atv",
    kind: "moment",
    tourSlug: "atv",
    text: {
      ru: "Брызги грязи, открытые тропы и смех, которого не слышно за рёвом моторов.",
      en: "Mud splashes, open trails, and laughter nobody can hear over the engines.",
      id: "Mud splashes, open trails, and laughter nobody can hear over the engines.",
    },
  },
  {
    id: "moment-enduro",
    kind: "moment",
    tourSlug: "enduro",
    text: {
      ru: "Чёрный вулканический песок Кинтамани под колёсами, а потом лесные дороги, где слышно только свой мотор.",
      en: "Black volcanic sand under the wheels in Kintamani, then forest roads where the only sound is your engine.",
      id: "Black volcanic sand under the wheels in Kintamani, then forest roads where the only sound is your engine.",
    },
  },
  {
    id: "moment-jeep",
    kind: "moment",
    tourSlug: "jeep",
    text: {
      ru: "Фары в темноте, подъём по склону — и солнце встаёт над Батуром прямо перед тобой.",
      en: "Headlights in the dark, a climb up the slope, and the sun rising over Batur right in front of you.",
      id: "Headlights in the dark, a climb up the slope, and the sun rising over Batur right in front of you.",
    },
  },
  {
    id: "moment-jet-ski",
    kind: "moment",
    tourSlug: "jet-ski",
    text: {
      ru: "Открытая вода, брызги в лицо и берег Бали, пролетающий мимо на полном газу.",
      en: "Open water, spray in your face, and the Bali coastline flying past at full throttle.",
      id: "Open water, spray in your face, and the Bali coastline flying past at full throttle.",
    },
  },
  {
    id: "moment-harley",
    kind: "moment",
    tourSlug: "harley",
    text: {
      ru: "Утренние дороги, низкий рокот мотора и гид, который точно знает, где остановиться ради вида.",
      en: "Morning roads, the low rumble of the engine, and a guide who knows exactly where to stop for the view.",
      id: "Morning roads, the low rumble of the engine, and a guide who knows exactly where to stop for the view.",
    },
  },
  {
    id: "moment-ubud-culture-day",
    kind: "moment",
    tourSlug: "ubud-culture-day",
    text: {
      ru: "Террасы Тегалаланга в мягком утреннем свете, потом тихий двор храма и мастера за работой.",
      en: "The terraces of Tegallalang in soft morning light, then a quiet temple courtyard and artisans at work.",
      id: "The terraces of Tegallalang in soft morning light, then a quiet temple courtyard and artisans at work.",
    },
  },
  {
    id: "moment-batur-sunrise-trekking",
    kind: "moment",
    tourSlug: "batur-sunrise-trekking",
    text: {
      ru: "Два часа подъёма в темноте с фонариком — и облака под тобой становятся розовыми.",
      en: "Two hours up in the dark by torchlight — and then the clouds below you turn pink.",
      id: "Two hours up in the dark by torchlight — and then the clouds below you turn pink.",
    },
  },
  {
    id: "moment-mount-agung-sunrise-climb",
    kind: "moment",
    tourSlug: "mount-agung-sunrise-climb",
    text: {
      ru: "Самая высокая вершина острова — и на рассвете весь Бали лежит у тебя под ногами.",
      en: "The island's highest summit, and at sunrise all of Bali lies below you.",
      id: "The island's highest summit, and at sunrise all of Bali lies below you.",
    },
  },
  {
    id: "moment-temples-purification-ritual",
    kind: "moment",
    tourSlug: "temples-purification-ritual",
    text: {
      ru: "Прохладная родниковая вода во время ритуала Мелукат и тишина, которой не ждёшь посреди дня.",
      en: "Cool spring water pouring over you during the Melukat ritual, and a stillness you don't expect in the middle of the day.",
      id: "Cool spring water pouring over you during the Melukat ritual, and a stillness you don't expect in the middle of the day.",
    },
  },
  {
    id: "moment-east-bali-explorer",
    kind: "moment",
    tourSlug: "east-bali-explorer",
    text: {
      ru: "Врата Рая, в проёме которых стоит Агунг, а потом бассейны и фонтаны Тирта Ганги.",
      en: "The Gates of Heaven framing Mount Agung, then the pools and fountains of Tirta Gangga.",
      id: "The Gates of Heaven framing Mount Agung, then the pools and fountains of Tirta Gangga.",
    },
  },
  {
    id: "moment-bukit-peninsula-day",
    kind: "moment",
    tourSlug: "bukit-peninsula-day",
    text: {
      ru: "Бирюзовый пляж под скалами, бассейн над океаном и закат у храма Улувату.",
      en: "A turquoise beach below the cliffs, a pool above the ocean, and sunset at Uluwatu temple.",
      id: "A turquoise beach below the cliffs, a pool above the ocean, and sunset at Uluwatu temple.",
    },
  },
  {
    id: "moment-dolphins-waterfalls",
    kind: "moment",
    tourSlug: "dolphins-waterfalls",
    text: {
      ru: "Рассвет в море, взгляд ищет плавники над водой, а потом прохладный водопад, после которого просыпаешься окончательно.",
      en: "Dawn on the water, eyes on the surface for fins, then a cold waterfall swim that wakes you up for good.",
      id: "Dawn on the water, eyes on the surface for fins, then a cold waterfall swim that wakes you up for good.",
    },
  },
];
