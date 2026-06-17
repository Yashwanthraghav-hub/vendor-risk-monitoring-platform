const ComplianceDocument = require('../models/ComplianceDocument');
const Vendor = require('../models/Vendor');
const AuditLog = require('../models/AuditLog');

// Get all compliance documents (or filter by vendor)
async function getDocuments(req, res) {
  try {
    const { vendorId } = req.query;
    let filter = {};
    if (vendorId) {
      filter.vendorId = vendorId;
    }

    const documents = await ComplianceDocument.find(filter);
    
    // Sort documents: Expired first, then Pending, then Valid
    const statusOrder = { 'Expired': 0, 'Pending Renewal': 1, 'Valid': 2 };
    documents.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

    res.json(documents);
  } catch (error) {
    console.error('Error fetching compliance documents:', error);
    res.status(500).json({ message: 'Error fetching compliance documents' });
  }
}

// Upload mock compliance document
async function uploadDocument(req, res) {
  try {
    const { vendorId, documentType, expiryDate, status } = req.body;

    if (!vendorId || !documentType || !expiryDate) {
      return res.status(400).json({ message: 'vendorId, documentType and expiryDate are required' });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Determine status automatically if not provided
    let finalStatus = status || 'Valid';
    const expDate = new Date(expiryDate);
    const today = new Date();
    if (expDate < today) {
      finalStatus = 'Expired';
    } else {
      const diffTime = Math.abs(expDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 30) {
        finalStatus = 'Pending Renewal';
      }
    }

    const mockDocUrl = `/uploads/${vendorId}_${documentType.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`;

    const newDoc = await ComplianceDocument.create({
      vendorId,
      documentType,
      expiryDate,
      status: finalStatus,
      documentUrl: mockDocUrl
    });

    // Create Audit Log
    await AuditLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'Upload Compliance Document',
      details: `Uploaded compliance document: ${documentType} for vendor ${vendor.name}. Expiry date: ${new Date(expiryDate).toLocaleDateString()}.`
    });

    res.status(201).json(newDoc);
  } catch (error) {
    console.error('Error uploading compliance document:', error);
    res.status(500).json({ message: 'Error uploading compliance document' });
  }
}

// Update Document Status
async function updateDocumentStatus(req, res) {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const doc = await ComplianceDocument.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const updatedDoc = await ComplianceDocument.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    const vendor = await Vendor.findById(doc.vendorId);
    const vendorName = vendor ? vendor.name : 'Unknown Vendor';

    // Create Audit Log
    await AuditLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'Verify Compliance Document',
      details: `Updated compliance document status to '${status}' for document type ${doc.documentType} of vendor ${vendorName}.`
    });

    res.json(updatedDoc);
  } catch (error) {
    console.error('Error updating document status:', error);
    res.status(500).json({ message: 'Error updating document status' });
  }
}

// Simulate Renewal Reminder email notifications
async function sendReminder(req, res) {
  try {
    const doc = await ComplianceDocument.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const vendor = await Vendor.findById(doc.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found for document' });
    }

    // Create Audit Log for reminder
    await AuditLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'Trigger Compliance Reminder',
      details: `Compliance renewal notification triggered for vendor '${vendor.name}' contact '${vendor.contactPerson}' (${vendor.email}) regarding ${doc.documentType} expiring on ${new Date(doc.expiryDate).toLocaleDateString()}.`
    });

    res.json({ 
      success: true, 
      message: `Renewal reminder email simulated successfully. Sent to ${vendor.contactPerson} (${vendor.email}) for document '${doc.documentType}'.` 
    });
  } catch (error) {
    console.error('Error sending compliance reminder:', error);
    res.status(500).json({ message: 'Error sending compliance reminder' });
  }
}

module.exports = {
  getDocuments,
  uploadDocument,
  updateDocumentStatus,
  sendReminder
};
