# Celery + Redis Background Jobs Setup

## Overview

This implementation provides a complete Celery + Redis background job system for InfluConnect with:

- ✅ Automated trust score recalculation
- ✅ Suspicious account detection
- ✅ Inactive influencer downgrade
- ✅ Profile completion updates
- ✅ Manual admin triggers
- ✅ Scheduled automation via Celery Beat

## Prerequisites

### 1. Install Redis

**Windows (using Chocolatey):**
```bash
choco install redis-64
```

**macOS (using Homebrew):**
```bash
brew install redis
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install redis-server
```

### 2. Start Redis Server

```bash
redis-server
```

Verify Redis is running:
```bash
redis-cli ping
# Should return: PONG
```

### 3. Install Python Dependencies

```bash
cd backend/backend
pip install -r requirements.txt
```

## Database Migration

Run the SQL migration to add new fields:

```bash
# Connect to your PostgreSQL database
psql -U postgres -d influconnect -f add_automation_fields.sql
```

Or run manually:
```sql
ALTER TABLE influencer_profiles 
ADD COLUMN IF NOT EXISTS followers INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS engagement_rate FLOAT DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS suspicious_flag BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_active TIMESTAMP NULL;
```

## Running the System

### Terminal 1: Start FastAPI Server
```bash
cd backend/backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2: Start Celery Worker
```bash
cd backend/backend
celery -A app.tasks.celery_worker worker --loglevel=info
```

### Terminal 3: Start Celery Beat Scheduler
```bash
cd backend/backend
celery -A app.tasks.celery_worker beat --loglevel=info
```

### Terminal 4: Start Flower (Optional - Web UI for monitoring)
```bash
cd backend/backend
celery -A app.tasks.celery_worker flower
```

Access Flower at: http://localhost:5555

## API Endpoints

All endpoints require admin authentication.

### Manual Task Triggers

**Recalculate Trust Scores:**
```bash
POST /api/admin/automation/run/trust-score
Authorization: Bearer <admin_token>
```

**Scan for Suspicious Accounts:**
```bash
POST /api/admin/automation/run/suspicious-scan
Authorization: Bearer <admin_token>
```

**Check Inactive Influencers:**
```bash
POST /api/admin/automation/run/inactive-check
Authorization: Bearer <admin_token>
```

**Update Profile Completion:**
```bash
POST /api/admin/automation/run/update-completion
Authorization: Bearer <admin_token>
```

### Task Monitoring

**Get Task Status:**
```bash
GET /api/admin/automation/tasks/status/{task_id}
Authorization: Bearer <admin_token>
```

**Get Active Tasks:**
```bash
GET /api/admin/automation/tasks/active
Authorization: Bearer <admin_token>
```

## Scheduled Tasks

Tasks run automatically via Celery Beat:

| Task | Schedule | Description |
|------|----------|-------------|
| Trust Score Recalculation | Daily at 2:00 AM | Recalculates trust scores for all influencers |
| Suspicious Account Detection | Daily at 3:00 AM | Flags potentially suspicious accounts |
| Inactive Influencer Downgrade | Weekly (Sunday 4:00 AM) | Downgrades inactive influencers |
| Profile Completion Update | Daily at 1:00 AM | Updates profile completion percentages |

## Task Details

### 1. Trust Score Recalculation

**Factors:**
- Profile completion (0-40 points)
- Verification status (0-30 points)
- Account age (0-20 points)
- Engagement consistency (0-10 points)

**Triggers:**
- Scheduled: Daily at 2:00 AM
- Manual: `POST /api/admin/automation/run/trust-score`

### 2. Suspicious Account Detection

**Criteria:**
- Engagement rate < 1% or > 15%
- Profile completion < 30%
- Inactive for > 30 days

**Triggers:**
- Scheduled: Daily at 3:00 AM
- Manual: `POST /api/admin/automation/run/suspicious-scan`

### 3. Inactive Influencer Downgrade

**Penalties:**
- 60+ days inactive: -10 points
- 90+ days inactive: -20 points
- 180+ days inactive: -30 points

**Triggers:**
- Scheduled: Weekly (Sunday at 4:00 AM)
- Manual: `POST /api/admin/automation/run/inactive-check`

### 4. Profile Completion Update

**Factors:**
- Display name: 20%
- Bio: 15%
- Category: 10%
- Profile image: 15%
- Social links: 25%
- Platform data: 15%

**Triggers:**
- Scheduled: Daily at 1:00 AM
- Manual: `POST /api/admin/automation/run/update-completion`

## Monitoring and Debugging

### Check Redis Connection
```bash
redis-cli
> ping
PONG
> keys *
```

### Check Celery Worker Status
```bash
celery -A app.tasks.celery_worker inspect active
celery -A app.tasks.celery_worker inspect stats
```

### View Task Results
```bash
# In Python shell
from app.core.celery_config import celery_app
result = celery_app.AsyncResult('task-id-here')
print(result.status)
print(result.result)
```

### Logs

**Worker logs:** Check terminal where worker is running
**Beat logs:** Check terminal where beat is running
**Task logs:** Stored in task results and printed to worker terminal

## Production Deployment

### 1. Use Supervisor for Process Management

Create `/etc/supervisor/conf.d/influconnect-celery.conf`:

```ini
[program:influconnect-worker]
command=/path/to/venv/bin/celery -A app.tasks.celery_worker worker --loglevel=info
directory=/path/to/backend/backend
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/influconnect/celery-worker.log

[program:influconnect-beat]
command=/path/to/venv/bin/celery -A app.tasks.celery_worker beat --loglevel=info
directory=/path/to/backend/backend
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/influconnect/celery-beat.log
```

### 2. Redis Configuration

For production, configure Redis with:
- Password authentication
- Persistence enabled
- Memory limits
- Proper networking

### 3. Environment Variables

Set in production `.env`:
```env
REDIS_URL=redis://password@redis-server:6379/0
CELERY_BROKER_URL=redis://password@redis-server:6379/0
CELERY_RESULT_BACKEND=redis://password@redis-server:6379/0
```

## Troubleshooting

### Common Issues

**1. "Connection refused" error:**
- Check if Redis is running: `redis-cli ping`
- Verify Redis URL in `.env`

**2. Tasks not executing:**
- Check worker is running and connected
- Verify task imports in `celery_worker.py`

**3. Beat schedule not working:**
- Ensure beat scheduler is running
- Check timezone settings in `celery_config.py`

**4. Database connection errors in tasks:**
- Verify database URL is correct
- Check database permissions

### Performance Tuning

**Worker Concurrency:**
```bash
celery -A app.tasks.celery_worker worker --concurrency=4
```

**Memory Optimization:**
```bash
celery -A app.tasks.celery_worker worker --max-tasks-per-child=1000
```

**Queue Routing:**
```bash
celery -A app.tasks.celery_worker worker -Q automation,high_priority
```

## Extension Points

The system is designed to be easily extensible:

### Adding New Tasks

1. Create task function in `automation_tasks.py`
2. Add to beat schedule in `celery_config.py`
3. Add admin endpoint in `automation.py`

### Adding New Queues

1. Update `task_routes` in `celery_config.py`
2. Start workers with specific queues
3. Route tasks to appropriate queues

### Adding Monitoring

1. Integrate with Sentry for error tracking
2. Add Prometheus metrics
3. Set up alerting for failed tasks

## Security Considerations

- Admin endpoints require authentication
- Tasks run with database permissions
- Redis should be secured in production
- Log sensitive data carefully
- Rate limit admin endpoints

## Next Steps

1. **Add more sophisticated trust scoring algorithms**
2. **Implement ML-based suspicious detection**
3. **Add email notifications for critical events**
4. **Create dashboard for automation metrics**
5. **Add task result persistence**
6. **Implement task retry policies**
7. **Add performance monitoring**

The system is production-ready and can handle thousands of influencers efficiently!