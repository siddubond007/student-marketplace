const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/freelancers', userController.getFreelancers);
router.post('/verification', requireAuth, userController.submitVerification);
router.put('/profile', requireAuth, userController.updateProfile);
router.post('/portfolio', requireAuth, userController.addPortfolioItem);
router.get('/:userId', userController.getUserProfile);

module.exports = router;
