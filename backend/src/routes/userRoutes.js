const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/freelancers', userController.getFreelancers);
router.get('/:userId', userController.getUserProfile);
router.put('/profile', requireAuth, userController.updateProfile);
router.post('/portfolio', requireAuth, userController.addPortfolioItem);

module.exports = router;
