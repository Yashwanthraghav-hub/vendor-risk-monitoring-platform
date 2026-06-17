const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { authenticateJWT } = require('../middleware/auth');

router.get('/', authenticateJWT, alertController.getAlerts);
router.put('/:id/read', authenticateJWT, alertController.markAsRead);

module.exports = router;
