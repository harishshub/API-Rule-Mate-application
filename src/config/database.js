const mysql = require('mysql')

//database connection
const db = mysql.createConnection({
    // host: "localhost",
    // user: "root",
    // password: "",
    // database: "ruleapp",
    host:"sql12.freemysqlhosting.net",
    user:"sql12674396",
    password:"Ltei6wHHhV",
    database:"sql12674396"
  });
  db.connect((err) => {
    if (err) {
      console.log("Database connection failed !!");
    } else {
      console.log("Database connection success !!");
    }
  });

  module.exports = db;

