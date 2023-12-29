const mysql = require('mysql')

//database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ruleapp",
  });
  db.connect((err) => {
    if (err) {
      console.log("Database connection failed !!");
    } else {
      console.log("Database connection success !!");
    }
  });

  module.exports = db;

