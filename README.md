# InfluConnect 🚀  
**Trust-First Influencer Discovery Platform**

InfluConnect is a modern, data-driven web platform that helps companies discover **credible, relevant influencers** and helps influencers showcase **trust, professionalism, and proof of work** — without chat, payments, or social-media noise.

The platform focuses on **discovery, trust, and transparency**, not transactions.

---

## 🧠 Product Philosophy

> Remove bias. Build trust. Enable meaningful collaborations.

- No chat or messaging
- No payments or escrow
- No social feeds, likes, or comments
- No AI black-box recommendations
- Explainable, rule-based logic
- Verification as a **trust badge**, not a gatekeeper

---

## 👥 User Roles

InfluConnect supports **exactly three roles**:

### 1️⃣ Company
- Create a professional company profile
- Define campaign interests
- Discover influencers using filters & recommendations
- View influencer portfolio-style profiles
- Send collaboration requests (intent-based)
- Track request status (Pending / Accepted / Rejected)

### 2️⃣ Influencer
- Create a public professional profile
- Add achievements / proof of work
- Browse company campaigns
- View company profiles
- Accept or reject collaboration requests
- May receive a **Verified badge** (granted by Admin only)

### 3️⃣ Admin
- Grant or revoke **Verified badges**
- Maintain platform trust
- Manage categories (optional)
- View high-level platform stats

> Admin does **NOT** approve influencer existence, manage collaborations, or handle payments.

---

## ✨ Core Features

### 🔍 Influencer Discovery
- Card-based influencer browsing
- Filters: category, platform, location, budget, followers, engagement
- Explainable “Why recommended” indicators
- Verified badge as a trust signal

### 🧑‍🎨 Influencer Profiles (Portfolio-Style)
- Inspired by LinkedIn + Instagram (visual, not social)
- Image-based profile header (content images)
- Stats highlights (followers, views, engagement)
- Trust badges
- Achievements gallery (proof of work)
- Sticky “Send Collaboration Request” CTA

### 🏢 Company Profiles
- Professional brand identity
- Campaign interests (mandatory)
- Visible to influencers
- Profile completeness indicator

### 🤝 Collaboration Requests (No Chat)
- Intent-based collaboration flow
- Companies send requests
- Influencers accept or reject
- Contact details revealed only after acceptance

### 🛡️ Verified Badge System
- Optional and rare
- Granted or revoked by Admin only
- Influencers cannot self-verify
- Badge signals credibility, not permission

---

## 🧭 Platform Flow

### Company Flow
1. Sign in → Create Company Profile
2. Define campaign interests
3. Discover influencers
4. View influencer profiles
5. Send collaboration request
6. Track request status

### Influencer Flow
1. Sign in → Create Influencer Profile
2. Add achievements / proof of work
3. Browse campaigns
4. Receive / send collaboration intents
5. (Optional) Receive Verified badge from Admin

### Admin Flow
1. Review influencer profiles
2. Grant / revoke Verified badge
3. Manage categories (optional)

---

## 🧑‍💻 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS v4
- Axios
- Role-based routing
- Modern, responsive UI (no sidebar)

### Backend
- FastAPI (Python)
- REST APIs
- JWT Authentication (access + refresh tokens)
- Google OAuth (Company & Influencer)
- Admin created manually

### Database
- PostgreSQL
- SQLAlchemy ORM
- Relational schema with proper foreign keys

---

## 🔐 Authentication

- Google OAuth (auto-verified email)
- Email + password (fallback)
- Role selection after login (Company / Influencer)
- Admin role created manually
- Secure JWT-based auth

## Team
- Kirtan Jogani (Backend)
- Man Dhanani (Frontend)
