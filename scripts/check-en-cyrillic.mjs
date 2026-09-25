/**
 * Проверка английской версии на кириллицу.
 *
 * Запускать после `npm run build`: скрипт проходит по собранным страницам в .next/server/app,
 * берёт английские (всё, что не под /ru), вырезает <script>, <style> и теги и ищет в оставшемся
 * видимом тексте русские буквы. Заодно смотрит <title> и meta description — их видно в выдаче.
 *
 * Оригиналы отзывов на русском в EN-страницы не попадают: они показываются только после нажатия
 * «Show original», то есть на клиенте, поэтому в собранном HTML их быть не должно.
 *
 *   node scripts/check-en-cyrillic.mjs
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const ROOT = join(process.cwd(), ".next", "server", "app");
const CYRILLIC = /[А-Яа-яЁё]/;

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

/** Русская версия живёт под /ru — её не проверяем */
const isRussianPage = (path) => {
  const parts = relative(ROOT, path).split(sep);
  return parts[0] === "ru" || parts[0] === "ru.html";
};

const visibleText = (html) =>
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const snippets = (text) => {
  const found = [];
  const pattern = /[А-Яа-яЁё][^]{0,60}/g;
  let match;
  while ((match = pattern.exec(text)) !== null && found.length < 3) {
    found.push(match[0].trim());
    pattern.lastIndex = match.index + match[0].length;
  }
  return found;
};

const files = (await htmlFiles(ROOT)).filter((path) => !isRussianPage(path));

if (files.length === 0) {
  console.error("Собранных страниц не нашлось. Сначала запусти npm run build.");
  process.exit(1);
}

const problems = [];

for (const path of files) {
  const html = await readFile(path, "utf8");
  const page = relative(ROOT, path);

  const text = visibleText(html);
  if (CYRILLIC.test(text)) problems.push({ page, where: "видимый текст", samples: snippets(text) });

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  if (CYRILLIC.test(title)) problems.push({ page, where: "<title>", samples: [title.trim()] });

  const description = html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? "";
  if (CYRILLIC.test(description)) problems.push({ page, where: "meta description", samples: [description.trim()] });
}

if (problems.length === 0) {
  console.log(`Кириллицы на английских страницах нет. Проверено страниц: ${files.length}.`);
  process.exit(0);
}

console.error(`Кириллица на английских страницах (проверено ${files.length}):\n`);
for (const problem of problems) {
  console.error(`  ${problem.page} — ${problem.where}`);
  for (const sample of problem.samples) console.error(`      ${sample}`);
}
process.exit(1);
