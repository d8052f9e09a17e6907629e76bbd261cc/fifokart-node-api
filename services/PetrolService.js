const { pool } = require("../config/config");
var md5 = require("md5");

function getList(deviceId) {
  return new Promise(function(resolve, reject) {
    console.log("deviceId", deviceId);
    pool.query(
      `select * from petrol where device_id=${deviceId} `,
      (error, result) => {
        if (error) {
          if (error.errno === 1146) {
            resolve({
              statusCode: 404,
              response: {
                success: 0,
                message: "List is empty"
              }
            });
          } else throw error;
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
                message: "List is empty"
              }
            });
          }
        }
      }
    );
  });
}

function addPetrolInList(body, deviceId) {
  return new Promise(async function(resolve, reject) {
    if (await createTable()) {
      const { quantity, price, distance } = body;
      let query = `INSERT INTO petrol (device_id, date, quantity, price, distance) values ('${deviceId}', '${new Date().getTime()}', '${quantity}', '${price}', '${distance}')`;
      pool.query(query, (error, result) => {
        console.log("result", result);
        console.log("query", query);
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
                message: `details added to the list`,
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

function editPetrolInList(body, uniqueId) {
  return new Promise(async function(resolve, reject) {
    const { quantity, price, distance } = body;
    let query = `UPDATE petrol SET quantity='${quantity}', price='${price}', distance='${distance}' where unique_id=${uniqueId}`;
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
          delete body.password;
          resolve({
            statusCode: 201,
            response: {
              success: 1,
              message: `details updated to the list`,
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
  });
}

function checkDeviceInPetrol(unique_id) {
  return new Promise(function(resolve, reject) {
    pool.query(
      `SELECT * FROM petrol WHERE unique_id=${unique_id}`,
      (error, result) => {
        if (error) {
          resolve(false);
        } else {
          if (result.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      }
    );
  });
}

function createTable() {
  return new Promise(function(resolve, reject) {
    pool.query(
      `CREATE TABLE IF NOT EXISTS petrol (unique_id int AUTO_INCREMENT, device_id int, date text, quantity text, price text, distance int, PRIMARY KEY (unique_id))`,
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

module.exports = { getList, addPetrolInList, editPetrolInList };
