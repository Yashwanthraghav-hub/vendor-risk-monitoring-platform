const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateJWT, vendorController.getVendors);
router.get('/:id', authenticateJWT, vendorController.getVendorById);
router.post('/', authenticateJWT, authorizeRoles('Admin', 'Procurement Manager'), vendorController.createVendor);
router.put('/:id', authenticateJWT, authorizeRoles('Admin', 'Procurement Manager'), vendorController.updateVendor);
router.delete('/:id', authenticateJWT, authorizeRoles('Admin'), vendorController.deleteVendor);
router.get('/:id/predict', authenticateJWT, vendorController.getPrediction);

module.exports = router;
