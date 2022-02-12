const router = require('express').Router();
const activity = require('./activityRouter');
const todo = require('./todoRouter');
// make a get and console.log test
router.get('/', (req, res) => {
  res.send('Hello World!');
});
router.use('/activity-groups', activity);
router.use('/todo-items', todo);
module.exports = router;
