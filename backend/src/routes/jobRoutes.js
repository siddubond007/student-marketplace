const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/', jobController.getJobs);
router.post('/', requireAuth, jobController.createJob);
router.delete('/:jobId', requireAuth, jobController.deleteJob);
router.post('/:jobId/bid', requireAuth, jobController.submitBid);

module.exports = router;
