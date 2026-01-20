#!/bin/bash
# Railway Deployment Quick Commands
# قم بنسخ والصق هذه الأوامر في Terminal

# ============================================
# 📋 STEP 1: تثبيت Railway CLI
# ============================================
echo "Step 1: تثبيت Railway CLI..."
npm install -g @railway/cli

# تحقق من التثبيت
railway --version


# ============================================
# 🔑 STEP 2: تسجيل الدخول إلى Railway
# ============================================
echo "Step 2: تسجيل الدخول..."
railway login
# ستفتح نافذة متصفح - سجل دخول أو أنشئ حساب جديد


# ============================================
# 📁 STEP 3: الذهاب إلى مجلد المشروع
# ============================================
cd "c:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE"


# ============================================
# 🆕 STEP 4: إنشاء Project جديد على Railway
# ============================================
echo "Step 4: إنشاء Project جديد..."
railway init

# عند السؤال:
# Project name: alrabie-backend
# Region: us-east1 (أو غيره)


# ============================================
# 🗄️ STEP 5: إضافة PostgreSQL Database
# ============================================
# اذهب إلى Dashboard: https://railway.app/dashboard
# 1. اختر Project الذي أنشأته
# 2. اضغط على "+" button
# 3. اختر "PostgreSQL"
# 4. انتظر التثبيت (2-3 دقائق)
# Railway سيضيف DATABASE_URL تلقائياً ✅


# ============================================
# ⚙️ STEP 6: إضافة Environment Variables
# ============================================
# في Dashboard > Backend Service > Variables
# أضف هذه المتغيرات:

# NODE_ENV
railway variable NODE_ENV production

# JWT_SECRET (من RAILWAY_VARIABLES.md)
railway variable JWT_SECRET "pVV73iZjqZyAh7xIe/k95zre7MvnamY27Tqa+CaGdp5sVJvYHJqKfLGw
F0PR8vhmAd8c2TB6fnzKm/trfQcoJw=="

# FRONTEND_URL (غيّر yourdomain.com)
railway variable FRONTEND_URL "https://yourdomain.com"

# CORS_ORIGINS (غيّر yourdomain.com)
railway variable CORS_ORIGINS "https://yourdomain.com,https://app.yourdomain.com"

# RATE_LIMIT_MAX_REQUESTS
railway variable RATE_LIMIT_MAX_REQUESTS "50"

# LOG_LEVEL
railway variable LOG_LEVEL "warn"


# ============================================
# 🔨 STEP 7: إعداد Build Commands
# ============================================
# في Dashboard > Backend > Settings > Build
# أضف Build Command:
# npm install && npx prisma migrate deploy && npx prisma generate

# وأضف Start Command:
# node start-server.js


# ============================================
# 🚀 STEP 8: النشر (Deploy)
# ============================================
echo "Step 8: النشر..."
cd backend
railway up

# أو إذا لم تكن في مجلد backend:
# railway up


# ============================================
# ✅ STEP 9: التحقق من النشر
# ============================================

# اقرأ الـ Logs
railway logs

# اختبر الـ API
curl https://alrabie-backend-production.railway.app/api/health

# يجب أن تحصل على:
# {"status":"OK","message":"API is running"}


# ============================================
# 📊 معلومات مهمة
# ============================================

# URL الـ API بعد النشر:
# https://alrabie-backend-production.railway.app
# (قد يكون مختلف - تحقق من Dashboard)

# استخدم هذا الـ URL في:
# 1. FRONTEND_URL (في Railway)
# 2. NEXT_PUBLIC_API_URL (في Frontend)

# ============================================
# 🎉 تم!
# ============================================
echo "✅ تم النشر بنجاح!"
echo "📊 اذهب إلى: https://railway.app/dashboard"
echo "📍 البحث عن Project > Backend > Settings > Deployment"
echo "🔗 انسخ الـ URL واستخدمه في Frontend"
