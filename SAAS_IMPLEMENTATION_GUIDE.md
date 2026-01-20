# 🛠️ دليل التنفيذ التقني - تحويل المشروع إلى SaaS

## 📋 نظرة سريعة

هذا الدليل يوضح الخطوات التقنية التفصيلية لتحويل AL RABEI REAL ESTATE إلى تطبيق SaaS كامل.

---

## 🗄️ 1. تحديث قاعدة البيانات

### الخطوة 1: إضافة Models جديدة إلى Prisma Schema

```prisma
// backend/prisma/schema.prisma

// Plan Model
model Plan {
  id              Int       @id @default(autoincrement())
  name            String    @unique // free, basic, premium, enterprise
  displayName     String    @map("display_name")
  description     String?
  price           Float     @default(0)
  currency        String    @default("AED")
  billingCycle    String    @default("monthly") @map("billing_cycle") // monthly, yearly
  propertiesLimit Int?      @map("properties_limit") // null = unlimited
  brokersLimit    Int?      @map("brokers_limit")
  leadsLimit      Int?      @map("leads_limit")
  dealsLimit      Int?      @map("deals_limit")
  features        String?   // JSON array of features
  isActive        Boolean   @default(true) @map("is_active")
  sortOrder       Int       @default(0) @map("sort_order")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  subscriptions   Subscription[]
  
  @@map("plans")
}

// Subscription Model
model Subscription {
  id            Int       @id @default(autoincrement())
  companyId     Int       @unique @map("company_id")
  planId        Int       @map("plan_id")
  status        String    @default("trial") // trial, active, cancelled, expired, suspended
  startDate     DateTime  @default(now()) @map("start_date")
  endDate       DateTime? @map("end_date")
  trialEndDate  DateTime? @map("trial_end_date")
  cancelledAt   DateTime? @map("cancelled_at")
  autoRenew     Boolean   @default(true) @map("auto_renew")
  paymentMethod String?   @map("payment_method") // card, bank_transfer
  stripeCustomerId String? @unique @map("stripe_customer_id")
  stripeSubscriptionId String? @unique @map("stripe_subscription_id")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  company       Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)
  plan          Plan      @relation(fields: [planId], references: [id])
  invoices      Invoice[]
  
  @@map("subscriptions")
}

// Invoice Model
model Invoice {
  id              Int       @id @default(autoincrement())
  subscriptionId  Int       @map("subscription_id")
  invoiceNumber   String    @unique @map("invoice_number")
  amount          Float
  currency        String    @default("AED")
  status          String    @default("pending") // pending, paid, failed, refunded, cancelled
  dueDate         DateTime  @map("due_date")
  paidAt          DateTime? @map("paid_at")
  paymentMethod   String?   @map("payment_method")
  stripeInvoiceId String?   @unique @map("stripe_invoice_id")
  pdfUrl          String?   @map("pdf_url")
  notes           String?
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  subscription    Subscription @relation(fields: [subscriptionId], references: [id])
  
  @@map("invoices")
}

// Usage Tracking Model
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

// Notification Model
model Notification {
  id          Int       @id @default(autoincrement())
  userId      Int?      @map("user_id")
  companyId   Int?      @map("company_id")
  type        String    // subscription_expiring, payment_failed, limit_reached, deal_closed
  title       String
  message     String
  isRead      Boolean   @default(false) @map("is_read")
  actionUrl   String?   @map("action_url")
  createdAt   DateTime  @default(now()) @map("created_at")
  
  user        User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
  company     Company?  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  @@map("notifications")
}

// تحديث Company Model
model Company {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  email     String?
  phone     String?
  address   String?
  logo      String?
  website   String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  users         User[]
  properties    Property[]
  leads         Lead[]
  deals         Deal[]
  subscription  Subscription?
  usage         Usage[]
  invoices      Invoice[]
  notifications Notification[]

  @@map("companies")
}

// تحديث User Model
model User {
  // ... existing fields
  notifications Notification[]
}
```

### الخطوة 2: إنشاء Migration

```bash
cd backend
npx prisma migrate dev --name add_saas_models
npx prisma generate
```

---

## 🔐 2. إضافة Middleware للعزل والحدود

### ملف: `backend/middleware/tenantIsolation.js`

```javascript
const { prisma } = require('../database/db');

/**
 * Middleware to enforce tenant isolation
 * Automatically filters queries by companyId
 */
const tenantIsolation = async (req, res, next) => {
  // Skip for admin users (they can see all)
  if (req.user && req.user.role === 'admin' && !req.user.companyId) {
    return next();
  }
  
  // Set tenant ID from user's company
  if (req.user && req.user.companyId) {
    req.tenantId = req.user.companyId;
  }
  
  next();
};

/**
 * Middleware to check if user has access to resource
 */
const checkTenantAccess = async (req, res, next) => {
  const resourceId = req.params.id || req.body.id;
  const resourceType = req.resourceType || 'property'; // property, lead, deal
  
  if (!resourceId) {
    return next();
  }
  
  // Admin without company can access all
  if (req.user.role === 'admin' && !req.user.companyId) {
    return next();
  }
  
  const modelMap = {
    property: prisma.property,
    lead: prisma.lead,
    deal: prisma.deal,
    user: prisma.user
  };
  
  const model = modelMap[resourceType];
  if (!model) {
    return next();
  }
  
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

module.exports = {
  tenantIsolation,
  checkTenantAccess
};
```

### ملف: `backend/middleware/checkUsageLimit.js`

```javascript
const Subscription = require('../models/Subscription');
const Usage = require('../models/Usage');

/**
 * Check if company has reached usage limit for a resource
 */
const checkUsageLimit = async (req, res, next) => {
  try {
    if (!req.user || !req.user.companyId) {
      return next();
    }
    
    const subscription = await Subscription.findByCompanyId(req.user.companyId);
    if (!subscription) {
      return res.status(403).json({
        error: 'No active subscription',
        code: 'NO_SUBSCRIPTION'
      });
    }
    
    // Check subscription status
    if (subscription.status !== 'active' && subscription.status !== 'trial') {
      return res.status(403).json({
        error: 'Subscription is not active',
        code: 'INACTIVE_SUBSCRIPTION',
        status: subscription.status
      });
    }
    
    const plan = await subscription.getPlan();
    const resourceType = req.resourceType || 'property';
    
    // Get current usage
    const currentDate = new Date();
    const usage = await Usage.getCurrentUsage(
      req.user.companyId,
      resourceType,
      currentDate.getMonth() + 1,
      currentDate.getFullYear()
    );
    
    // Check limit
    const limitField = `${resourceType}sLimit`;
    const limit = plan[limitField];
    
    if (limit !== null && limit !== -1 && usage >= limit) {
      return res.status(403).json({
        error: `${resourceType} limit reached`,
        code: 'USAGE_LIMIT_REACHED',
        limit,
        current: usage,
        resourceType
      });
    }
    
    next();
  } catch (error) {
    console.error('Usage limit check error:', error);
    next(error);
  }
};

module.exports = checkUsageLimit;
```

### ملف: `backend/middleware/requireActiveSubscription.js`

```javascript
const Subscription = require('../models/Subscription');

/**
 * Ensure company has active subscription
 */
const requireActiveSubscription = async (req, res, next) => {
  try {
    if (!req.user || !req.user.companyId) {
      return res.status(403).json({
        error: 'Company access required',
        code: 'NO_COMPANY'
      });
    }
    
    const subscription = await Subscription.findByCompanyId(req.user.companyId);
    
    if (!subscription) {
      return res.status(403).json({
        error: 'No subscription found',
        code: 'NO_SUBSCRIPTION'
      });
    }
    
    // Check if subscription is active or in trial
    if (subscription.status !== 'active' && subscription.status !== 'trial') {
      return res.status(403).json({
        error: 'Subscription is not active',
        code: 'INACTIVE_SUBSCRIPTION',
        status: subscription.status
      });
    }
    
    // Check if trial expired
    if (subscription.status === 'trial' && subscription.trialEndDate) {
      if (new Date() > new Date(subscription.trialEndDate)) {
        return res.status(403).json({
          error: 'Trial period has expired',
          code: 'TRIAL_EXPIRED'
        });
      }
    }
    
    req.subscription = subscription;
    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    next(error);
  }
};

module.exports = requireActiveSubscription;
```

---

## 📊 3. تحديث Models

### ملف: `backend/models/Subscription.js`

```javascript
const { prisma } = require('../database/db');

class Subscription {
  constructor(data) {
    this.id = data.id;
    this.companyId = data.companyId || data.company_id;
    this.planId = data.planId || data.plan_id;
    this.status = data.status;
    this.startDate = data.startDate || data.start_date;
    this.endDate = data.endDate || data.end_date;
    this.trialEndDate = data.trialEndDate || data.trial_end_date;
    this.autoRenew = data.autoRenew ?? data.auto_renew;
    this.stripeCustomerId = data.stripeCustomerId || data.stripe_customer_id;
    this.stripeSubscriptionId = data.stripeSubscriptionId || data.stripe_subscription_id;
  }
  
  static async create(subscriptionData) {
    const created = await prisma.subscription.create({
      data: {
        companyId: subscriptionData.companyId,
        planId: subscriptionData.planId,
        status: subscriptionData.status || 'trial',
        startDate: subscriptionData.startDate || new Date(),
        trialEndDate: subscriptionData.trialEndDate,
        autoRenew: subscriptionData.autoRenew ?? true
      },
      include: {
        plan: true
      }
    });
    
    return new Subscription(created);
  }
  
  static async findByCompanyId(companyId) {
    const subscription = await prisma.subscription.findUnique({
      where: { companyId: parseInt(companyId) },
      include: {
        plan: true
      }
    });
    
    return subscription ? new Subscription(subscription) : null;
  }
  
  async getPlan() {
    const plan = await prisma.plan.findUnique({
      where: { id: this.planId }
    });
    
    return plan;
  }
  
  async update(updateData) {
    const updated = await prisma.subscription.update({
      where: { id: this.id },
      data: updateData
    });
    
    Object.assign(this, updated);
    return this;
  }
  
  async cancel() {
    return this.update({
      status: 'cancelled',
      cancelledAt: new Date(),
      autoRenew: false
    });
  }
  
  async activate() {
    return this.update({
      status: 'active'
    });
  }
}

module.exports = Subscription;
```

### ملف: `backend/models/Usage.js`

```javascript
const { prisma } = require('../database/db');

class Usage {
  constructor(data) {
    this.id = data.id;
    this.companyId = data.companyId || data.company_id;
    this.resourceType = data.resourceType || data.resource_type;
    this.count = data.count;
    this.month = data.month;
    this.year = data.year;
  }
  
  static async getCurrentUsage(companyId, resourceType, month, year) {
    const usage = await prisma.usage.findUnique({
      where: {
        companyId_resourceType_month_year: {
          companyId: parseInt(companyId),
          resourceType,
          month,
          year
        }
      }
    });
    
    return usage ? usage.count : 0;
  }
  
  static async increment(companyId, resourceType) {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    
    const usage = await prisma.usage.upsert({
      where: {
        companyId_resourceType_month_year: {
          companyId: parseInt(companyId),
          resourceType,
          month,
          year
        }
      },
      update: {
        count: { increment: 1 }
      },
      create: {
        companyId: parseInt(companyId),
        resourceType,
        count: 1,
        month,
        year
      }
    });
    
    return new Usage(usage);
  }
  
  static async decrement(companyId, resourceType) {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    
    const usage = await prisma.usage.findUnique({
      where: {
        companyId_resourceType_month_year: {
          companyId: parseInt(companyId),
          resourceType,
          month,
          year
        }
      }
    });
    
    if (usage && usage.count > 0) {
      await prisma.usage.update({
        where: { id: usage.id },
        data: { count: { decrement: 1 } }
      });
    }
  }
}

module.exports = Usage;
```

---

## 🔄 4. تحديث Routes الموجودة

### مثال: تحديث `backend/routes/properties.js`

```javascript
const express = require('express');
const Property = require('../models/Property');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { tenantIsolation, checkTenantAccess } = require('../middleware/tenantIsolation');
const checkUsageLimit = require('../middleware/checkUsageLimit');
const Usage = require('../models/Usage');

const router = express.Router();

// Get all properties - with tenant isolation
router.get('/', tenantIsolation, async (req, res, next) => {
  try {
    const where = {};
    
    // Apply tenant isolation
    if (req.tenantId) {
      where.companyId = req.tenantId;
    }
    
    // Apply filters
    if (req.query.type) where.type = req.query.type;
    if (req.query.purpose) where.purpose = req.query.purpose;
    if (req.query.emirate) where.emirate = req.query.emirate;
    
    const properties = await Property.findAll(where);
    res.json({ success: true, properties });
  } catch (error) {
    next(error);
  }
});

// Create property - with usage limit check
router.post(
  '/',
  authenticateToken,
  requireRole(['admin', 'broker']),
  tenantIsolation,
  checkUsageLimit,
  async (req, res, next) => {
    try {
      // Set companyId from user
      req.body.companyId = req.user.companyId;
      req.body.ownerId = req.user.id;
      
      const property = await Property.create(req.body);
      
      // Increment usage
      if (req.user.companyId) {
        await Usage.increment(req.user.companyId, 'property');
      }
      
      res.status(201).json({ success: true, property });
    } catch (error) {
      next(error);
    }
  }
);

// Update property - with tenant access check
router.put(
  '/:id',
  authenticateToken,
  requireRole(['admin', 'broker']),
  checkTenantAccess,
  async (req, res, next) => {
    try {
      const property = await Property.update(req.params.id, req.body);
      res.json({ success: true, property });
    } catch (error) {
      next(error);
    }
  }
);

// Delete property - with tenant access check
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin', 'broker']),
  checkTenantAccess,
  async (req, res, next) => {
    try {
      await Property.delete(req.params.id);
      
      // Decrement usage
      if (req.user.companyId) {
        await Usage.decrement(req.user.companyId, 'property');
      }
      
      res.json({ success: true, message: 'Property deleted' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
```

---

## 💳 5. إضافة Payment Integration (Stripe)

### تثبيت Stripe

```bash
npm install stripe
```

### ملف: `backend/services/paymentService.js`

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  /**
   * Create Stripe customer
   */
  static async createCustomer(companyId, email, name) {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        companyId: companyId.toString()
      }
    });
    
    return customer;
  }
  
  /**
   * Create checkout session
   */
  static async createCheckoutSession(subscriptionId, planId, successUrl, cancelUrl) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      subscription_data: {
        metadata: {
          subscriptionId: subscriptionId.toString(),
          planId: planId.toString()
        }
      },
      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: {
              name: `Plan ${planId}`,
            },
            unit_amount: 29900, // 299 AED in cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    
    return session;
  }
  
  /**
   * Handle webhook
   */
  static async handleWebhook(event) {
    switch (event.type) {
      case 'checkout.session.completed':
        // Handle successful payment
        break;
      case 'invoice.payment_succeeded':
        // Handle recurring payment
        break;
      case 'invoice.payment_failed':
        // Handle failed payment
        break;
      case 'customer.subscription.deleted':
        // Handle cancellation
        break;
    }
  }
}

module.exports = PaymentService;
```

### ملف: `backend/routes/payments.js`

```javascript
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const PaymentService = require('../services/paymentService');
const Subscription = require('../models/Subscription');

const router = express.Router();

// Create checkout session
router.post('/checkout', authenticateToken, async (req, res, next) => {
  try {
    const { planId } = req.body;
    
    if (!req.user.companyId) {
      return res.status(400).json({ error: 'Company required' });
    }
    
    let subscription = await Subscription.findByCompanyId(req.user.companyId);
    
    if (!subscription) {
      subscription = await Subscription.create({
        companyId: req.user.companyId,
        planId,
        status: 'trial'
      });
    }
    
    const session = await PaymentService.createCheckoutSession(
      subscription.id,
      planId,
      `${process.env.FRONTEND_URL}/payment/success`,
      `${process.env.FRONTEND_URL}/payment/cancel`
    );
    
    res.json({ success: true, sessionId: session.id, url: session.url });
  } catch (error) {
    next(error);
  }
});

// Webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  await PaymentService.handleWebhook(event);
  
  res.json({ received: true });
});

module.exports = router;
```

---

## 📧 6. إضافة Email Service

### تثبيت

```bash
npm install nodemailer
# أو
npm install @sendgrid/mail
```

### ملف: `backend/services/emailService.js`

```javascript
const nodemailer = require('nodemailer');

class EmailService {
  static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  
  static async sendWelcomeEmail(email, companyName) {
    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Welcome to AL RABEI Real Estate',
      html: `
        <h1>Welcome ${companyName}!</h1>
        <p>Your account has been created successfully.</p>
        <p>You are currently on a 14-day free trial.</p>
      `
    });
  }
  
  static async sendTrialExpiringEmail(email, daysLeft) {
    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Your trial is expiring soon',
      html: `
        <h1>Trial Expiring Soon</h1>
        <p>Your trial will expire in ${daysLeft} days.</p>
        <a href="${process.env.FRONTEND_URL}/subscription">Upgrade Now</a>
      `
    });
  }
}

module.exports = EmailService;
```

---

## 🎯 الخطوات التالية

1. **تنفيذ Database Changes**
   ```bash
   cd backend
   npx prisma migrate dev --name add_saas_models
   ```

2. **إضافة Seed Data للخطط**
   ```javascript
   // prisma/seed.js
   await prisma.plan.createMany({
     data: [
       { name: 'free', displayName: 'Free', price: 0, propertiesLimit: 10 },
       { name: 'basic', displayName: 'Basic', price: 299, propertiesLimit: 100 },
       { name: 'premium', displayName: 'Premium', price: 799, propertiesLimit: 500 }
     ]
   });
   ```

3. **تحديث جميع Routes**
   - إضافة `tenantIsolation` middleware
   - إضافة `checkUsageLimit` للـ POST routes
   - إضافة `checkTenantAccess` للـ PUT/DELETE routes

4. **إضافة Frontend Components**
   - Subscription Management Page
   - Payment Checkout Page
   - Usage Dashboard
   - Plan Comparison Page

5. **Testing**
   - Unit Tests للـ Models
   - Integration Tests للـ Routes
   - E2E Tests للـ Subscription Flow

---

**ملاحظة**: هذا دليل تقني تفصيلي. راجع `SAAS_TRANSFORMATION_REPORT.md` للحصول على التقرير الشامل.

