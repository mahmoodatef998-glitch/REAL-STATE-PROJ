# 🚀 نشر AL RABEI على Railway - دليل شامل

**الإصدار:** 1.0.0  
**التاريخ:** يناير 2026  
**المنصة:** Railway.app

---

## 📋 ملخص سريع

```
✅ 6 خطوات بسيطة لنشر المشروع على Railway
⏱️ الوقت المتوقع: 15-20 دقيقة
💰 التكلفة: $5/شهر مجاني (أكثر من كافي)
```

---

## 🎯 الخطوات الأساسية

### **خطوة 1: إنشاء حساب على Railway** 👤

1. اذهب إلى: **https://railway.app**
2. اضغط **"Sign Up"** (أو "Login")
3. اختر طريقة التسجيل:
   - GitHub (الأسهل)
   - Google
   - Email

4. أكمل التسجيل
5. ستحصل على **$5 مجاني/شهر** 🎉

---

### **خطوة 2: تثبيت Railway CLI** 📦

افتح Terminal وشغّل:

```bash
# تثبيت
npm install -g @railway/cli

# تحقق من التثبيت
railway --version
```

**إذا لم يعمل:**

```bash
npm install -g @railway/cli --force
```

---

### **خطوة 3: تسجيل الدخول** 🔑

```bash
railway login
```

**سيحدث:**
1. يفتح متصفح تلقائياً
2. سجل دخول بحسابك على Railway
3. وافق على الأذونات
4. عد إلى Terminal - تم! ✅

---

### **خطوة 4: إنشاء Project** 📁

```bash
# الذهاب إلى مجلد المشروع
cd "c:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE"

# إنشاء project جديد
railway init
```

**أجب على الأسئلة:**

```
✓ Project name: alrabie-backend (أو أي اسم)
✓ Region: us-east1 (اختر الأقرب لك)
✓ Continue: yes
```

---

### **خطوة 5: إضافة PostgreSQL Database** 🗄️

**في Railway Dashboard:**

1. اذهب إلى: https://railway.app/dashboard
2. اختر **Project > Backend** (الذي أنشأته)
3. اضغط على **"+"** (Add Service button)
4. اختر **"PostgreSQL"**
5. انتظر التثبيت (2-3 دقائق)

**سيحدث تلقائياً:**
- ✅ إنشاء Database جديد
- ✅ إضافة `DATABASE_URL` للـ variables
- ✅ جاهز للاتصال!

---

### **خطوة 6: إضافة Environment Variables** ⚙️

**في Railway Dashboard:**

```
Backend Service > Variables
```

**أضف هذه المتغيرات:**

| الاسم | القيمة |
|------|--------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | (من أدناه) |
| `FRONTEND_URL` | `https://yourdomain.com` |
| `CORS_ORIGINS` | `https://yourdomain.com,https://app.yourdomain.com` |
| `RATE_LIMIT_MAX_REQUESTS` | `50` |
| `LOG_LEVEL` | `warn` |

**JWT_SECRET:**

```
pVV73iZjqZyAh7xIe/k95zre7MvnamY27Tqa+CaGdp5sVJvYHJqKfLGw
F0PR8vhmAd8c2TB6fnzKm/trfQcoJw==
```

(انسخه من `RAILWAY_VARIABLES.md` أو وليد جديد)

---

### **خطوة 7: إعداد Build & Start Commands** 🔨

**في Dashboard:**

```
Backend Service > Settings > Deploy
```

**Build Command:**
```bash
npm install && npx prisma migrate deploy && npx prisma generate
```

**Start Command:**
```bash
node start-server.js
```

---

### **خطوة 8: النشر (Deploy)** 🚀

من Terminal:

```bash
# اذهب إلى مجلد backend
cd backend

# انشر!
railway up
```

**سيحدث:**
1. رفع ملفات المشروع
2. تثبيت dependencies
3. تشغيل migrations
4. بدء الـ server
5. ✅ تم!

---

## ✅ التحقق من النشر

### **1. افحص الـ URL**

في Dashboard > Backend > Settings > Deployment

ستجد URL مثل:
```
https://alrabie-backend-production.railway.app
```

### **2. اختبر الـ API**

```bash
curl https://alrabie-backend-production.railway.app/api/health

# يجب أن تحصل على:
# {"status":"OK","message":"API is running"}
```

### **3. افحص الـ Logs**

```bash
railway logs

# يجب أن تري:
✅ Server started successfully!
🌐 Server running on port 3000
✅ Database connected
```

---

## 🌐 نشر Frontend (اختياري)

### **الخيار 1: Vercel (الموصى به)**

```bash
# تثبيت Vercel CLI
npm install -g vercel

# تسجيل الدخول
vercel login

# من مجلد frontend-next
cd frontend-next

# النشر
vercel --prod
```

**أثناء النشر:**
- Project name: `alrabie-frontend`
- Environment: Production
- NEXT_PUBLIC_API_URL: (من Railway API URL)

### **الخيار 2: Railway**

في Dashboard:
1. اضغط "+" > Add Service
2. اختر GitHub Repository
3. اختر `frontend-next` folder
4. Build: `npm run build`
5. Start: `npm start`

---

## 📊 المتغيرات النهائية

### **على Railway:**

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=pVV73iZjqZyAh7xIe/k95zre7MvnamY27Tqa+CaGdp5sVJvYHJqKfLGw
F0PR8vhmAd8c2TB6fnzKm/trfQcoJw==
DATABASE_URL=<Railway سيضيفه تلقائياً>
FRONTEND_URL=https://yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
RATE_LIMIT_MAX_REQUESTS=50
LOG_LEVEL=warn
```

### **على Vercel (Frontend):**

```env
NEXT_PUBLIC_API_URL=https://alrabie-backend-production.railway.app/api
```

---

## 🐛 استكشاف الأخطاء

### **❌ خطأ: Build failed**

**الحل:**
```bash
# افحص الـ logs
railway logs

# قد يكون:
# 1. Node modules: npm install
# 2. Prisma: npm run prisma:generate
# 3. Env variables: تحقق من Dashboard
```

### **❌ خطأ: Database connection failed**

**الحل:**
```bash
# تأكد من PostgreSQL مُضاف
# في Dashboard > اضغط "+" > PostgreSQL

# ثم أعد النشر
railway up
```

### **❌ خطأ: CORS blocked**

**الحل:**
```
تأكد من CORS_ORIGINS محدد بشكل صحيح
ليس: *
نعم: https://yourdomain.com
```

### **❌ خطأ: Migrations failed**

**الحل:**
```bash
# شغّل migrations يدوياً
railway exec npm run prisma:migrate:prod

# أو أعد النشر
railway up
```

---

## 🎯 Checklist النشر

### ✅ قبل النشر:
```
[ ] حساب Railway مُنشأ
[ ] Railway CLI مثبت
[ ] git repo جاهز
[ ] package.json صحيح
[ ] .env محدث (اختياري)
[ ] Migrations جاهزة
```

### ✅ أثناء النشر:
```
[ ] Project مُنشأ
[ ] PostgreSQL مُضاف
[ ] Variables مُضافة
[ ] Build command محدد
[ ] Start command محدد
[ ] railway up تم تشغيله
```

### ✅ بعد النشر:
```
[ ] Logs تظهر بدون أخطاء
[ ] Health check يعمل
[ ] Database متصل
[ ] API يرد على الطلبات
[ ] Frontend يتصل (اختياري)
```

---

## 📞 الروابط المهمة

- 🎯 Dashboard: https://railway.app/dashboard
- 📖 Docs: https://docs.railway.app
- 💬 Support: https://railway.app/support
- 💰 Pricing: https://railway.app/pricing

---

## 🎊 تم!

**عاشت المشروع على Railway بنجاح! 🎉**

```
Your API is live at:
https://alrabie-backend-production.railway.app

✅ Database: Connected
✅ Migrations: Running
✅ API: Ready to serve
```

---

**شكراً لاستخدام Railway! 🚀**

**التالي:**
- [ ] نشر Frontend (إن لم تنشره)
- [ ] ربط النطاق (اختياري)
- [ ] إعداد Monitoring (اختياري)
- [ ] استمتع بـ project مُنشور! 🎉
