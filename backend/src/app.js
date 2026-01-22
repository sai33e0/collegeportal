import express from 'express';
import cors from 'cors';


// Import routes
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import studentRoutes from './routes/student.js';
import facultyRoutes from './routes/faculty.js';
import marksRoutes from './routes/marks.js';
import attendanceRoutes from './routes/facultyattendence.js';
import studentAttendanceRoutes from './routes/studentattendence.js';
import academicRoutes from './routes/academic.js';
import feesRoutes from './routes/fees.js';
import csvImportRoutes from './routes/csv-import.js';



const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SRIT Portal Backend'
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/csv-import', csvImportRoutes);
app.use('/student', studentRoutes);
app.use('/faculty', facultyRoutes);
app.use('/marks', marksRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/student-attendance', studentAttendanceRoutes);
app.use('/academic', academicRoutes);
app.use('/fees', feesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
