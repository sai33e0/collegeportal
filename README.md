# SRIT College Portal 🎓

A modern, full-stack college management system built with **Next.js**, **Node.js/Express**, and **Supabase PostgreSQL**.

## Features ✨

- **Student Portal**: View marks, attendance, fees, and academic details
- **Faculty Dashboard**: Manage classes, marks, and attendance  
- **Admin Panel**: User management, department & subject configuration
- **AI Assistant**: Smart campus summary with animated robot UI
- **Real-time Data**: Live faculty count, departments, and placement highlights
- **Responsive Design**: Modern glassmorphism UI with smooth animations
- **Secure Auth**: JWT-based authentication with role-based access

## Tech Stack 🛠️

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth + JWT
- **Hosting**: Vercel (frontend), Railway/Docker (backend)

## Quick Start 🚀

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/collegeportal.git
   cd collegeportal
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend && npm install && cd ..
   ```

3. **Configure environment**
   
   Create `.env.local` in root:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   ```
   
   Create `backend/.env`:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://yourdomain.com
   PORT=3001
   NODE_ENV=development
   ```

4. **Setup database**
   
   Run SQL schemas in Supabase:
   - [backend/ACADEMIC_SCHEMA.sql](backend/ACADEMIC_SCHEMA.sql)
   - [backend/OVERVIEW_SCHEMA.sql](backend/OVERVIEW_SCHEMA.sql)

5. **Start servers**
   ```bash
   # Terminal 1: Backend (from backend folder)
   npm run dev
   
   # Terminal 2: Frontend (from root)
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## API Endpoints 📡

### Public
- `GET /public/overview?year=2025-26` - College overview with departments, faculty count, placements

### Auth
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Student
- `GET /student/profile` - Student profile
- `GET /student/marks` - Student marks
- `GET /student/attendance` - Student attendance

### Faculty
- `GET /faculty/profile` - Faculty profile
- `GET /faculty/subjects` - Assigned subjects
- `GET /faculty/marks` - Subject marks

### Admin
- `GET /admin/dashboard` - Dashboard stats
- `POST /admin/students` - Create student
- `POST /admin/faculty` - Create faculty
- `GET /admin/departments` - List departments
- `POST /overview/college` - Set college overview
- `POST /overview/placement` - Set placement highlight

## Folder Structure 📁

```
collegeportal/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home with AI agent
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Styles + animations
│   │   ├── admin/                # Admin dashboard
│   │   ├── student/              # Student dashboard
│   │   ├── faculty/              # Faculty dashboard
│   │   └── auth/                 # Auth pages
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Notifications.tsx
│   │   ├── SocialMediaFeed.tsx
│   │   └── ...
│   └── lib/
│       ├── api.ts                # API client
│       ├── auth.ts               # Auth utilities
│       └── constants.ts          # Constants
├── backend/
│   ├── src/
│   │   ├── app.js                # Express app
│   │   ├── routes/               # API routes
│   │   ├── middleware/           # Auth middleware
│   │   └── config/               # Supabase config
│   ├── server.js                 # Server entry
│   ├── ACADEMIC_SCHEMA.sql       # DB schema
│   └── OVERVIEW_SCHEMA.sql       # AI schema
├── public/                        # Static assets
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## Demo Accounts 👤

### Admin
- Email: `admin@srit.ac.in`
- Password: `admin123`

### Student
- Email: `student1@srit.ac.in`
- Password: `student123`

### Faculty
- Email: `faculty@srit.ac.in`
- Password: `faculty123`

## Key Features Walkthrough 🎬

### 1. AI Assistant on Home Page
- Modern animated robot UI with floating animation
- Ask questions about college, departments, faculty, placements
- Select academic year (2023-24, 2024-25, 2025-26)
- Get live data from backend with fallbacks

### 2. Admin Dashboard
- Manage users (students, faculty, admins)
- Create/edit departments and subjects
- Assign faculty to subjects
- Configure college overview and placement data

### 3. Student Portal
- View enrolled subjects and marks
- Check attendance records
- View fee details and payment history
- Download receipts

### 4. Faculty Dashboard
- View assigned subjects and student roster
- Publish marks and track attendance
- Manage class information

## Customization 🎨

### Update AI Assistant Summaries
```bash
curl -X POST http://localhost:3001/overview/college \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "academic_year": "2025-26",
    "college_summary": "Your college summary...",
    "departments_summary": "Your departments summary...",
    "faculty_summary": "Your faculty summary..."
  }'

curl -X POST http://localhost:3001/overview/placement \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "academic_year": "2025-26",
    "amount": "₹26 LPA",
    "company": "Vertex Analytics",
    "stream": "CSE"
  }'
```

## Deployment 🌍

### Frontend (Vercel)
```bash
npm run build
# Push to GitHub, connect to Vercel
```

### Backend (Railway/Docker)
```bash
cd backend
npm run build
# Deploy to Railway or use Docker
```

## Troubleshooting 🔧

**API not responding?**
- Ensure backend is running: `npm run dev` in backend folder
- Check port 3001 is not blocked
- Verify `.env.local` has correct API_BASE_URL

**Database errors?**
- Run SQL schemas in Supabase
- Check Supabase credentials in `backend/.env`
- Verify tables exist in Supabase dashboard

**Auth issues?**
- Clear browser cookies
- Verify Supabase project is active
- Check role_id values in database

## Contributing 💡

1. Create a feature branch
2. Make your changes
3. Test locally
4. Push and create a pull request

## License 📄

ISC License - See LICENSE file

## Support 📧

For issues or questions, contact: support@srit.ac.in

---

**Built with ❤️ at SRIT College Portal**
