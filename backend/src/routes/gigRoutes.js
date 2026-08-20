const express = require('express');
const router = express.Router();
const gigController = require('../controllers/gigController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/', gigController.getGigs);
router.post('/', requireAuth, gigController.createGig);

module.exports = router;
