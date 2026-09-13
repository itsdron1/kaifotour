import { PageShell } from "@/components/layout/PageShell";

export default function Page() {
  return (
    <PageShell locale="ru">
      <section className="min-h-[100dvh] bg-deep" />
      <section className="min-h-[100dvh] bg-paper" />
    </PageShell>
  );
}
