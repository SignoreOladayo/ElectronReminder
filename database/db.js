
const Sequelize = require('sequelize')
const dbCon = new Sequelize({dialect: 'sqlite', storage: '/todo/database/database.sqlite'});



module.exports = dbCon;