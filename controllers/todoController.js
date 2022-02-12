const Sequelize = require('sequelize');
const { Todo } = require('../models/index');

const { Op } = Sequelize;

const list = (req, res) => {
  const limit = req.query.limit || 1000;
  const offset = req.query.offset || 0;
  Todo.findAndCountAll({
    where: {
      activity_group_id: req.query.activity_group_id || { [Op.not]: null },
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
  Todo.create({
    activity_group_id: req.body.activity_group_id,
    title: req.body.title,
  })
    .then((todo) => res.status(200).json(todo))
    .catch((err) => res.status(400).json(err));
};

const detail = async (req, res) => {
  const todo = await Todo.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ['id', 'title', 'is_active', 'priority'],
  });
  if (!todo) {
    return res.status(404).json({
      name: 'NotFound',
      message: `No record found for id '${req.params.id}'`,
      code: 404,
      className: 'not-found',
      errors: {},
    });
  }
  return res.status(200).json(todo);
};

const remove = async (req, res) => {
  let { id } = req.params;
  if (req.query.id) {
    const queryId = req.query.id;
    id = queryId.split(',');
  }
  try {
    const todo = await Todo.destroy({
      where: {
        id,
      },
    });
    if (!todo) {
      return res.status(404).json({
        name: 'NotFound',
        message: `No record found for id '${id}'`,
        code: 404,
        className: 'not-found',
        errors: {},
      });
    }
    return res.status(200).json({
      todo,
    });
  } catch (err) {
    return res.status(400).json({
      name: 'InternalServerError',
      message: err.message,
      code: 500,
      className: 'internal-server-error',
      errors: {},
    });
  }
};

const update = async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  if (!todo) {
    return res.status(404).json({
      name: 'NotFound',
      message: `No record found for id '${req.params.id}'`,
      code: 404,
      className: 'not-found',
      errors: {},
    });
  }
  try {
    const updateTodo = await todo.update({
      title: req.body.title,
      is_active: req.body.is_active,
      priority: req.body.priority,
    });
    return res.status(200).json(updateTodo);
  } catch (err) {
    return res.status(400).json({
      name: 'GeneralError',
      message: err.message,
      code: 500,
      className: 'general-error',
      errors: {},
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
