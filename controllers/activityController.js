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
        total: activities.count,
        limit,
        skip: offset,
        data: activities.rows,
      });
    });
};

const create = (req, res) => {
  Activity.create({
    title: req.body.title,
    email: req.body.email,
  })
    .then((a) => res.status(200).json(a))
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
      name: 'NotFound',
      message: `No record found for id '${req.params.id}'`,
      code: 404,
      className: 'not-found',
      errors: {},
    });
  }
  return res.status(200).json(activity);
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
      returning: true,
    });
    if (!activity) {
      return res.status(404).json({
        name: 'NotFound',
        message: `No record found for id '${id}'`,
        code: 404,
        className: 'not-found',
        errors: {},
      });
    }
    return res.status(200).json({
      activity,
    });
  } catch (err) {
    return res.status(500).json({
      name: 'InternalServerError',
      message: err.message,
      code: 500,
      className: 'internal-server-error',
      errors: {},
    });
  }
};

const update = async (req, res) => {
  const activity = await Activity.findByPk(req.params.id);
  if (!activity) {
    return res.status(404).json({
      name: 'NotFound',
      message: `No record found for id '${req.params.id}'`,
      code: 404,
      className: 'not-found',
      errors: {},
    });
  }
  try {
    const updatedActivity = await activity.update({
      title: req.body.title,
    });
    return res.status(200).json(updatedActivity);
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
