#!/bin/bash

# SRIT College Portal - Setup Verification Script
# Run this to check if everything is configured correctly

echo "=========================================="
echo "SRIT Portal - Setup Verification"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Check function
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAILED++))
    fi
}

# 1. Check Node.js
echo "1. Checking Node.js..."
node --version > /dev/null 2>&1
check "Node.js installed"

# 2. Check npm
echo "2. Checking npm..."
npm --version > /dev/null 2>&1
check "npm installed"

# 3. Check backend directory
echo "3. Checking backend structure..."
[ -d "backend" ]
check "Backend directory exists"

[ -f "backend/package.json" ]
check "Backend package.json exists"

[ -f "backend/server.js" ]
check "Backend server.js exists"

[ -f "backend/.env" ]
check "Backend .env file exists"

# 4. Check backend dependencies
echo "4. Checking backend dependencies..."
[ -d "backend/node_modules" ]
check "Backend dependencies installed"

# 5. Check backend files
echo "5. Checking backend files..."
[ -f "backend/src/app.js" ]
check "app.js exists"

[ -f "backend/src/config/supabase.js" ]
check "supabase.js exists"

[ -f "backend/src/middleware/auth.js" ]
check "auth middleware exists"

[ -f "backend/src/routes/auth.js" ]
check "auth routes exist"

[ -f "backend/src/routes/admin.js" ]
check "admin routes exist"

[ -f "backend/src/routes/student.js" ]
check "student routes exist"

[ -f "backend/src/routes/faculty.js" ]
check "faculty routes exist"

# 6. Check frontend structure
echo "6. Checking frontend structure..."
[ -d "src" ]
check "Frontend src directory exists"

[ -f "package.json" ]
check "Frontend package.json exists"

[ -d "node_modules" ]
check "Frontend dependencies installed"

# 7. Check frontend files
echo "7. Checking frontend files..."
[ -f "src/lib/constants.ts" ]
check "constants.ts exists"

[ -f "src/lib/auth.ts" ]
check "auth.ts exists"

[ -f "src/components/Header.tsx" ]
check "Header component exists"

[ -f "src/components/ProtectedRoute.tsx" ]
check "ProtectedRoute component exists"

[ -f "src/app/login/page.tsx" ]
check "Login page exists"

[ -f "src/app/admin/page.tsx" ]
check "Admin dashboard exists"

[ -f "src/app/student/page.tsx" ]
check "Student dashboard exists"

[ -f "src/app/faculty/page.tsx" ]
check "Faculty dashboard exists"

# 8. Check documentation
echo "8. Checking documentation..."
[ -f "backend/README.md" ]
check "Backend README exists"

[ -f "backend/DATABASE_SCHEMA.md" ]
check "Database schema docs exist"

[ -f "backend/API_TESTING_GUIDE.md" ]
check "API testing guide exists"

[ -f "SETUP_GUIDE.md" ]
check "Setup guide exists"

[ -f "START_HERE.md" ]
check "Quick start guide exists"

# 9. Check environment configuration
echo "9. Checking environment configuration..."
if grep -q "your-project.supabase.co" backend/.env 2>/dev/null; then
    echo -e "${YELLOW}⚠${NC} Backend .env has placeholder values (needs configuration)"
    echo "   → Edit backend/.env with your Supabase credentials"
else
    echo -e "${GREEN}✓${NC} Backend .env appears configured"
    ((PASSED++))
fi

# 10. Check port configuration
echo "10. Checking port configuration..."
if grep -q "next dev -p 5173" package.json; then
    echo -e "${GREEN}✓${NC} Frontend configured for port 5173"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Frontend not configured for port 5173"
    ((FAILED++))
fi

# Summary
echo ""
echo "=========================================="
echo "Verification Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Configure backend/.env with your Supabase credentials"
    echo "2. Follow START_HERE.md for complete setup"
    echo "3. Start backend: cd backend && npm run dev"
    echo "4. Start frontend: npm run dev"
    exit 0
else
    echo -e "${RED}✗ Some checks failed${NC}"
    echo "Please review the errors above and fix them."
    exit 1
fi
