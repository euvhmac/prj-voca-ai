import { useState } from "react";

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const WaveformIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="2" y="12" width="3" height="8" rx="1.5" fill="#4ade80" opacity="0.6"/>
    <rect x="7" y="8" width="3" height="16" rx="1.5" fill="#4ade80" opacity="0.8"/>
    <rect x="12" y="4" width="3" height="24" rx="1.5" fill="#4ade80"/>
    <rect x="17" y="8" width="3" height="16" rx="1.5" fill="#4ade80" opacity="0.8"/>
    <rect x="22" y="12" width="3" height="8" rx="1.5" fill="#4ade80" opacity="0.6"/>
    <rect x="27" y="14" width="3" height="4" rx="1.5" fill="#4ade80" opacity="0.4"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function VocaAuth() {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(null);

  const handleSocial = (provider) => {
    setLoading(provider);
    setTimeout(() => setLoading(null), 1800);
  };

  const features = [
    "Transcrição de áudios do WhatsApp em segundos",
    "Prompts otimizados para qualquer LLM",
    "Histórico organizado e exportável",
    "Export em .json e .md para devs",
  ];

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      background: "#f8f9f7",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Syne:wght@600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .voca-left {
          width: 52%;
          background: #0d2218;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 52px 52px;
        }

        .voca-left::before {
          content: '';
          position: absolute;
          top: -120px;
          right: -120px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 65%);
          pointer-events: none;
        }

        .voca-left::after {
          content: '';
          position: absolute;
          bottom: -80px;
          left: -80px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(74,222,128,0.05) 0%, transparent 65%);
          pointer-events: none;
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.6;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
          z-index: 2;
        }

        .logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 22px;
          color: #f0fdf4;
          letter-spacing: -0.5px;
        }

        .hero-section {
          position: relative;
          z-index: 2;
        }

        .hero-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #4ade80;
          margin-bottom: 20px;
          opacity: 0.9;
        }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(36px, 4vw, 52px);
          font-weight: 700;
          line-height: 1.1;
          color: #f0fdf4;
          margin-bottom: 10px;
          letter-spacing: -1.5px;
        }

        .hero-title em {
          font-style: italic;
          font-weight: 600;
          color: #4ade80;
          font-family: 'DM Sans', sans-serif;
        }

        .hero-sub {
          font-size: 15px;
          color: rgba(240,253,244,0.5);
          line-height: 1.6;
          margin-bottom: 40px;
          max-width: 380px;
          font-weight: 300;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
          color: rgba(240,253,244,0.75);
          font-weight: 400;
        }

        .check-wrap {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: rgba(74,222,128,0.12);
          border: 1px solid rgba(74,222,128,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .voca-right {
          width: 48%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 48px;
          background: #f8f9f7;
        }

        .auth-card {
          width: 100%;
          max-width: 400px;
        }

        .auth-header {
          margin-bottom: 32px;
        }

        .auth-title {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #0d2218;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }

        .auth-subtitle {
          font-size: 14px;
          color: #6b7280;
          font-weight: 400;
        }

        .tab-row {
          display: flex;
          background: #eff1ee;
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 28px;
          gap: 2px;
        }

        .tab-btn {
          flex: 1;
          padding: 9px 0;
          border: none;
          background: transparent;
          border-radius: 7px;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #6b7280;
          font-family: 'DM Sans', sans-serif;
        }

        .tab-btn.active {
          background: white;
          color: #0d2218;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04);
          font-weight: 600;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 20px;
        }

        .field-label {
          display: block;
          font-size: 12.5px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
          letter-spacing: 0.1px;
        }

        .field-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          color: #111827;
          background: white;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          font-family: 'DM Sans', sans-serif;
        }

        .field-input:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
        }

        .field-input::placeholder {
          color: #c4c9c2;
        }

        .field-hint {
          font-size: 11.5px;
          color: #9ca3af;
          margin-top: 4px;
        }

        .cta-btn {
          width: 100%;
          padding: 12px 20px;
          background: #0d2218;
          color: #f0fdf4;
          border: none;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          margin-bottom: 18px;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.1px;
        }

        .cta-btn:hover {
          background: #163528;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(13,34,24,0.25);
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: #e9ebe8;
        }

        .divider-text {
          font-size: 12px;
          color: #9ca3af;
          white-space: nowrap;
          font-weight: 400;
        }

        .social-row {
          display: flex;
          gap: 10px;
          margin-bottom: 22px;
        }

        .social-btn {
          flex: 1;
          padding: 10px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #374151;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }

        .social-btn:hover {
          border-color: #22c55e;
          background: #f0fdf4;
          color: #0d2218;
        }

        .social-btn.loading {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid #e5e7eb;
          border-top-color: #22c55e;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .footer-link {
          text-align: center;
          font-size: 12.5px;
          color: #9ca3af;
        }

        .footer-link a {
          color: #16a34a;
          text-decoration: none;
          font-weight: 500;
        }

        .footer-link a:hover { text-decoration: underline; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .auth-card { animation: fadeUp 0.4s ease both; }
        .hero-eyebrow { animation: fadeUp 0.5s ease 0.1s both; }
        .hero-title { animation: fadeUp 0.5s ease 0.2s both; }
        .hero-sub { animation: fadeUp 0.5s ease 0.3s both; }
        .features-list { animation: fadeUp 0.5s ease 0.4s both; }

        @media (max-width: 768px) {
          .voca-left { display: none; }
          .voca-right { width: 100%; padding: 40px 24px; }
        }
      `}</style>

      {/* LEFT */}
      <div className="voca-left">
        <div className="noise-overlay" />
        <div className="logo">
          <WaveformIcon />
          <span className="logo-text">Voca</span>
        </div>
        <div className="hero-section">
          <p className="hero-eyebrow">Audio → Context</p>
          <h1 className="hero-title">
            Turn voice<br />into <em>context.</em>
          </h1>
          <p className="hero-sub">
            Cole áudios do WhatsApp e receba prompts prontos para discutir com qualquer LLM. Sem perder nenhum detalhe.
          </p>
          <div className="features-list">
            {features.map((f, i) => (
              <div key={i} className="feature-item">
                <div className="check-wrap"><CheckIcon /></div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="voca-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">
              {tab === "login" ? "Bem-vindo de volta" : "Criar conta"}
            </h2>
            <p className="auth-subtitle">
              {tab === "login"
                ? "Entre para acessar seus áudios e prompts."
                : "Crie sua conta gratuitamente."}
            </p>
          </div>

          <div className="tab-row">
            <button className={`tab-btn ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>
              Entrar
            </button>
            <button className={`tab-btn ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>
              Criar conta
            </button>
          </div>

          <div className="field-group">
            {tab === "register" && (
              <div>
                <label className="field-label">Nome completo</label>
                <input className="field-input" placeholder="Victor Macedo" value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})} />
              </div>
            )}
            <div>
              <label className="field-label">E-mail</label>
              <input className="field-input" type="email" placeholder="voce@email.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label className="field-label">Senha</label>
              <input className="field-input" type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} />
              {tab === "register" && <p className="field-hint">Mínimo de 8 caracteres.</p>}
            </div>
            {tab === "register" && (
              <div>
                <label className="field-label">Confirmar senha</label>
                <input className="field-input" type="password" placeholder="Repita sua senha" value={form.confirm}
                  onChange={e => setForm({...form, confirm: e.target.value})} />
              </div>
            )}
          </div>

          <button className="cta-btn">
            {tab === "login" ? "Entrar na conta" : "Criar minha conta"}
            <ArrowIcon />
          </button>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">ou continue com</span>
            <div className="divider-line" />
          </div>

          <div className="social-row">
            <button className={`social-btn ${loading === "linkedin" ? "loading" : ""}`}
              onClick={() => handleSocial("linkedin")}>
              {loading === "linkedin" ? <div className="spinner" /> : <LinkedInIcon />}
              LinkedIn
            </button>
            <button className={`social-btn ${loading === "google" ? "loading" : ""}`}
              onClick={() => handleSocial("google")}>
              {loading === "google" ? <div className="spinner" /> : <GoogleIcon />}
              Google
            </button>
          </div>

          <p className="footer-link">
            {tab === "login"
              ? <>Não tem conta? <a href="#" onClick={e => { e.preventDefault(); setTab("register"); }}>Criar agora →</a></>
              : <>Já tem conta? <a href="#" onClick={e => { e.preventDefault(); setTab("login"); }}>Entrar →</a></>
            }
          </p>
        </div>
      </div>
    </div>
  );
}
