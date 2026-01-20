# 🚀 خطوات رفع قاعدة البيانات على Supabase

## ✅ ما تم إنجازه

1. ✅ تحديث `schema.prisma` لاستخدام PostgreSQL
2. ✅ تحديث `config.env` و `.env` بـ DATABASE_URL الخاص بـ Supabase

## 🔍 التحقق من Supabase

### الخطوة 1: تأكد من أن Supabase Project نشط

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. افتح المشروع: `yzeirccdvvshpygofnlg`
3. تأكد من أن Status = **"Active"**

### الخطوة 2: تحقق من Database URL

1. في Supabase Dashboard → **Settings** → **Database**
2. انسخ **Connection string** → **URI**
3. تأكد من أن الكود يطابق:
   ```
   postgresql://postgres:M00243540000m@db.yzeirccdvvshpygofnlg.supabase.co:5432/postgres?sslmode=require
   ```

### الخطوة 3: تحقق من Network Restrictions

1. في Supabase Dashboard → **Settings** → **Database** → **Network Restrictions**
2. تأكد من أن IP Address الخاص بك مسموح (أو اتركه مفتوحاً للاختبار)

---

## 🔧 تشغيل Migrations

بعد التأكد من أن Supabase يعمل:

```bash
cd backend

# 1. تحديث Prisma Client
npx prisma generate

# 2. تشغيل Migrations
npx prisma migrate deploy

# أو للتطوير:
npx prisma migrate dev --name add_saas_models
```

---

## 🌱 إضافة Seed Data (Plans)

بعد نجاح Migrations:

```bash
npm run seed
```

هذا سيضيف:
- ✅ Plans الافتراضية (Free, Basic, Premium, Enterprise)
- ✅ بيانات تجريبية (Users, Properties, etc.)

---

## 🧪 اختبار الاتصال

### من Supabase Dashboard:
1. اذهب إلى **SQL Editor**
2. شغل query:
   ```sql
   SELECT * FROM plans;
   ```

### من Command Line:
```bash
npx prisma studio
```
سيفتح Prisma Studio ويمكنك رؤية جميع البيانات.

---

## ⚠️ ملاحظات مهمة

1. **DATABASE_URL**: تأكد من أنه صحيح في `.env`
2. **SSL**: يجب أن يحتوي على `?sslmode=require`
3. **Password**: تأكد من أن كلمة المرور صحيحة (M00243540000m)

---

## 🔄 إذا استمرت المشكلة

### الحل 1: استخدام Connection Pooling
1. في Supabase Dashboard → **Settings** → **Database** → **Connection Pooling**
2. اختر **Session mode**
3. انسخ Connection String الجديد
4. استبدل DATABASE_URL في `.env`

### الحل 2: التحقق من كلمة المرور
1. في Supabase Dashboard → **Settings** → **Database**
2. إذا نسيت كلمة المرور، اضغط **Reset Database Password**
3. انسخ الكلمة الجديدة
4. حدث DATABASE_URL

### الحل 3: اختبار الاتصال من Supabase
1. في Supabase Dashboard → **SQL Editor**
2. شغل query بسيط:
   ```sql
   SELECT version();
   ```
3. إذا عمل، المشكلة في الاتصال المحلي

---

## 📝 الخطوات التالية بعد نجاح Migrations

1. ✅ تشغيل `npm run seed` لإضافة Plans
2. ✅ اختبار API: `http://localhost:3050/api/health`
3. ✅ اختبار Plans: `http://localhost:3050/api/plans` (بعد إنشاء Route)
4. ✅ تشغيل Backend: `npm start`

---

**جاهز للبدء؟** 🚀

بعد التأكد من أن Supabase يعمل، أخبرني وسأكمل تشغيل Migrations!

