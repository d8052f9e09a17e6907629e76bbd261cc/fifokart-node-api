const { pool } = require("../config/config");
var md5 = require("md5");

function getJobs(uniqueId) {
  return new Promise(function(resolve, reject) {
    pool.query(`select * from job`, (error, result) => {
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
    });
  });
}

function addJob(body) {
  return new Promise(async function(resolve, reject) {
    if (await createTable()) {
      const {
        job_id,
        job_title,
        job_description,
        image,
        last_apply_date,
        created_by
      } = body;
      let query = `INSERT INTO job (job_id, job_title, job_description, created_at, image, last_apply_date, created_by) values ('${job_id}', '${job_title}', '${job_description}', '${new Date().getTime()}', '${image}', '${last_apply_date}', '${created_by}')`;
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
                message: `job added to the list`,
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

function editJob(body, uniqueId) {
  return new Promise(async function(resolve, reject) {
    const { job_id, job_title, job_description, image } = body;
    let query = `UPDATE job SET job_id='${job_id}', job_title='${job_title}', job_description='${job_description}', image='${image}' where unique_id=${uniqueId}`;
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
        console.log(result);
        if (result.affectedRows > 0) {
          resolve({
            statusCode: 201,
            response: {
              success: 1,
              message: `job updated to the list`,
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

function deleteJob(jobId) {
  return new Promise(function(resolve, reject) {
    pool.query(`delete from job where job_id='${jobId}'`, (error, result) => {
      if (error) {
        throw error;
      } else {
        resolve({
          statusCode: 200,
          response: {
            success: 1,
            message: "Job Deleted"
          }
        });
      }
    });
  });
}

function getJob(jobId) {
  return new Promise(function(resolve, reject) {
    pool.query(`select * from job where job_id='${jobId}'`, (error, result) => {
      if (error) {
        throw error;
      } else {
        if (result.length > 0) {
          resolve({
            statusCode: 200,
            response: {
              success: 1,
              data: result[0]
            }
          });
        } else {
          resolve({
            statusCode: 401,
            response: {
              success: 0,
              message: "Invalid Job ID"
            }
          });
        }
      }
    });
  });
}

function createTable() {
  return new Promise(function(resolve, reject) {
    pool.query(
      `CREATE TABLE IF NOT EXISTS job (unique_id int AUTO_INCREMENT, job_id text, job_title text, job_description text, created_at text, image text, last_apply_date text, created_by text, PRIMARY KEY (unique_id))`,
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

module.exports = { getJobs, editJob, deleteJob, addJob, getJob };
