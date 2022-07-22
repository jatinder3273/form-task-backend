'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      role_id: {
        type: Sequelize.TINYINT,
        defaultValue: null,
        comment: "1 = Admin, 2= Customer"
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      password: {
        type: Sequelize.STRING(70),
        allowNull: true,
        defaultValue: null
      },
      address: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      zip_code: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      district: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      city: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: true
      },
      is_deleted: {
        type: Sequelize.TINYINT,
        allowNull: true,
        defaultValue: 0
      },
      deleted_at: {
        type: Sequelize.DATE(6),
        allowNull: true
      },
      last_login: {
        type: Sequelize.DATE(6),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};