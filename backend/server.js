require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const adminRoutes = require("./routes/adminRoutes");


// Initialize express app
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration - MUST come before routes
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:4000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded files)
app.use('/uploads', express.static('uploads'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CureLex Healthcare API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api', patientRoutes);
app.use('/api', doctorRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = 4000;
 app.listen(PORT, () => {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('  🏥 CureLex Healthcare Backend Server');
  console.log('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log(`  📡 Server running on port ${PORT}`);
  console.log(`  🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  🔗 API URL: http://localhost:${PORT}`);
  console.log(`  ✅ Health Check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('  📋 Available Endpoints:');
  console.log('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('  Patient Authentication:');
  console.log('    POST /api/auth/patient/signup');
  console.log('    POST /api/auth/patient/signin');
  console.log('    POST /api/auth/patient/forgot-password');
  console.log('');
  console.log('  Patient Dashboard:');
  console.log('    GET  /api/patient/dashboard (Protected)');
  console.log('    GET  /api/patient/profile (Protected)');
  console.log('');
  console.log('  Doctor Authentication:');
  console.log('    POST /api/auth/doctor/signup (with file uploads)');
  console.log('    POST /api/auth/doctor/signin');
  console.log('');
  console.log('  Doctor Profile:');
  console.log('    GET  /api/doctor/profile (Protected)');
  console.log('');
  console.log('  💡 CONNECT. CONSULT. CARE');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
});

// Handle unhandled promise rejections
// process.on('unhandledRejection', (err) => {
//   console.error(`❌ Unhandled Rejection: ${err.message}`);
//   server.close(() => process.exit(1));
// });

module.exports = app;