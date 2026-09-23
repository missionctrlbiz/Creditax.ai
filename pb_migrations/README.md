# Creditax.ai — PocketBase Demo (Track A)

Applies the P1 data spine to a running PocketBase binary. Without these steps
the app still works — it falls back to the inlined demo seed
(`src/lib/seed/demoSeed.ts`) — but you get real persistence + role-scoped
sessions when the flag is on.

## 0. Prerequisites

- **Node** (v20 or later; the system `/usr/local/bin/node` in this repo works).
- **PocketBase binary** — download from https://pocketbase.io. No npm install
  required for the app itself (the `pocketbase` client package is already in
  `package.json` and `node_modules`).
- `.env` with `KIMCHI_API_KEY` set (P2 RAG). P1 does not need a live LLM.

Optional P2 items: `OPENROUTER_API_KEY` for embeddings.

## 1. Download + start the PocketBase binary

```bash
mkdir -p /var/www/creditax-demo/pocketbase/pb_data
cd /var/www/creditax-demo/pocketbase

# macOS / Linux (adjust arch as needed)
curl -L https://pocketbase.io/downloads/releases/latest/darwin_amd64.zip \
  -o pb.zip && unzip -o pb.zip pocketbase
chmod +x pocketbase

# One-time admin setup
./pocketbase setup
#   Email:    admin@creditax.ai
#   Password: <pick a strong one; export as POCKETBASE_ADMIN_PASSWORD>

# Start it (local dev, or run on your VPS as a systemd service)
./pocketbase serve --http 127.0.0.1:8090
```

The admin UI is at `http://127.0.0.1:8090/_/` — IP-whitelist or VPN-guard it.

## 2. Apply the migration

PocketBase supports raw SQL migrations from `pb_data/migrations/`:

```bash
mkdir -p pb_data/migrations
cp /path/to/creditax-ai/pb_migrations/0001_creditax_demo.sql pb_data/migrations/
./pocketbase migrate apply 0001
```

> If `migrate apply` does not recognise the SQL on your PocketBase build
> (older than 0.23), open the admin UI and create the collections manually from
> the DDL in the file — the schema is the source of truth.

## 3. Seed the demo

```bash
cd /path/to/creditax-ai
export POCKETBASE_ADMIN_EMAIL=admin@creditax.ai
export POCKETBASE_ADMIN_PASSWORD=<same one as above>

# node 22+ (has --experimental-strip-types)
node --experimental-strip-types scripts/seed-demo.ts

# node 20 (transpile the one TS file first)
npx tsc scripts/seed-demo.ts --outDir .tmp-seed --module nodenext --target es2022 \
  --esModuleInterop --moduleResolution nodenext --skipLibCheck
node .tmp-seed/seed-demo.js
rm -rf .tmp-seed
```

The seeder is idempotent — re-running it upserts by stable ids/slugs, never
duplicates.

## 4. Point the app at it

Add to `.env.local`:

```
NEXT_PUBLIC_USE_POCKETBASE=true
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

`pb-data.ts` will now read PocketBase first and fall back to the inlined seed
on any failure. The demo still *behaves correctly while knowing nothing real* —
that is the Track A rule (mvp-demo-plan.md §2).

## 5. Verify

```bash
curl -s http://127.0.0.1:8090/api/health          # 200 ok
curl -s -u admin@creditax.ai:<pw> \
  http://127.0.0.1:8090/api/collections            # lists 14 collections
```

Then in the app: sign in as each of the 4 demo roles (`login` page → role
picker → “Login →”) and confirm each lands on its correct home (`/dashboard`,
`/pro/dashboard`, `/admin/dashboard`, `/admin/dashboard`).

## 6. What P1 intentionally does NOT do

- No real RAG yet — chat still renders the seeded offline conversation. P2
  adds `POST /api/v1/chat` (embed → cosine → LLM) reading `kb_chunks`.
- No real billing — `subscriptions` is populated by mock; the upgrade wall is a
  toast. P4 adds Paystack/Flutterwave in Track B.
- No real BVN/Mono — `quotas.bvns_free_teaser` mirrors the price doc; P1 only
  stores counters, P4 enforces them.
