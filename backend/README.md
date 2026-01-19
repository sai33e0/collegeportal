# SRIT College Portal - Backend

Production-ready backend for Srinivasa Ramanujan Institute of Technology College Portal.

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth
- **CORS:** Enabled for http://localhost:5173

## Project Structure

```
backend/
├── server.js                 # Entry point - starts server only
├── src/
│   ├── app.js               # Express app with middleware & routes
│   ├── config/
│   │   └── supabase.js      # Supabase client configuration
│   ├── middleware/
│   │   └── auth.js          # JWT verification & role checking
│   ├── routes/
│   │   ├── auth.js          # Login/logout endpoints
│   │   ├── admin.js         # Admin-only endpoints
│   │   ├── student.js       # Student-only endpoints
│   │   └── faculty.js       # Faculty-only endpoints
│   └── utils/               # Future utilities
├── package.json
├── .env.example
├── DATABASE_SCHEMA.md       # Complete database documentation
└── API_TESTING_GUIDE.md     # Testing instructions
```

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your Supabase credentials:
```bash
cp .env.example .env
```

Edit `.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
PORT=5000
NODE_ENV=development
```

### 3. Setup Database
Follow `DATABASE_SCHEMA.md` to:
1. Create all tables in Supabase SQL Editor
2. Insert sample departments
3. Create test users

### 4. Start Server
```bash
npm run dev
```

Server runs on **http://localhost:5000**

## API Overview

### Public Routes
- `GET /health` - Health check

### Auth Routes
- `POST /auth/login` - User login → returns token & role_id
- `POST /auth/logout` - Logout

### Admin Routes (Role 6)
- `GET /admin/dashboard` - Dashboard statistics
- `POST /admin/users` - Create new user
- `GET /admin/users` - List all users
- `GET /admin/departments` - List departments
- `POST /admin/subjects` - Create subject
- `GET /admin/subjects` - List subjects
- `POST /admin/faculty-subjects` - Assign faculty to subject

### Student Routes (Role 1)
- `GET /student/profile` - Student profile
- `GET /student/subjects` - Enrolled subjects
- `GET /student/marks` - Marks (placeholder)

### Faculty Routes (Role 2)
- `GET /faculty/profile` - Faculty profile
- `GET /faculty/subjects` - Assigned subjects
- `GET /faculty/students` - Student roster (placeholder)

## Role System

| Role ID | Role | Permissions |
|---------|------|-------------|
| 6 | Admin | Full system access |
| 2 | Faculty | View classes, upload marks |
| 1 | Student | View profile, results |

## Authentication Flow

1. User sends email + password to `/auth/login`
2. Backend verifies with Supabase Auth
3. Backend fetches user's role from database
4. Returns `{ access_token, role_id, user }`
5. Frontend stores token in localStorage
6. All protected routes need `Authorization: Bearer <token>` header
7. Middleware verifies token and checks role

## Middleware Stack

```
Request
  ↓
CORS Middleware
  ↓
JSON Parser
  ↓
Logger
  ↓
Route Handler
  ↓
authenticateToken (verifies JWT)
  ↓
requireRole([allowed_roles])
  ↓
Controller Logic
  ↓
Response
```

## Security Features

✅ JWT token verification on protected routes
✅ Role-based access control
✅ CORS restricted to frontend URL only
✅ Supabase service role key (bypasses RLS)
✅ Input validation on all POST requests
✅ Error messages don't leak sensitive info

## Testing

See **API_TESTING_GUIDE.md** for:
- Complete API endpoint documentation
- Request/response examples
- Thunder Client testing instructions
- Common issues and fixes

Quick test:
```bash
curl http://localhost:5000/health
```

Expected:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "SRIT Portal Backend"
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| SUPABASE_URL | Supabase project URL | Yes |
| SUPABASE_ANON_KEY | Supabase anon key | Yes |
| SUPABASE_SERVICE_KEY | Supabase service role key | Yes |
| PORT | Server port | No (default: 5000) |
| NODE_ENV | Environment mode | No (default: development) |

## Database Schema

See **DATABASE_SCHEMA.md** for:
- Complete table definitions
- Relationships and indexes
- SQL setup script
- Sample data
- Migration notes

## Development

### Add New Route

1. Create route file in `src/routes/`
2. Import in `src/app.js`
3. Add to route middleware stack
4. Use authentication middleware if needed

Example:
```javascript
// src/routes/newroute.js
import express from 'express';
import { authenticateToken, requireRole, ROLES } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole([ROLES.ADMIN]));

router.get('/', async (req, res) => {
  // Your logic
});

export default router;
```

```javascript
// src/app.js
import newRoute from './routes/newroute.js';
app.use('/newroute', newRoute);
```

### Code Style

- ES Modules (import/export)
- Async/await for all database calls
- Try-catch for error handling
- Descriptive error messages
- Clean separation: routes → logic → database

## Deployment

### Prerequisites
- Node.js 18+ installed
- Supabase project created
- Database schema deployed
- Environment variables configured

### Steps
1. Run `npm install --production`
2. Set `NODE_ENV=production`
3. Ensure all env vars are set
4. Run `npm start`
5. Configure reverse proxy (nginx) if needed
6. Setup SSL certificate

## Troubleshooting

### Server won't start
- Check all env vars are set
- Verify Supabase keys are correct
- Check port 5000 is not in use

### Login fails
- Verify user exists in both auth.users and users table
- Check email/password are correct
- Check Supabase project is active

### Token verification fails
- Token might be expired
- Check Authorization header format: `Bearer <token>`
- Verify token is from same Supabase project

### Role check fails
- Ensure user has role_id in users table
- Check role_id is 1, 2, or 6
- Verify user is accessing correct role endpoints

## Phase 1 Checklist

- [x] Server runs on port 5000
- [x] CORS enabled for frontend
- [x] Auth endpoints working
- [x] Admin CRUD operations
- [x] Student read operations
- [x] Faculty read operations
- [x] Role-based access control
- [x] Database schema documented
- [x] API testing guide complete

## Next: Phase 2

Once backend is tested and stable:
→ Build frontend (React + Vite)
→ Connect to these APIs
→ Create role-based dashboards

## Support

For issues or questions:
1. Check API_TESTING_GUIDE.md
2. Verify database schema is correct
3. Check server logs for errors
4. Review Supabase dashboard for auth issues

---

**Built for:** Srinivasa Ramanujan Institute of Technology
**Architecture:** Clean separation of concerns
**Status:** Phase 1 Complete ✅
