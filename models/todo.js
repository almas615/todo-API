const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Activity, {
        foreignKey: 'activity_group_id',
        key: 'id',
        as: 'activity',
      });
    }
  }
  Todo.init({
    title: DataTypes.STRING,
    activity_group_id: DataTypes.INTEGER,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    priority: {
      type: DataTypes.ENUM('very-high', 'high', 'normal', 'low', 'very-low'),
      defaultValue: 'very-high',
    },
  }, {
    sequelize,
    modelName: 'Todo',
    tableName: 'todos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Todo;
};
