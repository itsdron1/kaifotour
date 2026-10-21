/**
 * Проверка метатегов и контактов на собранных страницах.
 *
 * Запускать после `npm run build`:
 *   node scripts/check-meta.mjs
 *
 * Проверяет:
 *   - в <title>, description, og:* и twitter:* нет «&nbsp;» текстом и двойного экранирования
 *     (неразрывный пробел в данных пишется как  , React выводит его символом);
 *   - og:locale совпадает с языком страницы, а og:locale:alternate — ровно два других языка;
 *   - почта в видимом тексте стоит только ссылкой mailto:.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const APP = join(process.cwd(), ".next", "server", "app");
const EMAIL = "kaifotourbali@gmail.com";
const OG_LOCALES = { en: "en_US", ru: "ru_RU", id: "id_ID" };

async function htmlFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await htmlFiles(path)));
    else if (entry.name.endsWith(".html")) found.push(path);
  }
  return found;
}

const problems = [];
let pages = 0;

for (const file of await htmlFiles(APP)) {
  const page = relative(APP, file);
  if (/^_(not-found|global-error)/.test(page) || page.includes(`${sep}_not-found`)) continue;
  const html = await readFile(file, "utf8");
  const head = html.slice(0, html.indexOf("</head>"));
  if (!head.includes('property="og:locale"')) continue;
  pages++;

  const metaTexts = [
    ...head.matchAll(/<title>([\s\S]*?)<\/title>/g),
    ...head.matchAll(/<meta (?:name|property)="(?:description|og:[a-z_:]+|twitter:[a-z]+)" content="([^"]*)"/g),
  ].map((match) => match[1]);
  for (const text of metaTexts) {
    if (/&amp;(?:nbsp|amp|#\d+);|&nbsp;/.test(text)) problems.push(`${page}: в метатеге «&nbsp;» или двойное экранирование: ${text}`);
  }

  const locale = page.startsWith(`ru${sep}`) || page === "ru.html" ? "ru" : page.startsWith(`id${sep}`) || page === "id.html" ? "id" : "en";
  const current = head.match(/property="og:locale" content="([^"]+)"/)?.[1];
  const alternates = [...head.matchAll(/property="og:locale:alternate" content="([^"]+)"/g)].map((match) => match[1]).sort();
  const expected = Object.entries(OG_LOCALES).filter(([key]) => key !== locale).map(([, value]) => value).sort();
  if (current !== OG_LOCALES[locale]) problems.push(`${page}: og:locale ${current}, ожидался ${OG_LOCALES[locale]}`);
  if (alternates.join() !== expected.join()) problems.push(`${page}: og:locale:alternate ${alternates.join(", ")}, ожидались ${expected.join(", ")}`);

  const visible = html
    .replace(/<script\b[\s\S]*?<\/script>/g, "")
    .replace(new RegExp(`<a\\b[^>]*href="mailto:${EMAIL}"[^>]*>[\\s\\S]*?</a>`, "g"), "")
    .replace(/<[^>]*>/g, "");
  if (visible.includes(EMAIL)) problems.push(`${page}: почта в тексте без ссылки mailto:`);
}

console.log(`Страниц проверено: ${pages}.`);
if (problems.length === 0) {
  console.log("Замечаний нет.");
  process.exit(0);
}
console.error(`Замечаний: ${problems.length}`);
for (const problem of problems.slice(0, 40)) console.error(`  ${problem}`);
process.exit(1);
