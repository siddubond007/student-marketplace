const express = require('express');
const router = express.Router();
const gigController = require('../controllers/gigController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/', gigController.getGigs);
router.get('/drafts/:gigId', requireAuth, gigController.getGigDraft);
router.post('/drafts', requireAuth, gigController.createGigDraft);
router.put('/drafts/:gigId', requireAuth, gigController.updateGigDraft);
router.get('/:gigId', gigController.getGigById);
router.post('/', requireAuth, gigController.createGig);

module.exports = router;
