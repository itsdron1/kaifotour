import type { Locale } from "@/lib/i18n";

export type ReviewSource = "google" | "instagram" | "whatsapp" | "tripadvisor";

export interface Review {
  id: string;
  author: string;
  /** Страна или город гостя */
  location?: string;
  /** slug тура из data/tours.ts, если отзыв о конкретном маршруте */
  tourSlug?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** Язык оригинала: текст показываем как есть, с атрибутом lang */
  lang: Locale;
  /** ГГГГ-ММ */
  date: string;
  source: ReviewSource;
  sourceUrl?: string;
  /** Текст на карточке — перевод Google, а не слова гостя на языке оригинала */
  translated?: boolean;
}

/**
 * Отзывы гостей.
 *
 * Здесь только реальные отзывы, опубликованные с согласия гостя, слово в слово.
 * Примерных, тестовых и придуманных отзывов быть не должно даже как заглушек.
 *
 * Эти пять выписаны вручную 24.09.2026 с профиля KAIFO Bali | Tours & Activities
 * в Google Картах, как они там показаны. Когда в окружении появятся GOOGLE_PLACE_ID
 * и GOOGLE_PLACES_API_KEY, те же отзывы придут через API свежими и с ссылками
 * на профили авторов — тогда этот список можно очистить (см. lib/google-reviews.ts).
 */
export const reviews: Review[] = [
  {
    id: "google-lilia-golubina",
    author: "Lilia Golubina",
    rating: 5,
    text: "Отличная прогулка на лодке - всё было организовано идеально. Друзьям очень понравилось, впечатлений масса. Спасибо 😻",
    lang: "ru",
    date: "2026-09",
    source: "google",
    sourceUrl: "https://maps.app.goo.gl/1shMasnjWcpmkR2b9",
  },
  {
    id: "google-andrey-antonov",
    author: "Андрей Антонов",
    tourSlug: "batur-sunrise-trekking",
    rating: 5,
    text: "Поход на рассвете в Батур — обязательное мероприятие на Бали! 🌋 Мы начали до рассвета, шли около двух часов с налобными фонарями — проще, чем кажется, тропа хорошо размечена, а гид поддерживал мотивацию всех. На вершине: невероятный рассвет над облаками с кратером прямо перед вами. Стоило каждой минуты этого подъема в 2 часа ночи. На завтрак даже подают яйца, сваренные на вулканическом пару — забавная мелочь. В целом отличная организация, гиды, которые явно знают маршрут, трансфер из отеля и обратно включен. Настоятельно рекомендую, если вы хотите увидеть один незабываемый рассвет за всю свою поездку 🌅",
    lang: "ru",
    date: "2026-08",
    source: "google",
    sourceUrl: "https://maps.app.goo.gl/1shMasnjWcpmkR2b9",
    translated: true,
  },
  {
    id: "google-stanislav-morozov",
    author: "Stanislav Morozov",
    tourSlug: "fishing",
    rating: 5,
    text: "Привет, рыбалка огонь, доволен так как слоны не бывают довольны, огромное спасибо, благоденствия и процветания, ждите скоро ещё приеду!!!",
    lang: "ru",
    date: "2026-08",
    source: "google",
    sourceUrl: "https://maps.app.goo.gl/1shMasnjWcpmkR2b9",
    translated: true,
  },
  {
    id: "google-alexandr-gridin",
    author: "Александр Гридин",
    tourSlug: "fishing",
    rating: 5,
    text: "Отличный опыт, с семьёй ездили на рыбалку, всё было очень Круто!!! Спасибо большое организаторам.",
    lang: "ru",
    date: "2026-08",
    source: "google",
    sourceUrl: "https://maps.app.goo.gl/1shMasnjWcpmkR2b9",
    translated: true,
  },
  {
    id: "google-johnny-lullaby",
    author: "johnny lullaby",
    tourSlug: "fishing",
    rating: 5,
    text: "Заезжал к ребятам на рыбалку, шикарно нарыбачились! Спасибо большое KAIFO Bali!!",
    lang: "ru",
    date: "2026-08",
    source: "google",
    sourceUrl: "https://maps.app.goo.gl/1shMasnjWcpmkR2b9",
    translated: true,
  },
];
