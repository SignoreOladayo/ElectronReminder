
const Sequelize = require('sequelize')
const path = require('path')

const dbCon = new Sequelize('sqlite:"\\hqserver002\DATABASES\Databases\database.sqlite"')


module.exports = dbCon;