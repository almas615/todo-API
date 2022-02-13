const { Activity } = require('../models/index');

const list = (req, res) => {
  Activity.findAll()
    .then((activities) => {
      res.json({
        status: 'Success',
        message: 'Success',
        data: activities,
      });
    });
};

const create = (req, res) => {
  // req.body.title must not be null
  if (!req.body.title) {
    res.status(400).json({
      status: 'Bad Request',
      message: 'title cannot be null',
    });
    return;
  }
  Activity.create(req.body)
    .then((activities) => res.status(201).json({
      status: 'Success',
      message: 'Success',
      data: activities,
    }))
    .catch((err) => res.status(400).json(err));
};

const detail = async (req, res) => {
  const activity = await Activity.findByPk(req.params.id);
  if (!activity) {
    return res.status(404).json({
      status: 'Not Found',
      message: `Activity with ID ${req.params.id} Not Found`,
    });
  }
  return res.status(200).json({
    status: 'Success',
    message: 'Success',
    data: activity,
  });
};

const remove = async (req, res) => {
  try {
    const activity = await Activity.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!activity) {
      return res.status(404).json({
        status: 'Not Found',
        message: `Activity with ID ${req.params.id} Not Found`,
      });
    }
    return res.status(200).json({
      status: 'Success',
      message: 'Success',
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      status: 'Error',
      message: 'internal server error',
    });
  }
};

const update = async (req, res) => {
  if (!req.body) {
    res.json({
      status: 'Bad Request',
      message: 'title cannot be null',
      data: {},
    });
    return;
  }
  const activity = await Activity.findByPk(req.params.id);
  if (!activity) {
    res.status(404).json({
      status: 'Not Found',
      message: `Activity with ID ${req.params.id} Not Found`,
    });
    return;
  }
  try {
    const updatedActivity = await activity.update(req.body);
    if (updatedActivity) {
      res.status(200).json({
        status: 'Success',
        message: 'Success',
        data: updatedActivity,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 'Error',
      message: 'Internal Server Error',
    });
  }
};

module.exports = {
  create,
  list,
  detail,
  remove,
  update,
};
