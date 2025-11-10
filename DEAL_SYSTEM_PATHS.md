# مسارات نظام Deal Management - المسارات الكاملة

## 📁 المسارات الكاملة للملفات الجديدة

### Backend Prisma Schema
```
C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend\prisma\schema.prisma
```

### Backend Models
```
C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend\models\Company.js
C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend\models\Deal.js
```

### Backend Routes
```
C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend\routes\deals.js
```

### Server Configuration
```
C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend\start-server.js
```

### Documentation
```
C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\DEAL_SYSTEM_SETUP.md
```

---

## 🚀 المسارات لتنفيذ الأوامر

### 1. الانتقال إلى مجلد Backend
```powershell
cd "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend"
```

### 2. إنشاء Migration
```powershell
cd "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend"
npx prisma migrate dev --name add_deals_and_companies
```

### 3. Generate Prisma Client
```powershell
cd "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend"
npm run prisma:generate
```

### 4. فتح Prisma Studio (لإضافة Company تجريبية)
```powershell
cd "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend"
npm run prisma:studio
```

---

## 📋 المسارات الكاملة لـ API Endpoints

### Base URL
```
http://localhost:3050/api
```

### Deal Endpoints
```
POST   http://localhost:3050/api/deals          - إنشاء صفقة جديدة
GET    http://localhost:3050/api/deals          - الحصول على جميع الصفقات
GET    http://localhost:3050/api/deals?brokerId=2   - تصفية حسب broker
GET    http://localhost:3050/api/deals?companyId=1  - تصفية حسب company
GET    http://localhost:3050/api/deals/:id      - الحصول على صفقة محددة
PUT    http://localhost:3050/api/deals/:id      - تحديث صفقة
DELETE http://localhost:3050/api/deals/:id     - حذف صفقة (admin only)
```

---

## 📝 مثال على استخدام PowerShell

### تشغيل Migration (نسخ الكود بالكامل)

```powershell
# الانتقال إلى مجلد Backend
cd "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend"

# إنشاء Migration
npx prisma migrate dev --name add_deals_and_companies

# Generate Prisma Client
npm run prisma:generate

# (اختياري) فتح Prisma Studio
npm run prisma:studio
```

---

## 🔍 التحقق من الملفات

### للتحقق من وجود الملفات:

```powershell
# التحقق من Prisma Schema
Test-Path "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend\prisma\schema.prisma"

# التحقق من Deal Model
Test-Path "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend\models\Deal.js"

# التحقق من Company Model
Test-Path "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend\models\Company.js"

# التحقق من Deals Route
Test-Path "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend\routes\deals.js"
```

