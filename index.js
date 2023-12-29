const express = require("express");
const bodyParser = require("body-parser");
const compression = require("./src/Middleware/compression"); 
const helmet = require("./src/Middleware/helmet"); 
const config = require("./src/config");
const routes = require("./src/routes");
const db = require("./src/config/database");
const cors = require('cors')

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());
app.use(cors());

// Routes
app.use(routes);

// Database Connection
db.connect((err) => {
  if (err) {
    console.log("Database connection failed !!");
  } else {
    console.log("Database connection success !!");
  }
});

// Server Listening
app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`);
});
