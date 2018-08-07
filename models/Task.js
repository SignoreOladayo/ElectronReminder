const Sequelize = require('sequelize')
const dbCon = require('./../database/db');

const Task = dbCon.define('task', {
    id:{
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
    },
    title: Sequelize.TEXT,
    description: Sequelize.TEXT,
    dueDate: Sequelize.DATE,
    status: Sequelize.INTEGER,
    completionDate: {
        type: Sequelize.DATE,
        allowNull: true
    },
    reminderDate: {
        type: Sequelize.DATE,
        allowNull: true
    },
    reminderInterval: {
        type: Sequelize.INTEGER
    }
},
{
    tableName:'tasks'
})


Task.sync();

module.exports = Task