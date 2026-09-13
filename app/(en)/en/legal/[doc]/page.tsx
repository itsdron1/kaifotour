import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/pages/LegalPage";
import { isLegalDoc, legalDocs } from "@/lib/legal";
import { legalMetadata } from "@/lib/page-metadata";

type PageProps = { params: Promise<{ doc: string }> };

export function generateStaticParams() {
  return legalDocs.map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { doc } = await params;
  return isLegalDoc(doc) ? legalMetadata("en", doc) : {};
}

export default async function Page({ params }: PageProps) {
  const { doc } = await params;
  if (!isLegalDoc(doc)) notFound();
  return <LegalPage locale="en" doc={doc} />;
}
