const router = require('express').Router();
const activity = require('../controllers/activityController');

router.get('/', activity.list);
router.post('/', activity.create);
router.get('/:id', activity.detail);
router.patch('/:id', activity.update);
router.delete('/:id', activity.remove);
module.exports = router;
