"use strict";
module.exports = (sequelize, DataTypes) => {
  const tasks = sequelize.define(
    "tasks",
    {
      is_deleted: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      client: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      project: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      task: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: true,
        comment: "1 = Pending, 2 = Active, 3 = Inactive, 4 = Rejected",
      },
      assignee: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      is_send_email: {
        type: DataTypes.TINYINT,
        allowNull: true,
        comment: "1 = Yes, 0 = No",
        defaultValue: 0,
      },
      project_date_filter: {
        type: DataTypes.TINYINT,
        allowNull: true,
        comment: "1 = Yes, 0 = No",
        defaultValue: 0,
      },
      task_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      priority: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        defaultValue: null,
        allowNull: true,
      },
      email_notes: {
        type: DataTypes.TEXT,
        defaultValue: null,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {}
  );
  tasks.associate = function (models) {
    // associations can be defined here
  };
  return tasks;
};
