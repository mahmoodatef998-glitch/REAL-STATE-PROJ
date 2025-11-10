# خطوات Migration - دليل شامل بالعربي

## 📋 المتطلبات قبل البدء

1. ✅ PostgreSQL يعمل ومتصل
2. ✅ Database موجود ومتاح
3. ✅ Backend Server متوقف (إن كان يعمل)
4. ✅ جميع التغييرات في Schema تم قبولها

---

## 🚀 الخطوة 1: إيقاف السيرفر (إن كان يعمل)

إذا كان Backend Server يعمل، أوقفه بالضغط على `Ctrl+C` في Terminal الذي يشغله.

---

## 🚀 الخطوة 2: تشغيل Migration

### الطريقة الأولى: استخدام Batch File (Windows)

```powershell
# في المجلد الرئيسي للمشروع
.\MIGRATION_COMMANDS.bat
```

### الطريقة الثانية: تشغيل الأوامر يدوياً

افتح Terminal في المجلد الرئيسي:

```powershell
cd backend
```

ثم شغّل:

```powershell
npx prisma migrate dev --name enhance_deals_and_multi_tenant
```

**ماذا سيحدث:**
- ✅ سينشئ Prisma ملف migration جديد
- ✅ سيُطبق التغييرات على قاعدة البيانات
- ✅ سيُولد Prisma Client تلقائياً

**ملاحظات:**
- إذا طُلب منك تأكيد، اضغط `Y` ثم Enter
- إذا كان هناك deals موجودة، قد تحتاج لتحديثها يدوياً لاحقاً
- إذا ظهرت أخطاء، راجع قسم "المشاكل المحتملة" أدناه

---

## 🚀 الخطوة 3: التحقق من Migration

### فتح Prisma Studio:

```powershell
cd backend
npm run prisma:studio
```

**ما يجب التحقق منه:**
- ✅ Deal table يحتوي على:
  - `dealType` (sale/rent)
  - `dealValue` (رقم)
  - `commissionValue` (رقم)
  - `dateClosed` (تاريخ أو null)
  - `status` (open/closed/cancelled)
  
- ✅ User table يحتوي على:
  - `companyId` (رقم أو null)
  
- ✅ Property table يحتوي على:
  - `companyId` (رقم أو null)
  
- ✅ Lead table يحتوي على:
  - `companyId` (رقم أو null)

---

## 🚀 الخطوة 4: اختبار API Endpoints

### 1. شغّل Backend Server:

```powershell
cd backend
npm run dev
```

### 2. اختبر إنشاء Deal:

**استخدم Postman أو أي REST Client:**

```http
POST http://localhost:3050/api/deals
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

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

**النتيجة المتوقعة:**
- ✅ Deal يُنشأ بنجاح
- ✅ `commissionValue` محسوب تلقائياً (500000 * 0.05 = 25000)
- ✅ `brokerShare` = 17500 (70%)
- ✅ `companyShare` = 7500 (30%)

### 3. اختبر جلب Deals:

```http
GET http://localhost:3050/api/deals
Authorization: Bearer YOUR_TOKEN
```

**النتيجة المتوقعة:**
- ✅ قائمة بجميع Deals
- ✅ `totals` object يحتوي على إحصائيات

### 4. اختبر الفلترة:

```http
GET http://localhost:3050/api/deals?status=closed
Authorization: Bearer YOUR_TOKEN
```

```http
GET http://localhost:3050/api/deals?brokerId=2
Authorization: Bearer YOUR_TOKEN
```

---

## 🔧 تحديث Existing Deals (إن وجدت)

إذا كان لديك deals موجودة من النظام القديم، قم بتحديثها:

### باستخدام Prisma Studio:
1. افتح Prisma Studio: `npm run prisma:studio`
2. اذهب إلى `deals` table
3. عدّل كل deal:
   - `dealType` = "sale" أو "rent"
   - `dealValue` = نفس قيمة `salePrice`
   - `commissionValue` = `dealValue * commissionRate`
   - `status` = "closed" (إن كانت الصفقة مكتملة)

### باستخدام SQL Query:

افتح PostgreSQL واتصل بقاعدة البيانات:

```sql
-- Update existing deals to sync dealValue with salePrice
UPDATE deals 
SET deal_value = sale_price, 
    commission_value = sale_price * commission_rate,
    deal_type = 'sale',
    status = 'closed'
WHERE deal_value IS NULL OR deal_value = 0;

-- Verify the update
SELECT id, deal_value, sale_price, commission_value, status 
FROM deals;
```

---

## 🔧 إنشاء Company (للمنظمات المتعددة)

إذا كنت تريد تجربة Multi-Tenant:

### 1. إنشاء Company:

```http
POST http://localhost:3050/api/companies
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Al Rabie Real Estate",
  "email": "info@alrabie.com",
  "phone": "+971 50 123 4567",
  "address": "Dubai, UAE"
}
```

### 2. ربط Users بـ Company:

```sql
-- ربط جميع Brokers بـ Company ID 1
UPDATE users 
SET company_id = 1 
WHERE role = 'broker' OR role = 'admin';
```

---

## ⚠️ المشاكل المحتملة وحلولها

### 1. EPERM Error (Prisma Engine locked)

**المشكلة:**
```
EPERM: operation not permitted, rename '...query_engine-windows.dll.node'
```

**الحل:**
```powershell
# أغلق جميع Node.js processes
taskkill /F /IM node.exe

# انتظر ثانيتين، ثم جرب مرة أخرى
cd backend
npx prisma generate
```

### 2. Migration Conflicts

**المشكلة:** Migration موجود بالفعل أو توجد تعارضات

**الحل:**
```powershell
# عرض حالة Migrations
npx prisma migrate status

# إنشاء Migration جديد بدون تطبيق
npx prisma migrate dev --create-only

# تطبيق Migration يدوياً
npx prisma migrate deploy
```

### 3. Missing Fields في Existing Records

**المشكلة:** Deals موجودة بدون الحقول الجديدة

**الحل:**
```sql
-- تحديث جميع Deals الموجودة
UPDATE deals 
SET 
  deal_type = COALESCE(deal_type, 'sale'),
  deal_value = COALESCE(deal_value, sale_price, 0),
  commission_value = COALESCE(commission_value, COALESCE(deal_value, sale_price, 0) * commission_rate, 0),
  status = COALESCE(status, 'closed')
WHERE deal_type IS NULL 
   OR deal_value IS NULL 
   OR commission_value IS NULL;
```

### 4. Database Connection Error

**المشكلة:** لا يمكن الاتصال بـ PostgreSQL

**الحل:**
1. تحقق من `backend/config.env`:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/al_rabei_real_estate
   ```

2. تأكد أن PostgreSQL يعمل:
   ```powershell
   # تحقق من الخدمة
   Get-Service -Name postgresql*
   ```

3. اختبر الاتصال:
   ```powershell
   psql -U postgres -d al_rabei_real_estate
   ```

---

## ✅ Checklist بعد Migration

استخدم هذه القائمة للتحقق:

- [ ] Migration نجح بدون أخطاء
- [ ] Prisma Client تم توليده (`node_modules/.prisma/client` موجود)
- [ ] جميع الحقول موجودة في Database (تم التحقق من Prisma Studio)
- [ ] Backend Server يشتغل بدون أخطاء
- [ ] Create Deal يعمل ويحسب Commission بشكل صحيح
- [ ] Get Deals يعمل ويعرض البيانات
- [ ] Filters تعمل (status, brokerId, companyId)
- [ ] Totals تُحسب بشكل صحيح
- [ ] Existing Deals محدثة (إن وجدت)
- [ ] Multi-Tenant filtering يعمل (إن تم إعداد companyId)

---

## 📝 ملاحظات مهمة

1. **Backward Compatibility**: النظام يدعم `salePrice` القديم - سيتم sync تلقائياً مع `dealValue`
2. **Multi-Tenant**: يعمل حتى مع `companyId = null` (single-company mode)
3. **Commission**: يتم حسابها تلقائياً عند Create/Update
4. **Status**: Default = `'open'` - يمكن تغييره لـ `'closed'` عند إنشاء deal
5. **Date Closed**: يتم تعيينه تلقائياً عند تغيير Status إلى `'closed'`

---

## 🎯 الخطوات التالية

بعد التأكد من أن Migration نجحت و Backend يعمل:

1. ✅ **Dashboard Components** - إنشاء Deal Forms في Admin & Broker Dashboards
2. ✅ **Reporting Tables** - إضافة جداول الإحصائيات
3. ✅ **UX Improvements** - Loading States, Error Handling
4. ✅ **Responsive Design** - جعل Dashboard يعمل على Mobile

---

## 📞 الدعم

إذا واجهت أي مشكلة:

1. **تحقق من Console Logs** في Backend Server
2. **تحقق من Database مباشرة** باستخدام Prisma Studio
3. **تحقق من API Response** في Network Tab (Browser DevTools)
4. **راجع ملفات التوثيق**: `ENHANCEMENT_GUIDE.md`

---

## 🎉 تم بنجاح!

إذا أكملت جميع الخطوات وتحققت من Checklist، النظام جاهز للاستخدام!

