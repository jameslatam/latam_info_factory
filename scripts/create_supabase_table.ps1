param(
  [string]$SupabaseUrl,
  [string]$ServiceRoleKey
)

if (-not $SupabaseUrl -or -not $ServiceRoleKey) {
  Write-Host "Usage: .\\create_supabase_table.ps1 -SupabaseUrl <url> -ServiceRoleKey <key>"
  exit 1
}

$sql = Get-Content -Path "..\sql\create_projects_table.sql" -Raw

Write-Host "--- SQL to run in Supabase SQL editor ---" -ForegroundColor Yellow
Write-Host $sql
