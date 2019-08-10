const {pool} = require("../config/config");
var md5 = require('md5');

function getUsers() {
    return new Promise(function (resolve, reject) {
            pool.query(`select * from users `, (error, result) => {
                if (error) {
                    throw error;
                } else {
                    if (result.length > 0) {
                        resolve({
                            statusCode: 200,
                            response: {success: 1, data: result}
                        })
                    } else {
                        resolve({
                            statusCode: 404,
                            response: {
                                success: 0,
                                message: "User not found"
                            }
                        })
                    }
                }
            });
        }
    )
}

function addUser(body) {
    return new Promise(function (resolve, reject) {
        const {name, emailId, phone, password} = body;
        pool.query(`INSERT INTO users (name, email_id, phone, password) values ('${name}', '${emailId}', '${phone}', '${md5(password)}')`, (error, result) => {
            if (error) {
                if (error.errno === 1062) {
                    resolve({
                        statusCode: 409,
                        response: {success: 0, message: `phone number: ${phone} is already registered`}
                    })
                } else throw error;
            } else {
                if (result.affectedRows > 0) {
                    delete body.password;
                    resolve({
                        statusCode: 201,
                        response: {success: 1, message: `User registered successfully`, context: body}
                    })
                } else {
                    resolve({
                        statusCode: 503,
                        response: {success: 0, message: `Internal Server Error`}
                    })
                }
            }
        })
    })
}

function login(body) {
    const {phone, password} = body;
    return new Promise(function (resolve, reject) {
            pool.query(`select * from users where phone='${phone}' AND password='${md5(password)}'`, (error, result) => {
                if (error) {
                    throw error;
                } else {
                    if (result.length > 0) {
                        delete result[0].password;
                        resolve({
                            statusCode: 200,
                            response: {success: 1, message: "Login Successfull", data: result[0]}
                        })
                    } else {
                        resolve({
                            statusCode: 401,
                            response: {
                                success: 0,
                                message: "Invalid Credential"
                            }
                        })
                    }
                }
            });
        }
    )
}

module.exports = {getUsers, addUser, login};