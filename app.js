const { DB_NAME } = require("./config/databaseConfig");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const { createDBCon } = require("./config/config");
var swaggerJSDoc = require("swagger-jsdoc");

var app = express();

// swagger definition
var swaggerDefinition = {
  info: {
    title: "Node Swagger API",
    version: "1.0.0",
    description: "Demonstrating how to describe a RESTful API with Swagger"
  },
  host: "https://fifokart-node-api.herokuapp.com",
  basePath: "/"
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ["./controllers/*.js"]
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

app.get("/swagger.json", function(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// view engine setup
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// createDBCon.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   createDBCon.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`, function(
//       err,
//       result
//   ) {
//     if (err) throw err;
//     setCurrentDB(function(data) {
//       let queries = fs
//           .readFileSync(path.join(__dirname, "school.sql"), {
//             encoding: "UTF-8"
//           })
//           .split(";\n");
//       for (let query of queries) {
//         query = query.trim();
//         if (query.length !== 0 && !query.match(/\/\*/)) {
//           createDBCon.query(query, function(err, sets, fields) {
//             if (err) {
//               console.log(
//                   `Importing failed for Mysql Database  - Query:${query}`
//               );
//             } else {
//               console.log(`Importing Mysql Database  - Query:${query}`);
//             }
//           });
//         }
//       }
//     });
//   });
// });
// function setCurrentDB(callback) {
//   createDBCon.query(`USE swiftsschool`, function(err, rows) {
//     if (err) {
//       if (err.errno == 1049) {
//         console.log(`${err.sqlMessage} : Failed to connect MySql database`);
//         return callback("refused");
//       } else {
//         console.log(`Mysql Database connection error`);
//         return callback("refused");
//       }
//     } else {
//       return callback("connected");
//     }
//   });
// }

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
