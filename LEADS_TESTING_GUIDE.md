# 🧪 Leads Management System - Testing Guide

## Quick Start Testing

### 1. Start the Backend Server

```bash
cd backend
npm start
```

**Expected:** Server running on `http://localhost:5000`

### 2. Start the Frontend Server

```bash
cd frontend-next
npm run dev
```

**Expected:** Frontend running on `http://localhost:3000`

---

## 📋 Test Scenarios

### Scenario 1: Public User Expresses Interest

**Steps:**
1. Open browser to `http://localhost:3000`
2. Navigate to Properties page (`/properties`)
3. Find any property card
4. Click "I'm Interested" button
5. Fill in the modal:
   - Name: "John Doe"
   - Phone: "+971 50 123 4567"
6. Click "Submit Interest"

**Expected Results:**
- ✅ Success message appears
- ✅ Modal closes after 2 seconds
- ✅ Lead is created in database
- ✅ Lead is assigned to property's broker
- ✅ Status is set to "new"

**Database Check:**
```sql
SELECT * FROM leads ORDER BY created_at DESC LIMIT 1;
```

---

### Scenario 2: Broker Views Their Leads

**Steps:**
1. Login as a broker account
2. Look at the header navigation
3. Notice "Leads" button with notification badge (if new leads exist)
4. Click "Leads" button or go to `/broker/leads`

**Expected Results:**
- ✅ Dashboard shows statistics cards
- ✅ New leads count is displayed
- ✅ Table shows only leads assigned to this broker
- ✅ New leads have animated blue dot indicator
- ✅ Status dropdown is available
- ✅ Search and filter work correctly

**Test Actions:**
- Filter by status (New, Contacted, etc.)
- Search for a lead by name
- Click "Call" button (should open phone dialer)
- Click "View Property" (should open property in new tab)
- Change status from "New" to "Contacted"

---

### Scenario 3: Broker Updates Lead Status

**Steps:**
1. On `/broker/leads` dashboard
2. Find a lead with "New" status
3. Click the status dropdown
4. Select "Contacted"

**Expected Results:**
- ✅ Status updates immediately
- ✅ Blue dot disappears
- ✅ Statistics cards update
- ✅ Notification count decreases by 1
- ✅ Status color changes to yellow

**API Check:**
```
PUT http://localhost:5000/api/leads/:id
Authorization: Bearer <token>
Body: { "status": "contacted" }
```

---

### Scenario 4: Admin Views All Leads

**Steps:**
1. Login as an admin account
2. Look at header - see "Leads" with notification badge
3. Click "Leads" or navigate to `/admin/leads`

**Expected Results:**
- ✅ Dashboard shows all leads in the company
- ✅ Extra "Broker" column shows broker name
- ✅ Can update any lead's status
- ✅ Search includes broker names
- ✅ Statistics show company-wide data

**Test Actions:**
- Search for a broker name
- Update a lead that belongs to another broker
- Verify statistics are correct

---

### Scenario 5: Notification System

**Steps:**
1. Create a new lead as public user (Scenario 1)
2. Login as the broker who owns the property
3. Check header navigation

**Expected Results:**
- ✅ "Leads" button shows red badge with "1"
- ✅ Counter auto-updates every 30 seconds
- ✅ After updating lead status from "New", counter decreases

**API Check:**
```
GET http://localhost:5000/api/leads/notifications/count
Authorization: Bearer <broker_token>
```

Response should be: `{ "count": 1 }`

---

### Scenario 6: Mobile Responsiveness

**Steps:**
1. Open Chrome DevTools (F12)
2. Click device toolbar (mobile view)
3. Select iPhone 12 Pro or similar
4. Navigate through:
   - Properties page
   - Click "I'm Interested"
   - Submit form
   - Login as broker
   - View leads dashboard

**Expected Results:**
- ✅ Property cards stack vertically
- ✅ Buttons are easy to tap
- ✅ Modal is full-width
- ✅ Dashboard statistics in 2 columns
- ✅ Table scrolls horizontally
- ✅ Mobile menu shows Leads with badge

---

## 🔍 API Testing with Postman/cURL

### 1. Get All Leads (Broker)

```bash
curl -X GET http://localhost:5000/api/leads \
  -H "Authorization: Bearer <broker_token>"
```

**Expected:** Only leads assigned to this broker

### 2. Get Notification Count

```bash
curl -X GET http://localhost:5000/api/leads/notifications/count \
  -H "Authorization: Bearer <broker_token>"
```

**Expected:** `{ "count": <number> }`

### 3. Create Lead (Public - No Auth)

```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "phone": "+971 55 987 6543",
    "property_id": 1
  }'
```

**Expected:** 
```json
{
  "success": true,
  "message": "Your interest has been recorded successfully!...",
  "lead": { ... }
}
```

### 4. Update Lead Status

```bash
curl -X PUT http://localhost:5000/api/leads/1 \
  -H "Authorization: Bearer <broker_token>" \
  -H "Content-Type: application/json" \
  -d '{ "status": "contacted" }'
```

**Expected:**
```json
{
  "success": true,
  "message": "Lead status updated successfully",
  "lead": { ... }
}
```

### 5. Get Statistics

```bash
curl -X GET http://localhost:5000/api/leads/stats/overview \
  -H "Authorization: Bearer <broker_token>"
```

**Expected:**
```json
{
  "stats": {
    "total": 10,
    "new": 3,
    "contacted": 4,
    "negotiating": 2,
    "closed": 1
  }
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Property must have a valid broker"

**Cause:** Property doesn't have an owner or owner is not a broker/admin

**Solution:**
1. Check property in database
2. Ensure `owner_id` is set
3. Ensure owner has role "broker" or "admin"

```sql
-- Check property owner
SELECT p.id, p.title, u.id as owner_id, u.name, u.role 
FROM properties p 
LEFT JOIN users u ON p.owner_id = u.id 
WHERE p.id = <property_id>;
```

### Issue 2: Notification Count Not Updating

**Cause:** React Query cache not refreshing

**Solution:**
- Wait 30 seconds for auto-refresh
- Manually refresh page
- Check browser console for errors

### Issue 3: Can't See Any Leads

**Cause:** Logged in as broker with no leads

**Solution:**
1. Create a lead for one of your properties
2. Or login as admin to see all leads
3. Check database: `SELECT * FROM leads WHERE broker_id = <your_id>;`

### Issue 4: Modal Not Opening

**Cause:** JavaScript error or missing import

**Solution:**
1. Check browser console
2. Ensure all dependencies installed: `npm install`
3. Restart frontend dev server

---

## ✅ Verification Checklist

### Database
- [ ] Lead table has `broker_id` column
- [ ] Lead table has correct status values
- [ ] Foreign key constraints working
- [ ] Migration applied successfully

### Backend
- [ ] Server starts without errors
- [ ] All API endpoints respond correctly
- [ ] Authorization working (broker only sees their leads)
- [ ] Validation working (invalid status rejected)
- [ ] Notification count accurate

### Frontend
- [ ] Property cards show "I'm Interested" button
- [ ] Modal opens and submits correctly
- [ ] Broker dashboard displays leads
- [ ] Admin dashboard displays all leads
- [ ] Notification badge appears in header
- [ ] Status updates work
- [ ] Search and filter work
- [ ] Statistics display correctly
- [ ] Mobile responsive

### User Experience
- [ ] Clear success messages
- [ ] Helpful error messages
- [ ] Loading states visible
- [ ] No console errors
- [ ] Smooth animations
- [ ] Accessible (keyboard navigation works)

---

## 📊 Expected Data Flow

### Lead Creation Flow
```
1. User clicks "I'm Interested" on Property #1
2. Modal opens with form
3. User enters: Name="John", Phone="+971501234567"
4. Form submits to: POST /api/leads
5. Backend:
   - Validates property exists
   - Gets property owner (broker_id=5)
   - Creates lead with status="new"
6. Frontend:
   - Shows success message
   - Closes modal
   - Invalidates queries
7. Broker (id=5):
   - Notification count increases
   - Lead appears in dashboard
```

### Status Update Flow
```
1. Broker views lead in dashboard
2. Clicks status dropdown
3. Selects "Contacted"
4. PUT request to /api/leads/:id
5. Backend:
   - Verifies authorization
   - Updates status
   - Returns updated lead
6. Frontend:
   - Updates UI immediately
   - Updates statistics
   - Decreases notification count (if was "new")
```

---

## 🎯 Success Criteria

### For Public Users
- ✅ Can express interest in < 30 seconds
- ✅ Clear confirmation received
- ✅ No bugs or errors

### For Brokers
- ✅ Notified of new leads immediately
- ✅ Can view all their leads easily
- ✅ Can update lead status in 1 click
- ✅ Can call leads directly
- ✅ Dashboard is intuitive

### For Admins
- ✅ Can see all leads across brokers
- ✅ Can track which broker has which lead
- ✅ Statistics are accurate
- ✅ Can manage any lead

---

## 📝 Test Data Setup

### Create Test Users

```sql
-- Broker 1
INSERT INTO users (name, email, password, role, status) 
VALUES ('Broker One', 'broker1@test.com', '<hashed_password>', 'broker', 'approved');

-- Broker 2
INSERT INTO users (name, email, password, role, status) 
VALUES ('Broker Two', 'broker2@test.com', '<hashed_password>', 'broker', 'approved');

-- Admin
INSERT INTO users (name, email, password, role, status) 
VALUES ('Admin User', 'admin@test.com', '<hashed_password>', 'admin', 'approved');
```

### Create Test Properties

```sql
-- Property for Broker 1
INSERT INTO properties (title, type, purpose, price, emirate, owner_id, status)
VALUES ('Luxury Villa in Ajman', 'villa', 'sale', 2500000, 'ajman', 1, 'active');

-- Property for Broker 2
INSERT INTO properties (title, type, purpose, price, emirate, owner_id, status)
VALUES ('Modern Apartment in Dubai', 'apartment', 'rent', 85000, 'dubai', 2, 'active');
```

### Create Test Leads

```sql
-- New lead for Broker 1
INSERT INTO leads (lead_name, lead_phone, property_id, broker_id, status)
VALUES ('Test Lead 1', '+971501234567', 1, 1, 'new');

-- Contacted lead for Broker 2
INSERT INTO leads (lead_name, lead_phone, property_id, broker_id, status)
VALUES ('Test Lead 2', '+971559876543', 2, 2, 'contacted');
```

---

## 🚀 Ready for Production?

Before deploying to production, ensure:

1. ✅ All tests pass
2. ✅ Database migration applied
3. ✅ Environment variables set
4. ✅ Error tracking configured
5. ✅ Backup strategy in place
6. ✅ Load testing completed
7. ✅ Security audit passed
8. ✅ User acceptance testing done
9. ✅ Documentation complete
10. ✅ Rollback plan prepared

---

**Happy Testing! 🎉**

For issues or questions, refer to `LEADS_MANAGEMENT_IMPLEMENTATION.md`

