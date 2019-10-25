const { pool } = require("../config/config");
var md5 = require("md5");

function getUsers() {
  return new Promise(function(resolve, reject) {
    pool.query(`select * from users `, (error, result) => {
      if (error) {
        throw error;
      } else {
        if (result.length > 0) {
          resolve({
            statusCode: 200,
            response: { success: 1, data: result }
          });
        } else {
          resolve({
            statusCode: 404,
            response: {
              success: 0,
              message: "User not found"
            }
          });
        }
      }
    });
  });
}

function addUser(body) {
  return new Promise(function(resolve, reject) {
    const { name, emailId, phone, password } = body;
    pool.query(
      `INSERT INTO users (name, email_id, phone, password) values ('${name}', '${emailId}', '${phone}', '${md5(
        password
      )}')`,
      (error, result) => {
        if (error) {
          if (error.errno === 1062) {
            resolve({
              statusCode: 409,
              response: {
                success: 0,
                message: `phone number: ${phone} is already registered`
              }
            });
          } else throw error;
        } else {
          if (result.affectedRows > 0) {
            delete body.password;
            resolve({
              statusCode: 201,
              response: {
                success: 1,
                message: `User registered successfully`,
                context: body
              }
            });
          } else {
            resolve({
              statusCode: 503,
              response: { success: 0, message: `Internal Server Error` }
            });
          }
        }
      }
    );
  });
}

function login(body) {
  const { phone, password } = body;
  return new Promise(function(resolve, reject) {
    pool.query(
      `select * from users where phone='${phone}' AND password='${md5(
        password
      )}'`,
      (error, result) => {
        if (error) {
          throw error;
        } else {
          if (result.length > 0) {
            delete result[0].password;
            resolve({
              statusCode: 200,
              response: {
                success: 1,
                message: "Login Successfull",
                data: result[0]
              }
            });
          } else {
            resolve({
              statusCode: 401,
              response: {
                success: 0,
                message: "Invalid Credential"
              }
            });
          }
        }
      }
    );
  });
}

function addAddress(body, userId) {
  return new Promise(async function(resolve, reject) {
    if (await createAddressTable()) {
      let query = `INSERT INTO address (user_id, address) values ('${userId}', '${JSON.stringify(
        body
      )}')`;
      pool.query(query, (error, result) => {
        if (error) {
          resolve({
            statusCode: 503,
            response: {
              success: 0,
              message: `Internal Server Error: ${error}`
            }
          });
        } else {
          if (result.affectedRows > 0) {
            resolve({
              statusCode: 201,
              response: {
                success: 1,
                message: `address added to your account`,
                context: body
              }
            });
          } else {
            resolve({
              statusCode: 503,
              response: { success: 0, message: `Internal Server Error` }
            });
          }
        }
      });
    } else {
      resolve({
        statusCode: 503,
        response: { success: 0, message: `Internal Server Error` }
      });
    }
  });
}

function getAddress(userId) {
  return new Promise(function(resolve, reject) {
    pool.query(
      `select * from address where user_id=${userId}`,
      (error, result) => {
        if (error) {
          if (error.errno === 1146) {
            resolve({
              statusCode: 404,
              response: {
                success: 0,
                message: "address not added"
              }
            });
          } else throw error;
        } else {
          if (result.length > 0) {
            let addresses = [];
            for (let add of result) {
              addresses.push(JSON.parse(add.address));
            }
            resolve({
              statusCode: 200,
              response: { success: 1, data: addresses }
            });
          } else {
            resolve({
              statusCode: 404,
              response: {
                success: 0,
                message: "address not added"
              }
            });
          }
        }
      }
    );
  });
}

function deleteAddress(addressId) {
  return new Promise(function(resolve, reject) {
    pool.query(
      `delete from address where address_id=${addressId}`,
      (error, result) => {
        if (error) {
          if (error.errno === 1146) {
            resolve({
              statusCode: 404,
              response: {
                success: 0,
                message: "address id not found"
              }
            });
          } else throw error;
        } else {
          console.log(result);
          if (result.affectedRows > 0) {
            resolve({
              statusCode: 200,
              response: { success: 1, message: "address deleted successfully" }
            });
          } else {
            resolve({
              statusCode: 404,
              response: {
                success: 0,
                message: "address not found"
              }
            });
          }
        }
      }
    );
  });
}

function createAddressTable() {
  return new Promise(function(resolve, reject) {
    pool.query(
      `CREATE TABLE IF NOT EXISTS address (address_id int AUTO_INCREMENT, user_id int, address text, PRIMARY KEY (address_id))`,
      (error, result) => {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
}

module.exports = {
  getUsers,
  addUser,
  login,
  addAddress,
  getAddress,
  deleteAddress
};
