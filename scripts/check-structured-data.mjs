/**
 * Проверка структурированных данных (JSON-LD) на собранных страницах.
 *
 * Запускать после `npm run build`:
 *   node scripts/check-structured-data.mjs
 *
 * Проверяет то, что Google требует для разметки сайта KAIFO:
 *   - JSON разбирается, у каждого объекта есть @type;
 *   - TravelAgency: name, url, logo, telephone в формате +62…, address, geo;
 *   - TouristTrip: name, description, url, image, provider; Offer — с price, priceCurrency IDR,
 *     availability и url, а у туров «по запросу» Offer нет вовсе;
 *   - BreadcrumbList: позиции по порядку, у каждого пункта name и item;
 *   - все адреса абсолютные и с www;
 *   - нет AggregateRating и Review: по отзывам на сайте самой компании Google звёзд не показывает.
 * Это не замена validator.schema.org, а быстрая проверка перед ним.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const APP = join(process.cwd(), ".next", "server", "app");
const SITE = "https://www.kaifotour-bali.com";

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
const counts = { pages: 0, TravelAgency: 0, TouristTrip: 0, Offer: 0, BreadcrumbList: 0 };

function require(page, node, keys) {
  for (const key of keys) {
    if (node[key] === undefined || node[key] === "") problems.push(`${page}: у ${node["@type"]} нет «${key}»`);
  }
}

function walkUrls(page, value, path = "") {
  if (typeof value === "string") {
    if (/^https?:\/\/(?:www\.)?kaifotour-bali\.com/.test(value) && !value.startsWith(SITE)) {
      problems.push(`${page}: адрес без www в ${path}: ${value}`);
    }
    return;
  }
  if (Array.isArray(value)) value.forEach((item, index) => walkUrls(page, item, `${path}[${index}]`));
  else if (value && typeof value === "object") for (const [key, item] of Object.entries(value)) walkUrls(page, item, `${path}.${key}`);
}

for (const file of await htmlFiles(APP)) {
  const page = relative(APP, file);
  const html = await readFile(file, "utf8");
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => match[1]);
  if (blocks.length === 0) continue;
  counts.pages++;

  for (const block of blocks) {
    let data;
    try {
      data = JSON.parse(block);
    } catch {
      problems.push(`${page}: JSON-LD не разбирается`);
      continue;
    }
    walkUrls(page, data);
    if (/AggregateRating|"Review"/.test(block)) problems.push(`${page}: в разметке есть AggregateRating или Review`);

    for (const node of data["@graph"] ?? [data]) {
      if (!node["@type"]) problems.push(`${page}: объект без @type`);
      counts[node["@type"]] = (counts[node["@type"]] ?? 0) + 1;

      if (node["@type"] === "TravelAgency") {
        require(page, node, ["name", "url", "logo", "telephone", "address", "geo"]);
        if (node.telephone && !/^\+\d{8,15}$/.test(node.telephone)) problems.push(`${page}: телефон не в формате +62…`);
      }
      if (node["@type"] === "TouristTrip") {
        require(page, node, ["name", "description", "url", "image", "provider"]);
        if (node.offers) {
          counts.Offer++;
          require(page, node.offers, ["price", "priceCurrency", "availability", "url"]);
          if (node.offers.priceCurrency !== "IDR") problems.push(`${page}: валюта Offer не IDR`);
          if (!(node.offers.price > 0)) problems.push(`${page}: у Offer нет цены`);
        }
      }
      if (node["@type"] === "BreadcrumbList") {
        (node.itemListElement ?? []).forEach((item, index) => {
          if (item.position !== index + 1) problems.push(`${page}: в крошках сбит порядок позиций`);
          if (!item.name || !item.item) problems.push(`${page}: у пункта крошек нет name или item`);
        });
      }
    }
  }
}

console.log(
  `Страниц с разметкой: ${counts.pages}. TravelAgency: ${counts.TravelAgency}, TouristTrip: ${counts.TouristTrip}, ` +
    `из них с Offer: ${counts.Offer}, BreadcrumbList: ${counts.BreadcrumbList}.`,
);
if (problems.length === 0) {
  console.log("Замечаний нет.");
  process.exit(0);
}
console.error(`Замечаний: ${problems.length}`);
for (const problem of problems.slice(0, 40)) console.error(`  ${problem}`);
process.exit(1);
