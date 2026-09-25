import type { Locale, Localized } from "@/lib/i18n";

export type ReviewSource = "google" | "instagram" | "whatsapp" | "tripadvisor";

export interface Review {
  id: string;
  /** Имя гостя: кириллическое имя на английской версии пишем латиницей, латинское не трогаем */
  author: Localized;
  /** Страна или город гостя */
  location?: Localized;
  /** slug тура из data/tours.ts, если отзыв о конкретном маршруте */
  tourSlug?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** Текст на обоих языках: на языке оригинала — дословно, второй язык — наш перевод */
  text: Localized;
  /** На каком языке гость написал отзыв */
  originalLang: Locale;
  /** ГГГГ-ММ */
  date: string;
  source: ReviewSource;
  sourceUrl?: string;
}

/**
 * Отзывы гостей.
 *
 * Здесь только реальные отзывы, опубликованные с согласия гостя, слово в слово.
 * Примерных, тестовых и придуманных отзывов быть не должно даже как заглушек.
 *
 * Эти пять выписаны вручную 24.09.2026 с профиля KAIFO Bali | Tours & Activities
 * в Google Картах, как они там показаны. Русский текст — оригинал в нашем списке,
 * английский — наш перевод: тот же смысл и тон, без «улучшений».
 *
 * Когда в окружении появятся GOOGLE_PLACE_ID и GOOGLE_PLACES_API_KEY, те же отзывы
 * придут через API на языке страницы и с ссылками на профили авторов — тогда этот
 * список можно очистить (см. lib/google-reviews.ts).
 */
export const reviews: Review[] = [
  {
    id: "google-lilia-golubina",
    author: { ru: "Lilia Golubina", en: "Lilia Golubina" , id: "Lilia Golubina" },
    rating: 5,
    text: {
      ru: "Отличная прогулка на лодке - всё было организовано идеально. Друзьям очень понравилось, впечатлений масса. Спасибо 😻",
      en: "A great boat trip - everything was organized perfectly. My friends really liked it, so many impressions. Thank you 😻",
      id: "A great boat trip - everything was organized perfectly. My friends really liked it, so many impressions. Thank you 😻",
    },
    originalLang: "ru",
    date: "2026-09",
    source: "google",
    sourceUrl: "https://maps.app.goo.gl/1shMasnjWcpmkR2b9",
  },
  {
    id: "google-andrey-antonov",
    author: { ru: "Андрей Антонов", en: "Andrey Antonov" , id: "Andrey Antonov" },
    tourSlug: "batur-sunrise-trekking",
    rating: 5,
    text: {
      ru: "Поход на рассвете в Батур — обязательное мероприятие на Бали! 🌋 Мы начали до рассвета, шли около двух часов с налобными фонарями — проще, чем кажется, тропа хорошо размечена, а гид поддерживал мотивацию всех. На вершине: невероятный рассвет над облаками с кратером прямо перед вами. Стоило каждой минуты этого подъема в 2 часа ночи. На завтрак даже подают яйца, сваренные на вулканическом пару — забавная мелочь. В целом отличная организация, гиды, которые явно знают маршрут, трансфер из отеля и обратно включен. Настоятельно рекомендую, если вы хотите увидеть один незабываемый рассвет за всю свою поездку 🌅",
      en: "The sunrise hike up Batur is a must-do in Bali! 🌋 We started before dawn and walked for about two hours with headlamps — easier than it sounds, the trail is well marked and the guide kept everyone motivated. At the top: an incredible sunrise above the clouds with the crater right in front of you. Worth every minute of that 2 a.m. climb. For breakfast they even serve eggs cooked in volcanic steam — a fun little detail. Overall great organization, guides who clearly know the route, hotel transfer both ways included. Strongly recommend it if you want to see one unforgettable sunrise on your whole trip 🌅",
      id: "The sunrise hike up Batur is a must-do in Bali! 🌋 We started before dawn and walked for about two hours with headlamps — easier than it sounds, the trail is well marked and the guide kept everyone motivated. At the top: an incredible sunrise above the clouds with the crater right in front of you. Worth every minute of that 2 a.m. climb. For breakfast they even serve eggs cooked in volcanic steam — a fun little detail. Overall great organization, guides who clearly know the route, hotel transfer both ways included. Strongly recommend it if you want to see one unforgettable sunrise on your whole trip 🌅",
    },
    originalLang: "ru",
    date: "2026-08",
    source: "google",
    sourceUrl: "https://maps.app.goo.gl/1shMasnjWcpmkR2b9",
  },
  {
    id: "google-stanislav-morozov",
    author: { ru: "Stanislav Morozov", en: "Stanislav Morozov" , id: "Stanislav Morozov" },
    tourSlug: "fishing",
    rating: 5,
    text: {
      ru: "Привет, рыбалка огонь, доволен так как слоны не бывают довольны, огромное спасибо, благоденствия и процветания, ждите скоро ещё приеду!!!",
      en: "Hi, the fishing was fire, I'm happier than elephants ever get, huge thanks, wishing you well-being and prosperity, expect me back soon!!!",
      id: "Hi, the fishing was fire, I'm happier than elephants ever get, huge thanks, wishing you well-being and prosperity, expect me back soon!!!",
    },
    originalLang: "ru",
    date: "2026-08",
    source: "google",
    sourceUrl: "https://maps.app.goo.gl/1shMasnjWcpmkR2b9",
  },
  {
    id: "google-alexandr-gridin",
    author: { ru: "Александр Гридин", en: "Alexandr Gridin" , id: "Alexandr Gridin" },
    tourSlug: "fishing",
    rating: 5,
    text: {
      ru: "Отличный опыт, с семьёй ездили на рыбалку, всё было очень Круто!!! Спасибо большое организаторам.",
      en: "A great experience, we went fishing with the family, everything was very Cool!!! Big thanks to the organizers.",
      id: "A great experience, we went fishing with the family, everything was very Cool!!! Big thanks to the organizers.",
    },
    originalLang: "ru",
    date: "2026-08",
    source: "google",
    sourceUrl: "https://maps.app.goo.gl/1shMasnjWcpmkR2b9",
  },
  {
    id: "google-johnny-lullaby",
    author: { ru: "johnny lullaby", en: "johnny lullaby" , id: "johnny lullaby" },
    tourSlug: "fishing",
    rating: 5,
    text: {
      ru: "Заезжал к ребятам на рыбалку, шикарно нарыбачились! Спасибо большое KAIFO Bali!!",
      en: "Stopped by the guys for a fishing trip, the fishing was superb! Big thanks to KAIFO Bali!!",
      id: "Stopped by the guys for a fishing trip, the fishing was superb! Big thanks to KAIFO Bali!!",
    },
    originalLang: "ru",
    date: "2026-08",
    source: "google",
    sourceUrl: "https://maps.app.goo.gl/1shMasnjWcpmkR2b9",
  },
];
