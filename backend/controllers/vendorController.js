const Vendor = require('../models/Vendor');
const VendorPerformance = require('../models/VendorPerformance');
const ComplianceDocument = require('../models/ComplianceDocument');
const Alert = require('../models/Alert');
const AuditLog = require('../models/AuditLog');

// Helper: Calculate Risk Score dynamically
async function calculateRisk(vendorId, category) {
  let score = 0;
  
  // 1. Performance weight (50% total: 25% delivery, 25% quality)
  const history = await VendorPerformance.find({ vendorId });
  let avgDelivery = 95;
  let avgQuality = 95;
  let avgFulfillment = 95;
  
  if (history && history.length > 0) {
    const sumDelivery = history.reduce((sum, h) => sum + h.onTimeDeliveryRate, 0);
    const sumQuality = history.reduce((sum, h) => sum + h.qualityScore, 0);
    const sumFulfillment = history.reduce((sum, h) => sum + h.fulfillmentRate, 0);
    avgDelivery = sumDelivery / history.length;
    avgQuality = sumQuality / history.length;
    avgFulfillment = sumFulfillment / history.length;
  }

  // Delivery Delays component (max 25 points)
  const deliveryDeficit = 100 - avgDelivery;
  score += Math.min(25, deliveryDeficit * 1.5);

  // Quality score deficit component (max 25 points)
  const qualityDeficit = 100 - avgQuality;
  score += Math.min(25, qualityDeficit * 1.5);

  // 2. Compliance weight (30% total)
  const docs = await ComplianceDocument.find({ vendorId });
  let compliancePenalty = 0;
  if (docs && docs.length > 0) {
    docs.forEach(doc => {
      if (doc.status === 'Expired') {
        compliancePenalty += 15;
      } else if (doc.status === 'Pending Renewal') {
        compliancePenalty += 8;
      }
    });
  }
  score += Math.min(30, compliancePenalty);

  // 3. Contract fulfillment / breach component (10% total)
  if (avgFulfillment < 85) {
    score += 10;
  } else if (avgFulfillment < 92) {
    score += 5;
  }

  // 4. Financial Stability & Volatility simulation based on Category (10% total)
  // Categories like Logistics & Raw Materials have more volatility, adding default base risk points
  if (category === 'Logistics') {
    score += 8;
  } else if (category === 'Raw Materials') {
    score += 10;
  } else if (category === 'Hardware') {
    score += 5;
  } else {
    score += 2; // Software, Services, Consulting are lower volatility
  }

  // Round risk score between 0 and 100
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));
  
  // Determine level
  let level = 'Low';
  if (finalScore >= 70) {
    level = 'High';
  } else if (finalScore >= 40) {
    level = 'Medium';
  }

  return { finalScore, level };
}

// Get all vendors (with filters, search, sorting, and pagination)
async function getVendors(req, res) {
  try {
    const { search, category, riskLevel, sort, order, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    
    // Search by name
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    // Category filter
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    // Risk level filter
    if (riskLevel && riskLevel !== 'All') {
      filter.riskLevel = riskLevel;
    }

    const allVendors = await Vendor.find(filter);
    
    // Custom logic for sorting
    let sortedVendors = [...allVendors];
    if (sort) {
      const orderCoeff = order === 'desc' ? -1 : 1;
      sortedVendors.sort((a, b) => {
        let valA = a[sort];
        let valB = b[sort];
        
        // Handle case-insensitive sorting for strings
        if (typeof valA === 'string') {
          return valA.localeCompare(valB) * orderCoeff;
        }
        return (valA - valB) * orderCoeff;
      });
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedVendors = sortedVendors.slice(startIndex, startIndex + limitNum);
    
    res.json({
      vendors: paginatedVendors,
      total: sortedVendors.length,
      page: pageNum,
      totalPages: Math.ceil(sortedVendors.length / limitNum)
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ message: 'Error fetching vendors' });
  }
}

// Get vendor by ID (with dynamic risk calculation update)
async function getVendorById(req, res) {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Recalculate risk on demand to ensure real-time accuracy
    const { finalScore, level } = await calculateRisk(vendor._id || vendor.id, vendor.category);
    
    let updatedVendor = vendor;
    if (vendor.riskScore !== finalScore || vendor.riskLevel !== level) {
      updatedVendor = await Vendor.findByIdAndUpdate(
        vendor._id || vendor.id,
        { riskScore: finalScore, riskLevel: level },
        { new: true }
      );
      
      // If risk level changed to High, trigger an alert if not already exists
      if (level === 'High' && vendor.riskLevel !== 'High') {
        await Alert.create({
          vendorId: (vendor._id || vendor.id).toString(),
          type: 'High Risk Score',
          severity: 'High',
          message: `CRITICAL: Vendor '${vendor.name}' has escalated to High Risk Level with a score of ${finalScore}.`
        });
      }
    }

    // Load performance history
    const performance = await VendorPerformance.find({ vendorId: (vendor._id || vendor.id).toString() });
    
    // Sort performance by date
    performance.sort((a, b) => new Date(a.evaluationDate) - new Date(b.evaluationDate));

    res.json({
      vendor: updatedVendor,
      performance
    });
  } catch (error) {
    console.error('Error fetching vendor profile:', error);
    res.status(500).json({ message: 'Error fetching vendor profile' });
  }
}

// Create Vendor
async function createVendor(req, res) {
  try {
    const newVendor = await Vendor.create(req.body);
    
    // Trigger initial performance evaluation seeding for the vendor
    const evalDate = new Date();
    await VendorPerformance.create({
      vendorId: (newVendor._id || newVendor.id).toString(),
      onTimeDeliveryRate: 95,
      qualityScore: 92,
      fulfillmentRate: 98,
      feedbackScore: 90,
      evaluationDate: evalDate.toISOString()
    });

    // Run dynamic risk assessment immediately
    const { finalScore, level } = await calculateRisk(newVendor._id || newVendor.id, newVendor.category);
    const updatedVendor = await Vendor.findByIdAndUpdate(
      newVendor._id || newVendor.id,
      { riskScore: finalScore, riskLevel: level },
      { new: true }
    );

    // Create Audit Log
    await AuditLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'Create Vendor',
      details: `Added new vendor: ${newVendor.name} in category ${newVendor.category}. Contract Value: $${newVendor.contractValue}.`
    });

    res.status(201).json(updatedVendor);
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ message: 'Error creating vendor' });
  }
}

// Update Vendor
async function updateVendor(req, res) {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Recalculate risk score
    const { finalScore, level } = await calculateRisk(updatedVendor._id || updatedVendor.id, updatedVendor.category);
    const finalVendor = await Vendor.findByIdAndUpdate(
      updatedVendor._id || updatedVendor.id,
      { riskScore: finalScore, riskLevel: level },
      { new: true }
    );

    // Create Audit Log
    await AuditLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'Update Vendor',
      details: `Modified details for vendor: ${finalVendor.name}. Calculated Risk Score: ${finalScore} (${level}).`
    });

    res.json(finalVendor);
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ message: 'Error updating vendor' });
  }
}

// Delete Vendor
async function deleteVendor(req, res) {
  try {
    const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!deletedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Create Audit Log
    await AuditLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'Delete Vendor',
      details: `Permanently removed vendor: ${deletedVendor.name} (Category: ${deletedVendor.category}).`
    });

    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({ message: 'Error deleting vendor' });
  }
}

// AI Forecast Prediction Engine Controller
async function getPrediction(req, res) {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const performances = await VendorPerformance.find({ vendorId: (vendor._id || vendor.id).toString() });
    const docs = await ComplianceDocument.find({ vendorId: (vendor._id || vendor.id).toString() });

    // Sort performances chronologically
    performances.sort((a, b) => new Date(a.evaluationDate) - new Date(b.evaluationDate));

    // Calculate slopes for delivery and quality scores
    let deliverySlope = 0;
    let qualitySlope = 0;
    if (performances.length >= 2) {
      const p1 = performances[performances.length - 2];
      const p2 = performances[performances.length - 1];
      deliverySlope = p2.onTimeDeliveryRate - p1.onTimeDeliveryRate;
      qualitySlope = p2.qualityScore - p1.qualityScore;
    }

    // Calculate predictions:
    // 1. Future Delivery Delay Probability (0-100%)
    let deliveryDelayProb = 15; // base probability
    if (deliverySlope < 0) {
      deliveryDelayProb += Math.abs(deliverySlope) * 6; // increase risk if rate is falling
    } else {
      deliveryDelayProb -= deliverySlope * 3; // decrease risk if rate is rising
    }
    // High risk base adjustments
    if (vendor.riskLevel === 'High') deliveryDelayProb += 35;
    else if (vendor.riskLevel === 'Medium') deliveryDelayProb += 15;
    deliveryDelayProb = Math.min(95, Math.max(5, Math.round(deliveryDelayProb)));

    // 2. Compliance Failure Probability
    let complianceFailureProb = 10;
    const expiredCount = docs.filter(d => d.status === 'Expired').length;
    const pendingCount = docs.filter(d => d.status === 'Pending Renewal').length;
    
    complianceFailureProb += (expiredCount * 30) + (pendingCount * 15);
    if (vendor.riskLevel === 'High') complianceFailureProb += 20;
    complianceFailureProb = Math.min(98, Math.max(5, Math.round(complianceFailureProb)));

    // 3. Performance Decline Probability
    let performanceDeclineProb = 20;
    if (qualitySlope < 0) {
      performanceDeclineProb += Math.abs(qualitySlope) * 8;
    }
    if (vendor.riskLevel === 'High') performanceDeclineProb += 25;
    performanceDeclineProb = Math.min(90, Math.max(8, Math.round(performanceDeclineProb)));

    res.json({
      vendorId: vendor._id || vendor.id,
      vendorName: vendor.name,
      predictions: {
        deliveryDelayProbability: deliveryDelayProb,
        complianceFailureProbability: complianceFailureProb,
        performanceDeclineProbability: performanceDeclineProb,
      },
      insights: [
        deliverySlope < 0 
          ? `⚠️ Critical warning: Delivery rate decreased by ${Math.abs(deliverySlope)}% in last assessment.` 
          : `✅ Stable: On-time delivery rate is steady or improving.`,
        expiredCount > 0 
          ? `⚠️ Severe risk: Vendor has ${expiredCount} expired legal documents requiring immediate escalation.` 
          : `✅ Legal documents are currently valid.`,
        performanceDeclineProb > 50 
          ? `⚠️ High probability of quality rating decline within next 30 days based on historic slope.`
          : `✅ Quality trend metrics within normal operational thresholds.`
      ]
    });
  } catch (error) {
    console.error('Prediction calculation error:', error);
    res.status(500).json({ message: 'Error calculating predictions' });
  }
}

module.exports = {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
  getPrediction
};
