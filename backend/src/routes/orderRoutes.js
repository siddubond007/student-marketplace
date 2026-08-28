const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/', requireAuth, orderController.getMyOrders);
router.post('/', requireAuth, orderController.createOrder);
router.post('/:orderId/verify-payment', requireAuth, orderController.verifyPayment);
router.post('/:orderId/deliver', requireAuth, orderController.submitDeliverable);
router.post('/:orderId/approve', requireAuth, orderController.approveOrder);
router.get('/:orderId/messages', requireAuth, orderController.getMessages);
router.post('/:orderId/messages', requireAuth, orderController.sendMessage);

module.exports = router;
