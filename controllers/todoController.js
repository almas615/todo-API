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
        status: 'Success',
        data: activities.rows,
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
  if (!req.body.activity_group_id) {
    res.status(400).json({
      status: 'Bad Request',
      message: 'activity_group_id cannot be null',
    });
    return;
  }
  Todo.create({
    activity_group_id: req.body.activity_group_id,
    title: req.body.title,
  })
    .then((todo) => res.status(201).json({
      status: 'Success',
      data: {
        title: todo.title,
        activity_group_id: todo.activity_group_id,
      },
    }))
    .catch((err) => res.status(404).json(err));
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
      status: 'Not Found',
      message: `Todo with ID ${req.params.id} Not Found`,
    });
  }
  return res.status(200).json({
    status: 'Success',
    data: {
      title: todo.title,
      priority: todo.priority,
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
    const todo = await Todo.destroy({
      where: {
        id,
      },
    });
    if (!todo) {
      return res.status(404).json({
        status: 'Not Found',
        message: `Todo with ID ${req.params.id} Not Found`,
      });
    }
    return res.status(200).json({
      status: 'Success',
      data: {
      },
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
      status: 'Not Found',
      message: `Todo with ID ${req.params.id} Not Found`,
    });
  }
  try {
    const updateTodo = await todo.update({
      title: req.body.title,
      is_active: req.body.is_active,
      priority: req.body.priority,
    });
    return res.status(200).json({
      status: 'Success',
      data: {
        title: updateTodo.title,
        is_active: updateTodo.is_active,
        priority: updateTodo.priority,
      },
    });
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
