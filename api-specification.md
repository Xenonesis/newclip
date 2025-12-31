# API Specification

## ClipFlow AI - RESTful API v1

> **Base URL:** `https://api.clipflow.ai/v1`  
> **Auth:** Bearer Token (API Key or JWT)

---

## 🔐 Authentication

```bash
curl -X GET "https://api.clipflow.ai/v1/videos" \
  -H "Authorization: Bearer cf_live_xxxxxxxxxxxxx"
```

### Rate Limits

| Plan     | Requests/Day | Requests/Minute |
| -------- | ------------ | --------------- |
| Free     | 100          | 10              |
| Pro      | 1,000        | 60              |
| Business | 10,000       | 120             |
| Agency   | Unlimited    | 600             |

---

## 📚 Core Endpoints

### Videos

| Method   | Endpoint       | Description                |
| -------- | -------------- | -------------------------- |
| `POST`   | `/videos`      | Upload video (file or URL) |
| `GET`    | `/videos`      | List all videos            |
| `GET`    | `/videos/{id}` | Get video details          |
| `DELETE` | `/videos/{id}` | Delete video               |

#### Upload Video

```http
POST /videos
Content-Type: multipart/form-data
```

**Request:**

```json
{
  "url": "https://youtube.com/watch?v=xxx",
  "title": "My Video",
  "auto_generate_clips": true,
  "clip_settings": {
    "max_clips": 10,
    "target_duration": { "min": 30, "max": 60 }
  }
}
```

**Response:**

```json
{
  "id": "vid_abc123",
  "status": "processing",
  "duration_seconds": 3600,
  "processing_progress": 5,
  "created_at": "2024-12-31T12:00:00Z"
}
```

---

### Clips

| Method   | Endpoint               | Description      |
| -------- | ---------------------- | ---------------- |
| `POST`   | `/videos/{id}/clips`   | Generate clips   |
| `GET`    | `/clips`               | List all clips   |
| `GET`    | `/clips/{id}`          | Get clip details |
| `PATCH`  | `/clips/{id}`          | Update clip      |
| `DELETE` | `/clips/{id}`          | Delete clip      |
| `GET`    | `/clips/{id}/download` | Download clip    |

#### Generate Clips

```json
{
  "max_clips": 10,
  "platforms": ["tiktok", "instagram", "youtube-shorts"],
  "aspect_ratios": ["9:16", "1:1"],
  "captions": {
    "enabled": true,
    "style": "hormozi",
    "language": "en"
  }
}
```

#### Clip Response

```json
{
  "id": "clip_def456",
  "video_id": "vid_abc123",
  "title": "AI Will Change Everything",
  "start_time": 245.5,
  "end_time": 287.2,
  "duration_seconds": 41.7,
  "file_urls": {
    "9:16": "https://cdn.clipflow.ai/clips/clip_def456_9x16.mp4",
    "16:9": "https://cdn.clipflow.ai/clips/clip_def456_16x9.mp4"
  },
  "virality_score": 87,
  "hook_score": 92,
  "topics": ["AI", "future"],
  "captions": {
    "srt_url": "https://cdn.clipflow.ai/captions/clip_def456.srt"
  }
}
```

---

### Social Accounts

| Method   | Endpoint                              | Description             |
| -------- | ------------------------------------- | ----------------------- |
| `GET`    | `/social-accounts`                    | List connected accounts |
| `GET`    | `/social-accounts/connect/{platform}` | OAuth connect           |
| `DELETE` | `/social-accounts/{id}`               | Disconnect account      |

**Platforms:** `instagram`, `tiktok`, `youtube`, `facebook`, `linkedin`, `twitter`, `pinterest`, `threads`

---

### Posts

| Method   | Endpoint              | Description          |
| -------- | --------------------- | -------------------- |
| `POST`   | `/posts`              | Create/schedule post |
| `GET`    | `/posts`              | List posts           |
| `GET`    | `/posts/{id}`         | Get post details     |
| `PATCH`  | `/posts/{id}`         | Update post          |
| `DELETE` | `/posts/{id}`         | Cancel/delete post   |
| `POST`   | `/posts/{id}/publish` | Publish now          |

#### Create Post

```json
{
  "social_account_ids": ["sa_abc123"],
  "clip_id": "clip_def456",
  "caption": "Check this out! 🔥\n\n#AI #tips",
  "scheduled_at": "2024-12-31T18:00:00Z",
  "platform_options": {
    "instagram": { "first_comment": "Link in bio!" }
  }
}
```

---

### Analytics

| Method | Endpoint                   | Description         |
| ------ | -------------------------- | ------------------- |
| `GET`  | `/analytics/accounts/{id}` | Account analytics   |
| `GET`  | `/analytics/posts/{id}`    | Post analytics      |
| `GET`  | `/analytics/content`       | Content performance |

#### Account Analytics Response

```json
{
  "summary": {
    "total_views": 245000,
    "total_likes": 12450,
    "engagement_rate": 5.2,
    "followers_gained": 1234
  },
  "timeseries": [...]
}
```

---

### Jobs

| Method | Endpoint            | Description    |
| ------ | ------------------- | -------------- |
| `GET`  | `/jobs/{id}`        | Get job status |
| `POST` | `/jobs/{id}/cancel` | Cancel job     |

---

### Webhooks

| Method   | Endpoint         | Description    |
| -------- | ---------------- | -------------- |
| `GET`    | `/webhooks`      | List webhooks  |
| `POST`   | `/webhooks`      | Create webhook |
| `DELETE` | `/webhooks/{id}` | Delete webhook |

#### Webhook Events

- `video.processed`, `video.failed`
- `clip.generated`, `clip.approved`
- `post.scheduled`, `post.published`, `post.failed`
- `account.connected`, `account.expired`

---

## 🛠️ SDKs

### Node.js

```javascript
import { ClipFlow } from "@clipflow/sdk";
const client = new ClipFlow({ apiKey: "cf_live_xxx" });

const video = await client.videos.create({ url: "https://youtube.com/..." });
const clips = await client.clips.list({ videoId: video.id });
```

### Python

```python
from clipflow import ClipFlow
client = ClipFlow(api_key='cf_live_xxx')

video = client.videos.create(url='https://youtube.com/...')
clips = client.clips.list(video_id=video.id)
```

---

## ❌ Error Codes

| Code               | Status | Description              |
| ------------------ | ------ | ------------------------ |
| `UNAUTHORIZED`     | 401    | Invalid API key          |
| `FORBIDDEN`        | 403    | Insufficient permissions |
| `NOT_FOUND`        | 404    | Resource not found       |
| `VALIDATION_ERROR` | 400    | Invalid parameters       |
| `RATE_LIMITED`     | 429    | Rate limit exceeded      |
| `QUOTA_EXCEEDED`   | 402    | Usage quota exceeded     |

**OpenAPI Spec:** `https://api.clipflow.ai/docs`
