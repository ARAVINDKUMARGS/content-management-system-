const dns = require('dns');

// DNS workaround for MongoDB connection issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB().catch((err) => {
  console.warn(
    '[Lumen Server] MongoDB connection deferred or offline. Running Express server with in-memory fallback.'
  );
});

// Allowed frontend origins
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV === 'development'
      ) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Lumen Content Management System API',
  });
});

// ======================================================
// Routes
// ======================================================

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articleRoutes');
const adminVerificationRoutes = require('./routes/adminVerificationRoutes');
const quizRoutes = require('./routes/quizRoutes');
const quizAttemptRoutes = require('./routes/quizAttemptRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const commentRoutes = require('./routes/commentRoutes');

const subscriptionRoutes = require('./routes/subscriptionRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Authentication
app.use('/api/auth', authRoutes);

// User Management & Profiles
app.use('/api/users', userRoutes);

// Articles
app.use('/api/articles', articleRoutes);

// Admin Verification
app.use('/api/admin-verification', adminVerificationRoutes);

// Quizzes
app.use('/api/quizzes', quizRoutes);

// Quiz Attempts
app.use('/api/quiz-attempts', quizAttemptRoutes);

// Notifications
app.use('/api/notifications', notificationRoutes);

// Comments & Discussions
app.use('/api/comments', commentRoutes);

// Subscriptions
app.use('/api/subscriptions', subscriptionRoutes);

// Messages / Chat
app.use('/api/messages', messageRoutes);

// Content Reports
app.use('/api/reports', reportRoutes);



// ======================================================
// Root route
// ======================================================

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Lumen CMS API',
    module: 'Full Stack Content Management System',
    documentation: '/api/health',
  });
});

// ======================================================
// 404 Handler
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// ======================================================
// Error Handler
// ======================================================

app.use((err, req, res, next) => {
  console.error(
    '[Lumen Server Error]:',
    err.stack || err.message
  );

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development'
      ? { stack: err.stack }
      : {}),
  });
});

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`[Lumen Socket.io] Client connected: ${socket.id}`);

  socket.on('join_room', (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log(`[Lumen Socket.io] Socket ${socket.id} joined room ${userId}`);
    }
  });

  socket.on('send_message', (data) => {
    if (data && data.receiver) {
      io.to(data.receiver.toString()).emit('receive_message', data);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Lumen Socket.io] Client disconnected: ${socket.id}`);
  });
});

// ======================================================
// Server Port
// ======================================================

const PORT = process.env.PORT || 5000;

// ======================================================
// Start Server
// ======================================================

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log('\n=================================================');
    console.log(`  🌿 Lumen CMS Server running on port ${PORT}`);
    console.log(`  🔗 API Root: http://localhost:${PORT}/api/health`);
    console.log(`  💬 Real-Time Chat & Socket.io Enabled`);
    console.log('=================================================\n');
  });
}

module.exports = app;