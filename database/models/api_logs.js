'use strict';
module.exports = (sequelize, DataTypes) => {
    const api_logs = sequelize.define('api_logs', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        request_id: {
            type: DataTypes.INTEGER,
            defaultValue: null,
            allowNull: true,
        },
        request: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        ip_address:{
            type: DataTypes.STRING(30),
            defaultValue:null,
            allowNull: true,
        },
        response: {
            type: DataTypes.TEXT,
            defaultValue: null,
            allowNull: true,
        },
        message:{
            type: DataTypes.TEXT,
            defaultValue: null,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('current_timestamp'),
            allowNull: false
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('current_timestamp'),
            allowNull: false
        }
    }, {});
    api_logs.associate = function (models) {
        // associations can be defined here
    };
    return api_logs;
};