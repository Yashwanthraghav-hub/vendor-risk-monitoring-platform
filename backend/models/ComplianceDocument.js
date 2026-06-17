const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const complianceDocumentSchema = new mongoose.Schema({
  vendorId: { type: String, required: true, index: true },
  documentType: { 
    type: String, 
    required: true,
    enum: ['ISO Certificate', 'Business License', 'Audit Report', 'Insurance']
  },
  status: { 
    type: String, 
    enum: ['Valid', 'Expired', 'Pending Renewal'], 
    default: 'Valid' 
  },
  expiryDate: { type: Date, required: true },
  documentUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = getModel('ComplianceDocument', complianceDocumentSchema);
