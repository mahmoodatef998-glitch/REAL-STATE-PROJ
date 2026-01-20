# 🔍 اختبار الاتصال بـ Supabase

## ✅ DATABASE_URL صحيح في .env:
```
postgresql://postgres:M00243540000m@db.ofockovcnxfcuahvovwq.supabase.co:5432/postgres?sslmode=require
```

## 🔍 المشكلة: الاتصال لا يعمل

### الخطوة 1: اختبار من Supabase Dashboard

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. افتح المشروع `ofockovcnxfcuahvovwq`
3. اذهب إلى **SQL Editor**
4. شغل query بسيط:
   ```sql
   SELECT version();
   ```
5. إذا عمل، المشكلة في الاتصال المحلي

### الخطوة 2: تحقق من Network Restrictions

1. في Supabase Dashboard → **Settings** → **Database** → **Network Restrictions**
2. تأكد من أن:
   - **Allow all IPs** مفعل (للاختبار)
   - أو أضف IP Address الخاص بك

### الخطوة 3: جرب Connection Pooling

1. في Supabase Dashboard → **Settings** → **Database** → **Connection Pooling**
2. اختر **Session mode**
3. انسخ **Connection String**
4. سيبدو هكذا:
   ```
   postgresql://postgres.ofockovcnxfcuahvovwq:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
5. لاحظ أن:
   - Port يتغير من `5432` إلى `6543`
   - Host يتغير إلى `pooler.supabase.com`

### الخطوة 4: تحديث DATABASE_URL

إذا استخدمت Connection Pooling، حدث `.env`:
```env
DATABASE_URL=postgresql://postgres.ofockovcnxfcuahvovwq:M00243540000m@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require
```

---

## 🧪 اختبار الاتصال من Command Line

### الطريقة 1: استخدام psql (إذا كان مثبت)
```bash
psql "postgresql://postgres:M00243540000m@db.ofockovcnxfcuahvovwq.supabase.co:5432/postgres?sslmode=require"
```

### الطريقة 2: استخدام Prisma Studio
```bash
npx prisma studio
```

---

## ⚠️ أسباب محتملة للمشكلة

1. **Supabase Project غير نشط**: انتظر قليلاً بعد إنشاء المشروع
2. **Network Restrictions**: IP Address غير مسموح
3. **Firewall**: Firewall يمنع الاتصال
4. **VPN**: إذا كنت تستخدم VPN، جرب إيقافه

---

## ✅ بعد نجاح الاتصال

عندما يعمل الاتصال، شغّل:

```bash
cd backend
npx prisma migrate deploy
npm run seed
```

---

**ملاحظة**: إذا استمرت المشكلة، جرب Connection Pooling - عادة ما يكون أكثر استقراراً!

