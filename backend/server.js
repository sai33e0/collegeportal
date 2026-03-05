import 'dotenv/config';
import app from './src/app.js';

const PORT = process.env.PORT || 3001;

// Start server
const server = app.listen(PORT, () => {
  console.log('===========================================');
  console.log('  SRIT College Portal Backend');
  console.log('===========================================');
  console.log(`  Server running on: http://localhost:${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Health check: http://localhost:${PORT}/health`);
  console.log('===========================================');
});

server.on('error', (err) => {
  if (err?.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    console.error('Stop the other process or set a different PORT in backend/.env (e.g. PORT=3002).');
    process.exit(1);
  }

  if (err?.code === 'EACCES') {
    console.error(`Insufficient permissions to bind to port ${PORT}.`);
    process.exit(1);
  }

  console.error('Server failed to start:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  server.close(() => process.exit(0));
});
