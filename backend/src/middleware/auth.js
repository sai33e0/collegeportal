import supabase from '../config/supabase.js';

// Verify JWT token and extract user
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

// Check if user has required role
export const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get user's role from database
      const { data: userData, error } = await supabase
        .from('users')
        .select('role_id')
        .eq('id', req.user.id)
        .single();

      if (error || !userData) {
        return res.status(403).json({ error: 'User role not found' });
      }

      // Check if user's role is in allowed roles
      if (!allowedRoles.includes(userData.role_id)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          required: allowedRoles,
          current: userData.role_id
        });
      }

      // Attach role to request
      req.userRole = userData.role_id;
      next();
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(500).json({ error: 'Role verification failed' });
    }
  };
};

// Role constants
export const ROLES = {
  ADMIN: 6,
  FACULTY: 2,
  STUDENT: 1
};

// Convenience middleware for specific roles
export const requireAdmin = [authenticateToken, requireRole([ROLES.ADMIN])];
export const requireFaculty = [authenticateToken, requireRole([ROLES.FACULTY])];
export const requireStudent = [authenticateToken, requireRole([ROLES.STUDENT])];
