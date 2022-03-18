const mysql = require('mysql2');
const dbConnection = mysql.createPool({
  host:"localhost",
  user: "root",
  password: "root",
  database: "api-nodejs-login",
  port:"3307"
}).promise()

module.exports = dbConnection;