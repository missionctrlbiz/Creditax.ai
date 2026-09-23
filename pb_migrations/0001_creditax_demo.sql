-- 0001_creditax_demo.sql
-- PocketBase SQL migration for the Creditax Track A demo.
-- Apply: ./pocketbase migrate apply 0001
--
-- All collections map 1:1 to the Supabase tables in API-Research.md §3.6/§3.7
-- for the Track B migration (pocketbase-demo-mvp-architecture.md §16.2).

-- ===== users (extends PocketBase built-in _users) =========================
-- PocketBase built-in auth fields (email, password, token_key, created, updated)
-- already exist on _users. We add:
ALTER TABLE _users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'consumer';
ALTER TABLE _users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE _users ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free';
ALTER TABLE _users ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en';
ALTER TABLE _users ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE _users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE _users ADD COLUMN IF NOT EXISTS avatar TEXT;

-- ===== kb_docs ============================================================
CREATE TABLE IF NOT EXISTS kb_docs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  jurisdiction TEXT DEFAULT 'federal',
  effective_date TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  content TEXT NOT NULL,
  file_path TEXT,
  file_size INTEGER,
  demo_seed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== kb_chunks ==========================================================
CREATE TABLE IF NOT EXISTS kb_chunks (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES kb_docs(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL DEFAULT 0,
  embedding TEXT,                -- JSON float[] (768-dim OpenRouter / 1536-dim Vertex)
  token_count INTEGER,
  metadata TEXT,                 -- JSON: { source, section }
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_chunks_doc ON kb_chunks(document_id);

-- ===== professionals ======================================================
CREATE TABLE IF NOT EXISTS professionals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  owner TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  website TEXT,
  cac_number TEXT NOT NULL,
  services TEXT NOT NULL,        -- JSON array ["VAT Filing", "Tax Audit", …]
  description TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  lat REAL,
  lng REAL,
  verified INTEGER DEFAULT 0,
  rating REAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  cac_certificate TEXT,         -- PB file reference (optional)
  avatar TEXT,                  -- PB file reference (optional)
  demo_seed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_pros_verified ON professionals(verified);

-- ===== conversations ======================================================
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_conv_user ON conversations(user_id);

-- ===== conversation_messages =============================================
CREATE TABLE IF NOT EXISTS conversation_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,           -- 'user' | 'assistant'
  kind TEXT,                    -- 'answer' | 'filing' | 'referral' | 'calc'
  text TEXT NOT NULL,
  sources TEXT,                 -- JSON array of source labels
  locale TEXT DEFAULT 'en',
  demo_seed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_msgs_conv ON conversation_messages(conversation_id);

-- ===== quotas =============================================================
CREATE TABLE IF NOT EXISTS quotas (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free',
  chat_today INTEGER DEFAULT 0,
  chat_cap INTEGER DEFAULT 5,
  lifetime_chats INTEGER DEFAULT 0,
  lifetime_cap INTEGER DEFAULT 60,
  calcs_today INTEGER DEFAULT 0,
  calcs_cap INTEGER DEFAULT 5,
  uploads_today INTEGER DEFAULT 0,
  uploads_cap INTEGER DEFAULT 2,
  reports_today INTEGER DEFAULT 0,
  bvns_used INTEGER DEFAULT 0,
  bvns_free_teaser INTEGER DEFAULT 2,
  bvns_monthly INTEGER DEFAULT 0,
  reset_date TEXT,              -- ISO date; counters reset at 00:00 WAT
  demo_seed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== notifications ======================================================
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL,           -- filing_deadline | document_processed | score_change | pro_referral
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  due TEXT,
  read INTEGER DEFAULT 0,
  demo_seed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id);

-- ===== subscriptions (mocked billing — real Paystack/Flutterwave in Track B)
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan TEXT NOT NULL,           -- 'plus' | 'professional' | 'enterprise'
  status TEXT DEFAULT 'active', -- active | cancelled | past_due
  billing_cycle TEXT DEFAULT 'monthly',
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  current_period_end TEXT,
  demo_seed INTEGER DEFAULT 0
);

-- ===== shared_links (canvas sharing — product-foundation §10) =============
CREATE TABLE IF NOT EXISTS shared_links (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  conversation_id TEXT,
  url_slug TEXT NOT NULL UNIQUE,
  access TEXT NOT NULL DEFAULT 'view',  -- 'view' | 'comment'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== invites (paid-only workspace invites) ============================
CREATE TABLE IF NOT EXISTS invites (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  token TEXT NOT NULL,
  status TEXT DEFAULT 'pending',  -- pending | accepted | revoked
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  accepted_at DATETIME
);

-- ===== api_keys (b2b-platform key management) ============================
CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  key TEXT NOT NULL,
  environment TEXT NOT NULL DEFAULT 'live',  -- live | test
  scopes TEXT NOT NULL DEFAULT '["Read","Write"]',  -- JSON array
  status TEXT NOT NULL DEFAULT 'active',     -- active | revoked
  usage INTEGER DEFAULT 0,
  limit INTEGER DEFAULT -1,                  -- -1 = unlimited
  created_by TEXT,
  last_used TEXT,
  demo_seed INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== webhooks (async chat delivery — P1 stub; Track B worker consumes) ==
CREATE TABLE IF NOT EXISTS webhooks (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  user_id TEXT,
  events TEXT,
  active INTEGER DEFAULT 1,
  demo_seed INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== connectors (external AI connector links) ===========================
CREATE TABLE IF NOT EXISTS connectors (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  service TEXT NOT NULL,      -- 'claude' | 'chatgpt' | 'notion' | 'google_drive'
  display_name TEXT,
  scope TEXT DEFAULT 'read',
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== documents (processed receipts/invoices/tax forms — doc-processing) =
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'needs-review',  -- extracted | needs-review | processing
  amount REAL DEFAULT 0,
  category TEXT,
  period TEXT,
  group TEXT,
  confidence REAL DEFAULT 0,
  demo_seed INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== reports ============================================================
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,         -- tax_calculation | credit_report | receipt_analysis
  date TEXT,
  size TEXT,
  file_path TEXT,             -- PB file reference
  download_url TEXT,
  demo_seed INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== waitlist (existing — keep) =========================================
CREATE TABLE IF NOT EXISTS waitlist (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'header',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ===== login_log (existing — keep) ========================================
CREATE TABLE IF NOT EXISTS login_log (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
