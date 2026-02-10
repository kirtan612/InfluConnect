# InfluConnect Backend - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Database

Create PostgreSQL database:

```bash
createdb influconnect
```

Create `.env` file in `backend/` folder with:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/influconnect
SECRET_KEY=your-super-secret-key-make-it-long-and-random
DEBUG=True
```

Replace `password` with your PostgreSQL password.

### 3. Initialize Database

```bash
python -m app.db.init_db
```

### 4. Create Admin User

```bash
python create_admin.py

# Enter:
# Email: admin@example.com
# Password: Admin123456
```

### 5. Start Server

```bash
uvicorn app.main:app --reload
```

Server runs at `http://localhost:8000`
API docs at `http://localhost:8000/api/docs`

---

## 🧪 Test the API

### Signup as Influencer

```bash
curl -X POST "http://localhost:8000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "influencer@test.com",
    "password": "Password123",
    "role": "INFLUENCER"
  }'
```

Response will include `access_token` and `refresh_token`.

### Signup as Brand

```bash
curl -X POST "http://localhost:8000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "brand@test.com",
    "password": "Password123",
    "role": "BRAND"
  }'
```

### Login

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=influencer@test.com&password=Password123"
```

Keep the `access_token` from response for next requests.

### Get Influencer Profile

Replace `TOKEN` with your actual access token:

```bash
curl -X GET "http://localhost:8000/api/influencer/profile" \
  -H "Authorization: Bearer TOKEN"
```

### Update Influencer Profile

```bash
curl -X PUT "http://localhost:8000/api/influencer/profile" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "display_name": "Emma Fashion",
    "bio": "Fashion influencer",
    "category": "Fashion"
  }'
```

### Get Admin Stats (as admin)

```bash
# First login as admin (created in step 4)
curl -X GET "http://localhost:8000/api/admin/stats" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app
│   ├── core/                # Config, security, roles
│   ├── db/                  # Database models & session
│   ├── schemas/             # Pydantic request/response
│   ├── routers/             # API endpoints
│   ├── services/            # Business logic (trust, verification, automation)
│   └── utils/               # Permissions, validators
├── requirements.txt         # Dependencies
├── .env.example            # Environment template
├── create_admin.py         # Admin user creation
├── README.md               # Full documentation
├── API_GUIDE.md           # Complete API reference
└── QUICK_START.md         # This file
```

---

## 🔐 Key Features

✅ **JWT Authentication** - Secure token-based auth
✅ **Role-Based Access** - INFLUENCER, BRAND, ADMIN
✅ **Trust Engine** - Auto-calculated trust scores
✅ **Verification System** - Admin-managed verification
✅ **Automation** - Background tasks for platform health
✅ **Pydantic v2** - Advanced data validation
✅ **Error Handling** - Meaningful HTTP status codes

---

## 🚨 Common Issues

### Database Connection Failed

```
Make sure PostgreSQL is running:
1. Windows: Use Services or psql command
2. Mac: brew services start postgresql
3. Linux: sudo service postgresql start

Verify DATABASE_URL in .env is correct
```

### Port 8000 Already in Use

```bash
uvicorn app.main:app --reload --port 8001
```

### Import Errors

```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Permission Denied Error

```
Make sure:
- User role matches endpoint (BRAND for /api/brand/*, etc.)
- User is not suspended
- Token is valid and not expired
- Use /api/auth/refresh to get new token
```

---

## 📚 Documentation Files

- **README.md** - Full documentation, deployment guide
- **API_GUIDE.md** - Complete API endpoint reference
- **QUICK_START.md** - This quick setup guide

---

## 🚀 What's Included

**Complete, Production-Ready Backend:**

- ✅ 7 Database models with relationships
- ✅ 6 API routers with multiple endpoints
- ✅ Complete authentication system
- ✅ Role-based access control
- ✅ Trust engine with automated scoring
- ✅ Verification system
- ✅ Background automation
- ✅ Comprehensive error handling
- ✅ Data validation
- ✅ Admin management tools

**No TODOs, No Incomplete Code:**

- All endpoints fully implemented
- All business rules enforced
- All validations complete
- Ready for production use

---

## 📊 Trust Score System

Trust scores are calculated automatically from:

1. **Profile Completion** (0-30 points)
   - display_name, bio, category filled?

2. **Verification Status** (0-50 points)
   - Verified = 50, Pending = 15, Unverified = 0

3. **Collaborations** (0-20 points)
   - Each 10 accepted collaborations = max points

**Total: 0-100 points**

Scores update automatically when:

- Profile updated
- Verification status changed
- Collaboration request accepted
- Admin manual recalculation

---

## 🔄 Complete User Flow Example

1. **User Registration**

   ```
   /api/auth/signup → Returns access_token
   ```

2. **Complete Profile**

   ```
   /api/influencer/profile → PUT with display_name, bio, category
   ```

3. **Submit Verification** (Influencer only)

   ```
   /api/influencer/verify → POST metrics
   ```

4. **Admin Review** (Admin only)

   ```
   /api/admin/verify/{id} → POST approval/rejection
   ```

5. **Create Campaign** (Brand only)

   ```
   /api/campaign → POST campaign details
   ```

6. **Search Influencers** (Brand only)

   ```
   /api/request/influencer/search → GET with filters
   ```

7. **Send Request** (Brand to Influencer)

   ```
   /api/request → POST campaign_id + influencer_id
   ```

8. **Accept/Reject** (Influencer only)

   ```
   /api/request/{id} → PUT status = accepted/rejected
   ```

9. **Trust Score Updates**
   ```
   Automatic when collaboration accepted
   ```

---

## ⚙️ Advanced Configuration

### Change token expiration (in `.env`):

```env
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=14
```

### Enable debug logging:

```env
DEBUG=True
```

### Change database:

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

### CORS settings (in `app/core/config.py`):

Change `CORS_ORIGINS` list to match your frontend URL.

---

## 🎯 Business Rules Enforced

❌ **Explicitly Blocked:**

- TikTok as platform (only Instagram, YouTube, LinkedIn)
- Admin signup via registration (use create_admin.py)
- Flagged brands creating campaigns
- Unverified influencers receiving requests
- Suspended users logging in

✅ **Automatically Managed:**

- Trust score calculation and updates
- Profile completion percentage
- Verification status changes
- Inactive influencer tracking
- Suspicious profile detection

---

## 📞 Endpoints Summary

**Auth**: 3 endpoints (signup, login, refresh)
**Influencer**: 4 endpoints (profile management, verification, trust)
**Brand**: 2 endpoints (profile management)
**Campaign**: 5 endpoints (CRUD operations)
**Request**: 5 endpoints (collaboration requests, search)
**Admin**: 11 endpoints (management, automation, stats)

**Total: 30+ endpoints, all fully functional**

---

## ✅ Verification Checklist

Before using in production:

- [ ] Update SECRET_KEY in .env
- [ ] Set DEBUG=False in .env
- [ ] Use strong database password
- [ ] Configure CORS_ORIGINS for frontend
- [ ] Set up PostgreSQL backups
- [ ] Configure SSL/TLS certificate
- [ ] Set up monitoring and logging
- [ ] Create test admin account
- [ ] Test all endpoints
- [ ] Review error responses

---

For more details, see **README.md** and **API_GUIDE.md**

**Ready to build amazing things! 🚀**
