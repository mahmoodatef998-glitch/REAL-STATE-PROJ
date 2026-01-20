# 🚀 دليل النشر على Railway - خطوات عملية

**التاريخ:** يناير 2026  
**المنصة:** Railway.app  
**الحالة:** جاهز للنشر

---

## 📋 متطلبات النشر

قبل البدء، تأكد من وجود:
- ✅ حساب على Railway.app (مجاني)
- ✅ git مثبت
- ✅ npm مثبت
- ✅ Node.js 18+

---

## 🎯 الخطوات الأساسية

### **الخطوة 1: إنشاء حساب على Railway** 👤

```bash
# 1. اذهب إلى: https://railway.app
# 2. اضغط على "Sign Up"
# 3. اختر GitHub/Google/Email
# 4. أكمل التسجيل
# 5. ستحصل على $5 مجاني/شهر
```

### **الخطوة 2: تثبيت Railway CLI** 📦

```bash
# تثبيت Railway Command Line Interface
npm install -g @railway/cli

# تحقق من التثبيت
railway --version

# إذا لم يعمل، حاول:
npm install -g @railway/cli --force
```

### **الخطوة 3: تسجيل الدخول** 🔑

```bash
# سيفتح متصفح للدخول
railway login

# أو إذا تريد استخدام token:
# 1. اذهب إلى: https://railway.app/dashboard
# 2. Settings > Tokens
# 3. Create Token
# 4. railway login --with-token <token>
```

### **الخطوة 4: إنشاء Project جديد** 📁

```bash
# اختر مجلد المشروع
cd "c:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE"

# إنشاء project جديد على Railway
railway init

# ثم أجب على الأسئلة:
# Project name: alrabie-backend (أو أي اسم تفضله)
# Choose region: us-east1 (اختر الأقرب لك)
```

### **الخطوة 5: إضافة PostgreSQL** 🗄️

في Railway Dashboard:
```
1. اذهب إلى Dashboard: https://railway.app/dashboard
2. اختر Project الذي أنشأته
3. اضغط على "+" > Add Service
4. اختر "PostgreSQL"
5. سيتم إنشاء database تلقائياً
```

### **الخطوة 6: تحديث متغيرات البيئة** ⚙️

```bash
# Railway سينشئ DATABASE_URL تلقائياً
# لكن تحتاج إلى إضافة الـ variables الأخرى

# في Railway Dashboard:
# 1. اختر Backend service
# 2. اضغط على "Variables"
# 3. أضف:
```

**المتغيرات المطلوبة:**

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<paste-your-generated-secret>
FRONTEND_URL=https://yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
RATE_LIMIT_MAX_REQUESTS=50
LOG_LEVEL=warn
```

**الخطوات:**

```bash
# في Railway Dashboard:

1. قائمة Variables > Add Variable
2. أضف كل متغير:

NAME: NODE_ENV
VALUE: production
[Add]

NAME: JWT_SECRET
VALUE: <أنسخ من هنا>
[Add]

NAME: FRONTEND_URL
VALUE: https://yourdomain.com
[Add]

...وهكذا
```

### **الخطوة 7: إعداد Build Command** 🔨

في Railway Dashboard > Backend Service > Deploy:

```bash
Build Command: npm install && npx prisma migrate deploy && npx prisma generate

Start Command: node start-server.js
```

### **الخطوة 8: نشر Backend** 🚀

**الطريقة 1: من Terminal (السهلة)**

```bash
# من مجلد backend
cd backend

# نشر مباشر
railway up

# أو من المجلد الرئيسي:
cd ..
railway up
```

**الطريقة 2: من GitHub (أفضل)**

```bash
# 1. أرفع المشروع على GitHub
git add -A
git commit -m "Prepare for production deployment"
git push origin main

# 2. في Railway Dashboard:
# > Connect GitHub
# > اختر Repository
# > Auto-deploy enabled
# > Save
```

---

## 🔐 توليد JWT_SECRET الآمن

**مهم جداً! لا تستخدم الـ Secret الضعيف في الإنتاج**

```bash
# توليد secret عشوائي قوي:
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# مثال على الناتج:
# xY3p4Q2nM9vL5bR8kJ1wS7tD6eF4gH2iK9oP3uL8mN5qV7sW2xZ9cA4dB5fC6gD7h8i9j0k1l2m3n4o

# انسخ هذا الـ secret وضعه في JWT_SECRET على Railway
```

---

## ✅ التحقق من النشر

### **الخطوة 1: فحص الـ Logs**

```bash
# في Terminal:
railway logs

# أو في Dashboard:
# > Backend Service > Logs
```

يجب أن ترى:
```
✅ Server started successfully!
🌐 Server running on port 3000
✅ Database connected
```

### **الخطوة 2: اختبر Health Check**

```bash
# اختبر الـ API
curl https://<your-railway-url>/api/health

# يجب أن تحصل على:
# {"status":"OK","message":"API is running"}
```

### **الخطوة 3: تشغيل Migrations**

```bash
# إذا لم تعمل الـ migrations تلقائياً:

railway run npm run prisma:migrate:prod

# أو:
railway exec npm run prisma:migrate:prod
```

---

## 🌐 نشر Frontend (اختياري)

### **الطريقة 1: على Vercel (الموصى به)**

```bash
# 1. تثبيت Vercel CLI
npm install -g vercel

# 2. التسجيل
vercel login

# 3. من مجلد frontend-next
cd frontend-next

# 4. النشر
vercel --prod

# 5. أثناء النشر، ستُسأل:
# Project name? alrabie-frontend
# Environment variables?
# NEXT_PUBLIC_API_URL=https://<your-api-url>/api
```

### **الطريقة 2: على Railway نفسها**

```bash
# في Railway Dashboard:
# 1. اضغط "+" > Add Service
# 2. اختر GitHub Repository
# 3. اختر frontend-next folder
# 4. Build: npm run build
# 5. Start: npm start
```

---

## 📊 رابط الـ API

بعد النشر، ستحصل على URL مثل:

```
https://alrabie-backend-production.railway.app
```

استخدم هذا الـ URL في:
- FRONTEND_URL
- NEXT_PUBLIC_API_URL

---

## 🐛 استكشاف الأخطاء الشائعة

### **خطأ 1: "Build failed"**

```bash
# افحص الـ logs:
railway logs

# قد يكون:
1. Node modules غير مثبتة
   الحل: npm install

2. Prisma لم ينشأ
   الحل: npm run prisma:generate

3. Env variables ناقصة
   الحل: تحقق من Railway Dashboard > Variables
```

### **خطأ 2: "Database connection failed"**

```bash
# تحقق من DATABASE_URL
# يجب أن يكون موجود في Railway Variables

# إذا لم يكن موجود:
# 1. أضف PostgreSQL service
# 2. Railway سيضيف DATABASE_URL تلقائياً
# 3. أعد النشر
```

### **خطأ 3: "Port already in use"**

```bash
# لا تحدد PORT يدويياً
# Railway سيضيف PORT تلقائياً

# الحل:
# 1. أزل PORT من Variables
# 2. دع Railway يستخدم الـ PORT التلقائي
```

### **خطأ 4: "CORS blocked"**

```bash
# تأكد من CORS_ORIGINS
CORS_ORIGINS=https://yourdomain.com

# ليس:
CORS_ORIGINS=*
CORS_ORIGINS=http://localhost
```

---

## 🎯 Checklist النشر الكامل

```
قبل النشر:
[ ] JWT_SECRET آمن (64 characters)
[ ] DATABASE_URL محديث
[ ] NODE_ENV=production
[ ] FRONTEND_URL محديث
[ ] CORS_ORIGINS محدود
[ ] git committed
[ ] Railway CLI مثبت
[ ] حساب Railway جاهز

أثناء النشر:
[ ] project مُنشأ على Railway
[ ] PostgreSQL مُضاف
[ ] variables مُضافة
[ ] build command محدد
[ ] start command محدد

بعد النشر:
[ ] logs تظهر بدون أخطاء
[ ] health check يعمل
[ ] database متصل
[ ] migrations جاهزة
[ ] API يرد على الطلبات

اختياري:
[ ] Frontend مُنشر على Vercel
[ ] NEXT_PUBLIC_API_URL محدث
[ ] Domain مُرتبط (اختياري)
```

---

## 📞 الدعم

إذا واجهت مشاكل:

1. **اقرأ الـ Logs أولاً:**
   ```bash
   railway logs
   ```

2. **تحقق من Documentation:**
   - https://docs.railway.app

3. **اطلب المساعدة:**
   - Railway Support: https://railway.app/support
   - Community: Discord (في الـ website)

---

**تم! الآن أنت جاهز للنشر على Railway 🎉**
