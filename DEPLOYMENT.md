# Vercel + Neon deployment

## 1. Create or select a Neon project

The Neon CLI is available locally. Authenticate and choose the correct organization first:

```sh
neon auth
neon projects list --org-id YOUR_ORG_ID
# Choose the nearest approved region before creating a new project.
neon projects create --name vivacious-consultants --org-id YOUR_ORG_ID --region-id aws-eu-central-1 --set-context
neon connection-string
```

Do not paste the connection string into source control. Put it in `.env.local` for local work and Vercel environment settings for deployed environments.

Run the schema after assigning `DATABASE_URL`:

```sh
psql "$DATABASE_URL" -f db/schema.sql
```

## 2. Configure Vercel

Install/login to the Vercel CLI or import the repository in the Vercel dashboard:

```sh
npm i -g vercel
vercel login
vercel link
vercel env add DATABASE_URL production
vercel env add ADMIN_SESSION_SECRET production
vercel env add ADMIN_PASSWORD production
vercel --prod
```

Add the same variables to Preview if preview deployments should use a separate Neon branch/database. `vercel.json` routes public paths to the SPA while leaving `/api/*` to Vercel Serverless Functions.

## 3. Production variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon pooled Postgres connection string, including `sslmode=require` |
| `ADMIN_SESSION_SECRET` | Random HMAC secret, e.g. `openssl rand -base64 32` |
| `ADMIN_PASSWORD` | Strong unique dashboard password |

Never use `NEXT_PUBLIC_` for these values. They must only be stored as server-side Vercel environment variables.

## 4. Verify

1. Visit `/admin`, log in, and confirm the dashboard loads.
2. Submit a test contact message and newsletter signup.
3. Confirm both records appear in `/admin` within 20 seconds.
4. Set an `office_address` record in the Content Editor and refresh the public contact/footer page.

## Operational notes

The current dashboard uses an HTTP-only, signed, eight-hour admin session. For multi-user production administration, add a managed identity provider and role-based access control before distributing access. The API records website submissions; email notifications can be added with an approved mail provider in a future server-side integration.
