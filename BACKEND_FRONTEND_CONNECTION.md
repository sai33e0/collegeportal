# Backend-Frontend Connection Setup

## Overview
The frontend (Next.js) is now connected to the backend (Express.js) running on port 5000.

## Architecture

### Frontend Structure
- **Framework**: Next.js 14+ with TypeScript
- **Port**: 5173 (dev), 3000 (production)
- **API Client**: Centralized API service in `src/lib/api.ts`

### Backend Structure
- **Framework**: Express.js
- **Port**: 5000
- **Language**: JavaScript (ES Modules)
- **Database**: Supabase

## Key Files

### Frontend Files
- **[src/lib/api.ts](src/lib/api.ts)** - Centralized API client with automatic token management
- **[src/lib/constants.ts](src/lib/constants.ts)** - API endpoints and configuration
- **[src/lib/auth.ts](src/lib/auth.ts)** - Authentication utilities (token/role management)
- **[src/app/auth/login/page.tsx](src/app/auth/login/page.tsx)** - Login page integrated with backend

### Backend Files
- **[backend/server.js](backend/server.js)** - Server entry point (port 5000)
- **[backend/src/app.js](backend/src/app.js)** - Express app with CORS configured
- **[backend/src/routes/auth.js](backend/src/routes/auth.js)** - Authentication endpoints
- **[backend/src/middleware/auth.js](backend/src/middleware/auth.js)** - Auth middleware and role checks

## API Endpoints

### Authentication
- `POST /auth/login` - User login
  - Request: `{ email, password }`
  - Response: `{ access_token, role_id, user: { id, email, full_name } }`

### Admin Routes
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/users` - List users

### Student Routes
- `GET /student/dashboard` - Student dashboard
- `GET /student-attendance` - Student attendance records
- `GET /student/marks` - Student marks

### Faculty Routes
- `GET /faculty/dashboard` - Faculty dashboard
- `POST /attendance` - Mark attendance
- `GET /marks` - Faculty marks management

### Health
- `GET /health` - Server health check

## How the Connection Works

### 1. API Client (`src/lib/api.ts`)
The centralized API client handles:
- Base URL configuration
- Automatic token injection in headers
- Request/response handling
- Error management

```typescript
import { apiClient } from "@/lib/api";

// Usage:
const data = await apiClient.post("/auth/login", { email, password });
```

### 2. Authentication Flow
1. User enters credentials on login page
2. Frontend calls `apiClient.post(API_ENDPOINTS.LOGIN, { email, password })`
3. Backend validates with Supabase
4. Backend returns `access_token` and `role_id`
5. Frontend stores token in localStorage
6. Subsequent requests include token in `Authorization: Bearer {token}` header

### 3. CORS Configuration
Backend has CORS enabled for `http://localhost:5173`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## Running Both Services

### Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### Frontend
```bash
npm install
npm run dev
# Runs on http://localhost:5173
```

## Token Management

- **Token Storage**: `localStorage.access_token`
- **Role Storage**: `localStorage.role_id`
- **User Name Storage**: `localStorage.user_name`
- **Automatic Injection**: API client automatically adds `Authorization: Bearer {token}` to all requests

## Protected Routes

The frontend uses middleware to check authentication:
- `/student/*` - Requires STUDENT role (1)
- `/faculty/*` - Requires FACULTY role (2)
- `/admin/*` - Requires ADMIN role (6)

## Environment Configuration

### Backend (.env)
```
PORT=5000
NODE_ENV=development
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Next Steps

1. ✅ API client created
2. ✅ Login page integrated
3. ⏳ Update other pages to use API client for data fetching
4. ⏳ Add error handling and loading states
5. ⏳ Test all endpoints with actual backend
