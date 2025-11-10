# حل مشكلة EPERM في Prisma Generate

## 🔴 المشكلة
```
EPERM: operation not permitted, rename 'query_engine-windows.dll.node.tmp'
```

هذا الخطأ يحدث لأن الملف قيد الاستخدام من قبل:
- Backend server (node/nodemon)
- Prisma Studio
- أي عملية أخرى تستخدم Prisma Client

---

## ✅ الحلول

### الحل 1: إيقاف Backend Server (الأفضل)

```powershell
# إيقاف جميع عمليات Node.js
Get-Process node | Stop-Process -Force
Get-Process nodemon | Stop-Process -Force
```

أو أغلق النوافذ التي تحتوي على:
- Backend Server (cmd window)
- npm run dev
- nodemon

**ثم أعد المحاولة:**
```powershell
cd "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend"
npm run prisma:generate
```

---

### الحل 2: حذف .prisma folder وإعادة Generate

```powershell
cd "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend"

# إيقاف أي عمليات Node.js أولاً
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# حذف مجلد .prisma
Remove-Item -Path "node_modules\.prisma" -Recurse -Force -ErrorAction SilentlyContinue

# إعادة Generate
npm run prisma:generate
```

---

### الحل 3: إعادة تشغيل PowerShell كـ Administrator

1. أغلق PowerShell الحالي
2. افتح PowerShell جديد **كـ Administrator** (Right-click > Run as Administrator)
3. نفذ الأوامر:

```powershell
cd "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend"
npm run prisma:generate
```

---

### الحل 4: استخدام cmd بدلاً من PowerShell

```cmd
cd "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend"
npm run prisma:generate
```

---

## 🎯 الخطوات الموصى بها (بالترتيب)

### 1. إيقاف جميع عمليات Node.js
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process nodemon -ErrorAction SilentlyContinue | Stop-Process -Force
```

### 2. الانتظار ثانيتين
```powershell
Start-Sleep -Seconds 2
```

### 3. حذف .prisma folder
```powershell
cd "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend"
Remove-Item -Path "node_modules\.prisma" -Recurse -Force -ErrorAction SilentlyContinue
```

### 4. إعادة Generate
```powershell
npm run prisma:generate
```

---

## ✅ التحقق من النجاح

بعد نجاح الأمر، يجب أن ترى:
```
✔ Generated Prisma Client (...)
```

---

## 📝 ملاحظة مهمة

✅ **Migration تم بنجاح!** 
البيانات الجديدة (Company و Deal) تم إضافتها للـ database.

❌ فقط `prisma:generate` فشل بسبب ملف قيد الاستخدام.

بعد حل المشكلة وإعادة generate، سيتم حل المشكلة بالكامل.

