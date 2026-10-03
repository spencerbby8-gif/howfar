# HowFar — Backend, Database & Infrastructure Specification

> **Serverless & Distributed Edge Architecture for HowFar**  
> Built for zero algorithmic distortion, global real-time distance sync, and media delivery.

---

## 1. Cloud Architecture Overview

```
[Mobile / Web Clients]
          │
          ▼
[Cloudflare Edge Workers / Netlify Edge]
  ├── Geolocation Ingest (CF-IPCountry, CF-IPCity, Lat/Long headers)
  ├── Distance Radius Partitioning (Haversine calculation at the edge)
  │
  ├──► [Supabase PostgreSQL Database] (Metadata, receipts, reactions, strata)
  ├──► [Cloudflare R2 / S3 Object Storage] (Photo stills, 15s moments, video reactions)
  └──► [WebSocket / SSE Relay] (Live broadcast moments & comet flight pings)
```

---

## 2. PostgreSQL / Supabase Schema

```sql
-- Profiles & Creators
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    home_city TEXT NOT NULL,
    home_lat DOUBLE PRECISION NOT NULL,
    home_lng DOUBLE PRECISION NOT NULL,
    total_km_traveled BIGINT DEFAULT 0,
    cities_reached INT DEFAULT 1,
    flares_kept INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts & Moments
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    origin_city TEXT NOT NULL,
    origin_lat DOUBLE PRECISION NOT NULL,
    origin_lng DOUBLE PRECISION NOT NULL,
    media_url TEXT,
    media_type TEXT CHECK (media_type IN ('STILL', 'MOMENT', 'TEXT')),
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ -- For stills: created_at + interval '48 hours'
);

-- Video Reactions
CREATE TABLE video_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    video_url TEXT NOT NULL,
    duration_ms INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments & Replies
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content_text TEXT,
    voice_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Private Flares (No public counts)
CREATE TABLE flares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);
```

---

## 3. Distance & Decay Edge Engine

### 3.1 Proximity Query (Near Scope)
```sql
-- Returns posts within 50km radius, sorted by arrival time
SELECT p.*,
       (6371 * acos(cos(radians($1)) * cos(radians(p.origin_lat)) *
       cos(radians(p.origin_lng) - radians($2)) +
       sin(radians($1)) * sin(radians(p.origin_lat)))) AS distance_km
FROM posts p
WHERE (6371 * acos(cos(radians($1)) * cos(radians(p.origin_lat)) *
      cos(radians(p.origin_lng) - radians($2)) +
      sin(radians($1)) * sin(radians(p.origin_lat)))) <= 50
ORDER BY p.created_at DESC
LIMIT 50;
```

### 3.2 Traveled Query (Far Scope)
```sql
-- Returns posts beyond 50km, sorted by distance traveled
SELECT p.*,
       (6371 * acos(cos(radians($1)) * cos(radians(p.origin_lat)) *
       cos(radians(p.origin_lng) - radians($2)) +
       sin(radians($1)) * sin(radians(p.origin_lat)))) AS distance_km
FROM posts p
WHERE (6371 * acos(cos(radians($1)) * cos(radians(p.origin_lat)) *
      cos(radians(p.origin_lng) - radians($2)) +
      sin(radians($1)) * sin(radians(p.origin_lat)))) > 50
ORDER BY distance_km DESC, p.created_at DESC
LIMIT 50;
```
