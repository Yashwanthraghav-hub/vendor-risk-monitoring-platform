const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/db');
const seedData = require('./config/seeder');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());
// Parse incoming requests JSON body
app.use(express.json());

// Load routes
const authRoutes = require('./routes/authRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const complianceRoutes = require('./routes/complianceRoutes');
const alertRoutes = require('./routes/alertRoutes');
const reportRoutes = require('./routes/reportRoutes');
const auditRoutes = require('./routes/auditRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/audit', auditRoutes);

// Fallback error-handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start application database connection & express server
async function startServer() {
  // 1. Database Connection
  await connectDB();
  
  // 2. Run Database Seeder (auto-fills mock schemas if collections are empty)
  await seedData();
  
  // 3. Listen for connections
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();
