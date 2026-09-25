import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";
import { homeMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = homeMetadata("id");

export default function Page() {
  return <HomePage locale="id" />;
}
