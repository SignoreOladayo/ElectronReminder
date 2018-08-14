
const Sequelize = require('sequelize')
const path = require('path')

// const dbCon = new Sequelize('sqlite:database/database.sqlite')

const dbCon = new Sequelize('planning', 'sysadm', 'password', {
    dialect: 'mysql',
    host: "192.168.0.64",
    port: 3360,
  })

module.exports = dbCon;