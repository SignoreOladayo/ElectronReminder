
const Sequelize = require('sequelize')
const path = require('path')

const dbCon = new Sequelize('sqlite:database/database.sqlite')


module.exports = dbCon;