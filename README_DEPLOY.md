Deployment & integration steps (GitHub, Vercel, Supabase)
=========================================================

This guide automates as much as possible locally; you will need to provide credentials and create external resources once.

1) Git / GitHub
  - Initialize repo locally and push to GitHub (example):

    git init
    git add .
    git commit -m "chore: add web_v4"
    # create remote repo on GitHub via web UI or gh cli
    git remote add origin git@github.com:YOUR_USER/YOUR_REPO.git
    git branch -M main
    git push -u origin main

  - A GitHub Actions workflow is included at `.github/workflows/ci.yml` to build the app.

2) Supabase
  - Create project at https://app.supabase.com
  - In SQL Editor run `sql/create_projects_table.sql` (or use the `scripts` helpers).
  - In Project Settings → API, copy the `URL` and `anon key`.
  - Create a `service_role` key (Project Settings → API → Service Key) and keep it secret.

3) Environment variables
  - Locally create `.env.local` at `web_v4/.env.local` with:

    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    SUPABASE_SERVICE_ROLE=...

  - In Vercel, add the same variables in Project Settings → Environment Variables. Mark `SUPABASE_SERVICE_ROLE` as "Secret" and do NOT expose it to the client.

4) Vercel
  - Connect your GitHub repo in Vercel and enable auto-deploy on push to `main`.
  - Ensure `vercel.json` exists (included) and Vercel build environment has Node 20.

5) Test locally
  cd web_v4
  npm install
  npm run dev

5.1) Automated local validation
  - Windows: `cd web_v4 && .\scripts\automate_deploy.ps1`
  - macOS/Linux: `cd web_v4 && ./scripts/automate_deploy.sh`

6) Troubleshooting
  - If build fails: run `npm run build` locally and fix errors. Check Node version and dependency versions.
  - If API returns 500: verify `SUPABASE_SERVICE_ROLE` and `NEXT_PUBLIC_SUPABASE_URL` are correct and table exists.
