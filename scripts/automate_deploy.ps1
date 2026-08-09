param(
  [switch]$Push
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location -Path (Join-Path $scriptDir "..")

$envFile = Join-Path (Get-Location) ".env.local"
$envExample = Join-Path (Get-Location) ".env.local.example"

if (-not (Test-Path $envFile)) {
    if (Test-Path $envExample) {
        Copy-Item -Path $envExample -Destination $envFile
        Write-Host "Created .env.local from .env.local.example. Fill it with your Supabase values before continuing." -ForegroundColor Yellow
        exit 0
    }

    Write-Host ".env.local not found. Create it from .env.local.example or provide your Supabase variables." -ForegroundColor Red
    exit 1
}

Write-Host "Installing dependencies..." -ForegroundColor Cyan
& npm.cmd ci

Write-Host "Building the Next.js app..." -ForegroundColor Cyan
& npm.cmd run build

Write-Host "Build completed successfully." -ForegroundColor Green

$gitStatus = & git status --short
if ($gitStatus) {
    Write-Host "Git changes detected:" -ForegroundColor Yellow
    Write-Host $gitStatus

    if ($Push) {
        Write-Host "Committing and pushing changes to origin/main..." -ForegroundColor Cyan
        & git add .
        & git commit -m "chore: add deploy automation scripts and docs"
        & git push origin main
        Write-Host "Changes pushed to origin/main." -ForegroundColor Green
    } else {
        Write-Host "Run this script again with -Push to commit and push changes after review." -ForegroundColor Yellow
    }
} else {
    Write-Host "No local git changes detected." -ForegroundColor Green
}

Write-Host "If Vercel is connected to this GitHub repo and main branch deploys are enabled, the app will deploy automatically after push." -ForegroundColor Cyan
Write-Host "Make sure Vercel has the required env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE or SUPABASE_SERVICE_ROLE_KEY." -ForegroundColor Cyan
