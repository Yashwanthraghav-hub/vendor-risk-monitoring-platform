const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateJWT } = require('../middleware/auth');

router.get('/', authenticateJWT, reportController.getReports);
router.post('/generate', authenticateJWT, reportController.generateReport);

module.exports = router;
