# 🚀 دليل نشر المشروع على الإنتاج (Production Deployment Guide)

**آخر تحديث:** يناير 2026  
**الحالة:** جاهز للنشر ✅

---

## 📋 المحتويات

- [متطلبات النشر](#متطلبات-النشر)
- [اختيار منصة الاستضافة](#اختيار-منصة-الاستضافة)
- [خطوات النشر](#خطوات-النشر)
- [إعدادات الأمان](#إعدادات-الأمان)
- [المراقبة والتسجيل](#المراقبة-والتسجيل)
- [استكشاف الأخطاء](#استكشاف-الأخطاء)
- [القوائم التفتيشية](#القوائم-التفتيشية)

---

## ✅ متطلبات النشر

### 1. **الحسابات المطلوبة**
- [ ] حساب منصة استضافة (Railway, Render, Vercel, إلخ)
- [ ] حساب قاعدة بيانات (Supabase, Neon, إلخ)
- [ ] نطاق (Domain) مسجل
- [ ] شهادة SSL (غالباً مجانية مع المنصة)

### 2. **المعلومات المطلوبة**
```
- Domain: yourdomain.com
- Backend URL: api.yourdomain.com
- Frontend URL: yourdomain.com
- Database Host: production-db.example.com
- Database Password: [STRONG_PASSWORD]
```

### 3. **الأدوات**
```bash
# Node.js 18+
node --version

# npm 8+
npm --version

# Git
git --version
```

---

## 🏢 اختيار منصة الاستضافة

### **Backend Options:**

#### **Railway** ⭐ (الموصى به)
- ✅ سهل جداً
- ✅ PostgreSQL مدمج
- ✅ النسخة المجانية توفر $5/شهر
- 🌐 https://railway.app

```bash
# Installation
npm install -g railway

# Login
railway login

# Deploy
railway up
```

#### **Render**
- ✅ نسخة مجانية
- ✅ Auto-deploy من GitHub
- 🌐 https://render.com

#### **DigitalOcean**
- ✅ VPS موثوق
- ✅ قيمة جيدة
- 💰 $5+/شهر
- 🌐 https://digitalocean.com

#### **AWS Elastic Beanstalk**
- ✅ قابل للتوسع
- ✅ موثوق جداً
- 💰 Pay as you go
- 🌐 https://aws.amazon.com

---

### **Database Options:**

#### **Supabase** ⭐ (الموصى به)
- ✅ PostgreSQL مدار
- ✅ نسخة مجانية سخية
- ✅ Dashboard جميل
- ✅ Backups تلقائية
- 🌐 https://supabase.com

```sql
-- بعد إنشاء project
1. انسخ Database URL من Project Settings
2. استخدمها في: DATABASE_URL=...
3. تفعيل SSL في Connection String
```

#### **Neon**
- ✅ PostgreSQL بدون sunless
- ✅ نسخة مجانية
- ✅ Serverless مستقبلي
- 🌐 https://neon.tech

#### **AWS RDS**
- ✅ محترف جداً
- ✅ Backup تلقائي
- 💰 Pay as you go
- 🌐 https://aws.amazon.com

---

## 🚀 خطوات النشر

### **المرحلة 1: تحضير المشروع**

#### 1.1 تحديث ملف `.gitignore`
```bash
# تأكد من وجود config.env
echo "config.env" >> .gitignore
echo ".env.production" >> .gitignore
echo ".env.local" >> .gitignore

git add .gitignore
git commit -m "Update .gitignore for security"
```

#### 1.2 حذف الأسرار من Git
```bash
# إذا كنت قد رفعت config.env مسبقاً
git rm --cached backend/config.env
git commit -m "Remove config.env from git history"
git push origin main
```

#### 1.3 إعداد متغيرات الإنتاج
```bash
# في backend/.env.production.example
# حدث جميع القيم:
PORT=3000
NODE_ENV=production
JWT_SECRET=<GENERATE_STRONG_SECRET>
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
FRONTEND_URL=https://yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

---

### **المرحلة 2: إعداد قاعدة البيانات**

#### مثال: Supabase

```bash
# 1. انشئ project جديد على supabase.com
# 2. انسخ Database URL من Project Settings > Database > Connection string

# 3. حدث المتغير:
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?sslmode=require"

# 4. شغّل Migrations
npx prisma migrate deploy

# 5. تحقق من الـ Schema
npx prisma studio
```

#### مثال: Railway

```bash
# Railway ينشئ قاعدة بيانات تلقائياً
# عند إضافة PostgreSQL plugin

# ستحصل على DATABASE_URL تلقائياً
```

---

### **المرحلة 3: نشر Backend**

#### **خيار 1: Railway** (الأسهل)

```bash
# 1. إنشاء project جديد
railway init

# 2. إضافة متغيرات البيئة
# في Railway Dashboard:
# Settings > Variables
# أضف:
NODE_ENV=production
JWT_SECRET=<strong-secret>
DATABASE_URL=<your-database-url>
FRONTEND_URL=https://yourdomain.com

# 3. الربط مع GitHub (اختياري)
# في Railway: GitHub Sync

# 4. Deploy
railway up
```

#### **خيار 2: Render**

```bash
# 1. انذهب إلى https://render.com
# 2. Create New > Web Service
# 3. اختر Repository
# 4. إعدادات:
Name: alrabie-backend
Environment: Node
Build Command: npm install
Start Command: npm start

# 5. أضف متغيرات البيئة:
NODE_ENV=production
JWT_SECRET=...
DATABASE_URL=...
FRONTEND_URL=...

# 6. Deploy
```

#### **خيار 3: Heroku (قديم)**

```bash
# لاحظ: Heroku توقفت عن الخطة المجانية
# استخدم Railway أو Render بدلاً منها
```

---

### **المرحلة 4: نشر Frontend**

#### **خيار 1: Vercel** ⭐ (الموصى به)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy from frontend-next folder
cd frontend-next
vercel --prod

# 4. أثناء النشر، ستُسأل عن:
? Project name? alrabie-frontend
? Where is your code? ./
? Want to modify vercel.json? No

# 5. إعداد متغيرات البيئة:
# في Vercel Dashboard:
# Settings > Environment Variables
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

#### **خيار 2: Netlify**

```bash
# 1. Connect GitHub
# 2. في Netlify:
# Site Settings > Build & Deploy
Build command: npm run build
Publish directory: .next

# 3. متغيرات البيئة:
NEXT_PUBLIC_API_URL=...
```

#### **خيار 3: جهازك الخاص (VPS)**

```bash
# 1. بناء التطبيق
npm run build

# 2. تشغيل في الخلفية:
npm start

# 3. أو استخدم PM2:
npm install -g pm2
pm2 start "npm start" --name "alrabie-frontend"
pm2 save
```

---

## 🔐 إعدادات الأمان

### 1. **JWT Secret**

```bash
# توليد secret قوي:
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# الناتج مثل:
# xY3p4Q2nM9vL5bR8kJ1wS7tD6eF4gH2iK9oP3uL8mN5qV7sW2xZ9cA4dB5fC6gD7h8i9j0k

# ضعه في متغير البيئة:
JWT_SECRET=xY3p4Q2nM9vL5bR8kJ1wS7tD6eF4gH2iK9oP3uL8mN5qV7sW2xZ9cA4dB5fC6gD7h8i9j0k
```

### 2. **Database Password**

```bash
# استخدم password قوي (16+ characters):
# مثال: Tr0pic@lSunset#2024!XyZ

# لا تستخدم:
- ❌ password
- ❌ 123456
- ❌ yourdomain
- ❌ admin
```

### 3. **HTTPS فقط**

```javascript
// في config.js - تأكد من:
if (isProduction) {
  // Force HTTPS
  // في Nginx/Apache:
  // Redirect all HTTP to HTTPS
}
```

### 4. **CORS مقيد**

```env
# في .env.production:
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# لا تستخدم:
# ❌ CORS_ORIGINS=*
# ❌ CORS_ORIGINS=http://localhost:3000
```

### 5. **Rate Limiting**

```env
# في الإنتاج - اجعله أكثر صرامة:
RATE_LIMIT_MAX_REQUESTS=50      # بدلاً من 100
RATE_LIMIT_WINDOW_MS=600000     # 10 دقائق بدلاً من 15
```

---

## 📊 المراقبة والتسجيل

### 1. **Sentry** (Logging الأخطاء)

```bash
npm install @sentry/node

# في start-server.js:
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.errorHandler());
```

### 2. **LogRocket** (تتبع الجلسات)

```bash
npm install logrocket

# في الـ Frontend
import LogRocket from 'logrocket';
LogRocket.init('your-id');
```

### 3. **DataDog** (الأداء)

```bash
npm install dd-trace

# في start-server.js:
const tracer = require('dd-trace').init();
```

### 4. **Logs المدمج**

```javascript
// استخدم Logger الموجود في utils/logger.js
const logger = require('./utils/logger');

logger.error('Error message');
logger.warn('Warning message');
logger.info('Info message');

// سيتم حفظها في:
// logs/error.log
// logs/combined.log
```

---

## 🔍 استكشاف الأخطاء

### **الخطأ 1: "Cannot find module"**

```bash
# الحل:
npm install
npm run prisma:generate
```

### **الخطأ 2: "Port already in use"**

```bash
# غيّر PORT في متغيرات البيئة:
PORT=3001
```

### **الخطأ 3: "Database connection failed"**

```bash
# تحقق من:
1. DATABASE_URL صحيح
2. SSL مفعّل (إن لزم)
3. قاعدة البيانات مُنشأة
4. المستخدم له صلاحيات

# اختبر الاتصال:
psql "your-database-url"
```

### **الخطأ 4: "JWT_SECRET error"**

```bash
# تأكد من وجوده في متغيرات البيئة:
# لا تضعه في config.env في الإنتاج
```

### **الخطأ 5: "CORS blocked"**

```bash
# تحقق من:
FRONTEND_URL=https://yourdomain.com
CORS_ORIGINS=https://yourdomain.com
```

---

## ✅ القوائم التفتيشية

### **Pre-Deployment Checklist**

```
🔒 الأمان:
[ ] JWT_SECRET قوي (64+ characters)
[ ] DATABASE_URL محمي وليس في git
[ ] HTTPS مفعّل
[ ] CORS محدد بشكل صحيح
[ ] Rate limiting مفعّل
[ ] لا توجد أسرار في الكود

🗄️ قاعدة البيانات:
[ ] Backup مُفعّل
[ ] SSL مفعّل
[ ] Connection pool مُحسّن
[ ] Migrations جاهزة

🚀 التطبيق:
[ ] NODE_ENV=production
[ ] جميع المتغيرات مُعرّفة
[ ] Tests جميعاً passing
[ ] Build ينجح بدون errors
[ ] Performance مقبول

📊 المراقبة:
[ ] Logging مُفعّل
[ ] Error tracking مُفعّل
[ ] Health check يعمل
[ ] Metrics مرئية
```

### **Post-Deployment Checklist**

```
✅ بعد النشر:
[ ] اختبر الـ login
[ ] اختبر الـ API endpoints
[ ] تحقق من قاعدة البيانات
[ ] راقب الـ Logs
[ ] اختبر CORS من الـ Frontend
[ ] اختبر الـ Images upload
[ ] تحقق من الـ SSL certificate
[ ] اختبر من جهاز mobile
[ ] اختبر الـ Pagination
[ ] اختبر معدل الخطأ
```

---

## 📞 الدعم والمساعدة

### **المصادر**

- 📚 Railway Docs: https://docs.railway.app
- 📚 Supabase Docs: https://supabase.com/docs
- 📚 Vercel Docs: https://vercel.com/docs
- 📚 Prisma Docs: https://www.prisma.io/docs
- 📚 Next.js Docs: https://nextjs.org/docs

### **الأخطاء الشائعة**

```bash
# خطأ: "EADDRINUSE"
# الحل: تغيير PORT أو قتل العملية

# خطأ: "ENOTFOUND"
# الحل: تحقق من اسم المضيف

# خطأ: "ECONNREFUSED"
# الحل: قاعدة البيانات غير متاحة
```

---

## 🎉 النتيجة المتوقعة

بعد اتباع الخطوات:

```
✅ Backend API يعمل على: https://api.yourdomain.com
✅ Frontend يعمل على: https://yourdomain.com
✅ Database محمي وآمن
✅ SSL/HTTPS مفعّل
✅ Monitoring وLogging يعملان
✅ Auto-backups مُفعّلة
✅ جاهز للمستخدمين الحقيقيين! 🚀
```

---

**آخر تحديث:** يناير 2026  
**الإصدار:** 1.0.0  
**الحالة:** جاهز للنشر ✅
