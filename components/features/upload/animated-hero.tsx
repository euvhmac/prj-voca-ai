/**
 * Hero headline com fade-in palavra-por-palavra.
 * Acessibilidade: o texto completo é lido de uma vez por leitores de tela
 * (`aria-label`); cada palavra animada é `aria-hidden`.
 */
interface AnimatedHeroProps {
  headline: string;
  subline: string;
  /** 'dark' (default) usa texto escuro sobre fundo claro; 'light' inverte para fundos Deep Forest. */
  tone?: 'dark' | 'light';
}

export function AnimatedHero({ headline, subline, tone = 'dark' }: AnimatedHeroProps) {
  const words = headline.split(' ');
  const isLight = tone === 'light';
  const headlineColor = isLight ? '#f0fdf4' : '#0d2218';
  const sublineColor = isLight ? 'rgba(240,253,244,0.72)' : '#4b5563';

  return (
    <header className="flex flex-col gap-2">
      <h1
        aria-label={headline}
        className="text-[34px] md:text-[42px] font-extrabold tracking-[-1px] leading-[1.05]"
        style={{ fontFamily: 'var(--font-syne)', color: headlineColor }}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            aria-hidden="true"
            className="animate-word-in"
            style={{
              animationDelay: `${0.08 + i * 0.09}s`,
              marginRight: i === words.length - 1 ? 0 : '0.28em',
            }}
          >
            {word}
          </span>
        ))}
      </h1>
      <p
        className="text-[15px] md:text-[16px] max-w-[520px] animate-fade-up"
        style={{
          fontFamily: 'var(--font-dm-sans)',
          color: sublineColor,
          animationDelay: `${0.08 + words.length * 0.09 + 0.05}s`,
        }}
      >
        {subline}
      </p>
    </header>
  );
}
