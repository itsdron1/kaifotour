/** Юридические страницы-заглушки (docs/tz-main.md, Footer) */
export const legalDocs = ["privacy", "offer", "cookies"] as const;

export type LegalDoc = (typeof legalDocs)[number];

export function isLegalDoc(value: string): value is LegalDoc {
  return (legalDocs as readonly string[]).includes(value);
}
