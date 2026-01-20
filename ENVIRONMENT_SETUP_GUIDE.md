# AL RABEI REAL ESTATE - Environment Setup Helper

## 📋 خطوات الإعداد السريع

### 1. للتطوير المحلي (Development)

```bash
# انسخ الملف:
cp backend/config.env.example backend/config.env

# حدّث القيم (اختياري - القيم الافتراضية تعمل):
PORT=3050
NODE_ENV=development
JWT_SECRET=dev-only-change-this-min32chars1234567890
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/al_rabei_real_estate
FRONTEND_URL=http://localhost:3000
```

### 2. لقاعدة بيانات محلية (PostgreSQL)

```bash
# تثبيت PostgreSQL (إذا لم يكن مثبتاً):
# Windows: https://www.postgresql.org/download/windows/
# macOS: brew install postgresql
# Linux: sudo apt-get install postgresql

# إنشاء قاعدة بيانات:
createdb al_rabei_real_estate

# تشغيل Migrations:
cd backend
npx prisma migrate dev

# (اختياري) فتح Prisma Studio:
npx prisma studio
```

### 3. للنشر على الإنتاج (Production)

#### الخطوة 1: توليد Secrets آمن

```bash
# توليد JWT_SECRET (64 حرف عشوائي):
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# النتيجة مثل:
# xY3p4Q2nM9vL5bR8kJ1wS7tD6eF4gH2i...

# احفظ النتيجة - ستحتاجها
```

#### الخطوة 2: اختر منصة الاستضافة

**Railway** (الموصى به):
```bash
npm install -g railway
railway login
railway up
# أجب على الأسئلة واتبع الخطوات
```

**Render**:
- اذهب إلى https://render.com
- ربط GitHub
- Create New Web Service
- التالي: اتبع التعليمات

**Vercel** (للـ Frontend فقط):
```bash
npm install -g vercel
cd frontend-next
vercel --prod
```

#### الخطوة 3: أعد متغيرات الإنتاج

في منصة الاستضافة، أضف:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<paste-generated-secret>
DATABASE_URL=<your-database-url>
FRONTEND_URL=https://yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
RATE_LIMIT_MAX_REQUESTS=50
LOG_LEVEL=warn
```

#### الخطوة 4: قاعدة البيانات

استخدم:
- **Supabase**: https://supabase.com (PostgreSQL مدار)
- **Railway**: توفر PostgreSQL مدمج
- **Neon**: https://neon.tech (Serverless PostgreSQL)

```bash
# احصل على Connection String:
1. أنشئ database جديد
2. انسخ Connection String
3. ضعه في DATABASE_URL

# شغّل Migrations:
NODE_ENV=production npx prisma migrate deploy
```

---

## ⚠️ مهم جداً

### لا تفعل هذا ❌

```bash
# ❌ لا تضع أسرار في الكود:
const JWT_SECRET = "my-secret";

# ❌ لا ترفع config.env على GitHub:
git add backend/config.env

# ❌ لا تستخدم كلمات مرور ضعيفة:
DATABASE_URL=postgresql://postgres:password@...

# ❌ لا تترك أسرار في Comments:
// JWT_SECRET=my-actual-secret

# ❌ لا تستخدم CORS=*:
CORS_ORIGINS=*
```

### افعل هذا ✅

```bash
# ✅ استخدم متغيرات البيئة:
NODE_ENV=production
JWT_SECRET=<strong-random-secret>

# ✅ احمِ .gitignore:
echo "config.env" >> .gitignore

# ✅ استخدم كلمات مرور قوية:
DATABASE_URL=postgresql://user:StrongP@ss123!@host:5432/db

# ✅ حدّد CORS بدقة:
CORS_ORIGINS=https://yourdomain.com

# ✅ في منصة الاستضافة:
# Dashboard > Settings > Environment Variables
```

---

## 🧪 اختبار الإعداد

```bash
# 1. اختبر Connection:
curl http://localhost:3050/api/health

# يجب أن تحصل على:
# {"status":"OK","message":"API is running"}

# 2. اختبر Database:
npx prisma studio
# يجب أن يفتح على http://localhost:5555

# 3. اختبر Frontend:
cd frontend-next
npm run dev
# يجب أن يفتح على http://localhost:3000
```

---

## 🚨 استكشاف الأخطاء

### "Port already in use"
```bash
# غيّر PORT:
PORT=3051 npm start
```

### "Cannot find module"
```bash
npm install
npm run prisma:generate
```

### "Database connection failed"
```bash
# تحقق من:
1. PostgreSQL مشغّل
2. DATABASE_URL صحيح
3. Database موجود
4. المستخدم له صلاحيات

# أعد المحاولة:
npx prisma migrate deploy
```

---

## 📞 الدعم

- 📖 اقرأ PRODUCTION_DEPLOYMENT_GUIDE.md
- 🔐 اقرأ SECURITY_GUIDE.md
- 💬 اطلب المساعدة من الفريق
