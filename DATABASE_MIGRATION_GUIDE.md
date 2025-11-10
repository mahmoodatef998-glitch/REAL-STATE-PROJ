# 🗄️ دليل Migration من SQLite إلى PostgreSQL

## ✅ ما تم إنجازه

1. ✅ تثبيت Prisma و PostgreSQL Client
2. ✅ إنشاء Prisma Schema بناءً على SQLite schema
3. ✅ إنشاء Migration Script لنقل البيانات
4. ✅ إضافة scripts في package.json

---

## 📋 الخطوات التنفيذية

### الخطوة 1: تثبيت PostgreSQL

#### Windows:
```bash
# تحميل من: https://www.postgresql.org/download/windows/
# أو استخدام Chocolatey:
choco install postgresql
```

#### Mac:
```bash
brew install postgresql
brew services start postgresql
```

#### Linux:
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

### الخطوة 2: إنشاء Database

```bash
# تسجيل الدخول إلى PostgreSQL
psql -U postgres

# إنشاء database جديد
CREATE DATABASE alrabie_real_estate;

# إنشاء user (اختياري)
CREATE USER alrabie_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE alrabie_real_estate TO alrabie_user;

# الخروج
\q
```

---

### الخطوة 3: إعداد Environment Variables

أضف إلى `backend/config.env`:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/alrabie_real_estate"
```

**ملاحظات:**
- `5432` هو البورت الافتراضي لـ PostgreSQL ✅
- `postgres` هو اسم المستخدم الافتراضي
- `your_password` هو كلمة المرور التي وضعتها عند التثبيت
- `alrabie_real_estate` هو اسم الـ database الذي سننشئه

**مثال:**
إذا كانت كلمة المرور `mypass123`:
```env
DATABASE_URL="postgresql://postgres:mypass123@localhost:5432/alrabie_real_estate"
```

---

### الخطوة 4: تشغيل Prisma Migrations

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate
# سيسألك عن اسم الـ migration، اكتب: "init"

# أو للإنتاج:
npm run prisma:migrate:prod
```

---

### الخطوة 5: نقل البيانات من SQLite

```bash
cd backend

# تشغيل migration script
npm run migrate:sqlite-to-postgres
```

هذا سينقل:
- ✅ جميع Users
- ✅ جميع Properties
- ✅ جميع Leads
- ✅ جميع Agents

---

### الخطوة 6: التحقق من البيانات

```bash
# فتح Prisma Studio (GUI للـ database)
npm run prisma:studio
```

أو استخدام psql:
```bash
psql -U postgres -d alrabie_real_estate

# عرض الجداول
\dt

# عرض بيانات Users
SELECT * FROM users;

# الخروج
\q
```

---

## 🔄 تحديث الكود لاستخدام Prisma

### 1. تحديث Models

**مثال: `backend/models/User.prisma.js`**
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { name, email, password, role, phone, whatsapp, status } = userData;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userStatus = status || (role === 'broker' ? 'pending' : 'approved');
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        status: userStatus,
        phone: phone || null,
        whatsapp: whatsapp || null,
      },
    });
    
    return new User(user);
  }

  static async findByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    return user ? new User(user) : null;
  }

  static async findById(id) {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    
    return user ? new User(user) : null;
  }

  async validatePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;
```

---

## ⚠️ ملاحظات مهمة

### 1. **Dual Database Support (اختياري)**
يمكنك دعم SQLite و PostgreSQL معاً:

```javascript
// database/db.js
const isPostgres = process.env.DATABASE_PROVIDER === 'postgresql';

if (isPostgres) {
  // Use Prisma
  module.exports = { prisma: new PrismaClient() };
} else {
  // Use SQLite
  module.exports = { db: sqlite3.Database(...) };
}
```

### 2. **Migration Strategy**
- ✅ **Development**: ابق على SQLite (أسهل)
- ✅ **Production**: استخدم PostgreSQL (أقوى)

### 3. **Backup قبل Migration**
```bash
# Backup SQLite
cp database/alrabie_real_estate.db database/alrabie_real_estate.db.backup

# Backup PostgreSQL (بعد Migration)
pg_dump -U postgres alrabie_real_estate > backup.sql
```

---

## 🎯 الخلاصة

### ✅ ما تم:
- Prisma Schema جاهز
- Migration Script جاهز
- Documentation كامل

### 📝 الخطوات التالية:
1. تثبيت PostgreSQL
2. إنشاء Database
3. تشغيل Migration
4. نقل البيانات
5. تحديث Models تدريجياً

---

## 🚀 Quick Start

```bash
# 1. تثبيت PostgreSQL
# 2. إنشاء Database
# 3. إضافة DATABASE_URL في config.env
# 4. تشغيل:
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run migrate:sqlite-to-postgres

# ✅ Done!
```

---

**الآن: جاهز للـ Migration!** 🎉

