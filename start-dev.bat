@echo off
chcp 65001 >nul
title Voca — Dev Server

echo.
echo  ╔══════════════════════════════════════╗
echo  ║         VOCA — Dev Server            ║
echo  ║  Next.js (frontend + backend juntos) ║
echo  ╚══════════════════════════════════════╝
echo.
echo  Abrindo: http://localhost:3000
echo  Auth:    http://localhost:3000/login
echo  API:     http://localhost:3000/api
echo.
echo  Pressione Ctrl+C para parar.
echo  ─────────────────────────────────────
echo.

cd /d "%~dp0"

if not exist ".env.local" (
  echo  [AVISO] .env.local nao encontrado!
  echo  Copie .env.example para .env.local e preencha as variaveis.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo  [INFO] Instalando dependencias...
  call npm install
  echo.
)

start "" http://localhost:3000

npm run dev
