const mongoose = require('mongoose');
const { getModel } = require('../config/db');

const vendorPerformanceSchema = new mongoose.Schema({
  vendorId: { type: String, required: true, index: true },
  onTimeDeliveryRate: { type: Number, required: true, min: 0, max: 100 },
  qualityScore: { type: Number, required: true, min: 0, max: 100 },
  fulfillmentRate: { type: Number, required: true, min: 0, max: 100 },
  feedbackScore: { type: Number, required: true, min: 0, max: 100 },
  evaluationDate: { type: Date, default: Date.now }
});

module.exports = getModel('VendorPerformance', vendorPerformanceSchema);
