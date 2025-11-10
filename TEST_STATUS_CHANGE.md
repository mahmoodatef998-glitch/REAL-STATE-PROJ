# 🧪 اختبار تغيير Status والانتقال بين التابات

## ⚡ خطوات الاختبار (بعد التعديلات)

### الخطوة 1: Restart Frontend

```bash
# قفل Frontend Server (Ctrl + C)
# شغل تاني:
cd frontend-next
npm run dev

# أو:
START_PROJECT.bat
```

---

### الخطوة 2: Test Closed → Active

```
1. افتح Dashboard (Broker أو Admin)
   
2. اضغط تاب "Closed Properties"
   
3. اختار أي عقار Closed
   
4. اضغط "Edit"
   
5. في Edit Form:
   Status: [Closed ▼] → غيرها لـ Active
   
6. اضغط "Save Changes"
   
7. انتظر ثانية واحدة
   
8. ✅ تحقق من:
   - Form قفل؟
   - Filters اترست؟ (All Types, All Status)
   
9. اضغط تاب "Active Properties"
   
10. ✅ هتلاقي العقار موجود هنا!
    - Badge = "ACTIVE" أخضر
```

---

### الخطوة 3: Test Active → Closed

```
1. في "Active Properties" tab
   
2. Edit عقار Active
   
3. Status: Active → Closed
   
4. Save
   
5. انتظر ثانية
   
6. اضغط "Closed Properties" tab
   
7. ✅ العقار موجود هنا!
   - Badge = "CLOSED" رمادي
```

---

## 🔍 لو لسه مش شغال

### Debug Steps:

```bash
# 1. افتح Browser Console (F12)

# 2. بعد Save، شوف:
   - فيه API call بيحصل؟
   - فيه errors حمراء؟

# 3. شوف Network tab:
   - PUT /api/properties/:id → Success؟
   - GET /api/properties → بعد Save؟

# 4. لو مفيش refetch:
   - يعني React Query مش بيحدث
   - Solution: Hard refresh (Ctrl + Shift + R)
```

---

## 🎯 Expected Behavior

### Console Output (بعد Save):

```
Property save error: (should not appear!)
✅ No errors

Network Tab:
1. PUT /api/properties/123 → 200 OK ✅
2. GET /api/properties?status=active,closed,sold,rented → 200 OK ✅

React Query:
- Invalidating queries: ['myProperties'] ✅
- Invalidating queries: ['all-properties'] ✅
- Refetching... ✅
```

---

## 🔧 Troubleshooting

### Issue 1: عقار ما بيظهرش بعد تغيير Status

**Solution:**
```bash
# Hard refresh بعد Save:
Ctrl + Shift + R

# أو:
# اضغط التاب مرتين:
Active → Closed → Active
```

---

### Issue 2: Statistics مش بتتحدث

**Solution:**
```javascript
// في Console (F12):
location.reload()

// أو:
// Refresh الصفحة يدوياً
```

---

### Issue 3: Filters مش بتترست

**Check:**
```
بعد Save:
- Type filter = "All Types"? ✅
- Status filter = "All Status"? ✅

لو لا:
- يعني الكود مش محفوظ
- احفظ وشغل تاني
```

---

## ✅ ما تم إصلاحه

### 1. React Query Invalidation
```javascript
await queryClient.invalidateQueries({ 
  queryKey: ['myProperties'] 
});
await queryClient.invalidateQueries({ 
  queryKey: ['all-properties'] 
});
```

✅ يمسح الـ cache القديم
✅ يجيب بيانات جديدة

---

### 2. Filters Reset
```javascript
setFilter('all');
setStatusFilter('all');
```

✅ Filters بترجع default
✅ تشوف كل العقارات

---

### 3. Tab Click Reset
```javascript
onClick={() => {
  setActiveTab('properties');
  setStatusFilter('all');  // Reset
}}
```

✅ لما تغير تاب، filter يترست
✅ تشوف كل العقارات في التاب الجديد

---

## 🎉 Expected Result

### Complete Flow:

```
Before Save:
Closed Tab: [Villa Closed] ← موجود هنا
Active Tab: [Office Active], [Apt Active]

Edit Villa: Status Closed → Active

Save → ✅ Form closes → ✅ Refetch happens

After Save:
Closed Tab: (فاضي أو عقارات تانية)
Active Tab: [Villa Active] ← انتقل هنا!, [Office Active], [Apt Active]

✅ Villa ظهر في Active tab!
✅ Badge = "ACTIVE" أخضر!
```

---

**جرب دلوقتي بعد Restart Frontend! 🚀**

**Steps:**
1. Restart Frontend
2. Dashboard
3. Edit عقار من Closed tab
4. غير لـ Active
5. Save
6. اضغط Active tab
7. ✅ العقار موجود!

