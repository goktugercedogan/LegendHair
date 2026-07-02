# Legend Hair Reservierung

Modern German one-page website with a live-ready appointment flow and owner panel.

## Local Demo

```bash
npm install
npm run dev
```

- Website: `http://localhost:3000`
- Owner panel: `http://localhost:3000/admin`
- Demo admin password without Supabase env vars: `legend-demo`

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Create the owner account manually in Supabase Auth.
4. Copy `.env.example` to `.env.local` and fill:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The public booking API uses server-side validation and the service role key. The admin API requires a Supabase session bearer token.
