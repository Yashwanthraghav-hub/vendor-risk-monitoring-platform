const express = require('express');
const router = express.Router();
const complianceController = require('../controllers/complianceController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateJWT, complianceController.getDocuments);
router.post('/', authenticateJWT, authorizeRoles('Admin', 'Procurement Manager'), complianceController.uploadDocument);
router.put('/:id/status', authenticateJWT, authorizeRoles('Admin', 'Risk Analyst'), complianceController.updateDocumentStatus);
router.post('/:id/reminder', authenticateJWT, authorizeRoles('Admin', 'Procurement Manager', 'Risk Analyst'), complianceController.sendReminder);

module.exports = router;
