#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="$ROOT_DIR/.env.local"
ENV_EXAMPLE="$ROOT_DIR/.env.local.example"

if [ ! -f "$ENV_FILE" ]; then
  if [ -f "$ENV_EXAMPLE" ]; then
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    echo "Created .env.local from .env.local.example. Fill it with your Supabase values before continuing."
    exit 0
  fi
  echo ".env.local not found. Create it from .env.local.example or provide your Supabase variables."
  exit 1
fi

if [ -z "$(command -v npm)" ]; then
  echo "npm not found in PATH. Install Node.js and npm first."
  exit 1
fi

npm ci
npm run build

git_status=$(git status --short || true)
if [ -n "$git_status" ]; then
  echo "Git changes detected:" >&2
  echo "$git_status" >&2
  if [ "${1:-}" = "--push" ]; then
    git add .
    git commit -m "chore: add deploy automation scripts and docs"
    git push origin main
    echo "Changes pushed to origin/main."
  else
    echo "Run '$0 --push' to commit and push changes after review." >&2
  fi
else
  echo "No local git changes detected."
fi

echo "If Vercel is connected to this GitHub repo and main branch deploys are enabled, the app will deploy automatically after push."
echo "Make sure Vercel has the required env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE."
