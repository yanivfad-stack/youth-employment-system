# 📱 מערכת ניהול תעסוקת צעירים
# Youth Employment Management System

מערכת ניהול מלאה וייעודית לניהול עובדים צעירים, דיווחי שעות עבודה, אישורי מנהלים ודוחות מפורטים.

A comprehensive Next.js application for managing employment of youth workers, including role-based dashboards, work hour reporting, approval workflows, and detailed analytics.

## ✨ Features | תכונות עיקריות

### 👤 Youth Worker | עובד צעיר
- ⏰ Real-time work hour reporting with duration counter
- 📊 View work history and approval status
- 👔 Personal profile & document management
- 📈 Personal statistics and trends

### 👥 Coordinator | מתאם
- 📋 Team worker management and overview
- ✅ Approve/reject work hour reports
- 📊 Team statistics and performance metrics
- 🔔 Pending report notifications

### 👨‍💼 Admin | מנהל
- 👥 Complete user management system
- 📊 Advanced system-wide analytics
- ⚙️ System configuration and settings
- 📈 Performance monitoring

## 🛠️ Tech Stack

- **Framework**: Next.js 16.2.6 (App Router, TypeScript)
- **UI/Styling**: React 19.2.4 + Tailwind CSS 4
- **Icons**: Lucide React
- **Auth**: Firebase Authentication + Test Mode
- **Language**: TypeScript 5
- **RTL Support**: Full Hebrew support with RTL layout

## 📁 Project Structure

```
youth-employment-system/
├── app/
│   ├── layout.tsx                # Root layout with sidebar
│   ├── page.tsx                  # Home/landing page
│   ├── test/                     # Test mode page
│   ├── dashboard/
│   │   ├── layout.tsx            # Dashboard layout
│   │   └── page.tsx              # Main dashboard
│   ├── youth/                    # Youth worker pages
│   │   ├── clock-in/             # Work hour reporting
│   │   ├── history/              # Work history view
│   │   └── profile/              # Profile & documents
│   ├── coordinator/              # Coordinator pages
│   │   ├── workers/              # Team management
│   │   ├── approvals/            # Approval workflow
│   │   └── reports/              # Team analytics
│   ├── admin/                    # Admin pages
│   │   ├── workers/              # User management
│   │   ├── reports/              # System analytics
│   │   └── settings/             # System configuration
│   └── globals.css               # Global styles
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx           # Navigation sidebar
│   ├── auth/
│   │   └── ProtectedRoute.tsx    # Role-based protection
│   └── [other components]
├── hooks/
│   └── useAuth.ts                # Authentication hook
├── lib/
│   └── firebase/
│       ├── auth.ts               # Auth utilities
│       ├── context.tsx           # Auth context provider
│       └── test-auth.ts          # Test mode authentication
├── types/
│   └── index.ts                  # TypeScript definitions
├── public/                       # Static assets
├── netlify.toml                  # Netlify configuration
├── .env.example                  # Environment variables template
├── package.json
└── tsconfig.json
```

## 🚀 Getting Started | התחלה מהירה

### Prerequisites | דרישות מוקדמות
- Node.js 18+
- npm 9+ or yarn
- Git

### Quick Start - Local Development | התקנה בהתקנה המקומית

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/youth-employment-system.git
cd youth-employment-system

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🧪 Test Mode (No Firebase Required) | מצב בדיקה

To test the system without Firebase setup:

1. Set `NEXT_PUBLIC_TEST_MODE=true` in `.env.local`
2. Run `npm run dev`
3. Navigate to [http://localhost:3000/test](http://localhost:3000/test)
4. Select a test user to login

**Available test users:**
- **Admin**: David Cohen (מנהל)
- **Coordinators**: Sarah Levy, Yossi Barak (מתאמים)
- **Youth Workers**: Moshe Cohen, Rachel Levy (עובדים צעירים)

## 📄 Available Pages | עמודים זמינים

### Dashboard | דשבורד
- **URL**: `/dashboard`
- **Access**: All authenticated users
- **Features**: Role-specific welcome, quick stats, action links

### Youth Worker Pages | עמודי עובד צעיר
1. **Clock In** - `/youth/clock-in`
   - Real-time work duration counter
   - Start/stop work sessions
   - Add work notes
   - View recent entries

2. **History** - `/youth/history`
   - View all work reports
   - Filter by status (approved, pending, rejected)
   - Download reports as PDF
   - Detailed report modal

3. **Profile** - `/youth/profile`
   - Edit personal information
   - Manage documents
   - View verification status

### Coordinator Pages | עמודי מתאם
1. **Workers** - `/coordinator/workers`
   - View all team members
   - See worker statistics
   - Search and filter
   - Quick actions (view, edit, delete)

2. **Approvals** - `/coordinator/approvals`
   - Review pending reports
   - Approve/reject with notes
   - View detailed reports
   - Statistics dashboard

3. **Reports** - `/coordinator/reports`
   - Team analytics
   - Monthly trends
   - Worker performance metrics
   - Export to PDF/Excel

### Admin Pages | עמודי מנהל
1. **Users** - `/admin/workers`
   - Manage all system users
   - Filter by role and status
   - Add/edit/delete users
   - View activity history

2. **Reports** - `/admin/reports`
   - System-wide analytics
   - Coordinator performance
   - Monthly trends
   - System health metrics

3. **Settings** - `/admin/settings`
   - System configuration
   - Working hours settings
   - Security settings
   - Backup preferences

## 🔐 Authentication | הרשאות

### Test Mode (Default)
```typescript
// Works without Firebase
NEXT_PUBLIC_TEST_MODE=true
```

### Firebase Authentication
```typescript
// Optional: Connect to real Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
// ... (see .env.example for all variables)
```

## 🚀 Development Commands | פקודות פיתוח

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📦 Deployment to Netlify | הנגשה ל-Netlify

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

### Quick Deploy
```bash
# Build locally
npm run build

# Deploy to Netlify
# Option 1: Using Netlify CLI
netlify deploy --prod

# Option 2: Using GitHub integration
# Connect repo to Netlify and auto-deploy on push
```

## 🌍 Internationalization | ריבוי שפות

- ✅ Full Hebrew support with RTL layout
- ✅ All UI text in Hebrew
- ✅ Hebrew date formatting (toLocaleDateString('he-IL'))
- ✅ 24-hour time format
- ✅ Responsive design for all languages

## 📊 Mock Data | נתוני בדיקה

The application includes comprehensive mock data:
- ✅ Sample users (admins, coordinators, workers)
- ✅ Work reports with various statuses
- ✅ Statistics and trends
- ✅ Team data and performance metrics

## 🎨 Customization | התאמה אישית

### Change Colors and Styling
Edit `app/globals.css` or `tailwind.config.ts`

### Add New Pages
```bash
# Create new role-based page
mkdir -p app/[role]/[page]
touch app/[role]/[page]/page.tsx
```

### Add Components
```bash
# New component
touch components/MyComponent.tsx
```

## 📱 Responsive Design | עיצוב ריספונסיבי

Works perfectly on:
- 📱 Mobile (375px - 425px)
- 📱 Tablets (768px - 1024px)
- 🖥️ Desktops (1280px+)

## 🧪 Testing | בדיקה

### Manual Testing Checklist
- ✅ Login with each role
- ✅ Test role-specific navigation
- ✅ Create and submit work reports
- ✅ Approve/reject reports
- ✅ View statistics and charts
- ✅ Test on mobile/tablet
- ✅ Test responsive design

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📄 License | רישיון

All rights reserved © 2026

## 🤝 Contributing

Contributions welcome! Please follow the existing code style and create a pull request.

## 📞 Support | תמיכה

- 📧 Email: support@youth-employment.org
- 💬 GitHub Issues: [Report a bug](https://github.com/YOUR_USERNAME/youth-employment-system/issues)
- 📚 Documentation: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Version**: 1.0.0 - Production Ready 🚀  
**Last Updated**: May 2026
