const { pool } = require("../config/config");

function addOrder(body, userId, vendorId) {
  return new Promise(async function(resolve, reject) {
    if (await createRegularTable()) {
      const orderTime = new Date().getTime();
      const { orderType, orderStatus, orderDetails, address } = body;
      let query = `INSERT INTO orders (order_type, vendor_id, user_id, order_status, order_time, order_details, address) values ('${orderType}', '${vendorId}', '${userId}','${orderStatus}','${orderTime}','${JSON.stringify(
        orderDetails
      )}','${JSON.stringify(address)}')`;
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
            clearCart(userId);
            resolve({
              statusCode: 201,
              response: {
                success: 1,
                message: `order placed successfully`,
                orderId: result.insertId
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

function getOrders(id, type) {
  return new Promise(function(resolve, reject) {
    try {
      console.log(`select * from orders where ${type + "_id"}=${id} `);
      pool.query(
        `select * from orders where ${type + "_id"}=${id} `,
        (error, result) => {
          if (error) {
            throw error;
          } else {
            if (result.length > 0) {
              for (let item of result) {
                item.order_details = JSON.parse(item.order_details);
                item.address = JSON.parse(item.address);
              }
              resolve({
                statusCode: 200,
                response: { success: 1, data: result }
              });
            } else {
              resolve({
                statusCode: 404,
                response: {
                  success: 0,
                  message: "Order not added"
                }
              });
            }
          }
        }
      );
    } catch (e) {
      resolve({
        statusCode: 503,
        response: { success: 0, message: `Internal Server Error` }
      });
    }
  });
}

function clearCart(userId) {
  return new Promise(async function(resolve, reject) {
    pool.query(`DELETE from cart where user_id=${userId}`, (error, result) => {
      if (error) {
        throw error;
      } else {
        resolve({
          statusCode: 200,
          response: {
            success: 1,
            message: "Cart Cleared"
          }
        });
      }
    });
  });
}

function changeStatus(status, orderId) {
  return new Promise(async function(resolve, reject) {
    if (await createScheduledTable()) {
      pool.query(
        `UPDATE orders SET order_status='${status}' WHERE order_id=${orderId}`,
        (error, result) => {
          if (error) {
            console.log("update status error", error);
            resolve({
              statusCode: 503,
              response: {
                success: 0,
                message: `Internal Server Error: ${error}`
              }
            });
          } else {
            console.log("update status success ", result);
            if (result.affectedRows > 0) {
              if (result.changedRows > 0) {
                resolve({
                  statusCode: 200,
                  response: {
                    success: 1,
                    message: "Order status changes successfully",
                    data: result[0]
                  }
                });
              } else {
                resolve({
                  statusCode: 200,
                  response: {
                    success: 1,
                    message: "Order status same as previous one",
                    data: result[0]
                  }
                });
              }
            } else {
              resolve({
                statusCode: 404,
                response: { success: 1, message: "Order not found" }
              });
            }
          }
        }
      );
    } else {
      resolve({
        statusCode: 503,
        response: { success: 0, message: `Internal Server Error` }
      });
    }
  });
}

function deliverScheduleOrder(orderId) {
  return new Promise(async function(resolve, reject) {
    let date = new Date();
    let month_year = date.getMonth() + "_" + date.getFullYear();
    let query = "";
    let order = await getOrderByOrderIdAndMonthYear(orderId);
    let deliveryDetails = [`${date.getDate()}.${date.getTime()}`];
    if (order) {
      for (let item of JSON.parse(order.delivery_details)) {
        if (parseInt(item.toString().split(".")[0]) === date.getDate()) {
          resolve({
            statusCode: 400,
            response: {
              success: 0,
              message: `Item already deliver for the date ${date.getTime()}`
            }
          });
        }
      }
      let existingDeliveryDetails = JSON.parse(order.delivery_details);
      deliveryDetails = existingDeliveryDetails.concat(deliveryDetails);
      query = `UPDATE schedule_orders SET delivery_details='${JSON.stringify(
        deliveryDetails
      )}' WHERE order_id=${orderId}`;
    } else {
      query = `INSERT INTO schedule_orders (order_id, month_year, delivery_details) values (${orderId}, '${month_year}', '${JSON.stringify(
        deliveryDetails
      )}')`;
      console.log(query);
    }
    try {
      pool.query(query, (error, result) => {
        if (error) {
          console.log("add schedule order error ", error);
          resolve({
            statusCode: 503,
            response: { success: 0, message: `Internal Server Error: ${error}` }
          });
        } else {
          console.log("add schedule order success ", result);
          if (result.affectedRows > 0) {
            resolve({
              statusCode: 200,
              response: {
                success: 1,
                message: `Order delivered successfully for ${month_year}`,
                data: result[0]
              }
            });
          } else {
            resolve({
              statusCode: 200,
              response: {
                success: 1,
                message: "Order status same as previous one",
                data: result[0]
              }
            });
          }
        }
      });
    } catch (e) {
      resolve({
        statusCode: 503,
        response: { success: 0, message: `Internal Server Error: ${e}` }
      });
    }
  });
}

function getOrderByOrderIdAndMonthYear(orderId) {
  return new Promise(function(resolve, reject) {
    let date = new Date();
    let month_year = date.getMonth() + "_" + date.getFullYear();
    console.log(month_year, orderId);
    pool.query(
      `SELECT * FROM schedule_orders WHERE order_id=${orderId} AND month_year='${month_year}'`,
      (error, result) => {
        if (error) {
          console.log("get order for order id and month year error", error);
          resolve(false);
        } else {
          console.log("get order for order id and month year success", result);
          if (result.length > 0) {
            resolve(result[0]);
          } else {
            resolve(false);
          }
        }
      }
    );
  });
}

function createRegularTable() {
  return new Promise(function(resolve, reject) {
    pool.query(
      `CREATE TABLE IF NOT EXISTS orders (order_id int AUTO_INCREMENT, order_type varchar(16), vendor_id int, user_id int, order_status varchar(16), order_time varchar(16), accepted_time varchar(16) NULL, address text, delivered_time varchar(16) NULL, order_details text, PRIMARY KEY (order_id))`,
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

function createScheduledTable() {
  return new Promise(function(resolve, reject) {
    pool.query(
      `CREATE TABLE IF NOT EXISTS schedule_orders (order_id int, month_year varchar(16), delivery_details text, PRIMARY KEY (order_id))`,
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

module.exports = { addOrder, getOrders, changeStatus, deliverScheduleOrder };
