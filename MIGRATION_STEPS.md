# خطوات Migration و Setup

## ⚠️ قبل البدء
1. **تأكد من إيقاف Backend Server** (إذا كان يعمل)
2. **احفظ Backup للـ Database** (اختياري لكن موصى به)
3. **تأكد من أن Node.js و PostgreSQL يعملان**

---

## الخطوة 1: إيقاف السيرفر (إن كان يعمل)

```powershell
# في Terminal منفصل، اضغط Ctrl+C لإيقاف السيرفر
```

---

## الخطوة 2: تشغيل Prisma Migration

افتح Terminal في المجلد الرئيسي للمشروع:

```powershell
cd backend
npx prisma migrate dev --name enhance_deals_and_multi_tenant
```

**ماذا سيحدث:**
- سيُنشئ Prisma ملف migration جديد
- سيُطبق التغييرات على قاعدة البيانات
- إذا كان هناك data موجودة، قد تحتاج لتأكيد

**ملاحظات مهمة:**
- إذا طلب Prisma إنشاء companyId للـ existing records، سيضع `null` (single-company mode)
- إذا كان هناك deals موجودة، قد تحتاج لتحديثها يدوياً لاحقاً

---

## الخطوة 3: Generate Prisma Client

بعد نجاح Migration:

```powershell
npm run prisma:generate
```

أو:

```powershell
npx prisma generate
```

---

## الخطوة 4: التحقق من Migration

افتح Prisma Studio للتحقق:

```powershell
npx prisma studio
```

**ما يجب التحقق منه:**
- ✅ Deal table يحتوي على الحقول الجديدة (dealType, dealValue, commissionValue, dateClosed, status)
- ✅ User table يحتوي على companyId
- ✅ Property table يحتوي على companyId
- ✅ Lead table يحتوي على companyId

---

## الخطوة 5: اختبار API Endpoints

شغل Backend Server:

```powershell
npm run dev
```

اختبر الـ Endpoints:

### 1. Create Deal (POST)
```bash
POST http://localhost:3050/api/deals
Headers: Authorization: Bearer YOUR_TOKEN
Body:
{
  "propertyId": 1,
  "brokerId": 2,
  "companyId": 1,
  "clientName": "Ahmed Ali",
  "dealType": "sale",
  "dealValue": 500000,
  "commissionRate": 0.05,
  "status": "open"
}
```

### 2. Get All Deals (GET)
```bash
GET http://localhost:3050/api/deals
Headers: Authorization: Bearer YOUR_TOKEN
```

### 3. Get Totals (GET with query)
```bash
GET http://localhost:3050/api/deals?status=closed
Headers: Authorization: Bearer YOUR_TOKEN
```

---

## الخطوة 6: تحديث Existing Deals (إن وجدت)

إذا كان لديك deals موجودة من النظام القديم، قد تحتاج لتحديثها:

### Option 1: SQL Query (PostgreSQL)

```sql
-- Update existing deals to sync dealValue with salePrice
UPDATE deals 
SET deal_value = sale_price, 
    commission_value = sale_price * commission_rate,
    status = 'closed'
WHERE deal_value IS NULL OR deal_value = 0;

-- Set default status if null
UPDATE deals 
SET status = 'closed' 
WHERE status IS NULL OR status = '';
```

### Option 2: Prisma Studio
- افتح Prisma Studio
- عدّل كل deal يدوياً

---

## الخطوة 7: إنشاء Company (إن لم يكن موجوداً)

إذا كنت تريد تجربة Multi-Tenant:

```powershell
# في Node.js REPL أو Postman
POST http://localhost:3050/api/companies
Body:
{
  "name": "Al Rabie Real Estate",
  "email": "info@alrabie.com",
  "phone": "+971 50 123 4567",
  "address": "Dubai, UAE"
}
```

ثم حدث User لربطه بـ Company:

```sql
UPDATE users 
SET company_id = 1 
WHERE role = 'broker' OR role = 'admin';
```

---

## المشاكل المحتملة وحلولها

### 1. EPERM Error (Prisma Engine locked)
**الحل:**
```powershell
# أغلق جميع Node.js processes
taskkill /F /IM node.exe

# ثم جرب مرة أخرى
npx prisma generate
```

### 2. Migration Conflicts
**الحل:**
```powershell
# Reset migration (⚠️ سيحذف البيانات إن لم يكن هناك backup)
npx prisma migrate reset

# ثم جرب مرة أخرى
npx prisma migrate dev --name enhance_deals_and_multi_tenant
```

### 3. Missing Fields في Existing Records
**الحل:**
```sql
-- Set default values for existing deals
UPDATE deals 
SET deal_type = 'sale',
    deal_value = COALESCE(deal_value, sale_price, 0),
    commission_value = COALESCE(commission_value, sale_price * commission_rate, 0),
    status = COALESCE(status, 'closed')
WHERE deal_type IS NULL OR deal_value IS NULL;
```

---

## ✅ Checklist بعد Migration

- [ ] Migration نجح بدون أخطاء
- [ ] Prisma Client تم توليده
- [ ] جميع الحقول موجودة في Database
- [ ] API Endpoints تعمل بشكل صحيح
- [ ] Create Deal يعمل ويحسب Commission بشكل صحيح
- [ ] Get Deals مع Filters يعمل
- [ ] Multi-Tenant filtering يعمل (إن تم إعداد companyId)
- [ ] Backward compatibility (salePrice) يعمل

---

## الخطوات التالية (Frontend)

بعد التأكد من أن Backend يعمل:

1. إنشاء Deal Forms في Dashboard
2. إضافة Deals Tab
3. إضافة Reporting Tables
4. تحسين UX (Loading, Error Handling)
5. جعل Dashboard Responsive

---

## ملاحظات

- **Backward Compatibility**: النظام يدعم `salePrice` القديم (سيتم sync مع `dealValue`)
- **Multi-Tenant**: يعمل مع `companyId = null` (single-company mode)
- **Commission**: يتم حسابها تلقائياً عند Create/Update
- **Status**: Default = `'open'` (يمكن تغييره لـ `'closed'` عند إنشاء deal)

---

## Support

إذا واجهت أي مشكلة:
1. تحقق من Console Logs
2. تحقق من Database مباشرة (Prisma Studio)
3. تحقق من API Response في Network Tab

