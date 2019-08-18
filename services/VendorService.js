const {pool} = require("../config/config");
var md5 = require('md5');

function getVendors() {
    return new Promise(function (resolve, reject) {
            pool.query(`select * from vendors `, (error, result) => {
                if (error) {
                    if (error.errno === 1146) {
                        resolve({
                            statusCode: 404,
                            response: {
                                success: 0,
                                message: "Vendor not found"
                            }
                        })
                    } else
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
                                message: "Vendor not found"
                            }
                        })
                    }
                }
            });
        }
    )
}

function addVendor(body) {
    return new Promise(async function (resolve, reject) {
        const {vendorName, ownerName, phone, emailId, address, password} = body;
        if (await createTable()) {
            if (!(await checkActiveUser(phone))) {
                pool.query(`INSERT INTO vendors (vendor_name, owner_name, phone, email_id, address, password, status) values ('${vendorName}', '${ownerName}', '${phone}', '${emailId}','${address}', '${md5(password)}','ACTIVE')`, (error, result) => {
                    if (error) {
                        throw error;
                    } else {
                        if (result.affectedRows > 0) {
                            delete body.password;
                            resolve({
                                statusCode: 201,
                                response: {success: 1, message: `vendor added successfully`, context: body}
                            })
                        } else {
                            resolve({
                                statusCode: 503,
                                response: {success: 0, message: `Internal Server Error`}
                            })
                        }
                    }
                })
            } else {
                resolve({
                    statusCode: 409,
                    response: {success: 0, message: `vendor phone number: ${phone} is already registered`}
                })
            }
        } else {
            resolve({
                statusCode: 503,
                response: {success: 0, message: `Internal Server Error`}
            })
        }
    })

}

function login(body) {
    const {phone, password} = body;
    return new Promise(function (resolve, reject) {
            pool.query(`select * from vendors where phone='${phone}' AND password='${md5(password)}' AND status='ACTIVE'`, (error, result) => {
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

function changeStatus(body, vendorId) {
    const {status} = body;
    return new Promise(async function (resolve, reject) {
            if (!(await checkActiveUserById(vendorId))) {
                pool.query(`UPDATE vendors SET status='${status}' WHERE vendor_id=${vendorId}`, (error, result) => {
                    if (error) {
                        console.log("update status error", error);
                        resolve({
                            statusCode: 503,
                            response: {success: 0, message: `Internal Server Error: ${error}`}
                        })
                    } else {
                        if (result.affectedRows > 0) {
                            resolve({
                                statusCode: 200,
                                response: {success: 1, message: "Vendor status changes successfully", data: result[0]}
                            })
                        } else {
                            resolve({
                                statusCode: 200,
                                response: {success: 1, message: "Vendor status same as previous one", data: result[0]}
                            })
                        }
                    }
                });
            } else {
                resolve({
                    statusCode: 404,
                    response: {
                        success: 0,
                        message: "vendor id not found"
                    }
                })
            }

        }
    )
}

function checkActiveUserById(vendorId) {
    return new Promise(function (resolve, reject) {
        console.log("vendor id found: " + vendorId)
        pool.query(`select * from vendors where vendor_id='${vendorId}' AND status=ACTIVE`, (error, result) => {
            if (error) {
                resolve(false)
            } else {
                if (result.length > 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }
        })
    })
}

function checkActiveUser(phone) {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT * FROM vendors WHERE phone=${phone} AND status='ACTIVE'`, (error, result) => {
            if (error) {
                resolve(false)
            } else {
                if (result.length > 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }
        })
    })
}

function createTable() {
    return new Promise(function (resolve, reject) {
        pool.query(`CREATE TABLE IF NOT EXISTS vendors (vendor_id int AUTO_INCREMENT, vendor_name varchar(128), owner_name varchar(64), phone varchar(16), email_id varchar(64), address varchar(256), password varchar(64), status varchar(16), PRIMARY KEY (vendor_id))`, (error, result) => {
            if (error) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}

module.exports = {getVendors, addVendor, login, changeStatus};