require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app';
const POOL_SIZE = parseInt(process.env.MONGO_POOL_SIZE, 10) || 50;

// ═══════════════════════════════════════════════════════════
// MongoDB Connection
// ═══════════════════════════════════════════════════════════

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: POOL_SIZE,
      // serverSelectionTimeoutMS: how long to try to find a server (default: 30s)
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected (pool size: ${POOL_SIZE})`);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

// ═══════════════════════════════════════════════════════════
// Start Server
// ═══════════════════════════════════════════════════════════

async function startServer() {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  });

  // ── Graceful Shutdown ──────────────────────────────────────
  const shutdown = async (signal) => {
    console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);

    server.close(async () => {
      console.log('   HTTP server closed');

      try {
        await mongoose.connection.close();
        console.log('   MongoDB connection closed');
      } catch (err) {
        console.error('   Error closing MongoDB:', err.message);
      }

      process.exit(0);
    });

    // Force shutdown after 10 seconds if graceful shutdown hangs
    setTimeout(() => {
      console.error('   Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Catch unhandled rejections and uncaught exceptions
  process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Rejection:', reason);
  });

  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    // Uncaught exceptions leave the process in an unreliable state — shut down.
    shutdown('uncaughtException');
  });
}

startServer();
