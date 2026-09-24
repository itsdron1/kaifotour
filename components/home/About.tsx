import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { resolveMedia } from "@/data/media";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

/**
 * Раздел «О нас»: светлый блок про команду и тёмный блок «Почему KAIFO?»,
 * где крупные буквы складываются в название бренда и проявляются по очереди.
 */
export function About({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section id="about" aria-labelledby="about-title" className="bg-paper text-ink">
      <div className="mx-auto max-w-page px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-6">
            <p className="kicker text-secondary">{t.about.kicker}</p>
            <h2
              id="about-title"
              className="display mt-6 max-w-[18ch] text-balance text-[clamp(2.25rem,1.6rem+1.6vw,2.75rem)] leading-[1.15]"
            >
              {t.about.lead}
            </h2>
            {/* TODO: заменить на фото команды */}
            <figure className="mt-12 w-fit -rotate-2 bg-sand p-3 pb-6 shadow-postcard">
              <Photo
                image={resolveMedia("riders-sunset", locale)}
                sizes="(min-width: 640px) 20rem, 16rem"
                className="aspect-[4/5] w-64 sm:w-80"
              />
            </figure>
          </Reveal>

          <Reveal className="lg:col-span-6 lg:pt-16" delay={0.1}>
            <div className="max-w-[60ch] space-y-6 text-[1.0625rem] leading-relaxed text-label">
              {t.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-16 lg:mt-20">
          <blockquote className="display max-w-[40ch] border-l-2 border-accent pl-6 text-balance text-[clamp(1.75rem,1.4rem+0.9vw,2rem)] leading-snug lg:pl-10">
            {t.about.quote}
          </blockquote>
        </Reveal>
      </div>

      <div className="bg-deep text-on-dark">
        <div className="mx-auto max-w-page px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <Reveal className="max-w-3xl">
            <h2 className="display text-display-lg">{t.about.why.title}</h2>
            <p className="mt-6 text-lg leading-relaxed text-sand">{t.about.why.intro}</p>
          </Reveal>

          {/* Пять колонок на десктопе, чтобы буквы читались как слово KAIFO; на мобильном — строки */}
          <ul className="mt-14 grid divide-y divide-on-dark/15 md:mt-16 md:grid-cols-5 md:divide-x md:divide-y-0">
            {t.about.why.letters.map((item, index) => (
              <li key={item.letter} className="group py-7 md:px-4 md:py-0 md:first:pl-0 md:last:pr-0">
                <Reveal delay={index * 0.12} className="flex items-center gap-6 md:flex-col md:items-start md:gap-4">
                  <span className="display shrink-0 text-[5rem] leading-[0.9] text-accent transition-colors duration-300 group-hover:text-[#D8AE60] md:text-[clamp(7.5rem,9vw,10rem)]">
                    {item.letter}
                  </span>
                  <div>
                    <p className="break-words font-condensed text-base font-semibold uppercase leading-tight tracking-[0.15em]">
                      {item.word}
                    </p>
                    {item.original ? <p className="kicker mt-2 text-[0.625rem] text-mist">{item.original}</p> : null}
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-sand/85 transition-colors duration-300 group-hover:text-on-dark">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
