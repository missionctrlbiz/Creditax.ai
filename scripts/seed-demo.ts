/**
 * scripts/seed-demo.ts — one-shot Track A demo seeder.
 *
 * Requires a running PocketBase (default http://127.0.0.1:8090) with the
 * 0001 migration already applied. Run from the repo root:
 *
 *   ./pocketbase serve --http 127.0.0.1:8090 &      # start PB (or your VPS)
 *   /usr/local/bin/node --experimental-strip-types \
 *     scripts/seed-demo.ts
 *
 * (If your Node lacks type stripping, transpile with esbuild/tsc first, or use
 * `ts-node`. The PocketBase client is plain JS; only this script is TS.)
 *
 * It is idempotent: existing records (matched by stable ids / slugs) are
 * upserted, not duplicated. All records are flagged demo_seed=1.
 */

import PocketBase from 'pocketbase';
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  seedUsers,
  seedKbDocs,
  seedProfessionals,
  seedConversation,
  seedQuotas,
  seedNotifications,
} from '../src/lib/seed/demoSeed';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PB_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const PB_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@creditax.ai';
const PB_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || '';

const pb = new PocketBase(PB_URL);

function uid(prefix: string, name: string): string {
  // Deterministic, human-readable, stable-across-runs ids so re-seed is safe.
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${prefix}-${slug}`;
}

async function upsert(collection: string, record: Record<string, unknown>) {
  try {
    await pb.collection(collection).update(record.id as string, record);
    console.log(`  upsert ${collection}/${record.id}`);
  } catch {
    await pb.collection(collection).create(record);
    console.log(`  create ${collection}/${record.id}`);
  }
}

async function main() {
  console.log(`Connecting to PocketBase at ${PB_URL}…`);
  await pb.admins.authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
  console.log('Authed as admin.\n');

  // 1. Users (built-in auth collection) — seed the 4 role accounts
  console.log('[1/6] users');
  for (const u of seedUsers) {
    await upsert('_users', {
      id: u.id,
      email: u.email,
      password: 'demo', // demo-only; no real passwords (roles doc §2)
      name: u.name,
      role: u.role,
      tier: u.tier,
      locale: u.locale,
      verified: true,
    });
  }

  // 2. Knowledge base docs + chunks
  console.log('[2/6] kb_docs + kb_chunks');
  for (const doc of seedKbDocs) {
    await upsert('kb_docs', {
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      category: doc.category,
      status: doc.status,
      demo_seed: 1,
      // content: load the markdown if present on disk, else the chunks joined
      content: loadKbMarkdown(doc.slug),
    });
    for (let i = 0; i < doc.chunks.length; i++) {
      const c = doc.chunks[i];
      const chunkId = uid('chunk', `${doc.id}-${i}`);
      await upsert('kb_chunks', {
        id: chunkId,
        document_id: doc.id,
        chunk_text: c.text,
        chunk_index: i,
        embedding: c.embedding && c.embedding.length ? JSON.stringify(c.embedding) : '',
        token_count: c.text.split(/\s+/).length,
        metadata: JSON.stringify({ source: doc.title, section: c.section }),
      });
    }
  }

  // 3. Professionals
  console.log('[3/6] professionals');
  for (const p of seedProfessionals) {
    await upsert('professionals', {
      id: p.id,
      name: p.name,
      slug: p.slug,
      owner: p.owner,
      email: p.email,
      phone: p.phone,
      whatsapp: p.whatsapp ?? '',
      cac_number: p.cacNumber,
      services: JSON.stringify(p.services),
      address: p.location.address,
      city: p.location.city,
      state: p.location.state,
      lat: p.location.lat,
      lng: p.location.lng,
      verified: p.verified ? 1 : 0,
      rating: p.rating,
      review_count: p.reviewCount,
      demo_seed: 1,
    });
  }

  // 4. Conversation (seeded offline agent content)
  console.log('[4/6] conversation + messages');
  const convId = uid('conv', 'emeka-demo');
  await upsert('conversations', { id: convId, user_id: 'u-consumer', title: 'VAT & PAYE help' });
  for (const m of seedConversation) {
    await upsert('conversation_messages', {
      id: m.id,
      conversation_id: convId,
      role: m.role,
      kind: m.kind ?? '',
      text: m.text,
      sources: m.sources ? JSON.stringify(m.sources) : '',
      demo_seed: 1,
    });
  }

  // 5. Quotas
  console.log('[5/6] quotas');
  for (const q of seedQuotas) {
    await upsert('quotas', {
      id: uid('quota', q.userId),
      user_id: q.userId,
      tier: q.tier,
      chat_today: q.chatToday,
      chat_cap: q.chatCap,
      lifetime_chats: q.lifetimeChats,
      lifetime_cap: q.lifetimeCap,
      calcs_today: q.calcsToday,
      uploads_today: q.uploadsToday,
      bvns_used: q.bvnsUsed,
      bvns_free_teaser: q.bvnsFreeTeaser,
      demo_seed: 1,
    });
  }

  // 6. Notifications
  console.log('[6/6] notifications');
  for (const n of seedNotifications) {
    await upsert('notifications', {
      id: n.id,
      user_id: n.userId,
      kind: n.kind,
      title: n.title,
      body: n.body,
      due: n.due ?? '',
      read: n.read ? 1 : 0,
      demo_seed: 1,
    });
  }

  console.log('\nDone. Demo seed applied — switch on the app with NEXT_PUBLIC_USE_POCKETBASE=true.');
}

function loadKbMarkdown(slug: string): string {
  // Slug → file mapping (mirrors scripts/kb/*.md)
  const map: Record<string, string> = {
    'nta-2023': 'nta-2023.md',
    'ntaa-2023': 'ntaa-2023.md',
    'firs-vat-guide': 'firs-vat-guide.md',
    'paye-pit-rates': 'paye-pit.md',
    'witholding-tax-circulars': 'wht-circulars.md',
    'tax-clearance-certificate': 'tcc-guide.md',
  };
  const file = map[slug];
  if (!file) return '';
  const path = `${__dirname}/kb/${file}`;
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return `# ${slug} (missing markdown)`;
  }
}

main().catch((err) => {
  console.error('\nSeed failed:', err);
  process.exit(1);
});
