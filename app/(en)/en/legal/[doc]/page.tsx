import { notFound } from "next/navigation";
import { LegalPage } from "@/components/pages/LegalPage";
import { isLegalDoc, legalDocs } from "@/lib/legal";

type PageProps = { params: Promise<{ doc: string }> };

export function generateStaticParams() {
  return legalDocs.map((doc) => ({ doc }));
}

export default async function Page({ params }: PageProps) {
  const { doc } = await params;
  if (!isLegalDoc(doc)) notFound();
  return <LegalPage locale="en" doc={doc} />;
}
