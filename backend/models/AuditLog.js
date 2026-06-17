const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const auditLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = getModel('AuditLog', auditLogSchema);
