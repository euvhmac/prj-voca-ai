'use client';

import { useState, useCallback } from 'react';
import type { TranscriptionResult } from '@/lib/types';
import { useToast } from '@/components/ui/toast';

interface ResultCardProps {
  result: TranscriptionResult;
  onReset: () => void;
}

type ActiveTab = 'optimized' | 'raw';

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M4 4V3a1 1 0 011-1h5.5L12 3.5V10a1 1 0 01-1 1H9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 2V9M7 9L4.5 6.5M7 9L9.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 11.5H12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M1.5 7.5A6 6 0 0113 4M13.5 7.5A6 6 0 012 11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M13 1.5V4.5H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 10.5V13.5H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ResultCard({ result, onReset }: ResultCardProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('optimized');
  const [copied, setCopied] = useState(false);
  const [copiedLLM, setCopiedLLM] = useState(false);
  const { toast } = useToast();

  const activeContent =
    activeTab === 'optimized' ? result.optimizedPrompt : result.rawTranscription;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(activeContent);
    setCopied(true);
    toast('Copiado para a área de transferência', 'success');
    setTimeout(() => setCopied(false), 2000);
  }, [activeContent, toast]);

  const handleCopyLLM = useCallback(async () => {
    await navigator.clipboard.writeText(result.optimizedPrompt);
    setCopiedLLM(true);
    toast('Prompt copiado — pronto para colar no LLM', 'success');
    setTimeout(() => setCopiedLLM(false), 2000);
  }, [result.optimizedPrompt, toast]);

  function handleDownloadMd() {
    const content = `# Voca — Prompt Otimizado\n\n> Gerado em: ${new Date(result.createdAt).toLocaleString('pt-BR')}\n> Arquivo: ${result.filename}\n\n---\n\n## Prompt Otimizado\n\n${result.optimizedPrompt}\n\n---\n\n## Transcrição Bruta\n\n${result.rawTranscription}\n`;
    downloadBlob(content, 'voca-prompt.md', 'text/markdown');
    toast('Arquivo .md baixado', 'success');
  }

  function handleDownloadJson() {
    const payload = {
      id: result.id,
      filename: result.filename,
      durationSeconds: result.durationSeconds,
      wordCount: result.wordCount,
      optimizedPrompt: result.optimizedPrompt,
      rawTranscription: result.rawTranscription,
      createdAt: result.createdAt,
      generated_at: new Date().toISOString(),
    };
    downloadBlob(JSON.stringify(payload, null, 2), 'voca-prompt.json', 'application/json');
    toast('Arquivo .json baixado', 'success');
  }

  const durationLabel = result.durationSeconds
    ? result.durationSeconds >= 60
      ? `${Math.floor(result.durationSeconds / 60)}m ${result.durationSeconds % 60}s`
      : `${result.durationSeconds}s`
    : null;

  return (
    <div className="w-full flex flex-col gap-4 animate-fade-up">
      {/* Meta bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11.5px] font-medium"
          style={{
            backgroundColor: 'rgba(74,222,128,0.08)',
            border: '1px solid rgba(74,222,128,0.15)',
            color: '#16a34a',
            fontFamily: 'var(--font-dm-sans)',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 5L4 7L8 3" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Concluído
        </span>

        <span
          className="px-2.5 py-1 rounded-[6px] text-[11px] font-medium"
          style={{
            backgroundColor: '#f3f4f2',
            color: '#6b7280',
            fontFamily: 'var(--font-jetbrains-mono)',
          }}
        >
          {result.filename}
        </span>

        {durationLabel && (
          <span
            className="text-[11.5px]"
            style={{ fontFamily: 'var(--font-dm-sans)', color: '#9ca3af' }}
          >
            {durationLabel}
          </span>
        )}

        <span
          className="text-[11.5px]"
          style={{ fontFamily: 'var(--font-dm-sans)', color: '#9ca3af' }}
        >
          {result.wordCount} palavras
        </span>
      </div>

      {/* Card */}
      <div
        className="bg-white rounded-[18px] overflow-hidden"
        style={{ border: '1px solid #e5e7eb' }}
      >
        {/* Tab bar */}
        <div
          className="flex items-center justify-between px-4 pt-4 pb-0 gap-3"
        >
          <div
            className="flex bg-[#eff1ee] rounded-[10px] p-1 gap-0.5"
            role="tablist"
            aria-label="Tipo de conteúdo"
          >
            <button
              role="tab"
              aria-selected={activeTab === 'optimized'}
              onClick={() => setActiveTab('optimized')}
              style={{ fontFamily: 'var(--font-dm-sans)' }}
              className={`px-3 py-1.5 rounded-[7px] text-[13px] transition-all duration-150
                focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none
                ${activeTab === 'optimized'
                  ? 'bg-white text-[#0d2218] font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]'
                  : 'bg-transparent text-[#6b7280] font-medium hover:text-[#374151]'
                }`}
            >
              Prompt otimizado
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'raw'}
              onClick={() => setActiveTab('raw')}
              style={{ fontFamily: 'var(--font-dm-sans)' }}
              className={`px-3 py-1.5 rounded-[7px] text-[13px] transition-all duration-150
                focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none
                ${activeTab === 'raw'
                  ? 'bg-white text-[#0d2218] font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]'
                  : 'bg-transparent text-[#6b7280] font-medium hover:text-[#374151]'
                }`}
            >
              Transcrição bruta
            </button>
          </div>

          {/* Copy active tab */}
          <button
            onClick={handleCopy}
            aria-label={copied ? 'Copiado!' : 'Copiar conteúdo'}
            className="flex items-center gap-1.5 text-[12.5px] font-medium transition-colors
              text-[#374151] hover:text-[#0d2218]
              focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none rounded"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            <CopyIcon />
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>

        {/* Content */}
        <div
          className="px-5 py-4 min-h-[180px] max-h-[320px] overflow-y-auto"
          role="tabpanel"
          aria-live="polite"
        >
          <pre
            className="whitespace-pre-wrap text-[13.5px] leading-relaxed"
            style={{
              fontFamily:
                activeTab === 'raw'
                  ? 'var(--font-jetbrains-mono)'
                  : 'var(--font-dm-sans)',
              color: '#374151',
            }}
          >
            {activeContent}
          </pre>
        </div>

        {/* Action bar */}
        <div
          className="flex items-center justify-between px-5 py-3 gap-3 flex-wrap"
          style={{ borderTop: '1px solid #f3f4f2' }}
        >
          {/* Download buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadMd}
              aria-label="Baixar como Markdown"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-[12.5px] font-medium
                border border-[#e5e7eb] bg-white text-[#374151]
                hover:border-[#4ade80] hover:bg-[#f0fdf4] hover:text-[#0d2218]
                transition-all duration-150
                focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              <DownloadIcon />
              .md
            </button>
            <button
              onClick={handleDownloadJson}
              aria-label="Baixar como JSON"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-[12.5px] font-medium
                border border-[#e5e7eb] bg-white text-[#374151]
                hover:border-[#4ade80] hover:bg-[#f0fdf4] hover:text-[#0d2218]
                transition-all duration-150
                focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              <DownloadIcon />
              .json
            </button>
          </div>

          {/* Copy for LLM */}
          <button
            onClick={handleCopyLLM}
            aria-label={copiedLLM ? 'Prompt copiado!' : 'Copiar prompt para LLM'}
            className="flex items-center gap-2 px-4 py-2 rounded-[9px] text-[13px] font-semibold
              bg-[#0d2218] text-[#f0fdf4]
              hover:bg-[#163528] hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(13,34,24,0.12)]
              transition-all duration-150
              focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none"
            style={{ fontFamily: 'var(--font-dm-sans)' }}
          >
            <CopyIcon />
            {copiedLLM ? 'Copiado!' : 'Copiar para LLM →'}
          </button>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 mx-auto text-[13px] font-medium
          text-[#6b7280] hover:text-[#0d2218] transition-colors duration-150
          focus-visible:ring-2 focus-visible:ring-[#4ade80] focus-visible:outline-none rounded"
        style={{ fontFamily: 'var(--font-dm-sans)' }}
      >
        <RefreshIcon />
        Processar novo áudio
      </button>
    </div>
  );
}
