const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Software', 'Logistics', 'Hardware', 'Consulting', 'Raw Materials', 'Services'] 
  },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  contractValue: { type: Number, required: true },
  contractStartDate: { type: Date, required: true },
  contractEndDate: { type: Date, required: true },
  riskScore: { type: Number, default: 0 },
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = getModel('Vendor', vendorSchema);
