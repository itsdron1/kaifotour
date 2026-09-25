/**
 * Собирает docs/translations-id-review.md — таблицу «где на сайте | EN | ID» для вычитки.
 *
 *   node scripts/build-id-review-doc.mjs
 *
 * Английский и индонезийский словари устроены одинаково (индонезийский сделан копией
 * английского и переведён на месте), поэтому строки сопоставляются попарно по порядку.
 * В файлах данных пара берётся по соседним ключам en и id внутри одного объекта.
 */
import { readFile, writeFile } from "node:fs/promises";

const OUT = "docs/translations-id-review.md";

const escapeCell = (value) => value.replace(/\|/g, String.fromCharCode(92) + "|").replace(/\r?\n/g, " ");

/** Строки вида `ключ: "значение"` внутри блока словаря, с путём до ключа */
function dictionaryRows(source, name) {
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex((line) => line.startsWith(`const ${name}`));
  const end = lines.findIndex((line, index) => index > start && line === "};");
  const rows = [];
  const path = [];
  let depth = 0;
  /** Длинные значения записаны на следующей строке после `ключ:` */
  let pendingKey = null;

  for (const line of lines.slice(start + 1, end)) {
    const trimmed = line.trim();
    const wrapped = trimmed.match(/^(\w+):$/);
    if (wrapped) {
      pendingKey = wrapped[1];
      continue;
    }
    const opening = trimmed.match(/^(\w+):\s*[{[]$/);
    if (opening) {
      path[depth] = opening[1];
      depth += 1;
      continue;
    }
    // безымянный объект внутри массива: держим глубину, чтобы путь не сбивался
    if (trimmed === "{") {
      path[depth] = null;
      depth += 1;
      continue;
    }
    if (/^[}\]],?$/.test(trimmed)) {
      depth = Math.max(0, depth - 1);
      path.length = depth;
      continue;
    }
    const pair = trimmed.match(/^(\w+):\s*"((?:[^"\\]|\\.)*)",?$/);
    if (pair) {
      const key = [...path.slice(0, depth), pair[1]].filter(Boolean).join(".");
      rows.push({ key, value: JSON.parse(`"${pair[2]}"`) });
      continue;
    }
    const bare = trimmed.match(/^"((?:[^"\\]|\\.)*)",?$/);
    if (bare) {
      const key = [...path.slice(0, depth), pendingKey].filter(Boolean).join(".");
      rows.push({ key, value: JSON.parse(`"${bare[1]}"`) });
      pendingKey = null;
    }
  }
  return rows;
}

/**
 * Пары en/id в файлах данных. Значения бывают на одной строке, на разных строках
 * и списками, поэтому идём построчно и держим последний встреченный ключ для подписи.
 */
function dataRows(source) {
  const rows = [];
  const lines = source.split(/\r?\n/);
  let context = "";
  let pendingEn = null;
  let collecting = null;

  const strings = (text) => (text.match(/"(?:[^"\\\n]|\\.)*"/g) ?? []).map((value) => JSON.parse(value));

  for (const line of lines) {
    const trimmed = line.trim();

    if (collecting) {
      if (trimmed.startsWith("]")) {
        const items = strings(collecting.buffer);
        if (collecting.lang === "en") pendingEn = items;
        else if (Array.isArray(pendingEn)) {
          pendingEn.forEach((value, index) =>
            rows.push({ key: `${context}[${index}]`, en: value, id: items[index] ?? "" }),
          );
          pendingEn = null;
        }
        collecting = null;
        continue;
      }
      collecting.buffer += line;
      continue;
    }

    const named = trimmed.match(/^"?([\w-]+)"?:\s*(stock\(|\{|$)/);
    if (named) context = named[1];
    const slug = trimmed.match(/^slug:\s*"([\w-]+)"/);
    if (slug) context = slug[1];

    const inline = trimmed.match(/en:\s*("(?:[^"\\\n]|\\.)*")\s*,\s*id:\s*("(?:[^"\\\n]|\\.)*")/);
    if (inline) {
      rows.push({ key: context, en: JSON.parse(inline[1]), id: JSON.parse(inline[2]) });
      continue;
    }

    const inlineList = trimmed.match(/^(en|id):\s*\[(.*)\],?$/);
    if (inlineList) {
      const items = strings(inlineList[2]);
      if (inlineList[1] === "en") pendingEn = items;
      else if (Array.isArray(pendingEn)) {
        pendingEn.forEach((value, index) => rows.push({ key: `${context}[${index}]`, en: value, id: items[index] ?? "" }));
        pendingEn = null;
      }
      continue;
    }

    const listStart = trimmed.match(/^(en|id):\s*\[$/);
    if (listStart) {
      collecting = { lang: listStart[1], buffer: "" };
      continue;
    }

    const value = trimmed.match(/^(en|id):\s*("(?:[^"\\\n]|\\.)*"),?$/);
    if (!value) continue;
    if (value[1] === "en") pendingEn = JSON.parse(value[2]);
    else if (typeof pendingEn === "string") {
      rows.push({ key: context, en: pendingEn, id: JSON.parse(value[2]) });
      pendingEn = null;
    }
  }
  return rows;
}

const dictionarySource = await readFile("lib/dictionaries.ts", "utf8");
const enRows = dictionaryRows(dictionarySource, "en");
const idRows = dictionaryRows(dictionarySource, "id");
if (enRows.length !== idRows.length) {
  console.error(`Словари разошлись по числу строк: en ${enRows.length}, id ${idRows.length}`);
  process.exit(1);
}

const sections = {
  meta: "Метаданные страниц",
  a11y: "Подписи для скринридеров",
  nav: "Меню",
  cta: "Кнопки",
  whatsapp: "Готовые сообщения в WhatsApp",
  price: "Цены",
  hero: "Первый экран",
  ride: "Секция «Одна страна, сотни маршрутов»",
  catalog: "Каталог и фильтры",
  tour: "Страница тура",
  about: "О нас и «Почему KAIFO?»",
  stories: "Секция историй",
  reviews: "Отзывы",
  faq: "Вопросы и ответы",
  plan: "Форма «Спланируйте поездку»",
  footer: "Футер",
  legal: "Юридические страницы",
  notFound: "Страница 404",
};

let out = `# Перевод на индонезийский: файл для вычитки

Таблицы собраны из кода командой \`node scripts/build-id-review-doc.mjs\`, поэтому всегда совпадают с сайтом.
Правки удобно присылать строками «было → стало»: Claude Code заменит их в \`lib/dictionaries.ts\` и файлах данных.

Тон перевода: вежливое «Anda». Не переводятся KAIFO, названия туров-продуктов (Traditional Boat, Beat Boat, ATV,
Enduro, Jeep Tours, Jet Ski, Harley Tours), географические названия и названия сервисов (WhatsApp, Instagram, Google).

`;

let current = null;
for (const [index, row] of enRows.entries()) {
  const section = row.key.split(".")[0];
  if (section !== current) {
    current = section;
    out += `\n## ${sections[section] ?? section}\n\n| Ключ | EN | ID |\n|---|---|---|\n`;
  }
  out += `| \`${row.key}\` | ${escapeCell(row.value)} | ${escapeCell(idRows[index].value)} |\n`;
}

const dataFiles = [
  ["data/tours.ts", "Туры: кикеры, описания, длительность, что включено"],
  ["data/stories.ts", "Карточки историй и сцен с маршрутов"],
  ["data/reviews.ts", "Отзывы гостей (перевод, оригинал остаётся на своём языке)"],
  ["data/media.ts", "Alt-тексты фотографий"],
  ["lib/site.ts", "Адрес точки"],
];

for (const [file, title] of dataFiles) {
  const rows = dataRows(await readFile(file, "utf8"));
  if (rows.length === 0) continue;
  out += `\n## ${title}\n\n| Поле | EN | ID |\n|---|---|---|\n`;
  for (const row of rows) out += `| \`${row.key}\` | ${escapeCell(row.en)} | ${escapeCell(row.id)} |\n`;
}

out += `
## Места, где я сомневался

- **«Sewa Kendaraan» для категории Rides.** В английской версии это «Rides» — прокат техники с пемanду.
  Возможно, ближе «Sewa dengan Pemandu», но для бейджа категории это длинно.
- **«Trip kapal» против «Perjalanan dengan perahu».** Выбрал короткое «trip», как в разговорной речи балийских операторов.
- **«Wisata Harian» для Day Tours.** Альтернатива — «Tur Harian»; выбрал «Wisata», чтобы не путалось с «Tur» в меню.
- **«Fire show» оставил как есть** — на Бали так и пишут в программах, но можно заменить на «pertunjukan api».
- **«Spot» в описаниях серфинга и снорклинга** — англицизм, привычный в туризме; заменить на «lokasi», если режет глаз.
- **«Jeda / Putar» для паузы и продолжения показа карточек** — короткие формы для кнопок, проверьте на слух.
- **«Gerbang Surga (Pura Lempuyang)»** — как в промте; в тексте тура и в карточке момента одинаково.
- **Шутка в отзыве Станислава** («доволен так как слоны не бывают довольны») передана смыслом:
  «saya puas sampai gajah pun tidak sepuas itu». Дословный перевод звучал бы странно.
- **«Anda» во всех текстах гостей.** В отзывах гость говорит о себе, поэтому там «saya», а обращение «Anda»
  осталось только в текстах от лица KAIFO.
`;

await writeFile(OUT, out);
console.log(`${OUT}: строк словаря ${enRows.length}, разделов данных ${dataFiles.length}`);
