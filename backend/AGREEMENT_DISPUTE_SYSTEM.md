# Agreement and Dispute Management System

## Overview
Complete implementation of Agreement Acceptance and Dispute Management system integrated into the existing InfluConnect campaign module.

---

## FEATURE 1: AGREEMENT ACCEPTANCE

### Database Fields Added to `campaigns` Table

```sql
brand_accepted_terms         BOOLEAN   DEFAULT FALSE
brand_accepted_at            TIMESTAMP NULL
influencer_accepted_terms    BOOLEAN   DEFAULT FALSE
influencer_accepted_at       TIMESTAMP NULL
```

### API Endpoints

#### 1. Brand Accepts Agreement
```http
POST /api/campaigns/{campaign_id}/brand-accept
Authorization: Bearer {token}
```

**Rules:**
- Only the campaign owner (brand) can accept
- Cannot accept twice
- Sets `brand_accepted_terms = True` and timestamp
- If both parties accepted → campaign status becomes `ACTIVE`

**Response:**
```json
{
  "message": "Brand successfully accepted the agreement",
  "campaign_id": 123,
  "accepted_by": "brand",
  "accepted_at": "2024-03-18T10:30:00Z",
  "both_accepted": false,
  "campaign_status": "pending_agreement"
}
```

#### 2. Influencer Accepts Agreement
```http
POST /api/campaigns/{campaign_id}/influencer-accept
Authorization: Bearer {token}
```

**Rules:**
- Only the assigned influencer can accept
- Must be part of an active collaboration
- Cannot accept twice
- Sets `influencer_accepted_terms = True` and timestamp
- If both parties accepted → campaign status becomes `ACTIVE`

**Response:**
```json
{
  "message": "Influencer successfully accepted the agreement",
  "campaign_id": 123,
  "accepted_by": "influencer",
  "accepted_at": "2024-03-18T11:00:00Z",
  "both_accepted": true,
  "campaign_status": "active"
}
```

#### 3. Get Agreement Status
```http
GET /api/campaigns/{campaign_id}/agreement-status
Authorization: Bearer {token}
```

**Response:**
```json
{
  "campaign_id": 123,
  "brand_accepted": true,
  "brand_accepted_at": "2024-03-18T10:30:00Z",
  "influencer_accepted": true,
  "influencer_accepted_at": "2024-03-18T11:00:00Z",
  "both_accepted": true,
  "status": "active"
}
```

### Campaign Activation Rule

```
IF brand_accepted_terms == TRUE 
AND influencer_accepted_terms == TRUE
THEN campaign.status = "active"
```

### Important Rules
- ✅ Both parties must accept before campaign actions (submission, review)
- ✅ Agreement must be accepted before campaign starts
- ✅ Cannot accept agreement twice
- ✅ Only correct user (brand/influencer) can accept their respective agreement

---

## FEATURE 2: DISPUTE SYSTEM

### Database Fields Added to `campaigns` Table

```sql
dispute_count      INTEGER   DEFAULT 0
dispute_reason     VARCHAR(1000) NULL
admin_decision     VARCHAR(1000) NULL
admin_decided_at   TIMESTAMP NULL
admin_decided_by   INTEGER   NULL (FK to users.id)
```

### Campaign Status Flow

```
draft → pending_agreement → active → submitted → under_review
                                                      ↓
                                                  dispute (count < 3)
                                                      ↓
                                                  admin_review (count >= 3)
                                                      ↓
                                              completed / rejected
```

### API Endpoints

#### 1. Raise Dispute
```http
POST /api/campaigns/{campaign_id}/raise-dispute
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Deliverables do not match agreed requirements"
}
```

**Rules:**
- Only brand can raise disputes
- Campaign must be in `SUBMITTED` or `UNDER_REVIEW` status
- Both parties must have accepted agreement
- Dispute count increments by 1
- If `dispute_count < 3`: status = `DISPUTE` (influencer can revise)
- If `dispute_count >= 3`: status = `ADMIN_REVIEW` (escalated to admin)

**Response (dispute_count < 3):**
```json
{
  "message": "Dispute raised. Influencer can revise and resubmit. Disputes remaining: 2",
  "campaign_id": 123,
  "dispute_count": 1,
  "status": "dispute",
  "escalated_to_admin": false
}
```

**Response (dispute_count >= 3):**
```json
{
  "message": "Dispute raised. Maximum disputes (3) reached. Escalated to admin review.",
  "campaign_id": 123,
  "dispute_count": 3,
  "status": "admin_review",
  "escalated_to_admin": true
}
```

#### 2. Admin Makes Decision
```http
POST /api/campaigns/{campaign_id}/admin-decision
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "decision": "After reviewing the evidence, the campaign deliverables meet requirements.",
  "final_status": "completed"
}
```

**Rules:**
- Only admins can make decisions
- Campaign must be in `ADMIN_REVIEW` status
- Admin can only set status to `COMPLETED` or `REJECTED`
- Decision is final and cannot be changed

**Response:**
```json
{
  "message": "Admin decision recorded successfully",
  "campaign_id": 123,
  "decision": "After reviewing the evidence...",
  "final_status": "completed",
  "decided_at": "2024-03-18T15:00:00Z",
  "decided_by": 1
}
```

#### 3. Get Dispute Status
```http
GET /api/campaigns/{campaign_id}/dispute-status
Authorization: Bearer {token}
```

**Response:**
```json
{
  "campaign_id": 123,
  "dispute_count": 2,
  "dispute_reason": "Deliverables do not match requirements",
  "status": "dispute",
  "escalated_to_admin": false,
  "admin_decision": null,
  "admin_decided_at": null,
  "admin_decided_by": null
}
```

### Dispute Logic

```python
# When brand raises dispute:
dispute_count += 1

if dispute_count < 3:
    status = "dispute"
    # Influencer can revise and resubmit
else:
    status = "admin_review"
    # Escalated to admin for final decision
```

### Validations
- ✅ Prevent dispute if campaign not in `SUBMITTED` or `UNDER_REVIEW`
- ✅ Prevent accepting agreement twice
- ✅ Ensure only brand can raise disputes
- ✅ Ensure dispute_count does not exceed 3 before escalation
- ✅ Admin decision is final

---

## FEATURE 3: REPORT SYSTEM

### Enhanced Reports Table

```sql
reported_by            INTEGER   NOT NULL (FK to users.id)
reported_entity_type   VARCHAR(50)  -- "influencer", "brand", "campaign", "agreement", "dispute"
reported_entity_id     INTEGER   NOT NULL
reason                 VARCHAR(500) NOT NULL
description            VARCHAR(2000) NULL
status                 ENUM      -- "pending", "reviewed", "resolved"
admin_notes            VARCHAR(1000) NULL
reviewed_by            INTEGER   NULL (FK to users.id)
reviewed_at            TIMESTAMP NULL
created_at             TIMESTAMP NOT NULL
```

### API Endpoints

#### 1. Create Report
```http
POST /api/reports
Authorization: Bearer {token}
Content-Type: application/json

{
  "reported_entity_type": "campaign",
  "reported_entity_id": 123,
  "reason": "Agreement terms were violated",
  "description": "The brand changed requirements after agreement was signed..."
}
```

**Supported Entity Types:**
- `influencer` - Report an influencer profile
- `brand` - Report a brand profile
- `campaign` - Report a campaign
- `agreement` - Report agreement violation
- `dispute` - Report dispute handling issue

**Response:**
```json
{
  "id": 456,
  "reported_by": 789,
  "reported_entity_type": "campaign",
  "reported_entity_id": 123,
  "reason": "Agreement terms were violated",
  "description": "The brand changed requirements...",
  "status": "pending",
  "admin_notes": null,
  "reviewed_by": null,
  "reviewed_at": null,
  "created_at": "2024-03-18T12:00:00Z"
}
```

#### 2. Get Reports
```http
GET /api/reports?entity_type=campaign&status_filter=pending&skip=0&limit=20
Authorization: Bearer {token}
```

**Query Parameters:**
- `entity_type` (optional): Filter by entity type
- `status_filter` (optional): Filter by status
- `skip` (optional): Pagination offset (default: 0)
- `limit` (optional): Results per page (default: 100, max: 100)

**Access Control:**
- Regular users: See only their own reports
- Admins: See all reports with filters

#### 3. Get Report by ID
```http
GET /api/reports/{report_id}
Authorization: Bearer {token}
```

#### 4. Admin Review Report
```http
POST /api/reports/{report_id}/review
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "resolved",
  "admin_notes": "Investigated the claim. Agreement violation confirmed. Brand has been warned."
}
```

**Response:**
```json
{
  "message": "Report reviewed successfully",
  "report_id": 456,
  "status": "resolved",
  "reviewed_by": 1,
  "reviewed_at": "2024-03-18T14:00:00Z"
}
```

#### 5. Get Report Statistics (Admin Only)
```http
GET /api/reports/stats/summary
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "total_reports": 150,
  "by_status": {
    "pending": 45,
    "reviewed": 30,
    "resolved": 75
  },
  "by_entity_type": {
    "influencer": 50,
    "brand": 30,
    "campaign": 40,
    "agreement": 20,
    "dispute": 10
  }
}
```

---

## DATABASE MIGRATION

### Step 1: Run Campaign Fields Migration
```bash
psql -U postgres -d influconnect -f add_agreement_dispute_fields.sql
```

### Step 2: Run Reports Table Migration
```bash
psql -U postgres -d influconnect -f add_report_fields.sql
```

### Or use Python migration script:
```bash
cd backend/backend
python migrate_agreement_dispute.py
```

---

## TESTING THE SYSTEM

### Test Agreement Flow

1. **Brand creates campaign** (status: `draft`)
2. **Brand accepts agreement**
   ```bash
   POST /api/campaigns/123/brand-accept
   ```
   Status: `pending_agreement`

3. **Influencer accepts agreement**
   ```bash
   POST /api/campaigns/123/influencer-accept
   ```
   Status: `active` ✅

### Test Dispute Flow

1. **Influencer submits work** (status: `submitted`)
2. **Brand raises first dispute**
   ```bash
   POST /api/campaigns/123/raise-dispute
   {"reason": "Quality issues"}
   ```
   Status: `dispute`, count: 1

3. **Influencer revises and resubmits**
4. **Brand raises second dispute**
   Status: `dispute`, count: 2

5. **Brand raises third dispute**
   Status: `admin_review`, count: 3 ⚠️

6. **Admin makes final decision**
   ```bash
   POST /api/campaigns/123/admin-decision
   {"decision": "...", "final_status": "completed"}
   ```
   Status: `completed` ✅

### Test Report System

1. **User reports agreement violation**
   ```bash
   POST /api/reports
   {
     "reported_entity_type": "agreement",
     "reported_entity_id": 123,
     "reason": "Terms were changed after signing"
   }
   ```

2. **Admin reviews report**
   ```bash
   POST /api/reports/456/review
   {
     "status": "resolved",
     "admin_notes": "Investigated and resolved"
   }
   ```

---

## SECURITY & VALIDATION

### Agreement Acceptance
- ✅ Only campaign owner can accept brand agreement
- ✅ Only assigned influencer can accept influencer agreement
- ✅ Cannot accept twice
- ✅ Both must accept before campaign actions

### Dispute Management
- ✅ Only brand can raise disputes
- ✅ Must be in correct status (SUBMITTED/UNDER_REVIEW)
- ✅ Automatic escalation after 3 disputes
- ✅ Only admin can make final decision
- ✅ Decision is final and immutable

### Report System
- ✅ Any user can create reports
- ✅ Users can only view their own reports
- ✅ Only admins can review reports
- ✅ Only admins can view statistics

---

## API DOCUMENTATION

After starting the server, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

All endpoints are documented with:
- Request/response schemas
- Validation rules
- Example payloads
- Error responses

---

## SUMMARY

✅ **Agreement System**: Forces both parties to accept terms before campaign activation
✅ **Dispute System**: Limits disputes to 3, then escalates to admin
✅ **Report System**: Comprehensive reporting for all violations
✅ **Status Flow**: Clear progression from draft → active → completed/rejected
✅ **Security**: Role-based access control and validation
✅ **Admin Control**: Final decision authority on disputes

The system is production-ready and fully integrated with your existing campaign module!
