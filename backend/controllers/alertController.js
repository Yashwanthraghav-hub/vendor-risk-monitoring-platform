const Alert = require('../models/Alert');
const Vendor = require('../models/Vendor');

// Get active alerts (with vendor names integrated)
async function getAlerts(req, res) {
  try {
    const alerts = await Alert.find();
    
    // Sort chronologically (newest first)
    alerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Enhance alerts with vendor names
    const enhancedAlerts = await Promise.all(alerts.map(async (alert) => {
      const vendor = await Vendor.findById(alert.vendorId);
      return {
        ...alert,
        vendorName: vendor ? vendor.name : 'Unknown Vendor'
      };
    }));

    res.json(enhancedAlerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ message: 'Error fetching alerts' });
  }
}

// Mark alert as read (dismiss)
async function markAsRead(req, res) {
  try {
    const updatedAlert = await Alert.findByIdAndUpdate(
      req.params.id, 
      { isRead: true }, 
      { new: true }
    );
    
    if (!updatedAlert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json(updatedAlert);
  } catch (error) {
    console.error('Error updating alert status:', error);
    res.status(500).json({ message: 'Error updating alert status' });
  }
}

module.exports = {
  getAlerts,
  markAsRead
};
