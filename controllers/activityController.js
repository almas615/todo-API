// eslint-disable-next-line import/no-unresolved
const Sequelize = require('sequelize');

const { Op } = Sequelize;
const { Activity, Todo } = require('../models/index');

const list = (req, res) => {
  const limit = req.query.limit || 1000;
  const offset = req.query.offset || 0;
  Activity.findAndCountAll({
    where: {
      email: req.query.email || { [Op.not]: null },
    },
    limit,
    offset,
    attributes: ['id', 'title', 'created_at'],
  })
    .then((activities) => {
      res.json({
        status: 'Success',
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
  Activity.create({
    id: req.body.id || null,
    title: req.body.title,
    email: req.body.email,
  })
    .then((a) => res.status(201).json({
      status: 'Success',
      data: {
        title: a.title,
        email: a.email,
      },
    }))
    .catch((err) => res.status(400).json(err));
};

const detail = async (req, res) => {
  const activity = await Activity.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ['id', 'title', 'created_at'],
    include: [{
      model: Todo,
      as: 'todo-items',
      attributes: ['id', 'title', 'activity_group_id', 'is_active', 'priority'],
    }],
  });
  if (!activity) {
    return res.status(404).json({
      status: 'Not Found',
      message: `Activity with ID ${req.params.id} Not Found`,
    });
  }
  return res.status(200).json({
    status: 'Success',
    data: {
      id: activity.id,
      title: activity.title,
    },
  });
};

const remove = async (req, res) => {
  let { id } = req.params;
  if (req.query.id) {
    const queryId = req.query.id;
    id = queryId.split(',');
  }
  try {
    const activity = await Activity.destroy({
      where: {
        id,
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
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      status: 'Internal Server Error',
      message: err,
    });
  }
};

// eslint-disable-next-line consistent-return
const update = async (req, res) => {
  const activity = await Activity.findByPk(req.params.id);
  if (!activity) {
    return res.status(404).json({
      status: 'Not Found',
      message: `Activity with ID ${req.params.id} Not Found`,
    });
  }
  try {
    const updatedActivity = await activity.update({
      title: req.body.title,
    });
    if (updatedActivity) {
      return res.status(200).json({
        status: 'Success',
        data: {
          id: updatedActivity.id,
          title: updatedActivity.title,
        },
      });
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

module.exports = {
  create,
  list,
  detail,
  remove,
  update,
};
