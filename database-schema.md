# Database Schema

## ClipFlow AI - PostgreSQL Database Design

> **Version:** 1.0  
> **Database:** PostgreSQL 15+  
> **ORM:** Prisma

---

## 📊 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    DATABASE SCHEMA                                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌──────────────┐       ┌──────────────┐       ┌──────────────┐                        │
│  │    Users     │──────<│  Workspaces  │>──────│ TeamMembers  │                        │
│  └──────┬───────┘       └──────┬───────┘       └──────────────┘                        │
│         │                      │                                                        │
│         │              ┌───────┴────────┐                                              │
│         │              │                │                                              │
│         ▼              ▼                ▼                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                                   │
│  │Subscriptions │ │SocialAccounts│ │   Projects   │                                   │
│  └──────────────┘ └──────┬───────┘ └──────┬───────┘                                   │
│                          │                │                                            │
│                          │         ┌──────┴───────┐                                   │
│                          │         │              │                                    │
│                          ▼         ▼              ▼                                    │
│                   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                  │
│                   │    Posts     │ │   Videos     │ │   Assets     │                  │
│                   └──────┬───────┘ └──────┬───────┘ └──────────────┘                  │
│                          │                │                                            │
│                          │                ▼                                            │
│                   ┌──────┴───────┐ ┌──────────────┐                                   │
│                   │              │ │    Clips     │                                   │
│                   ▼              │ └──────┬───────┘                                   │
│            ┌──────────────┐      │        │                                           │
│            │ PostMetrics  │      │        ▼                                           │
│            └──────────────┘      │ ┌──────────────┐                                   │
│                                  │ │  Captions    │                                   │
│                                  │ └──────────────┘                                   │
│                                  │                                                     │
│                                  ▼                                                     │
│                           ┌──────────────┐                                            │
│                           │  Comments    │                                            │
│                           └──────────────┘                                            │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Core Tables

### Users & Authentication

```sql
-- ═══════════════════════════════════════════════════════════════
-- USERS TABLE
-- Core user account information
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255),  -- NULL for OAuth users
    name            VARCHAR(255) NOT NULL,
    avatar_url      TEXT,
    email_verified  BOOLEAN DEFAULT FALSE,

    -- OAuth providers
    google_id       VARCHAR(255) UNIQUE,
    github_id       VARCHAR(255) UNIQUE,
    twitter_id      VARCHAR(255) UNIQUE,

    -- Settings
    timezone        VARCHAR(50) DEFAULT 'UTC',
    language        VARCHAR(10) DEFAULT 'en',
    theme           VARCHAR(20) DEFAULT 'dark',

    -- Metadata
    last_login_at   TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE  -- Soft delete
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);

-- ═══════════════════════════════════════════════════════════════
-- SESSIONS TABLE
-- Active user sessions
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      VARCHAR(255) NOT NULL,
    device_info     JSONB,
    ip_address      INET,
    expires_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token_hash);

-- ═══════════════════════════════════════════════════════════════
-- API KEYS TABLE
-- Developer API keys
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE api_keys (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workspace_id    UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    key_hash        VARCHAR(255) NOT NULL,
    key_prefix      VARCHAR(20) NOT NULL,  -- For display: "cf_live_12ab..."
    scopes          TEXT[] DEFAULT '{}',
    rate_limit      INTEGER DEFAULT 1000,  -- Requests per day
    last_used_at    TIMESTAMP WITH TIME ZONE,
    expires_at      TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at      TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_api_keys_key_prefix ON api_keys(key_prefix);
```

### Subscriptions & Billing

```sql
-- ═══════════════════════════════════════════════════════════════
-- SUBSCRIPTION PLANS TABLE
-- Available pricing tiers
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE subscription_plans (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(50) NOT NULL,  -- free, starter, pro, business, agency
    display_name        VARCHAR(100) NOT NULL,
    description         TEXT,

    -- Pricing
    price_monthly       DECIMAL(10,2) NOT NULL,
    price_yearly        DECIMAL(10,2),
    stripe_price_id     VARCHAR(255),

    -- Limits
    videos_per_month    INTEGER NOT NULL,
    clips_per_video     INTEGER,  -- NULL = unlimited
    max_video_duration  INTEGER NOT NULL,  -- In seconds
    export_quality      VARCHAR(20) NOT NULL,  -- 720p, 1080p, 4k
    social_accounts     INTEGER NOT NULL,
    team_members        INTEGER NOT NULL,
    api_requests_daily  INTEGER,  -- NULL = unlimited
    storage_gb          INTEGER NOT NULL,

    -- Features (JSON flags)
    features            JSONB NOT NULL DEFAULT '{}',

    -- Metadata
    is_active           BOOLEAN DEFAULT TRUE,
    sort_order          INTEGER DEFAULT 0,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- SUBSCRIPTIONS TABLE
-- User subscriptions
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE subscriptions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id                 UUID NOT NULL REFERENCES subscription_plans(id),

    -- Stripe integration
    stripe_customer_id      VARCHAR(255),
    stripe_subscription_id  VARCHAR(255),

    -- Status
    status                  VARCHAR(50) NOT NULL DEFAULT 'active',
    -- active, past_due, canceled, trialing, paused

    -- Billing cycle
    billing_cycle           VARCHAR(20) NOT NULL DEFAULT 'monthly',
    current_period_start    TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end      TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end    BOOLEAN DEFAULT FALSE,

    -- Usage tracking
    videos_used             INTEGER DEFAULT 0,
    api_requests_today      INTEGER DEFAULT 0,
    storage_used_bytes      BIGINT DEFAULT 0,

    -- Trial
    trial_ends_at           TIMESTAMP WITH TIME ZONE,

    -- Metadata
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

-- ═══════════════════════════════════════════════════════════════
-- USAGE LOGS TABLE
-- Daily usage tracking for billing
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE usage_logs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id     UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    date                DATE NOT NULL,

    -- Daily counts
    videos_processed    INTEGER DEFAULT 0,
    clips_generated     INTEGER DEFAULT 0,
    posts_scheduled     INTEGER DEFAULT 0,
    api_requests        INTEGER DEFAULT 0,
    storage_delta_bytes BIGINT DEFAULT 0,

    -- Cost calculation (for metered billing)
    processing_minutes  DECIMAL(10,2) DEFAULT 0,

    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(subscription_id, date)
);

CREATE INDEX idx_usage_logs_date ON usage_logs(subscription_id, date);
```

### Workspaces & Teams

```sql
-- ═══════════════════════════════════════════════════════════════
-- WORKSPACES TABLE
-- Team/organization workspaces
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE workspaces (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) UNIQUE NOT NULL,
    owner_id        UUID NOT NULL REFERENCES users(id),

    -- Branding (for white-label)
    logo_url        TEXT,
    primary_color   VARCHAR(7),  -- #RRGGBB
    custom_domain   VARCHAR(255),

    -- Settings
    settings        JSONB DEFAULT '{}',

    -- Metadata
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX idx_workspaces_slug ON workspaces(slug);

-- ═══════════════════════════════════════════════════════════════
-- TEAM MEMBERS TABLE
-- Workspace membership with roles
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE team_members (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Role: owner, admin, editor, scheduler, viewer, client
    role            VARCHAR(50) NOT NULL DEFAULT 'viewer',

    -- Permissions override (JSON)
    custom_permissions JSONB,

    -- Invitation
    invited_by      UUID REFERENCES users(id),
    invited_at      TIMESTAMP WITH TIME ZONE,
    accepted_at     TIMESTAMP WITH TIME ZONE,

    -- Metadata
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(workspace_id, user_id)
);

CREATE INDEX idx_team_members_workspace ON team_members(workspace_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);

-- ═══════════════════════════════════════════════════════════════
-- INVITATIONS TABLE
-- Pending team invitations
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE invitations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    email           VARCHAR(255) NOT NULL,
    role            VARCHAR(50) NOT NULL DEFAULT 'viewer',
    token           VARCHAR(255) UNIQUE NOT NULL,
    invited_by      UUID NOT NULL REFERENCES users(id),
    expires_at      TIMESTAMP WITH TIME ZONE NOT NULL,
    accepted_at     TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_email ON invitations(email);
```

### Social Media Accounts

```sql
-- ═══════════════════════════════════════════════════════════════
-- SOCIAL ACCOUNTS TABLE
-- Connected social media accounts
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE social_accounts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id        UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

    -- Platform info
    platform            VARCHAR(50) NOT NULL,
    -- instagram, tiktok, youtube, facebook, linkedin, twitter, pinterest, threads

    platform_user_id    VARCHAR(255) NOT NULL,
    username            VARCHAR(255),
    display_name        VARCHAR(255),
    profile_image_url   TEXT,

    -- OAuth tokens (encrypted)
    access_token        TEXT NOT NULL,
    refresh_token       TEXT,
    token_expires_at    TIMESTAMP WITH TIME ZONE,

    -- Account metadata
    account_type        VARCHAR(50),  -- personal, business, creator
    follower_count      INTEGER,

    -- Connection status
    status              VARCHAR(50) DEFAULT 'active',
    -- active, expired, revoked, error
    last_error          TEXT,
    last_sync_at        TIMESTAMP WITH TIME ZONE,

    -- Metadata
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(workspace_id, platform, platform_user_id)
);

CREATE INDEX idx_social_accounts_workspace ON social_accounts(workspace_id);
CREATE INDEX idx_social_accounts_platform ON social_accounts(platform);
```

### Videos & Clips

```sql
-- ═══════════════════════════════════════════════════════════════
-- VIDEOS TABLE
-- Source videos uploaded for processing
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE videos (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id        UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    uploaded_by         UUID NOT NULL REFERENCES users(id),

    -- Video info
    title               VARCHAR(500),
    description         TEXT,
    source_type         VARCHAR(50) NOT NULL,  -- upload, youtube, drive, dropbox
    source_url          TEXT,

    -- File info
    file_url            TEXT NOT NULL,
    file_size_bytes     BIGINT,
    duration_seconds    INTEGER,
    width               INTEGER,
    height              INTEGER,
    fps                 DECIMAL(5,2),
    codec               VARCHAR(50),

    -- Thumbnail
    thumbnail_url       TEXT,

    -- Processing status
    status              VARCHAR(50) DEFAULT 'pending',
    -- pending, processing, transcribing, analyzing, generating_clips, completed, failed
    processing_progress INTEGER DEFAULT 0,  -- 0-100
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,
    error_message       TEXT,

    -- Transcription
    transcript          JSONB,  -- Word-level timestamps
    language_detected   VARCHAR(10),

    -- AI Analysis
    topics              TEXT[],
    key_moments         JSONB,  -- Timestamps with descriptions

    -- Tags & organization
    tags                TEXT[],
    folder_id           UUID,

    -- Metadata
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at          TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_videos_workspace ON videos(workspace_id);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_created ON videos(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- CLIPS TABLE
-- Generated short clips from videos
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE clips (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id            UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    workspace_id        UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

    -- Clip info
    title               VARCHAR(500),
    description         TEXT,

    -- Timing
    start_time          DECIMAL(10,3) NOT NULL,  -- Seconds
    end_time            DECIMAL(10,3) NOT NULL,
    duration_seconds    DECIMAL(10,3) GENERATED ALWAYS AS (end_time - start_time) STORED,

    -- File info (per aspect ratio)
    file_urls           JSONB NOT NULL DEFAULT '{}',
    -- { "9:16": "url", "16:9": "url", "1:1": "url" }

    thumbnail_url       TEXT,

    -- AI Scores
    virality_score      INTEGER,  -- 0-100
    hook_score          INTEGER,  -- 0-100
    engagement_score    INTEGER,  -- 0-100

    -- AI Analysis
    topics              TEXT[],
    emotions            TEXT[],
    transcript_segment  TEXT,

    -- Editing
    has_captions        BOOLEAN DEFAULT FALSE,
    caption_style       VARCHAR(50),
    has_music           BOOLEAN DEFAULT FALSE,
    music_track_id      UUID,
    edits_json          JSONB,  -- Timeline edits

    -- Status
    status              VARCHAR(50) DEFAULT 'generated',
    -- generated, edited, approved, rejected, published

    -- Approval workflow
    approved_by         UUID REFERENCES users(id),
    approved_at         TIMESTAMP WITH TIME ZONE,
    rejection_reason    TEXT,

    -- Usage tracking
    times_published     INTEGER DEFAULT 0,

    -- Metadata
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at          TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_clips_video ON clips(video_id);
CREATE INDEX idx_clips_workspace ON clips(workspace_id);
CREATE INDEX idx_clips_virality ON clips(virality_score DESC);
CREATE INDEX idx_clips_created ON clips(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- CAPTIONS TABLE
-- Caption tracks for clips
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE captions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clip_id         UUID NOT NULL REFERENCES clips(id) ON DELETE CASCADE,

    -- Style
    style           VARCHAR(50) NOT NULL,  -- hormozi, minimal, bold, etc.
    font_family     VARCHAR(100),
    font_size       INTEGER,
    font_color      VARCHAR(7),
    background_color VARCHAR(9),  -- With alpha: #RRGGBBAA
    position        VARCHAR(20) DEFAULT 'bottom',

    -- Words with timing
    words           JSONB NOT NULL,
    -- [{ "word": "Hello", "start": 0.5, "end": 0.8, "confidence": 0.98 }]

    -- Rendered file
    srt_url         TEXT,
    vtt_url         TEXT,

    -- Language
    language        VARCHAR(10) NOT NULL DEFAULT 'en',

    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_captions_clip ON captions(clip_id);
```

### Posts & Scheduling

```sql
-- ═══════════════════════════════════════════════════════════════
-- POSTS TABLE
-- Scheduled and published social media posts
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE posts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id        UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    social_account_id   UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
    clip_id             UUID REFERENCES clips(id) ON DELETE SET NULL,

    -- Content
    caption             TEXT,
    hashtags            TEXT[],
    mentions            TEXT[],

    -- Media
    media_urls          TEXT[] NOT NULL,
    media_type          VARCHAR(50) NOT NULL,  -- video, image, carousel
    thumbnail_url       TEXT,

    -- Platform-specific
    platform_options    JSONB DEFAULT '{}',
    -- { "firstComment": "...", "coverFrame": 5, "shareToStory": true }

    -- Scheduling
    status              VARCHAR(50) DEFAULT 'draft',
    -- draft, scheduled, publishing, published, failed, deleted
    scheduled_at        TIMESTAMP WITH TIME ZONE,
    published_at        TIMESTAMP WITH TIME ZONE,

    -- Platform response
    platform_post_id    VARCHAR(255),
    platform_url        TEXT,
    publish_error       TEXT,

    -- Approval workflow
    needs_approval      BOOLEAN DEFAULT FALSE,
    approved_by         UUID REFERENCES users(id),
    approved_at         TIMESTAMP WITH TIME ZONE,

    -- Analytics
    last_metrics_sync   TIMESTAMP WITH TIME ZONE,

    -- Created by
    created_by          UUID NOT NULL REFERENCES users(id),

    -- Metadata
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at          TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_posts_workspace ON posts(workspace_id);
CREATE INDEX idx_posts_social_account ON posts(social_account_id);
CREATE INDEX idx_posts_scheduled ON posts(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX idx_posts_status ON posts(status);

-- ═══════════════════════════════════════════════════════════════
-- POST METRICS TABLE
-- Performance metrics for published posts
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE post_metrics (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id         UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,

    -- Timestamp of metrics snapshot
    recorded_at     TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Engagement metrics
    views           BIGINT DEFAULT 0,
    likes           INTEGER DEFAULT 0,
    comments        INTEGER DEFAULT 0,
    shares          INTEGER DEFAULT 0,
    saves           INTEGER DEFAULT 0,

    -- Video metrics
    watch_time_seconds  BIGINT DEFAULT 0,
    avg_watch_percent   DECIMAL(5,2),

    -- Reach metrics
    impressions     BIGINT DEFAULT 0,
    reach           BIGINT DEFAULT 0,

    -- Profile metrics
    profile_visits  INTEGER DEFAULT 0,
    follows         INTEGER DEFAULT 0,

    -- Link metrics
    link_clicks     INTEGER DEFAULT 0,

    -- Raw platform data
    raw_data        JSONB,

    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_post_metrics_post ON post_metrics(post_id);
CREATE INDEX idx_post_metrics_recorded ON post_metrics(post_id, recorded_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- COMMENTS TABLE
-- Comments from social platforms (for unified inbox)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE comments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id             UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    social_account_id   UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,

    -- Platform data
    platform_comment_id VARCHAR(255) NOT NULL,
    parent_comment_id   UUID REFERENCES comments(id),  -- For replies

    -- Author
    author_id           VARCHAR(255),
    author_username     VARCHAR(255),
    author_display_name VARCHAR(255),
    author_avatar_url   TEXT,

    -- Content
    text                TEXT NOT NULL,

    -- Sentiment (AI analyzed)
    sentiment           VARCHAR(20),  -- positive, negative, neutral
    sentiment_score     DECIMAL(4,3),

    -- Status
    is_read             BOOLEAN DEFAULT FALSE,
    is_archived         BOOLEAN DEFAULT FALSE,
    is_spam             BOOLEAN DEFAULT FALSE,

    -- Our response
    replied             BOOLEAN DEFAULT FALSE,
    replied_by          UUID REFERENCES users(id),
    replied_at          TIMESTAMP WITH TIME ZONE,
    reply_text          TEXT,

    -- Platform timestamps
    posted_at           TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Metadata
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_unread ON comments(social_account_id, is_read) WHERE NOT is_read;
CREATE INDEX idx_comments_posted ON comments(posted_at DESC);
```

### Content Assets & Templates

```sql
-- ═══════════════════════════════════════════════════════════════
-- ASSETS TABLE
-- Media assets (images, music, fonts, etc.)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE assets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID REFERENCES workspaces(id) ON DELETE CASCADE,  -- NULL for system assets

    -- Asset info
    name            VARCHAR(255) NOT NULL,
    type            VARCHAR(50) NOT NULL,  -- image, video, audio, font
    category        VARCHAR(50),  -- logo, b-roll, music, sfx, thumbnail

    -- File
    file_url        TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type       VARCHAR(100),

    -- Dimensions (for images/video)
    width           INTEGER,
    height          INTEGER,
    duration_seconds DECIMAL(10,3),

    -- Licensing
    license_type    VARCHAR(50) DEFAULT 'user_uploaded',
    -- user_uploaded, royalty_free, licensed, ai_generated
    attribution     TEXT,

    -- Metadata
    tags            TEXT[],
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_assets_workspace ON assets(workspace_id);
CREATE INDEX idx_assets_type ON assets(type);

-- ═══════════════════════════════════════════════════════════════
-- TEMPLATES TABLE
-- Video and post templates
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE templates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID REFERENCES workspaces(id) ON DELETE CASCADE,  -- NULL for system templates

    -- Template info
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    type            VARCHAR(50) NOT NULL,  -- video, caption, post
    category        VARCHAR(100),  -- marketing, education, lifestyle, etc.

    -- Preview
    thumbnail_url   TEXT,
    preview_url     TEXT,

    -- Template data
    template_data   JSONB NOT NULL,
    -- For video: { layers: [...], duration: 30, aspectRatio: "9:16" }
    -- For caption: { style: "hormozi", font: "Inter", ... }

    -- Usage stats
    usage_count     INTEGER DEFAULT 0,

    -- Visibility
    is_public       BOOLEAN DEFAULT FALSE,
    is_premium      BOOLEAN DEFAULT FALSE,

    -- Metadata
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_templates_workspace ON templates(workspace_id);
CREATE INDEX idx_templates_category ON templates(category);

-- ═══════════════════════════════════════════════════════════════
-- BRAND KITS TABLE
-- Brand assets and guidelines per workspace
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE brand_kits (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL DEFAULT 'Default',

    -- Colors
    primary_color   VARCHAR(7),
    secondary_color VARCHAR(7),
    accent_color    VARCHAR(7),
    background_color VARCHAR(7),
    text_color      VARCHAR(7),

    -- Typography
    heading_font    VARCHAR(100),
    body_font       VARCHAR(100),

    -- Logos
    logo_url        TEXT,
    logo_dark_url   TEXT,
    icon_url        TEXT,

    -- Watermark
    watermark_url   TEXT,
    watermark_position VARCHAR(20),
    watermark_opacity DECIMAL(3,2),

    -- Voice & Tone
    voice_guidelines TEXT,

    -- Hashtags & Mentions
    default_hashtags TEXT[],
    default_mentions TEXT[],

    is_default      BOOLEAN DEFAULT FALSE,

    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_brand_kits_workspace ON brand_kits(workspace_id);
```

### Jobs & Processing Queue

```sql
-- ═══════════════════════════════════════════════════════════════
-- JOBS TABLE
-- Background processing jobs
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE jobs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

    -- Job info
    type            VARCHAR(50) NOT NULL,
    -- video_process, clip_generate, post_publish, metrics_sync, export

    -- Related entities
    video_id        UUID REFERENCES videos(id) ON DELETE CASCADE,
    clip_id         UUID REFERENCES clips(id) ON DELETE CASCADE,
    post_id         UUID REFERENCES posts(id) ON DELETE CASCADE,

    -- Queue management
    priority        INTEGER DEFAULT 0,  -- Higher = more priority
    attempts        INTEGER DEFAULT 0,
    max_attempts    INTEGER DEFAULT 3,

    -- Status
    status          VARCHAR(50) DEFAULT 'pending',
    -- pending, processing, completed, failed, cancelled

    -- Progress
    progress        INTEGER DEFAULT 0,  -- 0-100
    progress_message TEXT,

    -- Timing
    started_at      TIMESTAMP WITH TIME ZONE,
    completed_at    TIMESTAMP WITH TIME ZONE,

    -- Input/Output
    input_data      JSONB,
    output_data     JSONB,
    error           TEXT,

    -- Worker info
    worker_id       VARCHAR(100),

    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_jobs_status ON jobs(status, priority DESC, created_at);
CREATE INDEX idx_jobs_workspace ON jobs(workspace_id);
CREATE INDEX idx_jobs_video ON jobs(video_id);

-- ═══════════════════════════════════════════════════════════════
-- WEBHOOKS TABLE
-- Outgoing webhook configurations
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE webhooks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

    -- Webhook config
    url             TEXT NOT NULL,
    secret          VARCHAR(255) NOT NULL,  -- For signature verification

    -- Events to trigger
    events          TEXT[] NOT NULL,
    -- ['video.processed', 'clip.generated', 'post.published']

    -- Status
    is_active       BOOLEAN DEFAULT TRUE,

    -- Stats
    last_triggered_at   TIMESTAMP WITH TIME ZONE,
    last_response_code  INTEGER,
    failure_count       INTEGER DEFAULT 0,

    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_webhooks_workspace ON webhooks(workspace_id);

-- ═══════════════════════════════════════════════════════════════
-- WEBHOOK LOGS TABLE
-- Webhook delivery logs
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE webhook_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id      UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,

    -- Event
    event_type      VARCHAR(100) NOT NULL,
    event_id        UUID NOT NULL,

    -- Request
    request_body    JSONB NOT NULL,

    -- Response
    response_code   INTEGER,
    response_body   TEXT,
    response_time_ms INTEGER,

    -- Status
    success         BOOLEAN NOT NULL,
    error           TEXT,

    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_webhook_logs_webhook ON webhook_logs(webhook_id, created_at DESC);
```

### Analytics & Audit

```sql
-- ═══════════════════════════════════════════════════════════════
-- AUDIT LOGS TABLE
-- Security and compliance audit trail
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID REFERENCES workspaces(id) ON DELETE SET NULL,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Action info
    action          VARCHAR(100) NOT NULL,
    -- user.login, video.upload, clip.delete, settings.update, etc.

    resource_type   VARCHAR(50),
    resource_id     UUID,

    -- Details
    details         JSONB,

    -- Context
    ip_address      INET,
    user_agent      TEXT,

    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_workspace ON audit_logs(workspace_id, created_at DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action, created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- ACCOUNT ANALYTICS TABLE
-- Aggregated social account analytics (daily)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE account_analytics (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    social_account_id   UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
    date                DATE NOT NULL,

    -- Follower metrics
    followers           INTEGER,
    followers_gained    INTEGER,
    followers_lost      INTEGER,

    -- Engagement totals
    total_views         BIGINT,
    total_likes         INTEGER,
    total_comments      INTEGER,
    total_shares        INTEGER,

    -- Posting
    posts_published     INTEGER,

    -- Engagement rate
    engagement_rate     DECIMAL(5,2),

    -- Demographics (sampled)
    demographics        JSONB,

    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(social_account_id, date)
);

CREATE INDEX idx_account_analytics_account_date ON account_analytics(social_account_id, date DESC);
```

---

## 🔧 Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String?   @map("password_hash")
  name          String
  avatarUrl     String?   @map("avatar_url")
  emailVerified Boolean   @default(false) @map("email_verified")

  googleId      String?   @unique @map("google_id")
  githubId      String?   @unique @map("github_id")
  twitterId     String?   @unique @map("twitter_id")

  timezone      String    @default("UTC")
  language      String    @default("en")
  theme         String    @default("dark")

  lastLoginAt   DateTime? @map("last_login_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")

  // Relations
  subscription    Subscription?
  ownedWorkspaces Workspace[]     @relation("WorkspaceOwner")
  memberships     TeamMember[]
  videos          Video[]
  posts           Post[]          @relation("PostCreator")
  approvals       Post[]          @relation("PostApprover")
  sessions        Session[]
  apiKeys         ApiKey[]

  @@map("users")
}

model Workspace {
  id            String    @id @default(uuid())
  name          String
  slug          String    @unique
  ownerId       String    @map("owner_id")

  logoUrl       String?   @map("logo_url")
  primaryColor  String?   @map("primary_color")
  customDomain  String?   @map("custom_domain")

  settings      Json      @default("{}")

  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")

  // Relations
  owner          User            @relation("WorkspaceOwner", fields: [ownerId], references: [id])
  members        TeamMember[]
  socialAccounts SocialAccount[]
  videos         Video[]
  clips          Clip[]
  posts          Post[]
  brandKits      BrandKit[]
  assets         Asset[]
  templates      Template[]
  jobs           Job[]
  webhooks       Webhook[]

  @@map("workspaces")
}

model Video {
  id                    String    @id @default(uuid())
  workspaceId           String    @map("workspace_id")
  uploadedBy            String    @map("uploaded_by")

  title                 String?
  description           String?
  sourceType            String    @map("source_type")
  sourceUrl             String?   @map("source_url")

  fileUrl               String    @map("file_url")
  fileSizeBytes         BigInt?   @map("file_size_bytes")
  durationSeconds       Int?      @map("duration_seconds")
  width                 Int?
  height                Int?

  thumbnailUrl          String?   @map("thumbnail_url")

  status                String    @default("pending")
  processingProgress    Int       @default(0) @map("processing_progress")
  errorMessage          String?   @map("error_message")

  transcript            Json?
  languageDetected      String?   @map("language_detected")
  topics                String[]
  keyMoments            Json?     @map("key_moments")

  tags                  String[]

  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  deletedAt             DateTime? @map("deleted_at")

  // Relations
  workspace             Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  uploader              User      @relation(fields: [uploadedBy], references: [id])
  clips                 Clip[]

  @@map("videos")
}

model Clip {
  id                UUID      @id @default(uuid())
  videoId           String    @map("video_id")
  workspaceId       String    @map("workspace_id")

  title             String?
  description       String?

  startTime         Decimal   @map("start_time")
  endTime           Decimal   @map("end_time")

  fileUrls          Json      @default("{}") @map("file_urls")
  thumbnailUrl      String?   @map("thumbnail_url")

  viralityScore     Int?      @map("virality_score")
  hookScore         Int?      @map("hook_score")
  engagementScore   Int?      @map("engagement_score")

  topics            String[]
  emotions          String[]

  hasCaptions       Boolean   @default(false) @map("has_captions")
  captionStyle      String?   @map("caption_style")

  status            String    @default("generated")

  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")
  deletedAt         DateTime? @map("deleted_at")

  // Relations
  video             Video     @relation(fields: [videoId], references: [id], onDelete: Cascade)
  workspace         Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  captions          Caption[]
  posts             Post[]

  @@map("clips")
}

model Post {
  id                String    @id @default(uuid())
  workspaceId       String    @map("workspace_id")
  socialAccountId   String    @map("social_account_id")
  clipId            String?   @map("clip_id")

  caption           String?
  hashtags          String[]
  mentions          String[]

  mediaUrls         String[]  @map("media_urls")
  mediaType         String    @map("media_type")

  status            String    @default("draft")
  scheduledAt       DateTime? @map("scheduled_at")
  publishedAt       DateTime? @map("published_at")

  platformPostId    String?   @map("platform_post_id")
  platformUrl       String?   @map("platform_url")

  createdBy         String    @map("created_by")
  approvedBy        String?   @map("approved_by")

  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")
  deletedAt         DateTime? @map("deleted_at")

  // Relations
  workspace         Workspace      @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  socialAccount     SocialAccount  @relation(fields: [socialAccountId], references: [id], onDelete: Cascade)
  clip              Clip?          @relation(fields: [clipId], references: [id], onDelete: SetNull)
  creator           User           @relation("PostCreator", fields: [createdBy], references: [id])
  approver          User?          @relation("PostApprover", fields: [approvedBy], references: [id])
  metrics           PostMetric[]
  comments          Comment[]

  @@map("posts")
}

// ... Additional models follow same pattern
```

---

## 📋 Migrations Checklist

- [ ] Initial schema creation
- [ ] Add indexes for common queries
- [ ] Set up foreign key constraints
- [ ] Create materialized views for analytics
- [ ] Add database functions for computed fields
- [ ] Set up row-level security (RLS)
- [ ] Configure connection pooling (PgBouncer)
- [ ] Set up read replicas for scaling

---

## 🔒 Security Considerations

1. **Encryption**: All sensitive fields (tokens, keys) encrypted at application level
2. **RLS**: Row-Level Security for multi-tenant data isolation
3. **Audit**: Complete audit trail via `audit_logs` table
4. **Soft Deletes**: Use `deleted_at` for data recovery
5. **Indexes**: Optimized for common query patterns
