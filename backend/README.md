# FunTech Quiz Backend

Production-ready backend API for a college society quiz competition. Supports 100–150 concurrent users during a live quiz window.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Auth Flow (Read This First)](#auth-flow-read-this-first)
- [API Reference](#api-reference)
  - [Health Check](#health-check)
  - [Registration](#registration)
  - [Quiz Questions](#quiz-questions)
  - [Submit Answers](#submit-answers)
  - [Admin: Questions CRUD](#admin-questions-crud)
  - [Admin: Results](#admin-results)
  - [Admin: Participants](#admin-participants)
- [What the Frontend Needs to Know](#what-the-frontend-needs-to-know)
- [Concurrency & Reliability Design](#concurrency--reliability-design)
- [Running with PM2 (Production)](#running-with-pm2-production)
- [Tuning the MongoDB Connection Pool](#tuning-the-mongodb-connection-pool)

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally or a MongoDB Atlas connection string

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file from the template
cp .env.example .env

# 3. Edit .env — you MUST change JWT_SECRET and ADMIN_SECRET
#    Generate secrets with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 4. Start the dev server
npm run dev

# 5. Verify it's running
curl http://localhost:5000/health
```

The server runs on `http://localhost:5000` by default.

---

## Auth Flow (Read This First)

> **There is no login endpoint. There are no passwords.**

This is how authentication works:

1. A participant calls `POST /api/register` with their `name` and `email` (and optionally `rollNumber`).
2. The server creates their record and returns a **JWT token** (valid for 60 minutes by default).
3. The participant uses this token for all subsequent requests by sending it in the `Authorization` header:
   ```
   Authorization: Bearer <token>
   ```
4. **That's it.** There is no login, no logout, no refresh token. If the token expires, the participant must register again (but if they already submitted, they'll get an error — see below).

### One Attempt Per Email

- Each email address can only register **once** and submit **once**.
- If someone tries to register with an email that's already in the system:
  - If they haven't submitted yet: `409` — `"This email is already registered. Use your existing token to continue."`
  - If they've already submitted: `409` — `"You have already attempted this quiz."`

### What the Frontend Needs to Store

- **Just the JWT token.** Store it in `localStorage` or in-memory — either is fine for a 30–60 minute quiz.
- The token is valid for the duration specified in `JWT_EXPIRES_IN` (default: `60m`).
- No cookies, no refresh tokens, no session storage.

---

## API Reference

### Health Check

**`GET /health`** — No auth required

Checks if the server and database are operational. Use this before the quiz starts to confirm the system is alive.

**Response (200):**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-09-13T17:00:00.000Z",
  "uptime": 123.456,
  "database": "connected"
}
```

**Response (503 — DB down):**
```json
{
  "success": false,
  "status": "unhealthy",
  "database": "disconnected"
}
```

---

### Registration

**`POST /api/register`** — No auth required, rate-limited (10 req/IP/15min)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Participant's name |
| `email` | string | ✅ | Must be a valid email format, unique |
| `rollNumber` | string | ❌ | Optional, for club member verification |

**Request:**
```json
{
  "name": "Arjun Sharma",
  "email": "arjun@college.edu",
  "rollNumber": "CS2023045"
}
```

**Response (201 — Success):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "participant": {
      "id": "6505a1b2c3d4e5f6a7b8c9d0",
      "name": "Arjun Sharma",
      "email": "arjun@college.edu",
      "rollNumber": "CS2023045",
      "registeredAt": "2026-09-13T17:00:00.000Z",
      "submitted": false,
      "score": null,
      "timeTakenSeconds": null,
      "submittedAt": null
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "tokenExpiresIn": "60m"
  }
}
```

**Response (409 — Duplicate email):**
```json
{
  "success": false,
  "message": "You have already attempted this quiz."
}
```

**Response (400 — Validation error):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

---

### Quiz Questions

**`GET /api/quiz`** — Requires JWT

Returns all questions **without correct answers**. Also returns the quiz time limit so the frontend can start a timer.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "_id": "6505a2b3c4d5e6f7a8b9c0d1",
        "questionText": "What does HTML stand for?",
        "options": [
          { "key": "A", "text": "Hyper Text Markup Language" },
          { "key": "B", "text": "High Tech Modern Language" },
          { "key": "C", "text": "Home Tool Markup Language" },
          { "key": "D", "text": "Hyperlink and Text Markup Language" }
        ],
        "marks": 1,
        "order": 1
      }
    ],
    "totalQuestions": 20,
    "timeLimitSeconds": 1800
  }
}
```

**Response (401 — No/invalid token):**
```json
{
  "success": false,
  "message": "Access denied. No token provided. Send Authorization: Bearer <token>"
}
```

**Response (403 — Already submitted):**
```json
{
  "success": false,
  "message": "You have already submitted this quiz. Questions are no longer available."
}
```

---

### Submit Answers

**`POST /api/quiz/submit`** — Requires JWT, rate-limited (5 req/IP/15min)

Submit all answers at once. This endpoint is **atomic and idempotent** — if called twice, the second call returns `409`.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "answers": [
    { "questionId": "6505a2b3c4d5e6f7a8b9c0d1", "selectedOptionKey": "A" },
    { "questionId": "6505a2b3c4d5e6f7a8b9c0d2", "selectedOptionKey": "C" }
  ],
  "timeTakenSeconds": 845
}
```

**Response (200 — Success):**
```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "score": 15,
    "maxPossibleScore": 20,
    "totalQuestions": 20,
    "attempted": 20,
    "correct": 15,
    "incorrect": 5,
    "timeTakenSeconds": 845,
    "breakdown": [
      { "questionId": "6505a2b3c4d5e6f7a8b9c0d1", "selectedOptionKey": "A", "isCorrect": true },
      { "questionId": "6505a2b3c4d5e6f7a8b9c0d2", "selectedOptionKey": "C", "isCorrect": false }
    ]
  }
}
```

**Response (409 — Already submitted):**
```json
{
  "success": false,
  "message": "Already submitted. Each participant can only submit once."
}
```

---

### Admin: Questions CRUD

All admin endpoints require the `x-admin-secret` header:
```
x-admin-secret: <your ADMIN_SECRET from .env>
```

#### `POST /admin/questions` — Add a question

**Request:**
```json
{
  "questionText": "What does CSS stand for?",
  "options": [
    { "key": "A", "text": "Cascading Style Sheets" },
    { "key": "B", "text": "Creative Style System" },
    { "key": "C", "text": "Computer Style Sheets" },
    { "key": "D", "text": "Colorful Style Sheets" }
  ],
  "correctOptionKey": "A",
  "marks": 1,
  "order": 1
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Question created",
  "data": { "question": { ... } }
}
```

#### `GET /admin/questions` — List all questions (with correct answers)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "questions": [ ... ],
    "totalQuestions": 20
  }
}
```

#### `PUT /admin/questions/:id` — Update a question

Send only the fields you want to update.

#### `DELETE /admin/questions/:id` — Delete a question

**Response (200):**
```json
{
  "success": true,
  "message": "Question deleted"
}
```

---

### Admin: Results

**`GET /admin/results`** — Requires admin secret

Full leaderboard sorted by score (highest first), then time taken (lowest first) as tiebreaker.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "rank": 1,
        "name": "Arjun Sharma",
        "email": "arjun@college.edu",
        "rollNumber": "CS2023045",
        "score": 18,
        "timeTakenSeconds": 720,
        "submittedAt": "2026-09-13T17:35:00.000Z"
      }
    ],
    "totalSubmissions": 95
  }
}
```

---

### Admin: Participants

**`GET /admin/participants`** — Requires admin secret

List everyone who registered, with their attempt status.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "participants": [ ... ],
    "stats": {
      "totalRegistered": 120,
      "totalSubmitted": 95,
      "totalPending": 25
    }
  }
}
```

---

## What the Frontend Needs to Know

| Topic | Details |
|-------|---------|
| **Authentication** | No login page needed. Registration returns a JWT. Store it in `localStorage` or memory. |
| **Token format** | Send as `Authorization: Bearer <token>` on every request after registration. |
| **Token lifetime** | Default 60 minutes (configurable via `JWT_EXPIRES_IN` env var). |
| **One attempt rule** | Each email can register once and submit once. Handle `409` errors gracefully. |
| **Quiz timer** | The `GET /api/quiz` response includes `timeLimitSeconds`. Use this to run a client-side countdown. |
| **Submitting** | Send all answers at once to `POST /api/quiz/submit`. Include `timeTakenSeconds` (client-tracked). |
| **After submission** | The response includes the score and per-question breakdown immediately. |
| **Correct answers** | Never exposed before submission. After submission, the breakdown shows which answers were correct/incorrect. |

---

## Concurrency & Reliability Design

This section documents the engineering decisions that prevent data corruption, race conditions, and service outages during a live quiz with 100–150 concurrent users.

### Atomic Double-Submission Prevention

The submit endpoint uses MongoDB's `findOneAndUpdate` with a condition:

```javascript
Participant.findOneAndUpdate(
  { _id: participantId, submitted: false },  // only match if NOT yet submitted
  { $set: { submitted: true, score, answers, ... } },
  { new: true }
)
```

This is a single atomic operation — there is no "read, check, then write" gap. If two identical submit requests arrive simultaneously, MongoDB guarantees only one will match the `{ submitted: false }` condition. The other gets `null` back and receives a `409` response.

### Duplicate Email Protection

The `email` field has a **unique index** in MongoDB. Even if two registration requests for the same email arrive in the same millisecond, the database-level constraint ensures only one succeeds. The application catches the `E11000` duplicate key error and returns a friendly `409` message.

### Connection Pool Sizing

The Mongoose connection is configured with `maxPoolSize: 50` by default (tunable via `MONGO_POOL_SIZE` env var). This means up to 50 concurrent MongoDB operations can run without waiting. For a ~150 user quiz where each user makes 3-4 API calls total, this is more than sufficient.

### Rate Limiting

| Endpoint | Limit | Purpose |
|----------|-------|---------|
| `POST /api/register` | 10 req/IP/15min | Prevents spam registrations |
| `POST /api/quiz/submit` | 5 req/IP/15min | Prevents accidental double-submits |
| All endpoints | 100 req/IP/15min | General abuse prevention |

### Error Isolation

Every route handler is wrapped in `asyncHandler()` which catches rejected promises and forwards them to the global error handler. A single failing request (e.g., malformed input) never crashes the Node.js process.

### Indexes

| Collection | Field | Index Type | Purpose |
|------------|-------|------------|---------|
| Participant | `email` | Unique | Fast lookup + duplicate prevention |
| Participant | `submitted` | Standard | Fast admin queries for results/participants |
| Question | `order` | Standard | Sorted question retrieval |

---

## Running with PM2 (Production)

For a single quiz event with 100–150 users, a single Node.js process is likely sufficient (this is I/O-bound work, not CPU-bound). However, PM2 cluster mode provides:

- **Automatic restarts** if the process crashes
- **Multi-core utilization** if needed
- **Zero-downtime reload** for last-minute fixes

### Setup

```bash
# Install PM2 globally
npm install -g pm2

# Start in cluster mode (use number of CPU cores)
pm2 start src/server.js --name "quiz-api" -i max

# Or specify exact instance count
pm2 start src/server.js --name "quiz-api" -i 2

# Monitor
pm2 monit

# View logs
pm2 logs quiz-api

# Restart gracefully
pm2 reload quiz-api

# Stop
pm2 stop quiz-api
```

### Notes

- PM2 cluster mode works out of the box with this codebase because there is no in-memory shared state — all state lives in MongoDB.
- Rate limiting with `express-rate-limit` uses in-memory counters per process. In cluster mode, each worker has its own counters, so effective limits are multiplied by the number of workers. For this use case (preventing accidental retries, not DDoS protection), this is acceptable. For stricter enforcement, use the `rate-limit-redis` store.

---

## Tuning the MongoDB Connection Pool

The `MONGO_POOL_SIZE` env var controls `maxPoolSize` in the Mongoose connection options.

| Scenario | Recommended Pool Size |
|----------|----------------------|
| Development / testing | `10` |
| Quiz event (~150 users) | `50` (default) |
| Larger event (500+ users) | `100` |

**Rule of thumb:** Pool size should be roughly `concurrent_users / 3` because not all users hit the DB simultaneously, and each DB operation completes in milliseconds for this workload.

If you see `MongoServerSelectionError` or slow responses, increase the pool size. If MongoDB itself is the bottleneck, consider:
1. Adding a read replica for the admin results query
2. Using MongoDB Atlas with auto-scaling
3. Adding an index on any frequently queried field
