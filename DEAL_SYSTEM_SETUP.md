# Deal Management System - Setup Guide

## ✅ ما تم تنفيذه

تم تنفيذ نظام إدارة الصفقات (Deal Management System) بنجاح مع المكونات التالية:

### 1. Prisma Schema Updates
- ✅ إضافة `Company` model
- ✅ إضافة `Deal` model
- ✅ تحديث Relations في `User` و `Property`

### 2. Backend Models
- ✅ `backend/models/Company.js` - إدارة الشركات
- ✅ `backend/models/Deal.js` - إدارة الصفقات مع حساب العمولات تلقائياً

### 3. API Routes
- ✅ `backend/routes/deals.js` - جميع endpoints للصفقات
- ✅ تم تسجيل الـ route في `start-server.js`

## 🚀 خطوات الإعداد

### الخطوة 1: إنشاء Prisma Migration

```powershell
cd backend
npx prisma migrate dev --name add_deals_and_companies
```

هذا سيقوم بـ:
- إنشاء migration للـ Company و Deal models
- تحديث Prisma Client تلقائياً

### الخطوة 2: Generate Prisma Client

```powershell
npm run prisma:generate
```

### الخطوة 3: إضافة شركة تجريبية (اختياري)

يمكنك إضافة شركة من Prisma Studio:

```powershell
npm run prisma:studio
```

أو استخدام API endpoint (يحتاج auth):

```bash
POST /api/companies
{
  "name": "Alrabie Real Estate",
  "email": "info@alrabie.ae",
  "phone": "+971501234567",
  "address": "Dubai, UAE"
}
```

## 📋 API Endpoints

### POST /api/deals
إنشاء صفقة جديدة (admin أو broker فقط)

**Request Body:**
```json
{
  "propertyId": 1,
  "brokerId": 2,
  "companyId": 1,
  "clientName": "Ahmed Ali",
  "salePrice": 1500000,
  "commissionRate": 0.05
}
```

**Response:**
```json
{
  "success": true,
  "message": "Deal created successfully",
  "deal": {
    "id": 1,
    "propertyId": 1,
    "brokerId": 2,
    "companyId": 1,
    "clientName": "Ahmed Ali",
    "salePrice": 1500000,
    "commissionRate": 0.05,
    "brokerShare": 52500,
    "companyShare": 22500,
    "status": "completed",
    "property": { ... },
    "broker": { ... },
    "company": { ... }
  }
}
```

### GET /api/deals
الحصول على جميع الصفقات

**Query Parameters:**
- `brokerId` - تصفية حسب broker
- `companyId` - تصفية حسب company (admin only)

**Response:**
```json
{
  "success": true,
  "deals": [...],
  "totals": {
    "totalDeals": 10,
    "totalSalePrice": 15000000,
    "totalCommission": 750000,
    "totalBrokerShare": 525000,
    "totalCompanyShare": 225000
  }
}
```

### GET /api/deals/:id
الحصول على صفقة محددة

### PUT /api/deals/:id
تحديث صفقة (admin أو broker للصفقات الخاصة به)

### DELETE /api/deals/:id
حذف صفقة (admin only)

## 🔒 Authentication & Permissions

- **Admin**: يمكنه إنشاء/قراءة/تحديث/حذف جميع الصفقات
- **Broker**: يمكنه إنشاء/قراءة/تحديث الصفقات الخاصة به فقط
- **Client**: لا يمكنه الوصول للصفقات

## 💰 حساب العمولات

النظام يحسب العمولات تلقائياً عند إنشاء صفقة:

```javascript
const brokerRate = 0.7; // 70% broker, 30% company
const brokerShare = salePrice * commissionRate * brokerRate;
const companyShare = salePrice * commissionRate * (1 - brokerRate);
```

**مثال:**
- Sale Price: 1,500,000 AED
- Commission Rate: 5% (0.05)
- Broker Share: 1,500,000 × 0.05 × 0.7 = 52,500 AED
- Company Share: 1,500,000 × 0.05 × 0.3 = 22,500 AED

## ⚠️ ملاحظات مهمة

1. **Company يجب أن يكون موجوداً قبل إنشاء Deal**
2. **Property يجب أن يكون موجوداً**
3. **Broker يجب أن يكون user مع role = 'broker'**
4. **Commission Rate يجب أن يكون بين 0 و 1** (0.05 = 5%)

## 🔄 التكامل مع المشروع

- ✅ لا يوجد تضارب مع الكود الحالي
- ✅ يستخدم نفس نظام Authentication
- ✅ يتبع نفس نمط Code Structure
- ✅ جاهز للدمج مع Dashboard

## 📝 الخطوات التالية (اختياري)

1. إنشاء Frontend components لـ Deal Management
2. إضافة Deal Management إلى Admin/Broker Dashboard
3. إضافة تقارير وإحصائيات متقدمة
4. إضافة إشعارات عند إنشاء صفقات جديدة

