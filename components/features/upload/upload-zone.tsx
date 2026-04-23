'use client';

import { useRef, useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { WaveformIcon } from '@/components/ui/icons/waveform-icon';

interface UploadZoneProps {
  onFile: (file: File) => void;
  error: string | null;
  /** When false, dropping/selecting a file redirects to /login instead of uploading. */
  isAuthenticated?: boolean;
}

const ACCEPTED = '.ogg,.mp3,.m4a,.wav,.opus,.webm';

export function UploadZone({ onFile, error, isAuthenticated = true }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      // Intent-first: visitante anônimo é redirecionado para autenticar
      // antes do upload começar. callbackUrl=/ traz o usuário de volta para
      // a home, onde ele pode reenviar o arquivo já autenticado.
      if (!isAuthenticated) {
        void signIn(undefined, { callbackUrl: '/' });
        return;
      }
      onFile(file);
    },
    [onFile, isAuthenticated],
  );

  function handleDragOver(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLLabelElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // reset so same file can be re-selected
    e.target.value = '';
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <label
        htmlFor="audio-upload"
        aria-label={
          isAuthenticated
            ? 'Área de upload de áudio. Clique ou arraste um arquivo.'
            : 'Área de upload de áudio. Clique ou arraste — você será direcionado ao login antes de processar.'
        }
        data-dragover={isDragOver ? 'true' : 'false'}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`upload-mint-ring relative z-10 flex flex-col items-center justify-center gap-6 w-full
          rounded-[18px] border-2 border-dashed cursor-pointer
          transition-all duration-200 outline-none select-none
          focus-visible:ring-2 focus-visible:ring-[#4ade80]
          ${isDragOver
            ? 'border-[#4ade80] bg-[rgba(74,222,128,0.08)] shadow-[0_24px_60px_rgba(74,222,128,0.18)] scale-[1.015]'
            : 'border-[#d1d5db] bg-white/95 backdrop-blur-[2px] hover:border-[#4ade80] hover:bg-[rgba(74,222,128,0.04)] hover:-translate-y-px'
          }`}
        style={{ minHeight: 320 }}
      >
        {/* Waveform icon + animated bars */}
        <div className="flex flex-col items-center gap-4">
          <div
            className={`flex items-center justify-center w-20 h-20 rounded-full transition-all duration-200 ${
              isDragOver
                ? 'bg-[rgba(74,222,128,0.16)] animate-pulse-ring'
                : 'bg-[rgba(74,222,128,0.06)]'
            }`}
          >
            <WaveformIcon
              size={38}
              color={isDragOver ? '#16a34a' : '#86efac'}
              className="transition-colors duration-200"
            />
          </div>

          {/* Animated wave bars — visible on drag */}
          {isDragOver && (
            <div className="flex items-end gap-1 h-7" aria-hidden="true">
              {[0, 0.1, 0.2, 0.3, 0.4, 0.3, 0.2, 0.1, 0].map((delay, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-[#4ade80] animate-wave-bar"
                  style={{
                    height: [10, 14, 20, 26, 28, 26, 20, 14, 10][i],
                    animationDelay: `${delay}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 px-6 text-center">
          <p
            className="text-[17px] font-semibold tracking-[-0.2px]"
            style={{ fontFamily: 'var(--font-syne)', color: '#0d2218' }}
          >
            {isDragOver
              ? 'Solte o arquivo aqui'
              : isAuthenticated
                ? 'Arraste seu áudio aqui'
                : 'Suba seu primeiro áudio'}
          </p>
          <p
            className="text-[13.5px]"
            style={{ fontFamily: 'var(--font-dm-sans)', color: '#6b7280' }}
          >
            ou{' '}
            <span className="text-[#16a34a] font-semibold underline underline-offset-2">
              clique para selecionar
            </span>
            {!isAuthenticated && (
              <span className="block mt-1 text-[12px] text-[#9ca3af]">
                Pediremos um login rápido antes de processar.
              </span>
            )}
          </p>
        </div>

        <div
          className="flex flex-wrap justify-center gap-1.5 px-8 max-w-[460px]"
          aria-label="Formatos aceitos"
        >
          {['OGG', 'MP3', 'M4A', 'WAV', 'OPUS', 'WEBM'].map((fmt) => (
            <span
              key={fmt}
              className="px-2.5 py-1 rounded-[6px] text-[11px] font-semibold tracking-[0.5px]"
              style={{
                backgroundColor: '#f3f4f2',
                color: '#6b7280',
                fontFamily: 'var(--font-jetbrains-mono)',
              }}
            >
              {fmt}
            </span>
          ))}
          <span
            className="px-2.5 py-1 rounded-[6px] text-[11px] font-medium"
            style={{
              backgroundColor: '#f3f4f2',
              color: '#9ca3af',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            até 25 MB
          </span>
        </div>

        <input
          ref={inputRef}
          id="audio-upload"
          type="file"
          accept={ACCEPTED}
          onChange={handleInputChange}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        />
      </label>

      {/* Validation error */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 px-4 py-3 rounded-[8px] text-[13px]"
          style={{
            backgroundColor: 'rgba(248,113,113,0.08)',
            border: '1px solid rgba(248,113,113,0.25)',
            color: '#dc2626',
            fontFamily: 'var(--font-dm-sans)',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <circle cx="7.5" cy="7.5" r="6.5" stroke="#dc2626" strokeWidth="1.2" />
            <path d="M7.5 4.5V8" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="7.5" cy="10.5" r="0.7" fill="#dc2626" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
