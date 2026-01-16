# 🚀 نشر الفرونت إند على Vercel

## 📋 الخطوات السريعة

### 1️⃣ ربط المشروع

1. اذهب إلى [Vercel](https://vercel.com)
2. **Add New** → **Project**
3. اختر الريبو: `REAL-STATE-PROJ`
4. **Framework Preset**: Next.js (سيتم اكتشافه تلقائياً)

### 2️⃣ إعدادات Build

- **Root Directory**: `/` (أو اتركه فارغاً)
- **Build Command**: `npm run build` (افتراضي)
- **Output Directory**: `.next` (افتراضي)
- **Install Command**: `npm install` (افتراضي)

### 3️⃣ Environment Variables

في **Environment Variables**، أضف:

```env
# Backend API URL (بعد نشر الباك إند على Railway)
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api

# Site URL (سيتم تعيينه تلقائياً، لكن يمكنك تعيينه يدوياً)
NEXT_PUBLIC_SITE_URL=https://your-frontend.vercel.app
```

**مثال**:
```env
NEXT_PUBLIC_API_URL=https://al-rabei-backend.railway.app/api
NEXT_PUBLIC_SITE_URL=https://real-state-proj.vercel.app
```

### 4️⃣ Deploy

اضغط **Deploy** وانتظر حتى يكتمل Build.

---

## 🔍 بعد النشر

### 1. احصل على Frontend URL
بعد النشر، Vercel سيعطيك رابط مثل:
```
https://real-state-proj.vercel.app
```

### 2. حدث Backend CORS
في Railway → Environment Variables:
```env
FRONTEND_URL=https://real-state-proj.vercel.app
CORS_ORIGINS=https://real-state-proj.vercel.app
```

### 3. حدث Frontend API URL
في Vercel → Environment Variables:
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

### 4. Redeploy
- أعد نشر Backend على Railway
- أعد نشر Frontend على Vercel (أو سيحدث تلقائياً)

---

## ✅ التحقق

بعد النشر، اختبر:
1. افتح: `https://your-frontend.vercel.app`
2. تأكد من أن الصفحة تعمل
3. جرب Login/Register
4. تأكد من أن API calls تعمل

---

## 🐛 Troubleshooting

### مشكلة: API calls فاشلة
**الحل**: 
- تأكد من `NEXT_PUBLIC_API_URL` صحيح
- تأكد من CORS في Backend
- تحقق من Console في Browser

### مشكلة: Images لا تظهر
**الحل**: 
- تأكد من `next.config.js` يحتوي على remotePatterns
- تأكد من أن Backend URL صحيح في next.config.js

### مشكلة: Build فاشل
**الحل**:
- تحقق من Logs في Vercel
- تأكد من أن جميع Dependencies مثبتة
- تأكد من Node.js version (18+)

---

## 📝 ملاحظات

1. **Auto Deploy**: Vercel سينشر تلقائياً عند push إلى main branch
2. **Preview Deployments**: كل PR يحصل على preview URL
3. **Environment Variables**: يمكن تعيينها لكل environment (Production, Preview, Development)

---

## 🔐 الأمان

- ✅ Environment Variables آمنة في Vercel
- ✅ لا تحفظ secrets في الكود
- ✅ استخدم `NEXT_PUBLIC_` فقط للمتغيرات التي تحتاجها في Browser

---

**تم! 🎉**

