# 🚀 متغيرات Railway - جاهز للنشر

**توليد المتغيرات:** يناير 2026

---

## ✅ JWT_SECRET (آمن)

```
pVV73iZjqZyAh7xIe/k95zre7MvnamY27Tqa+CaGdp5sVJvYHJqKfLGw
F0PR8vhmAd8c2TB6fnzKm/trfQcoJw==
```

**تعليمات:**
1. انسخ الـ Secret أعلاه
2. اذهب إلى Railway Dashboard
3. اختر Backend Service
4. اضغط "Variables" 
5. أضف متغير جديد:
   - NAME: `JWT_SECRET`
   - VALUE: (الصق الـ Secret)
6. اضغط Save

---

## ⚙️ المتغيرات الأخرى المطلوبة

أضف هذه المتغيرات في Railway Dashboard:

### 1. NODE_ENV
```
NAME: NODE_ENV
VALUE: production
```

### 2. FRONTEND_URL
```
NAME: FRONTEND_URL
VALUE: https://yourdomain.com
```

(غيّر yourdomain.com بنطاقك الفعلي)

### 3. CORS_ORIGINS
```
NAME: CORS_ORIGINS
VALUE: https://yourdomain.com,https://app.yourdomain.com
```

### 4. RATE_LIMIT_MAX_REQUESTS
```
NAME: RATE_LIMIT_MAX_REQUESTS
VALUE: 50
```

### 5. LOG_LEVEL
```
NAME: LOG_LEVEL
VALUE: warn
```

### 6. DATABASE_URL
```
✅ Railway سيضيفه تلقائياً عند إضافة PostgreSQL
لا تحتاج لتحديثه يدوياً
```

---

## 📋 خطوات سريعة للنشر

### 1. تثبيت Railway CLI
```bash
npm install -g @railway/cli
```

### 2. تسجيل الدخول
```bash
railway login
```

### 3. إنشاء Project
```bash
railway init
```

### 4. إضافة PostgreSQL
- في Dashboard > اضغط "+"
- اختر "PostgreSQL"
- تم!

### 5. إضافة المتغيرات
- في Dashboard > Backend Service > Variables
- أضف جميع المتغيرات أعلاه

### 6. النشر
```bash
cd backend
railway up
```

---

## ✨ الخطوات الأساسية

### Step 1️⃣ - الحساب والـ CLI
```bash
# 1. اذهب إلى https://railway.app
# 2. سجل حساب جديد (مجاني)
# 3. ثم شغّل:

npm install -g @railway/cli
railway login
```

### Step 2️⃣ - إنشاء Project
```bash
cd "c:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE"
railway init
```

عند السؤال:
- Project name: `alrabie-backend`
- Region: اختر الأقرب (أو `us-east1`)

### Step 3️⃣ - إضافة Database
في https://railway.app/dashboard:
1. اختر Project > Backend
2. اضغط "+" button
3. اختر "PostgreSQL"
4. انتظر التثبيت

### Step 4️⃣ - إضافة المتغيرات
في Dashboard > Backend > Variables:
1. أضف `NODE_ENV=production`
2. أضف `JWT_SECRET` (من أعلاه)
3. أضف `FRONTEND_URL`
4. أضف `CORS_ORIGINS`
5. أضف `RATE_LIMIT_MAX_REQUESTS=50`
6. أضف `LOG_LEVEL=warn`

### Step 5️⃣ - النشر
```bash
cd backend
railway up
```

---

## 🔗 الروابط المهمة

- 📖 Railway Docs: https://docs.railway.app
- 🎯 Dashboard: https://railway.app/dashboard
- 💬 Support: https://railway.app/support
- 📝 Pricing: https://railway.app/pricing

---

## ✅ بعد النشر مباشرة

### 1. تحقق من الـ URL
في Dashboard > Backend > Settings > Deployment
ستجد URL مثل:
```
https://alrabie-backend-production.railway.app
```

### 2. اختبر الـ API
```bash
curl https://alrabie-backend-production.railway.app/api/health

# يجب أن تحصل على:
# {"status":"OK","message":"API is running"}
```

### 3. افحص الـ Logs
```bash
railway logs
```

يجب أن ترى:
```
✅ Server started successfully!
🌐 Server running on port 3000
✅ Database connected
```

---

## 🎉 تم!

الآن Backend مُنشر على Railway!

**التالي:**
- [ ] نشر Frontend على Vercel (اختياري)
- [ ] ربط النطاق (اختياري)
- [ ] إعداد Monitoring (اختياري)

---

**🚀 Ready to deploy!**
