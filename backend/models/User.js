const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'Procurement Manager', 'Risk Analyst'], 
    default: 'Procurement Manager' 
  },
  department: { type: String, default: 'Procurement' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = getModel('User', userSchema);
