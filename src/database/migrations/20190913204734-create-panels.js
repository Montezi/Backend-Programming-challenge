module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('panels', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      data_provider: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      installation_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      system_size: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      zip_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cost: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('panels');
  },
};
