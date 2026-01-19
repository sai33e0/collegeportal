# TODO: Modify Next.js Login Page for Environment Variable

- [ ] Create .env.local with NEXT_PUBLIC_API_BASE_URL=https://collegeportal-n4kz.onrender.com
- [ ] Edit src/app/auth/login/page.tsx: Add const API = process.env.NEXT_PUBLIC_API_BASE_URL; after imports
- [ ] Edit src/app/auth/login/page.tsx: Replace fetch call with await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ email, password, }), });
- [ ] Remove unused imports (API_BASE_URL, API_ENDPOINTS) from src/app/auth/login/page.tsx
- [ ] Search for any remaining hardcoded 'localhost' in the frontend to ensure none exist
