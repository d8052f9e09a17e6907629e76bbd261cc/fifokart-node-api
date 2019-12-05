var express = require("express");
var router = express.Router();
var {
  getJobs,
  getJob,
  addJob,
  editJob,
  deleteJob
} = require("../services/JobService");

/**
 * @swagger
 * definitions:
 *   Job:
 *     properties:
 *       job_id:
 *         type: string
 *       job_title:
 *         type: string
 *       job_description:
 *         type: integer
 *       image:
 *         type: string
 *       last_apply_date:
 *         type: string
 *       created_by:
 *         type: string
 */

/**
 * @swagger
 * /job:
 *   get:
 *     tags:
 *       - Get All Jobs
 *     description: Getting all jobs
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Getting all jobs
 *         schema:
 *           $ref: '#/paths/definitions/Job'
 */
router.route("/").get(async function(req, res, next) {
  const result = await getJobs();
  res.statusCode = result.statusCode;
  res.send(result.response);
});

/**
 * @swagger
 * /job:
 *   post:
 *     tags:
 *       - Add a Job
 *     description: Add a job
 *     produces:
 *       - application/json
 *     parameters:
 *       - job_id: INFY1010
 *         job_title: INFOSYS CAREERS
 *         job_description: Description
 *         image: Image URL
 *         last_apply_date: epoc time
 *         created_by : Mohit Prakash
 *         schema:
 *           $ref: '#/paths/definitions/Job'
 *     responses:
 *       201:
 *         description: Successfully created
 */
router.route("/").post(async function(req, res, next) {
  const result = await addJob(req.body);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route("/:jobId").get(async function(req, res, next) {
  const result = await getJob(req.params.jobId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route("/:jobId").delete(async function(req, res, next) {
  const result = await deleteJob(req.params.jobId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route("/:uniqueId").put(async function(req, res, next) {
  const result = await editJob(req.body, req.params.uniqueId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

module.exports = router;
