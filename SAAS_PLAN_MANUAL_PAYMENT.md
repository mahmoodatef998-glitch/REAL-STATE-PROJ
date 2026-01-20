# 🏢 خطة التحويل إلى SaaS - مع الدفع اليدوي (الشيكات)

## 📋 نظرة عامة

هذه الخطة مخصصة لتطوير المشروع إلى SaaS مع:
- ✅ تطوير ذاتي باستخدام AI (بدون تكلفة تطوير)
- ✅ نظام دفع يدوي (الشيكات المباشرة)
- ✅ إدارة يدوية للاشتراكات من قبل Admin
- ✅ Multi-Tenancy كامل
- ✅ تتبع الاستخدام والحدود

---

## 🎯 الميزات المطلوبة (مبسطة)

### ✅ ما سنضيفه:

1. **Multi-Tenancy كامل** - عزل البيانات بين الشركات
2. **نظام الخطط (Plans)** - Free, Basic, Premium, Enterprise
3. **نظام الاشتراكات (Subscriptions)** - إدارة يدوية
4. **تتبع الاستخدام (Usage Tracking)** - تلقائي
5. **تطبيق الحدود (Usage Limits)** - تلقائي
6. **نظام الفواتير (Invoices)** - بدون دفع أونلاين
7. **لوحة تحكم Super Admin** - لإدارة الشركات والاشتراكات

### ❌ ما لن نضيفه:

- ❌ Payment Gateway Integration (Stripe/PayTabs)
- ❌ Automated Payment Processing
- ❌ Online Checkout
- ❌ Webhook Handlers للدفع

---

## 🗄️ قاعدة البيانات المطلوبة

### Models الجديدة:

```prisma
// Plan - الخطط المتاحة
model Plan {
  id              Int       @id @default(autoincrement())
  name            String    @unique // free, basic, premium, enterprise
  displayName     String    @map("display_name")
  description     String?
  price           Float     @default(0) // السعر الشهري
  currency        String    @default("AED")
  propertiesLimit Int?      @map("properties_limit") // null = unlimited
  brokersLimit    Int?      @map("brokers_limit")
  leadsLimit      Int?      @map("leads_limit")
  dealsLimit      Int?      @map("deals_limit")
  features        String?   // JSON array
  isActive        Boolean   @default(true) @map("is_active")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  subscriptions   Subscription[]
  
  @@map("plans")
}

// Subscription - اشتراك الشركة
model Subscription {
  id            Int       @id @default(autoincrement())
  companyId     Int       @unique @map("company_id")
  planId        Int       @map("plan_id")
  status        String    @default("trial") 
  // trial, active, expired, cancelled, suspended, pending_payment
  
  startDate     DateTime  @default(now()) @map("start_date")
  endDate       DateTime? @map("end_date")
  trialEndDate  DateTime? @map("trial_end_date")
  
  // إدارة يدوية
  notes         String?   // ملاحظات Admin
  activatedBy   Int?      @map("activated_by") // Admin ID الذي فعّل الاشتراك
  activatedAt   DateTime? @map("activated_at")
  cancelledAt   DateTime? @map("cancelled_at")
  
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  company       Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)
  plan          Plan      @relation(fields: [planId], references: [id])
  invoices      Invoice[]
  
  @@map("subscriptions")
}

// Invoice - الفواتير (بدون دفع أونلاين)
model Invoice {
  id              Int       @id @default(autoincrement())
  subscriptionId  Int       @map("subscription_id")
  invoiceNumber   String    @unique @map("invoice_number") // INV-2025-001
  amount          Float
  currency        String    @default("AED")
  status          String    @default("pending") 
  // pending, paid, overdue, cancelled
  
  // معلومات الدفع اليدوي
  paymentMethod   String?   @map("payment_method") // check, bank_transfer, cash
  paymentReference String?  @map("payment_reference") // رقم الشيك أو التحويل
  paidAt          DateTime? @map("paid_at")
  dueDate         DateTime  @map("due_date")
  
  // معلومات إضافية
  pdfUrl          String?   @map("pdf_url")
  notes           String?
  createdBy       Int?      @map("created_by") // Admin ID
  
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  subscription    Subscription @relation(fields: [subscriptionId], references: [id])
  
  @@map("invoices")
}

// Usage - تتبع الاستخدام
model Usage {
  id            Int       @id @default(autoincrement())
  companyId     Int       @map("company_id")
  resourceType  String    @map("resource_type") // property, broker, lead, deal
  count         Int       @default(0)
  month         Int
  year          Int
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  company       Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  @@unique([companyId, resourceType, month, year])
  @@map("usage")
}

// Notification - الإشعارات
model Notification {
  id          Int       @id @default(autoincrement())
  userId      Int?      @map("user_id")
  companyId   Int?      @map("company_id")
  type        String    // subscription_expiring, limit_reached, invoice_created
  title       String
  message     String
  isRead      Boolean   @default(false) @map("is_read")
  actionUrl   String?   @map("action_url")
  createdAt   DateTime  @default(now()) @map("created_at")
  
  user        User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
  company     Company?  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  @@map("notifications")
}
```

---

## 🚀 خطة التنفيذ (مبسطة)

### المرحلة 1: الأساسيات (2-3 أسابيع)

#### الأسبوع 1: Multi-Tenancy
- [ ] إضافة Tenant Isolation Middleware
- [ ] تحديث جميع Queries للعزل التلقائي
- [ ] اختبار العزل بين الشركات

#### الأسبوع 2: Plans & Subscriptions
- [ ] إنشاء Plan & Subscription Models
- [ ] إضافة Subscription Routes (CRUD)
- [ ] إضافة Plan Management UI

#### الأسبوع 3: Usage Tracking
- [ ] إنشاء Usage Model
- [ ] إضافة Usage Tracking في CRUD Operations
- [ ] إضافة Usage Limits Enforcement

### المرحلة 2: الإدارة والفوترة (1-2 أسبوع)

#### الأسبوع 4: Invoice System
- [ ] إنشاء Invoice Model
- [ ] إضافة Invoice Generation
- [ ] إضافة PDF Generation
- [ ] إضافة Invoice Management UI

#### الأسبوع 5: Super Admin Dashboard
- [ ] إنشاء Super Admin Dashboard
- [ ] إضافة Company Management
- [ ] إضافة Subscription Management
- [ ] إضافة Manual Payment Recording

---

## 💻 الكود المطلوب

### 1. Tenant Isolation Middleware

```javascript
// backend/middleware/tenantIsolation.js
const { prisma } = require('../database/db');

const tenantIsolation = async (req, res, next) => {
  // Super Admin (بدون companyId) يمكنه رؤية كل شيء
  if (req.user && req.user.role === 'admin' && !req.user.companyId) {
    return next();
  }
  
  // تعيين tenantId من companyId الخاص بالمستخدم
  if (req.user && req.user.companyId) {
    req.tenantId = req.user.companyId;
  }
  
  next();
};

const checkTenantAccess = async (req, res, next) => {
  const resourceId = req.params.id || req.body.id;
  const resourceType = req.resourceType || 'property';
  
  if (!resourceId) return next();
  
  // Super Admin يمكنه الوصول لكل شيء
  if (req.user.role === 'admin' && !req.user.companyId) {
    return next();
  }
  
  const modelMap = {
    property: prisma.property,
    lead: prisma.lead,
    deal: prisma.deal
  };
  
  const model = modelMap[resourceType];
  if (!model) return next();
  
  const resource = await model.findUnique({
    where: { id: parseInt(resourceId) },
    select: { companyId: true }
  });
  
  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  
  if (resource.companyId !== req.user.companyId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  next();
};

module.exports = { tenantIsolation, checkTenantAccess };
```

### 2. Usage Tracking Service

```javascript
// backend/services/usageService.js
const Usage = require('../models/Usage');

class UsageService {
  static async increment(companyId, resourceType) {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    
    return await Usage.increment(companyId, resourceType, month, year);
  }
  
  static async decrement(companyId, resourceType) {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    
    return await Usage.decrement(companyId, resourceType, month, year);
  }
  
  static async checkLimit(companyId, resourceType, plan) {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    
    const usage = await Usage.getCurrentUsage(companyId, resourceType, month, year);
    const limitField = `${resourceType}sLimit`;
    const limit = plan[limitField];
    
    if (limit !== null && limit !== -1 && usage >= limit) {
      return {
        allowed: false,
        limit,
        current: usage
      };
    }
    
    return {
      allowed: true,
      limit,
      current: usage
    };
  }
}

module.exports = UsageService;
```

### 3. Subscription Management (Manual)

```javascript
// backend/routes/subscriptions.js
const express = require('express');
const Subscription = require('../models/Subscription');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get subscription (Company can see their own, Admin can see all)
router.get('/company/:companyId', authenticateToken, async (req, res, next) => {
  try {
    const { companyId } = req.params;
    
    // Check access
    if (req.user.role !== 'admin' && req.user.companyId !== parseInt(companyId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const subscription = await Subscription.findByCompanyId(companyId);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    res.json({ success: true, subscription });
  } catch (error) {
    next(error);
  }
});

// Activate subscription (Admin only - Manual)
router.post('/:id/activate', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    await subscription.activate(req.user.id);
    
    res.json({ 
      success: true, 
      message: 'Subscription activated',
      subscription 
    });
  } catch (error) {
    next(error);
  }
});

// Cancel subscription (Admin only - Manual)
router.post('/:id/cancel', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    await subscription.cancel(req.user.id);
    
    res.json({ 
      success: true, 
      message: 'Subscription cancelled',
      subscription 
    });
  } catch (error) {
    next(error);
  }
});

// Update subscription plan (Admin only - Manual)
router.put('/:id/plan', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const { planId, notes } = req.body;
    
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    await subscription.updatePlan(planId, req.user.id, notes);
    
    res.json({ 
      success: true, 
      message: 'Subscription plan updated',
      subscription 
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

### 4. Invoice Management (Manual Payment)

```javascript
// backend/routes/invoices.js
const express = require('express');
const Invoice = require('../models/Invoice');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create invoice (Admin only)
router.post('/', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const { subscriptionId, amount, dueDate, notes } = req.body;
    
    const invoice = await Invoice.create({
      subscriptionId,
      amount,
      dueDate: new Date(dueDate),
      notes,
      createdBy: req.user.id
    });
    
    res.status(201).json({ success: true, invoice });
  } catch (error) {
    next(error);
  }
});

// Mark invoice as paid (Admin only - Manual)
router.post('/:id/mark-paid', authenticateToken, requireRole(['admin']), async (req, res, next) => {
  try {
    const { paymentMethod, paymentReference, notes } = req.body;
    
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    await invoice.markAsPaid({
      paymentMethod, // 'check', 'bank_transfer', 'cash'
      paymentReference, // رقم الشيك أو التحويل
      notes
    });
    
    res.json({ 
      success: true, 
      message: 'Invoice marked as paid',
      invoice 
    });
  } catch (error) {
    next(error);
  }
});

// Get invoices for company
router.get('/company/:companyId', authenticateToken, async (req, res, next) => {
  try {
    const { companyId } = req.params;
    
    // Check access
    if (req.user.role !== 'admin' && req.user.companyId !== parseInt(companyId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const invoices = await Invoice.findByCompanyId(companyId);
    
    res.json({ success: true, invoices });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

---

## 📊 Super Admin Dashboard Features

### الصفحات المطلوبة:

1. **Companies Management**
   - عرض جميع الشركات
   - إنشاء شركة جديدة
   - تعديل بيانات الشركة
   - حذف شركة

2. **Subscriptions Management**
   - عرض جميع الاشتراكات
   - تفعيل/إلغاء اشتراك
   - تغيير خطة الشركة
   - عرض حالة الاشتراك

3. **Invoices Management**
   - إنشاء فاتورة جديدة
   - عرض جميع الفواتير
   - تسجيل الدفع (Manual)
   - طباعة/تحميل الفواتير

4. **Usage Monitoring**
   - عرض استخدام كل شركة
   - مقارنة الاستخدام مع الحدود
   - تنبيهات عند الوصول للحدود

---

## 🎯 الخطوات العملية للتنفيذ

### الخطوة 1: تحديث Database Schema
```bash
cd backend
# إضافة Models الجديدة إلى schema.prisma
npx prisma migrate dev --name add_saas_models_manual
npx prisma generate
```

### الخطوة 2: إنشاء Seed Data للخطط
```javascript
// backend/prisma/seed.js
const plans = [
  {
    name: 'free',
    displayName: 'Free',
    price: 0,
    propertiesLimit: 10,
    brokersLimit: 1,
    leadsLimit: 50,
    features: JSON.stringify(['basic_properties', 'basic_leads'])
  },
  {
    name: 'basic',
    displayName: 'Basic',
    price: 299,
    propertiesLimit: 100,
    brokersLimit: 5,
    leadsLimit: 500,
    features: JSON.stringify(['unlimited_properties', 'advanced_leads', 'reports'])
  },
  {
    name: 'premium',
    displayName: 'Premium',
    price: 799,
    propertiesLimit: 500,
    brokersLimit: 20,
    leadsLimit: 2000,
    features: JSON.stringify(['unlimited_properties', 'unlimited_leads', 'advanced_reports', 'api_access'])
  },
  {
    name: 'enterprise',
    displayName: 'Enterprise',
    price: 1999,
    propertiesLimit: null, // Unlimited
    brokersLimit: null,
    leadsLimit: null,
    features: JSON.stringify(['everything', 'custom_integrations', 'dedicated_support'])
  }
];

await prisma.plan.createMany({ data: plans });
```

### الخطوة 3: تحديث Routes الموجودة
- إضافة `tenantIsolation` middleware
- إضافة `checkUsageLimit` للـ POST routes
- إضافة `checkTenantAccess` للـ PUT/DELETE routes

### الخطوة 4: إنشاء Frontend Components
- Subscription Management Page
- Invoice Management Page
- Usage Dashboard
- Super Admin Dashboard

---

## ✅ Checklist مبسط

### Backend
- [ ] تحديث Prisma Schema
- [ ] إنشاء Migration
- [ ] إضافة Tenant Isolation Middleware
- [ ] إضافة Usage Tracking Service
- [ ] إضافة Subscription Routes
- [ ] إضافة Invoice Routes
- [ ] تحديث Routes الموجودة

### Frontend
- [ ] Super Admin Dashboard
- [ ] Subscription Management UI
- [ ] Invoice Management UI
- [ ] Usage Dashboard
- [ ] Plan Selection UI

### Testing
- [ ] اختبار Multi-Tenancy
- [ ] اختبار Usage Limits
- [ ] اختبار Subscription Management
- [ ] اختبار Invoice Creation

---

## 💡 ملاحظات مهمة

1. **لا حاجة لـ Payment Gateway**: كل شيء يدوي
2. **Admin يقوم بكل شيء**: تفعيل الاشتراكات، تسجيل الدفع، إدارة الشركات
3. **تتبع الاستخدام تلقائي**: عند إضافة/حذف Properties, Leads, etc.
4. **الحدود تطبق تلقائياً**: عند محاولة تجاوز الحد المسموح

---

## 📞 الخطوات التالية

1. ✅ مراجعة هذا الملف
2. ✅ البدء بتحديث Database Schema
3. ✅ إضافة Middleware للعزل
4. ✅ إضافة Usage Tracking
5. ✅ إنشاء Super Admin Dashboard

---

**تاريخ الإنشاء**: يناير 2025  
**الحالة**: جاهز للتنفيذ  
**التكلفة**: $0 (تطوير ذاتي مع AI)

