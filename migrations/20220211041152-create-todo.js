module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('todos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      activity_group_id: {
        type: Sequelize.INTEGER,
        reference: {
          model: 'activities',
          key: 'id',
        },
      },
      is_active: {
        type: Sequelize.BOOLEAN,
      },
      priority: {
        type: Sequelize.ENUM,
        values: ['very-high', 'high', 'normal', 'low', 'very-low'],
        defaultValue: 'very-high',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('todos');
  },
};
