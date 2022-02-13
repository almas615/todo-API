/* eslint-disable camelcase */
const { Todo } = require('../models/index');

const list = async (req, res) => {
  const clause = {};
  if (req.query.activity_group_id) {
    clause.activity_group_id = req.query.activity_group_id;
  }
  const todo = await Todo.findAll({
    where: clause,
  });
  if (todo) {
    res.json({
      status: 'Success',
      message: 'Success',
      data: todo,
    });
  }
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
  Todo.create(req.body)
    .then((todo) => res.status(201).json({
      status: 'Success',
      message: 'Success',
      data: todo,
    }))
    .catch((err) => res.status(404).json(err));
};

const detail = async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  if (!todo) {
    return res.status(404).json({
      status: 'Not Found',
      message: `Todo with ID ${req.params.id} Not Found`,
    });
  }
  return res.status(200).json({
    status: 'Success',
    message: 'Success',
    data: todo,
  });
};

const remove = async (req, res) => {
  try {
    const todo = await Todo.destroy({
      where: {
        id: req.params.id,
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
      message: 'Success',
      data: {
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

const update = async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  if (!todo) {
    return res.status(404).json({
      status: 'Not Found',
      message: `Todo with ID ${req.params.id} Not Found`,
      data: {},
    });
  }
  try {
    const updateTodo = await todo.update(req.body);
    return res.status(200).json({
      status: 'Success',
      message: 'Success',
      data: updateTodo,
    });
  } catch (err) {
    return res.status(500).json({
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
