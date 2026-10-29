CREATE TABLE IF NOT EXISTS site_content (
  content_key TEXT PRIMARY KEY,
  content_value JSONB NOT NULL DEFAULT '""'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  organization TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  service_interest TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS page_views (
  id BIGSERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx ON contact_submissions(created_at DESC);

INSERT INTO site_content (content_key, content_value) VALUES
  ('office_address', '"Monrovia, Liberia"'::jsonb),
  ('tagline', '"Local Consultants with the Right Local Content Expertise"'::jsonb),
  ('home_intro_title', '"Your Partner in Strategy, Communication, and Innovation"'::jsonb),
  ('about_intro', '"We are a Liberia-based consultancy offering locally grounded support in strategy, communication, innovation, monitoring and evaluation, and technology."'::jsonb),
  ('contact_intro_title', '"Let’s discuss what is next."'::jsonb)
ON CONFLICT (content_key) DO NOTHING;

CREATE TABLE IF NOT EXISTS media_assets (
  id BIGSERIAL PRIMARY KEY,
  file_name TEXT NOT NULL,
  url TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
