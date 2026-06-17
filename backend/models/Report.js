const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['Performance', 'Risk', 'Compliance', 'Procurement']
  },
  generatedBy: { type: String, required: true },
  format: { type: String, enum: ['PDF', 'Excel'], default: 'PDF' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = getModel('Report', reportSchema);
