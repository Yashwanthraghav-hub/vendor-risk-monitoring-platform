const AuditLog = require('../models/AuditLog');

// Get all audit logs
async function getAuditLogs(req, res) {
  try {
    const logs = await AuditLog.find();
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // chronologically descending
    
    // Reverse to get newest logs first
    logs.reverse();

    res.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Error fetching audit logs' });
  }
}

module.exports = {
  getAuditLogs
};
