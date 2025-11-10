# ✅ تغيير Total Value إلى Total Commission

## 🎯 التغيير المطلوب

في واجهة البروكر (My Deals & Commissions)، بدل ما يعرض:
```
Total Value: 5,000,000 AED
```

يعرض:
```
Total Commission: 250,000 AED
```

---

## ✅ ما تم تعديله

### الملف: `DealsTable.jsx`

#### قبل:
```javascript
{totals.totalDealValue > 0 && (
  <div className="px-3 py-1 bg-neutral-800 rounded border border-white/10">
    <span className="text-neutral-400">Total Value: </span>
    <span className="text-white font-semibold">
      {totals.totalDealValue.toLocaleString()} AED
    </span>
  </div>
)}
```

#### بعد:
```javascript
{totals.totalCommissionValue > 0 && (
  <div className="px-3 py-1 bg-neutral-800 rounded border border-white/10">
    <span className="text-neutral-400">Total Commission: </span>
    <span className="text-green-400 font-semibold">  ← لون أخضر!
      {totals.totalCommissionValue.toLocaleString()} AED
    </span>
  </div>
)}
```

---

## 📊 الفرق

### Total Value (القديم):
- إجمالي **قيمة الصفقات**
- مثال: 5,000,000 AED

### Total Commission (الجديد):
- إجمالي **العمولات** (100%)
- مثال: 250,000 AED (5% من 5M)

---

## 🎨 المظهر

### في واجهة البروكر:

```
┌─────────────────────────────────────┐
│ My Deals & Commissions              │
├─────────────────────────────────────┤
│                                     │
│ Statistics:                         │
│ ┌──────────┐ ┌──────────┐          │
│ │ Deals: 5 │ │ Total Commission:  │ ← جديد!
│ └──────────┘ │ 250,000 AED        │
│              └──────────┘          │
│                 (أخضر)              │
└─────────────────────────────────────┘
```

---

## ✅ لاختبار التغيير

### 1. أعد تشغيل Frontend:
```bash
# اضغط Ctrl+C ثم
cd frontend-next
npm run dev
```

### 2. جرب:
```
1. Login as Broker
2. Go to /broker/dashboard
3. Click "My Deals & Commissions" tab
4. شوف الـ Statistics في الأعلى

Expected:
✅ Total Commission (بدل Total Value)
✅ باللون الأخضر
✅ يعرض إجمالي العمولات
```

---

## 📝 ملاحظة

الـ Backend بيرجع:
```javascript
totals = {
  totalDeals: 5,
  totalDealValue: 5000000,      // ← قيمة الصفقات
  totalCommissionValue: 250000,  // ← العمولات (جديد!)
  totalBrokerShare: 175000,      // ← حصة البروكر (70%)
  totalCompanyShare: 75000       // ← حصة الشركة (30%)
}
```

دلوقتي بنعرض `totalCommissionValue` بدل `totalDealValue` ✅

---

## 🎯 الخلاصة

### قبل:
```
Total Value: 5,000,000 AED (قيمة الصفقات)
```

### بعد:
```
Total Commission: 250,000 AED (العمولات)
         ↑ أخضر
```

**أكثر فائدة للبروكر! يشوف عمولته مباشرة** 💰

---

**تاريخ التعديل:** 3 نوفمبر 2025  
**الحالة:** ✅ تم التنفيذ

---

**تم التغيير بنجاح! 🎉**

