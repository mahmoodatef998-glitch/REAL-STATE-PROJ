# 🚀 Project Startup Guide

## Available Startup Files

### 1️⃣ START_PROJECT.bat (Main Launcher)
**Purpose:** Launch the complete project

**What it does:**
- ✅ Starts Backend Server on port 3050
- ✅ Starts Frontend Server on port 3000
- ✅ Automatically opens browser to project page
- ✅ Auto-connects Frontend to Backend

**When to use it:**
- Daily development work
- Project demonstration
- Full application testing

**Steps:**
1. Double-click `START_PROJECT.bat`
2. Wait 10-15 seconds
3. Browser opens automatically
4. Start working! 🎉

---

### 2️⃣ PRISMA_STUDIO.bat (Database Management)
**Purpose:** Open Prisma Studio independently

**What it does:**
- ✅ Opens Prisma Studio only
- ✅ Database management interface
- ✅ View and edit database tables

**When to use it:**
- Need to inspect database data
- Testing with data
- Manual data entry/editing

**Steps:**
1. Double-click `PRISMA_STUDIO.bat`
2. Opens at `http://localhost:5555`
3. Manage database tables visually

**Note:** Prisma Studio is now **separate** from main project startup

---

## 🔗 Important URLs

After starting the project:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main website |
| **Backend API** | http://localhost:3050/api | Server and APIs |
| **Prisma Studio** | http://localhost:5555 | Database management |

---

## 📝 Important Notes

### START_PROJECT.bat
- ✅ **Does NOT** open Prisma Studio automatically (faster startup)
- ✅ **Does** open browser automatically to project
- ✅ If Frontend port 3000 is busy, uses 3001 automatically
- ✅ Servers run in separate windows (don't close them!)

### PRISMA_STUDIO.bat
- ✅ Opens Prisma Studio only
- ✅ **Does NOT require** Backend to be running (independent)
- ✅ Useful for quick data inspection/editing

---

## ⚡ Usage Scenarios

### Scenario 1: Daily Development
```
1. Run START_PROJECT.bat
2. Wait for browser to open
3. Start coding!
```

### Scenario 2: Data Inspection
```
1. Run PRISMA_STUDIO.bat
2. Inspect database tables
3. Edit data if needed
```

### Scenario 3: Development + Data Management
```
1. Run START_PROJECT.bat (project starts)
2. Run PRISMA_STUDIO.bat (database interface opens)
3. Now you have both project + data management
```

---

## 🛑 Stopping Servers

To stop the servers:

1. **Backend Window**: Press `Ctrl + C`
2. **Frontend Window**: Press `Ctrl + C`
3. **Prisma Studio**: Press `Ctrl + C` or close window

Or: Close all windows directly

---

## 🐛 Troubleshooting

### Issue: Browser didn't open automatically
**Solution:** 
- Wait a bit longer (slow connection)
- Or open manually: http://localhost:3000

### Issue: Backend not working
**Solution:**
```bash
cd backend
npm install
npm start
```

### Issue: Frontend not working
**Solution:**
```bash
cd frontend-next
npm install
npm run dev
```

### Issue: Port already in use
**Solution:**
1. Close old server windows
2. Or change port in `START_PROJECT.bat`

---

## 📦 Other Available Files

| File | Description |
|------|-------------|
| `START_PROJECT.bat` | Main project launcher ✅ |
| `PRISMA_STUDIO.bat` | Database management ✅ |
| `backend/start.bat` | Backend server only |
| `frontend-next/start.bat` | Frontend server only |
| `FIX_PRISMA_GENERATE.bat` | Fix Prisma issues |

---

## ✨ Development Tips

1. **Always use START_PROJECT.bat** to begin work
2. **Open PRISMA_STUDIO.bat** when you need to check data
3. **Don't close** server windows while working
4. **If issues occur**, close everything and restart

---

## 🎯 Summary

### For Daily Use: 
➡️ **START_PROJECT.bat**

### For Database Management:
➡️ **PRISMA_STUDIO.bat**

---

**Happy Coding! 🚀**

