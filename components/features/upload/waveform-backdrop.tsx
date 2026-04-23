/**
 * Decorative animated waveform behind the upload zone.
 * `aria-hidden` — purely visual, never read by screen readers.
 * Respects `prefers-reduced-motion` via `.animate-ambient-pan`.
 */
export function WaveformBackdrop() {
  // Procedural set of bar heights — looks organic without being random per render.
  const bars = [
    14, 22, 36, 28, 18, 30, 44, 26, 16, 24, 38, 30, 20, 12, 28, 40, 32, 18, 26, 22,
    16, 30, 42, 28, 20, 14, 24, 36, 30, 18, 26, 38, 32, 22, 16, 28, 40, 26, 18, 24,
    14, 22, 36, 28, 18, 30, 44, 26, 16, 24, 38, 30, 20, 12, 28, 40, 32, 18, 26, 22,
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div
        className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center gap-[6px] animate-ambient-pan w-full px-8"
        style={{ opacity: 0.12 }}
      >
        {bars.map((h, i) => (
          <span
            key={i}
            className="block rounded-full"
            style={{
              width: 3,
              height: h,
              background:
                i % 7 === 0
                  ? 'linear-gradient(180deg, #4ade80 0%, #16a34a 100%)'
                  : '#0d2218',
              opacity: 0.5 + (h / 60),
            }}
          />
        ))}
      </div>

      {/* Soft mint glow that anchors the upload zone visually. */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 520,
          height: 520,
          background:
            'radial-gradient(circle at center, rgba(74,222,128,0.18) 0%, rgba(74,222,128,0.04) 45%, transparent 70%)',
          filter: 'blur(4px)',
        }}
      />
    </div>
  );
}
