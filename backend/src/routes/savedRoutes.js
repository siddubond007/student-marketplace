const express = require('express');
const router = express.Router();
const savedController = require('../controllers/savedController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/', requireAuth, savedController.getSavedLibrary);
router.post('/jobs/:jobId', requireAuth, savedController.saveJob);
router.delete('/jobs/:jobId', requireAuth, savedController.removeSavedJob);

module.exports = router;
