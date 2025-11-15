require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');
const http = require('http');
const { Server } = require('socket.io');
const StockPriceUpdateService = require('./services/stockPriceUpdateService');
const passport = require('./config/passport');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Initialize stock price update service
const stockPriceService = new StockPriceUpdateService(io);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/traders', require('./routes/traders'));
app.use('/api/trades', require('./routes/trades'));
app.use('/api/copied-trades', require('./routes/copiedTrades'));
app.use('/api/stock', require('./routes/stockData'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/watchlist', require('./routes/watchlist'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('subscribe-stock', (symbol) => {
    const normalizedSymbol = symbol.toUpperCase();
    socket.join(`stock-${normalizedSymbol}`);
    stockPriceService.addSubscription(normalizedSymbol, socket.id);
    console.log(`Client ${socket.id} subscribed to stock ${normalizedSymbol}`);
  });

  socket.on('unsubscribe-stock', (symbol) => {
    const normalizedSymbol = symbol.toUpperCase();
    socket.leave(`stock-${normalizedSymbol}`);
    stockPriceService.removeSubscription(normalizedSymbol, socket.id);
    console.log(`Client ${socket.id} unsubscribed from stock ${normalizedSymbol}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    stockPriceService.removeAllSubscriptions(socket.id);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, cleaning up...');
  stockPriceService.cleanup();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Make io available to routes
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection and server startup
const PORT = process.env.PORT || 3001;

sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    return sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    console.error('\nTroubleshooting tips:');
    console.error('1. Check your DATABASE_URL in .env file');
    console.error('2. Ensure your IP is whitelisted in Supabase (Settings > Database > Connection pooling)');
    console.error('3. Verify your password is correct and URL-encoded if it contains special characters');
    console.error('4. Check Supabase project status and database is active');
    if (err.original) {
      console.error('\nOriginal error:', err.original.message);
    }
    process.exit(1);
  });

module.exports = { app, server, io };

