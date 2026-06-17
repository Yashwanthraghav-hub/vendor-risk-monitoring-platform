const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const alertSchema = new mongoose.Schema({
  vendorId: { type: String, required: true, index: true },
  type: { 
    type: String, 
    required: true,
    enum: ['Contract Expiry', 'Compliance Expiry', 'High Risk Score', 'Performance Drop']
  },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = getModel('Alert', alertSchema);
