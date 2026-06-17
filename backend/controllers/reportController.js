const Report = require('../models/Report');
const AuditLog = require('../models/AuditLog');

// Get all generated reports list
async function getReports(req, res) {
  try {
    const reports = await Report.find();
    reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports list:', error);
    res.status(500).json({ message: 'Error fetching reports list' });
  }
}

// Generate report mock metadata
async function generateReport(req, res) {
  try {
    const { title, type, format } = req.body;

    if (!title || !type) {
      return res.status(400).json({ message: 'Title and type are required' });
    }

    const reportFormat = format || 'PDF';
    const creatorName = req.user.name || req.user.email;

    const newReport = await Report.create({
      title,
      type,
      generatedBy: creatorName,
      format: reportFormat
    });

    // Create Audit Log
    await AuditLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'Generate Report',
      details: `Generated new report: '${title}' (Type: ${type}, Format: ${reportFormat}).`
    });

    res.status(201).json(newReport);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
}

module.exports = {
  getReports,
  generateReport
};
