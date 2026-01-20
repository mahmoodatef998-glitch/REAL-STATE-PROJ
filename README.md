# 🏠 AL RABEI REAL ESTATE

<div align="center">

![Real Estate](https://img.shields.io/badge/Real%20Estate-Platform-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![License](https://img.shields.io/badge/License-Private-red)

**Modern Real Estate Management Platform for UAE Properties**

[Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation)

</div>

---

## 📋 Overview

AL RABEI REAL ESTATE is a comprehensive real estate management platform designed for the UAE market. It features a modern, responsive interface with advanced property management, lead tracking, and broker/admin dashboards.

### ✨ Key Highlights

- 🏢 **Complete Property Management** - Add, edit, and manage properties with ease
- 📊 **Lead Tracking System** - Track and manage customer inquiries efficiently
- 👥 **Multi-Role System** - Admin, Broker, and User roles with different permissions
- 🎨 **Beautiful UI/UX** - Modern design with Tailwind CSS and smooth animations
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🔒 **Secure Authentication** - JWT-based authentication with role-based access control

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/al-rabei-real-estate.git
cd al-rabei-real-estate
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
cp config.env.example config.env
# Edit config.env with your database credentials
npx prisma generate
npx prisma migrate deploy
npm start
```

### 3️⃣ Setup Frontend

```bash
cd frontend-next
npm install
npm run dev
```

### 4️⃣ Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3050/api
- **Prisma Studio**: `npx prisma studio` (runs on http://localhost:5555)

### 🎯 Or Use Quick Start Files (Windows)

Simply double-click:
- `START_PROJECT.bat` - Starts everything (Backend + Frontend + Prisma Studio + Opens Browsers)
- `PRISMA_STUDIO.bat` - Opens database management tool only (if needed separately)

---

## ⚡ Features

### 🏠 Property Management
- Advanced property search and filtering
- Multiple property types (Villa, Apartment, Commercial, Office, Land)
- Image upload and gallery management
- Property status tracking (Active, Pending, Closed, Sold)
- Featured properties showcase
- Interactive property comparison

### 📊 Lead Management
- Lead capture from property inquiries
- Lead status tracking (New, Contacted, Interested, Closed)
- Lead assignment to brokers
- Activity timeline for each lead
- Email and phone integration

### 👥 User Roles & Permissions

#### Admin
- Full system access
- User management and broker approval
- All properties and leads visibility
- System analytics and reports
- Deal management

#### Broker
- Add and manage own properties
- View and manage assigned leads
- Commission tracking
- Performance dashboard

#### User/Client
- Browse properties
- Express interest in properties
- Save favorite properties
- Contact brokers

### 🎨 Frontend Features
- Modern, responsive design
- Dark mode support
- Advanced search with filters
- Image optimization with Next.js Image
- SEO optimized
- Fast page transitions
- Loading states and error handling

### 🔧 Backend Features
- RESTful API architecture
- JWT authentication
- Role-based access control
- File upload handling
- Database migrations with Prisma
- Comprehensive error handling
- API documentation

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Image Handling**: Next.js Image Optimization

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Validation**: Custom validators

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Database Management**: Prisma Studio
- **Testing**: Jest (configured)
- **Process Manager**: PM2 (via ecosystem.config.js)

---

## 📁 Project Structure

```
AL RABEI REAL ESTATE/
├── backend/                  # Backend API Server
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/          # Auth & error handling
│   ├── validators/          # Input validation
│   ├── database/            # Database configuration
│   ├── prisma/              # Prisma schema & migrations
│   ├── uploads/             # Uploaded files
│   └── start-server.js      # Server entry point
│
├── frontend-next/           # Next.js Frontend
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities & services
│   └── public/              # Static assets
│
├── START_PROJECT.bat        # Quick start script
├── PRISMA_STUDIO.bat        # Database management tool
├── QUICK_START.md           # Quick start guide
└── README.md                # This file
```

---

## 📚 Documentation

### Available Documentation Files

- **[QUICK_START.md](QUICK_START.md)** - Quick start guide for developers
- **[frontend-next/README.md](frontend-next/README.md)** - Frontend specific documentation
- **[frontend-next/API_DOCUMENTATION.md](frontend-next/API_DOCUMENTATION.md)** - Complete API documentation

---

## 🔐 Environment Variables

### Backend (.env or config.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/alrabei_db"

# JWT
JWT_SECRET="your-secret-key-here"
JWT_EXPIRE="7d"

# Server
PORT=3050
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3050/api
```

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend-next
npm test
```

---

## 🚢 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Run database migrations: `npx prisma migrate deploy`
3. Start server: `npm start` or use PM2

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Set environment variables

### Recommended Platforms
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Render, DigitalOcean
- **Database**: Supabase, Railway, Neon

---

## 🤝 Contributing

This is a private project. For access requests or contributions, please contact the project owner.

---

## 📝 License

Copyright © 2025 AL RABEI REAL ESTATE. All rights reserved.

This is proprietary software. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.

---

## 👥 Team

**Development Team**: Professional Full-Stack Development

---

## 📞 Support

For support or inquiries:
- **Email**: support@alrabei-realestate.com
- **Documentation**: Check the `/docs` folder
- **Issues**: Contact project administrator

---

## 🎯 Roadmap

### Current Version: v1.0

### Upcoming Features
- [ ] Advanced analytics dashboard
- [ ] Email notifications system
- [ ] SMS integration for leads
- [ ] Virtual property tours
- [ ] Mobile app (React Native)
- [ ] Multi-language support (Arabic/English)
- [ ] Payment gateway integration
- [ ] Document management system
- [ ] Calendar integration for property viewings

---

<div align="center">

**Built with ❤️ for the UAE Real Estate Market**

⭐ Star this repository if you find it helpful!

</div>

