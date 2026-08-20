const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');

// Lock ALL routes below behind JWT Authentication + Strict ADMIN Role Gate
router.use(requireAuth);
router.use(requireAdmin);

router.get('/users', adminController.getAllUsers);
router.get('/stats', adminController.getStats);
router.get('/moderation-logs', adminController.getModerationLogs);
router.delete('/users/:userId', adminController.deleteUser);
router.put('/users/:userId/suspend', adminController.toggleSuspend);
router.put('/users/:userId/role', adminController.changeUserRole);

module.exports = router;
