const { pool } = require('../config/config');
var md5 = require('md5');

function getCart(userId) {
  return new Promise(function(resolve, reject) {
    pool.query(
      `select * from cart where user_id=${userId} `,
      (error, result) => {
        if (error) {
          if (error.errno === 1146) {
            resolve({
              statusCode: 404,
              response: {
                success: 0,
                message: 'Cart is empty',
              },
            });
          } else throw error;
        } else {
          if (result.length > 0) {
            result[0].cart_details = JSON.parse(result[0].cart_details);
            resolve({
              statusCode: 200,
              response: { success: 1, data: result[0] },
            });
          } else {
            resolve({
              statusCode: 404,
              response: {
                success: 0,
                message: 'Cart is empty',
              },
            });
          }
        }
      },
    );
  });
}

function addProductInCart(body, userId) {
  return new Promise(async function(resolve, reject) {
    if (await createTable()) {
      let query = '';
      if (await checkUserInCart(userId)) {
        query = `UPDATE cart SET cart_details='${JSON.stringify(
          body,
        )}' where user_id=${userId}`;
      } else {
        query = `INSERT INTO cart (user_id, cart_details) values ('${userId}', '${JSON.stringify(
          body,
        )}')`;
      }
      pool.query(query, (error, result) => {
        if (error) {
          resolve({
            statusCode: 503,
            response: {
              success: 0,
              message: `Internal Server Error: ${error}`,
            },
          });
        } else {
          if (result.affectedRows > 0) {
            delete body.password;
            resolve({
              statusCode: 201,
              response: {
                success: 1,
                message: `product added to the cart`,
                context: body,
              },
            });
          } else {
            resolve({
              statusCode: 503,
              response: { success: 0, message: `Internal Server Error` },
            });
          }
        }
      });
    } else {
      resolve({
        statusCode: 503,
        response: { success: 0, message: `Internal Server Error` },
      });
    }
  });
}

function checkUserInCart(userId) {
  return new Promise(function(resolve, reject) {
    pool.query(
      `SELECT * FROM cart WHERE user_id=${userId}`,
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
      },
    );
  });
}

function createTable() {
  return new Promise(function(resolve, reject) {
    pool.query(
      `CREATE TABLE IF NOT EXISTS cart (cart_id int AUTO_INCREMENT, user_id int, cart_details text, PRIMARY KEY (cart_id))`,
      (error, result) => {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
        }
      },
    );
  });
}

module.exports = { getCart, addProductInCart };
