const { pool } = require("../config/config");
var md5 = require("md5");

function addData(body, id) {
  return new Promise(async function(resolve, reject) {
    if (await createTable()) {
      let query = `INSERT INTO new_year (id, details) values ('${id}', '${JSON.stringify(
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
            delete body.password;
            resolve({
              statusCode: 201,
              response: {
                success: 1,
                message: `details added`,
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

function createTable() {
  return new Promise(function(resolve, reject) {
    pool.query(
      `CREATE TABLE IF NOT EXISTS new_year (id text, details text)`,
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

module.exports = { addData };
