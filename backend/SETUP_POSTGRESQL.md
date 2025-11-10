# 🗄️ إعداد PostgreSQL خطوة بخطوة

## ✅ البورت الصحيح: 5432

البورت `5432` هو البورت الافتراضي لـ PostgreSQL وهذا صحيح! ✅

---

## 📋 الخطوات الكاملة

### 1. التحقق من تثبيت PostgreSQL

```bash
# Windows (في Command Prompt أو PowerShell):
psql --version

# إذا رأيت رقم الإصدار → ✅ مثبت بشكل صحيح
# إذا رأيت خطأ → تحتاج التثبيت
```

---

### 2. إنشاء Database

```bash
# فتح psql
psql -U postgres

# في psql prompt:
CREATE DATABASE alrabie_real_estate;

# التحقق من إنشاء Database:
\l

# يجب أن ترى `alrabie_real_estate` في القائمة

# للخروج:
\q
```

---

### 3. إضافة DATABASE_URL إلى config.env

افتح `backend/config.env` وأضف في النهاية:

```env
PORT=3003
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=alrabie-real-estate-super-secret-key-2024-dev-mode-change-in-production

# PostgreSQL Database (البورت: 5432 ✅)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/alrabie_real_estate"
```

**استبدل `YOUR_PASSWORD`** بكلمة المرور التي وضعتها عند تثبيت PostgreSQL.

**مثال:** إذا كانت كلمة المرور `admin123`:
```env
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/alrabie_real_estate"
```

---

### 4. اختبار الاتصال

```bash
cd backend

# Test connection (سيستخدم psql)
psql -U postgres -d alrabie_real_estate

# إذا نجح → ✅ الاتصال يعمل!
# للخروج: \q
```

---

### 5. تشغيل Prisma Migration

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# سيسألك عن اسم الـ migration:
# اكتب: init
# أو: initial_migration
```

---

### 6. نقل البيانات من SQLite

```bash
cd backend

# نقل جميع البيانات
npm run migrate:sqlite-to-postgres
```

---

## 🔧 استكشاف الأخطاء

### مشكلة: "password authentication failed"

**الحل:**
1. تأكد من كلمة المرور في `DATABASE_URL`
2. أو أعد تعيين كلمة المرور:
```bash
psql -U postgres
ALTER USER postgres WITH PASSWORD 'new_password';
```
ثم حدث `DATABASE_URL` في `config.env`

---

### مشكلة: "database does not exist"

**الحل:**
```bash
psql -U postgres
CREATE DATABASE alrabie_real_estate;
```

---

### مشكلة: "connection refused" على البورت 5432

**الحل:**
1. تأكد أن PostgreSQL يعمل:
```bash
# Windows:
# افتح Services وابحث عن "postgresql" وتأكد أنه Running

# Mac/Linux:
sudo systemctl status postgresql
```

2. أو أعد تشغيل PostgreSQL:
```bash
# Windows: من Services
# Mac:
brew services restart postgresql
# Linux:
sudo systemctl restart postgresql
```

---

## ✅ التحقق من النجاح

### 1. اختبار الاتصال:
```bash
cd backend
npm run prisma:studio
```
إذا فتح Prisma Studio → ✅ كل شيء يعمل!

### 2. التحقق من البيانات:
```bash
psql -U postgres -d alrabie_real_estate
SELECT COUNT(*) FROM users;
\q
```

---

## 📝 ملخص الإعداد

```env
# في config.env:
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/alrabie_real_estate"
                                    ^^^^^^^^^^^^^^    ^^^^^^  ^^^^  ^^^^^^^^^^^^^^^^^^^^
                                    كلمة المرور       HOST   PORT   Database Name
```

**البورت 5432 صحيح ✅**

---

## 🚀 الخطوة التالية

بعد إضافة `DATABASE_URL`:
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run migrate:sqlite-to-postgres
```

**جاهز!** 🎉

