const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/', jobController.getJobs);
router.get('/my-drafts', requireAuth, jobController.getMyDrafts);
router.get('/my-projects', requireAuth, jobController.getMyProjects);
router.get('/:jobId', requireAuth, jobController.getJobById);
router.post('/', requireAuth, jobController.createJob);
router.put('/:jobId', requireAuth, jobController.updateJob);
router.delete('/:jobId', requireAuth, jobController.deleteJob);
router.post('/:jobId/bid', requireAuth, jobController.submitBid);

module.exports = router;
