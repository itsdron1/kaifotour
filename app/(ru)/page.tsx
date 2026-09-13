export default function Page() {
  return (
    <main className="mx-auto max-w-page px-6 py-24">
      <p className="kicker text-secondary">Шаг 1 · токены и шрифты</p>
      <h1 className="display mt-6 text-display-2xl">Бали, который останется с тобой</h1>
      <p className="mt-6 max-w-prose text-lg">
        Лодочные прогулки, серфинг и Batur Sunrise Trekking: проверка того, как кириллица в Sofia Sans стоит рядом с
        латиницей в Barlow.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        {["bg-deep", "bg-secondary", "bg-accent", "bg-sand", "bg-paper", "bg-on-dark"].map((c) => (
          <span key={c} className={`${c} h-16 w-24 border border-divider`} />
        ))}
      </div>
      <div className="mt-10 bg-deep p-10 text-on-dark">
        <p className="kicker text-accent">01 / Экскурсии</p>
        <h2 className="display mt-4 text-display-lg">Tours Worth Riding</h2>
        <p className="mt-4 font-condensed text-2xl uppercase tracking-caps">от 1 600 000 IDR · Ubud Culture Day</p>
      </div>
    </main>
  );
}
