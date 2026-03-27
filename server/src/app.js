/**
 * Express Application Setup
 */

const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const runRoutes = require('./routes/runRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'eval-studio-api', uptime: process.uptime() });
});

// Mount Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/runs', runRoutes);
app.use('/api/stats', statsRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

module.exports = app;
