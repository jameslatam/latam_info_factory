Supabase setup (quick)
======================

1) Crie um projeto no Supabase (app.supabase.com) e copie as chaves:
   - `NEXT_PUBLIC_SUPABASE_URL` (URL do projeto)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon key)
   - `SUPABASE_SERVICE_ROLE` (service role key — mantenha em segredo)

2) Defina as variáveis no Vercel (ou em `.env.local` para desenvolvimento):

   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE=...

3) Crie a tabela `projects` no Supabase SQL Editor com este exemplo:

```sql
create table if not exists projects (
  id bigserial primary key,
  projectId text not null,
  version text,
  status text,
  createdAt timestamptz,
  configuration jsonb,
  pipeline jsonb
);
```

4) Deploy/execução local

   cd web_v4
   npm install
   npm run dev

5) Observações
   - A API `/api/projects` usa a chave de serviço — não a exponha no cliente.
   - A aplicação manterá uma cópia local em `localStorage` como fallback.
