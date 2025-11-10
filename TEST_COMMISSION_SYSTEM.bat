@echo off
chcp 65001 >nul
echo ========================================
echo 🧪 Test Commission Approval System
echo ========================================
echo.
echo ✅ Changes Applied:
echo    1. Commission fields are now optional
echo    2. Broker creates deal WITHOUT commission
echo    3. Admin sets commission
echo    4. Broker sees commission after approval
echo.
echo ────────────────────────────────────────
echo.
echo 📋 Testing Steps:
echo.
echo ┌─ Step 1: BROKER Creates Deal ─────────┐
echo │                                        │
echo │ 1. Login as Broker                     │
echo │ 2. Go to /broker/dashboard             │
echo │ 3. Click Deals ^& Commissions tab      │
echo │ 4. Click "+ Create New Deal"           │
echo │ 5. Fill the form (NO commission)       │
echo │    - Property: Select any              │
echo │    - Client Name: Test Client          │
echo │    - Deal Value: 2500000               │
echo │    - Deal Type: Sale                   │
echo │    - Status: Closed                    │
echo │ 6. Click "Save Deal"                   │
echo │                                        │
echo │ Expected Result:                       │
echo │ ✅ Deal created successfully           │
echo │ ✅ Badge: "⏳ PENDING COMMISSION"      │
echo │ ✅ Message: "Admin needs to set..."   │
echo │                                        │
echo └────────────────────────────────────────┘
echo.
pause
echo.
echo ┌─ Step 2: ADMIN Sets Commission ───────┐
echo │                                        │
echo │ 1. Login as Admin                      │
echo │ 2. Go to /admin/dashboard              │
echo │ 3. Click Deals ^& Commissions tab      │
echo │ 4. Find deal with "⏳ PENDING"         │
echo │ 5. Click "Edit" button                 │
echo │ 6. Set Commission Rate: 0.05           │
echo │ 7. See preview:                        │
echo │    - Total: 125,000 AED                │
echo │    - Broker: 87,500 AED                │
echo │    - Company: 37,500 AED               │
echo │ 8. Click "Save Changes"                │
echo │                                        │
echo │ Expected Result:                       │
echo │ ✅ Commission calculated               │
echo │ ✅ Badge: "✓ COMMISSION SET"          │
echo │ ✅ All amounts visible                 │
echo │                                        │
echo └────────────────────────────────────────┘
echo.
pause
echo.
echo ┌─ Step 3: BROKER Views Commission ─────┐
echo │                                        │
echo │ 1. Login as Broker (same one)          │
echo │ 2. Go to /broker/dashboard             │
echo │ 3. Click Deals ^& Commissions tab      │
echo │ 4. Find the same deal                  │
echo │                                        │
echo │ Expected Result:                       │
echo │ ✅ Badge: "✓ COMMISSION SET"          │
echo │ ✅ Total Commission visible            │
echo │ ✅ Broker Share visible (87,500)       │
echo │ ✅ "My Commission" stat updated        │
echo │                                        │
echo └────────────────────────────────────────┘
echo.
echo ========================================
echo.
echo 📊 What Changed:
echo.
echo Database:
echo   ✅ commissionRate → Optional (NULL allowed)
echo   ✅ commissionValue → Optional
echo   ✅ brokerShare → Optional
echo   ✅ companyShare → Optional
echo   ✅ commissionApproved → NEW field (Boolean)
echo.
echo Backend:
echo   ✅ Deal creation without commission
echo   ✅ Auto-calculation when admin sets rate
echo   ✅ Validation updated
echo.
echo Frontend:
echo   ✅ Broker form: Commission field hidden
echo   ✅ Admin form: Commission field enabled
echo   ✅ DealCard: Pending/Approved badges
echo   ✅ Visual indicators
echo.
echo ========================================
echo.
echo 🚀 Ready to Test?
echo.
echo Press any key to open:
echo   1. Backend (http://localhost:3050)
echo   2. Frontend (http://localhost:3000)
echo   3. This testing guide
echo.
pause
echo.
echo Opening servers...
echo.
start http://localhost:3000/broker/dashboard
start http://localhost:3000/admin/dashboard
echo.
echo ✅ Servers opened in browser!
echo.
echo 📝 Testing Checklist:
echo   □ Broker creates deal (no commission)
echo   □ Deal shows "PENDING" badge
echo   □ Admin edits deal
echo   □ Admin sets commission rate
echo   □ Deal shows "SET" badge
echo   □ Broker sees commission amount
echo.
echo ========================================
echo.
echo 📖 For detailed documentation:
echo    - COMMISSION_APPROVAL_SYSTEM.md (English)
echo    - COMMISSION_APPROVAL_SYSTEM_AR.md (Arabic)
echo.
echo You can close this window after testing.
echo.
pause

