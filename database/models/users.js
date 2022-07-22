'use strict';
const { saltRounds } = require('../../config/keys');
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    role_id: {
      type: DataTypes.TINYINT,
      defaultValue: null,
      comment: "1 = Admin, 2= Broker, 3= Broker User, 4 = Customer"
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(70),
      allowNull: true,
      defaultValue: null
    },
    address: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    zip_code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    district: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    city_state: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "1 = Pending, 2 = Active, 3 = Inactive, 4 = Rejected"
    },
    is_deleted: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    },
    deleted_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    last_login: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    }

  }, {
    paranoid: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user && user.contact_email) {
          user.contact_email = user.contact_email.toLowerCase()
        }
        if (user && user.password) {
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
      beforeBulkUpdate: async (user) => {
        if (user && user.attributes && user.attributes.password) {
          user.attributes.password = await bcrypt.hash(user.attributes.password, saltRounds);
        }
        if (user && user.attributes && user.attributes.contact_email) {
          user.attributes.contact_email = user.attributes.contact_email.toLowerCase();
        }
      },
      afterDestroy: async (user) => {
        user.is_deleted = 1
        await user.save()
      }
    }
  });
  users.associate = function (models) {
    users.hasMany(models.user_documents,{as:"documents", foreignKey:'user_id'});
  };
  return users;
};
