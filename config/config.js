const mysql = require("mysql");
const { DB_NAME } = require("./databaseConfig")

const createDBCon = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password"
});

const config = {
    host: "localhost",
    user: "root",
    password: "password",
    database: DB_NAME
};

const pool = mysql.createPool(config);

module.exports = {pool, createDBCon, config};
