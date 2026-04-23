export default function Loading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: '#f8f9f7' }}
      aria-label="Carregando..."
      role="status"
    >
      <div className="flex items-end gap-[4px]" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="block w-[3px] rounded-full animate-wave-bar"
            style={{
              height: 24,
              backgroundColor: '#4ade80',
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
