/**
 * Проверка индонезийской версии.
 *
 * Запускать после `npm run build`:
 *   node scripts/check-id-translations.mjs
 *
 * Что проверяет:
 *   1. На собранных /id-страницах нет кириллицы в видимом тексте. Русские оригиналы отзывов
 *      в HTML не попадают: они показываются только после нажатия «Lihat versi asli», на клиенте.
 *   2. На /id-страницах не осталось английских строк интерфейса: берём значения английского
 *      словаря, отбрасываем те, что в индонезийском словаре совпадают намеренно, и ищем остальные.
 *   3. В файлах данных нет пар en/id с одинаковым текстом — это признак непереведённой строки.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const APP = join(process.cwd(), ".next", "server", "app");
const CYRILLIC = /[А-Яа-яЁё]/;
/** Короткие строки вроде «Bali» или «ATV» совпадают в обоих языках законно */
const MIN_LENGTH = 14;
const DATA_FILES = ["data/tours.ts", "data/stories.ts", "data/reviews.ts", "data/media.ts", "lib/site.ts"];

async function htmlFiles(dir) {
  const found = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await htmlFiles(path)));
    else if (entry.name.endsWith(".html")) found.push(path);
  }
  return found;
}

const visibleText = (html) =>
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, "&")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Строковые литералы внутри блока `const <name> = {` ... `};` */
function dictionaryStrings(source, name) {
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex((line) => line.startsWith(`const ${name}`));
  if (start === -1) throw new Error(`не найден словарь ${name}`);
  const end = lines.findIndex((line, index) => index > start && line === "};");
  const block = lines.slice(start, end).join("\n");
  return new Set((block.match(/"(?:[^"\\\n]|\\.){2,}"/g) ?? []).map((value) => JSON.parse(value)));
}

const problems = [];

// 1 и 2: собранные страницы
const dictionarySource = await readFile("lib/dictionaries.ts", "utf8");
const englishOnly = [...dictionaryStrings(dictionarySource, "en")]
  .filter((value) => value.length >= MIN_LENGTH)
  .filter((value) => !dictionaryStrings(dictionarySource, "id").has(value));

const pages = (await htmlFiles(APP)).filter((path) => {
  const parts = relative(APP, path).split(sep);
  return parts[0] === "id" || parts[0] === "id.html";
});

if (pages.length === 0) {
  console.error("Собранных /id-страниц не нашлось. Сначала запусти npm run build.");
  process.exit(1);
}

for (const path of pages) {
  const page = relative(APP, path);
  const text = visibleText(await readFile(path, "utf8"));

  if (CYRILLIC.test(text)) {
    const sample = text.match(/[А-Яа-яЁё][^]{0,60}/);
    problems.push({ page, where: "кириллица", sample: sample ? sample[0].trim() : "" });
  }

  for (const value of englishOnly) {
    if (text.includes(value)) problems.push({ page, where: "английская строка интерфейса", sample: value });
  }
}

// 3: данные
for (const file of DATA_FILES) {
  const source = await readFile(file, "utf8");
  const pattern = /(\w+):\s*\{[^{}]*?en:\s*("(?:[^"\\\n]|\\.)*")\s*,\s*id:\s*("(?:[^"\\\n]|\\.)*")/g;
  for (const [, key, en, id] of source.matchAll(pattern)) {
    // имя гостя и его город не переводим — совпадение здесь законно
    if (key === "author" || key === "location") continue;
    if (en !== id) continue;
    const value = JSON.parse(en);
    if (value.length < MIN_LENGTH) continue;
    problems.push({ page: file, where: "en и id совпадают", sample: value });
  }
}

if (problems.length === 0) {
  console.log(`Индонезийская версия чистая. Проверено страниц: ${pages.length}, файлов данных: ${DATA_FILES.length}.`);
  process.exit(0);
}

console.error(`Найдено замечаний: ${problems.length}\n`);
for (const problem of problems.slice(0, 40)) {
  console.error(`  ${problem.page} — ${problem.where}`);
  console.error(`      ${problem.sample.slice(0, 100)}`);
}
process.exit(1);
