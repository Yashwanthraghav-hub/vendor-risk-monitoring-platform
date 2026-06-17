const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateJWT, authorizeRoles('Admin'), auditController.getAuditLogs);

module.exports = router;
