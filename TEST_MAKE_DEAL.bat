@echo off
chcp 65001 >nul
echo ========================================
echo 🧪 Test "Make Deal" from Property
echo ========================================
echo.
echo ✅ Feature Implemented:
echo    - Admin can create Deal directly from closed property
echo    - New tab "Make Deal" in Property Edit form
echo    - Auto-populated data from property
echo.
echo ────────────────────────────────────────
echo.
echo 📋 Testing Steps:
echo.
echo ┌─ Prerequisites ────────────────────────┐
echo │                                        │
echo │ You need:                              │
echo │ ✅ One BROKER account                  │
echo │ ✅ One ADMIN account                   │
echo │ ✅ One property to test with           │
echo │                                        │
echo └────────────────────────────────────────┘
echo.
pause
echo.
echo ┌─ Step 1: BROKER Closes Property ──────┐
echo │                                        │
echo │ 1. Login as Broker                     │
echo │ 2. Go to /broker/dashboard             │
echo │ 3. Find an active property             │
echo │ 4. Click "Edit"                        │
echo │ 5. Change Status to "Sold" or "Rented" │
echo │ 6. Click "Update Property"             │
echo │                                        │
echo │ Expected Result:                       │
echo │ ✅ Property status changed             │
echo │ ✅ Property moved to "Closed           │
echo │    Properties" tab                     │
echo │                                        │
echo └────────────────────────────────────────┘
echo.
pause
echo.
echo ┌─ Step 2: ADMIN Creates Deal ──────────┐
echo │                                        │
echo │ 1. Login as Admin                      │
echo │ 2. Go to /admin/properties             │
echo │ 3. Click "Closed Properties" tab       │
echo │ 4. Find the property from Step 1       │
echo │ 5. Click "Edit"                        │
echo │                                        │
echo │ Expected Result:                       │
echo │ ✅ Two tabs appear:                    │
echo │    - Property Details                  │
echo │    - 🤝 Make Deal ← NEW!               │
echo │                                        │
echo └────────────────────────────────────────┘
echo.
pause
echo.
echo ┌─ Step 3: Fill Make Deal Form ─────────┐
echo │                                        │
echo │ 1. Click "🤝 Make Deal" tab            │
echo │ 2. You should see:                     │
echo │    - Property name (auto)              │
echo │    - Broker name (auto)                │
echo │    - Form fields:                      │
echo │      • Client Name (required)          │
echo │      • Deal Value (pre-filled)         │
echo │      • Deal Type (Sale/Rent)           │
echo │      • Commission Rate (required)      │
echo │                                        │
echo │ 3. Fill the form:                      │
echo │    - Client Name: Mohammed Ali         │
echo │    - Deal Value: 2500000               │
echo │    - Deal Type: Sale                   │
echo │    - Commission: 0.05                  │
echo │                                        │
echo │ 4. Watch the Preview update:           │
echo │    - Total Commission: 125,000 AED     │
echo │    - Broker Share: 87,500 AED          │
echo │    - Company Share: 37,500 AED         │
echo │                                        │
echo │ 5. Click "Create Deal"                 │
echo │                                        │
echo │ Expected Result:                       │
echo │ ✅ Deal created successfully           │
echo │ ✅ Modal closes                        │
echo │ ✅ Dashboard refreshes                 │
echo │                                        │
echo └────────────────────────────────────────┘
echo.
pause
echo.
echo ┌─ Step 4: Verify Deal Created ─────────┐
echo │                                        │
echo │ 1. Stay logged in as Admin             │
echo │ 2. Go to /admin/dashboard              │
echo │ 3. Click "Deals ^& Commissions" tab    │
echo │ 4. Find the newly created deal         │
echo │                                        │
echo │ Expected Result:                       │
echo │ ✅ Deal appears in the list            │
echo │ ✅ Property: (correct property name)   │
echo │ ✅ Broker: (property owner's name)     │
echo │ ✅ Client: Mohammed Ali                │
echo │ ✅ Value: 2,500,000 AED                │
echo │ ✅ Commission: 125,000 AED             │
echo │ ✅ Broker Share: 87,500 AED            │
echo │ ✅ Company Share: 37,500 AED           │
echo │ ✅ Status: Closed                      │
echo │ ✅ Badge: "✓ COMMISSION SET"          │
echo │                                        │
echo └────────────────────────────────────────┘
echo.
pause
echo.
echo ┌─ Step 5: Broker Can See Deal ─────────┐
echo │                                        │
echo │ 1. Login as Broker (property owner)    │
echo │ 2. Go to /broker/dashboard             │
echo │ 3. Click "Deals ^& Commissions" tab    │
echo │                                        │
echo │ Expected Result:                       │
echo │ ✅ Deal appears in broker's list       │
echo │ ✅ Broker can see:                     │
echo │    - Property details                  │
echo │    - Client name                       │
echo │    - Deal value                        │
echo │    - Commission (set by admin!)        │
echo │    - His share: 87,500 AED             │
echo │ ✅ Broker CANNOT see "Make Deal" tab   │
echo │    (Admin only!)                       │
echo │                                        │
echo └────────────────────────────────────────┘
echo.
echo ========================================
echo.
echo 🎯 What to Check:
echo.
echo 1. Tab Visibility:
echo    ✅ Admin sees "Make Deal" tab on closed properties
echo    ✅ Broker does NOT see "Make Deal" tab
echo    ✅ Tab only appears on CLOSED/SOLD/RENTED properties
echo.
echo 2. Auto-Population:
echo    ✅ Property name shown
echo    ✅ Broker name shown
echo    ✅ Deal Value pre-filled from property price
echo    ✅ Deal Type matches property purpose
echo.
echo 3. Form Validation:
echo    ✅ Client Name required
echo    ✅ Deal Value required (must be ^> 0)
echo    ✅ Commission Rate required (0-1)
echo.
echo 4. Commission Preview:
echo    ✅ Total calculates correctly
echo    ✅ Broker share = 70%%
echo    ✅ Company share = 30%%
echo    ✅ Updates in real-time
echo.
echo 5. Deal Creation:
echo    ✅ Deal created successfully
echo    ✅ Linked to correct property
echo    ✅ Linked to correct broker (property owner)
echo    ✅ Commission set by admin
echo    ✅ Status = "closed"
echo    ✅ Appears in Deals list
echo.
echo 6. Permissions:
echo    ✅ Admin can create deal
echo    ✅ Broker can view deal
echo    ✅ Broker sees commission amount
echo.
echo ========================================
echo.
echo 🚀 Ready to Test?
echo.
echo This will open:
echo   1. Admin Properties page
echo   2. Admin Dashboard (Deals)
echo   3. Broker Dashboard (Deals)
echo.
pause
echo.
echo Opening pages...
echo.
start http://localhost:3000/admin/properties
timeout /t 2 /nobreak >nul
start http://localhost:3000/admin/dashboard
timeout /t 2 /nobreak >nul
start http://localhost:3000/broker/dashboard
echo.
echo ✅ Pages opened!
echo.
echo 📝 Testing Checklist:
echo   □ Broker closes property
echo   □ Admin sees property in "Closed Properties"
echo   □ Admin clicks Edit on closed property
echo   □ "Make Deal" tab appears
echo   □ Click "Make Deal" tab
echo   □ Property and Broker info shown
echo   □ Fill form fields
echo   □ Commission preview updates
echo   □ Click "Create Deal"
echo   □ Deal created successfully
echo   □ Deal appears in admin dashboard
echo   □ Deal appears in broker dashboard
echo   □ Broker sees commission amount
echo.
echo ========================================
echo.
echo 📖 For detailed documentation:
echo    - MAKE_DEAL_FROM_PROPERTY_AR.md
echo.
echo You can close this window after testing.
echo.
pause

