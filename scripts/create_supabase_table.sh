#!/usr/bin/env bash
set -euo pipefail

if [ -z "${1:-}" ] || [ -z "${2:-}" ]; then
  echo "Usage: ./create_supabase_table.sh <SUPABASE_URL> <SERVICE_ROLE_KEY>"
  exit 1
fi

SQL_FILE="../sql/create_projects_table.sql"

if [ ! -f "$SQL_FILE" ]; then
  echo "SQL file not found: $SQL_FILE"
  exit 1
fi

echo "Please run the following SQL in Supabase SQL editor or via psql:" 
cat "$SQL_FILE"
