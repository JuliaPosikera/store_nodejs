const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "shop",
  password: "rootuser",
});

module.exports = pool.promise();
