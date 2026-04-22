// Placeholder — a página de upload será implementada na Sprint 06
export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center" style={{ minHeight: '100vh', backgroundColor: '#0d2218' }}>
      <main className="flex flex-col items-center gap-4 text-center px-6">
        <span
          className="text-[28px] font-extrabold tracking-[-0.8px]"
          style={{ fontFamily: 'var(--font-syne)', color: '#f0fdf4' }}
        >
          Voca
        </span>
        <p
          className="text-[14px]"
          style={{ fontFamily: 'var(--font-dm-sans)', color: 'rgba(240,253,244,0.6)' }}
        >
          Upload page — Sprint 06
        </p>
      </main>
    </div>
  );
}
