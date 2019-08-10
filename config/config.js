const mysql = require("mysql");
const { DB_NAME } = require("./databaseConfig")

const createDBCon = mysql.createConnection({
    host: "148.66.138.139",
    user: "fifokart",
    password: "Fifokart@123"
});

const config = {
    host: "148.66.138.139",
    user: "fifokart",
    password: "Fifokart@123"
    database: DB_NAME
};

const pool = mysql.createPool(config);

module.exports = {pool, createDBCon, config};
