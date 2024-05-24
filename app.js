// app.js
const express = require("express");
const session = require("express-session");
const app = express();
const mysql = require("mysql2");
const path = require("path");
const mainRouter = require("./routes/index.js");
const bodyParser = require("body-parser");

// Database connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "test",
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to database");
// });

// global.db = db;

app.use(
  session({
    secret: "yoursecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Note: the `secure` option should be set to true in a production environment.
  })
);

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use('/public/', express.static('./public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/", mainRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
