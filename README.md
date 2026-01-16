# Alrabie Real Estate - Next.js Frontend

A modern, Populous-inspired real estate website built with Next.js 14, featuring a responsive design, smooth animations, accessibility, and seamless integration with the existing Node.js backend (port 3050).

## 🚀 Features
- Next.js 14 (App Router)
- Populous-inspired responsive design
- Framer Motion animations (respects reduced motion)
- Accessible navigation and components
- Properties integrated with backend
- SEO: metadata, JSON‑LD, sitemap, robots.txt

## 🛠️ Tech Stack
- Framework: Next.js 14
- Styling: Tailwind CSS
- Animations: Framer Motion
- Data: TanStack Query (React Query)
- HTTP: Axios
- Language: JavaScript (ES6+)

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup
1. Navigate to the frontend directory:
```bash
cd frontend-next
```
2. Install dependencies:
```bash
npm install
```
3. Create environment file:
```bash
cp .env.example .env.local
```
4. Configure environment variables (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3050/api
```
5. Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000` (or `3001` if 3000 is busy).

## 🏗️ Structure
```
frontend-next/
├── app/                  # Next.js App Router
├── components/           # UI components
├── hooks/                # Custom hooks
├── lib/                  # API clients, utilities
├── public/               # Static assets
├── styles/               # Global styles
└── next.config.js        # Next config (images, etc.)
```

## 🔌 API Integration
- Properties: `/api/properties`, `/api/properties/new-arrivals/:limit`
- Auth: JWT-based (login/register/profile)
- Leads: `/api/leads`

## 🎨 Design Notes
- Neutral palette with accent color
- Large typographic scale for hero and headings
- Subtle hover/scroll animations

## 📈 Performance
- Next/Image optimization (remotePatterns includes `http://localhost:3050/uploads/**`)
- Code splitting, caching with React Query, lazy loading

## 🔧 Scripts
- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting
1) Backend connection failed
- Ensure backend runs on 3050 and `NEXT_PUBLIC_API_URL` is `http://localhost:3050/api`.

2) Images not loading
- Confirm image URLs begin with `http://localhost:3050/uploads/`.
- Restart dev server after changes to `next.config.js`.

## 🤝 Contributing
1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## 📄 License
MIT
