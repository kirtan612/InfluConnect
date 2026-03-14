# Redis Setup for Windows - Complete Guide

## The Error You're Seeing

```
redis-server : The term 'redis-server' is not recognized as the name of a cmdlet, function, script file, or operable program.
```

This means Redis is not installed on your Windows system.

---

## Installation Options

### Option 1: Install Redis using Chocolatey (Recommended)

**Step 1: Install Chocolatey (if not already installed)**
Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

**Step 2: Install Redis**
```powershell
choco install redis-64
```

**Step 3: Start Redis**
```powershell
redis-server
```

---

### Option 2: Install Redis using Windows Subsystem for Linux (WSL)

**Step 1: Install WSL2**
```powershell
wsl --install
```

**Step 2: Install Redis in WSL**
```bash
sudo apt update
sudo apt install redis-server
```

**Step 3: Start Redis**
```bash
sudo service redis-server start
```

---

### Option 3: Use Docker (Alternative)

**Step 1: Install Docker Desktop**
Download from: https://www.docker.com/products/docker-desktop

**Step 2: Run Redis Container**
```powershell
docker run -d -p 6379:6379 --name redis redis:alpine
```

**Step 3: Verify Redis is Running**
```powershell
docker ps
```

---

### Option 4: Manual Installation (Advanced)

**Step 1: Download Redis for Windows**
- Go to: https://github.com/microsoftarchive/redis/releases
- Download the latest .msi file
- Install it

**Step 2: Add Redis to PATH**
- Add `C:\Program Files\Redis` to your system PATH
- Restart PowerShell

**Step 3: Start Redis**
```powershell
redis-server
```

---

## Quick Setup (Recommended for Development)

### Using Chocolatey (Easiest)

1. **Open PowerShell as Administrator**
2. **Install Chocolatey:**
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

3. **Install Redis:**
   ```powershell
   choco install redis-64
   ```

4. **Start Redis:**
   ```powershell
   redis-server
   ```

5. **Test Redis (in new terminal):**
   ```powershell
   redis-cli ping
   ```
   Should return: `PONG`

---

## Alternative: Use Redis Cloud (No Installation Required)

If you don't want to install Redis locally, you can use a cloud Redis service:

### Redis Cloud (Free Tier)

1. **Sign up at:** https://redis.com/try-free/
2. **Create a free database**
3. **Get connection details**
4. **Update your .env file:**

```env
# Replace localhost with your Redis Cloud details
REDIS_URL=redis://username:password@redis-host:port/0
CELERY_BROKER_URL=redis://username:password@redis-host:port/0
CELERY_RESULT_BACKEND=redis://username:password@redis-host:port/0
```

---

## Verification Steps

After installing Redis, verify it's working:

### Test 1: Check Redis Server
```powershell
redis-server
```
Should show:
```
[28550] 01 Jan 00:00:00.000 * Ready to accept connections
```

### Test 2: Test Redis Client (in new terminal)
```powershell
redis-cli ping
```
Should return: `PONG`

### Test 3: Test from Python
```python
import redis
r = redis.Redis(host='localhost', port=6379, db=0)
print(r.ping())  # Should print True
```

---

## Troubleshooting

### Issue: "Access is denied" when installing Chocolatey
**Solution:** Run PowerShell as Administrator

### Issue: "redis-server" still not recognized after installation
**Solution:** 
1. Restart PowerShell
2. Check if Redis is in PATH: `where redis-server`
3. If not found, add Redis installation directory to PATH

### Issue: Redis starts but can't connect
**Solution:**
1. Check if Windows Firewall is blocking port 6379
2. Try: `redis-cli -h 127.0.0.1 -p 6379 ping`

### Issue: Permission denied on WSL
**Solution:**
```bash
sudo chown redis:redis /var/lib/redis
sudo service redis-server restart
```

---

## Configuration for InfluConnect

Once Redis is running, your InfluConnect automation system will work with these settings:

**backend/backend/.env:**
```env
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

---

## Starting Your Development Environment

After Redis is installed and running:

### Terminal 1: Redis Server
```powershell
redis-server
```

### Terminal 2: Backend API
```powershell
cd backend/backend
source venv/Scripts/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 3: Celery Worker
```powershell
cd backend/backend
source venv/Scripts/activate
celery -A app.tasks.celery_worker worker --loglevel=info
```

### Terminal 4: Celery Beat (Scheduler)
```powershell
cd backend/backend
source venv/Scripts/activate
celery -A app.tasks.celery_worker beat --loglevel=info
```

### Terminal 5: Frontend (Optional)
```powershell
cd frontend
npm run dev
```

---

## Production Deployment

For production on Windows Server:

### Using Windows Service

1. **Install Redis as Windows Service:**
   ```powershell
   redis-server --service-install
   redis-server --service-start
   ```

2. **Configure Redis:**
   Edit `redis.windows.conf`:
   ```
   bind 127.0.0.1
   port 6379
   requirepass your-secure-password
   ```

3. **Update .env for production:**
   ```env
   REDIS_URL=redis://:your-secure-password@localhost:6379/0
   CELERY_BROKER_URL=redis://:your-secure-password@localhost:6379/0
   CELERY_RESULT_BACKEND=redis://:your-secure-password@localhost:6379/0
   ```

---

## Summary

**For Development (Easiest):**
1. Install Chocolatey
2. Run: `choco install redis-64`
3. Start: `redis-server`
4. Test: `redis-cli ping`

**For Production:**
- Use Redis Cloud or install as Windows Service
- Configure authentication and persistence
- Set up monitoring and backups

**Alternative (No Installation):**
- Use Redis Cloud free tier
- Update .env with cloud connection details

Choose the option that works best for your setup!