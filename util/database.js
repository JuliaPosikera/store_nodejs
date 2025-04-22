// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "shop",
//   password: "rootuser",
// });

// module.exports = pool.promise();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('shop', 'root', 'rootuser', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
