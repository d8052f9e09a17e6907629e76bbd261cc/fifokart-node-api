const { pool } = require('../config/config');
var md5 = require('md5');

function getProducts(vendorId) {
  return new Promise(function(resolve, reject) {
    pool.query(
      `select * from products where vendor_id=${vendorId}`,
      (error, result) => {
        if (error) {
          if (error.errno === 1146) {
            resolve({
              statusCode: 404,
              response: {
                success: 0,
                message: 'Product not found',
              },
            });
          } else throw error;
        } else {
          if (result.length > 0) {
            resolve({
              statusCode: 200,
              response: { success: 1, data: result },
            });
          } else {
            resolve({
              statusCode: 404,
              response: {
                success: 0,
                message: 'Product not found',
              },
            });
          }
        }
      },
    );
  });
}

function addProduct(body, vendorId) {
  return new Promise(async function(resolve, reject) {
    const {
      productName,
      vendorId,
      shortDescription,
      longDescription,
      mrp,
      sellingPrice,
      productImage,
    } = body;
    if (await createTable()) {
      pool.query(
        `INSERT INTO products (product_name,vendor_id,short_description,long_description,mrp,selling_price,product_image,status) values ('${productName}', '${vendorId}', '${shortDescription}', '${longDescription}','${mrp}', '${sellingPrice}', '${productImage}','ACTIVE')`,
        (error, result) => {
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
              resolve({
                statusCode: 201,
                response: {
                  success: 1,
                  message: `Product added successfully`,
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
        },
      );
    } else {
      resolve({
        statusCode: 503,
        response: {
          success: 0,
          message: `Internal Server Error in creating table`,
        },
      });
    }
  });
}

function editProduct(body, productId) {
  return new Promise(async function(resolve, reject) {
    const {
      productName,
      shortDescription,
      longDescription,
      mrp,
      sellingPrice,
      productImage,
    } = body;
    if (await createTable()) {
      pool.query(
        `UPDATE products SET  product_name='${productName}', short_description='${shortDescription}', long_description='${longDescription}', mrp=${mrp}, selling_price=${sellingPrice}, product_image='${productImage}' where product_id=${productId}`,
        (error, result) => {
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
              resolve({
                statusCode: 200,
                response: {
                  success: 1,
                  message: `Product updated successfully`,
                  context: result[0],
                },
              });
            } else {
              resolve({
                statusCode: 503,
                response: { success: 0, message: `Internal Server Error` },
              });
            }
          }
        },
      );
    } else {
      resolve({
        statusCode: 503,
        response: {
          success: 0,
          message: `Internal Server Error in creating table`,
        },
      });
    }
  });
}

function getById(productId) {
  return new Promise(function(resolve, reject) {
    pool.query(
      `select * from products where product_id='${productId}'`,
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
                data: result[0],
              },
            });
          } else {
            resolve({
              statusCode: 404,
              response: {
                success: 0,
                message: 'Invalid product id',
              },
            });
          }
        }
      },
    );
  });
}

function changeStatus(body, productId) {
  const { status } = body;
  return new Promise(async function(resolve, reject) {
    if (!(await checkProductId(productId))) {
      pool.query(
        `UPDATE products SET status='${status}' WHERE product_id=${productId}`,
        (error, result) => {
          if (error) {
            console.log('update status error', error);
            resolve({
              statusCode: 503,
              response: {
                success: 0,
                message: `Internal Server Error: ${error}`,
              },
            });
          } else {
            if (result.affectedRows > 0) {
              resolve({
                statusCode: 200,
                response: {
                  success: 1,
                  message: 'Product status changes successfully',
                  data: result[0],
                },
              });
            } else {
              resolve({
                statusCode: 200,
                response: {
                  success: 1,
                  message: 'Product status same as previous one',
                  data: result[0],
                },
              });
            }
          }
        },
      );
    } else {
      resolve({
        statusCode: 404,
        response: {
          success: 0,
          message: 'Product id not found',
        },
      });
    }
  });
}

function checkProductId(productId) {
  return new Promise(function(resolve, reject) {
    console.log('vendor id found: ' + vendorId);
    pool.query(
      `select * from products where product_id='${productId}'`,
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

function checkActiveProduct() {
  return new Promise(function(resolve, reject) {
    pool.query(
      `SELECT * FROM products WHERE AND status='ACTIVE'`,
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
      `CREATE TABLE IF NOT EXISTS products (product_id int AUTO_INCREMENT, product_name varchar(128), vendor_id int, short_description varchar(64), long_description varchar(512), mrp decimal, selling_price decimal, product_image varchar(256), status varchar(16), PRIMARY KEY (product_id))`,
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

module.exports = { getProducts, addProduct, getById, changeStatus, editProduct };
