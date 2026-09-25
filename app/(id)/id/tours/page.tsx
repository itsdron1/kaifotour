import type { Metadata } from "next";
import { CatalogPage } from "@/components/pages/CatalogPage";
import { catalogMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = catalogMetadata("id");

export default function Page() {
  return <CatalogPage locale="id" />;
}
