const express = require('express');
const router = express.Router();
const {addOrder, getOrders, changeStatus, deliverScheduleOrder} = require('../services/OrderService');

router.route('/:type/:userId').get(async function (req, res, next) {
    const result = await getOrders(req.params.userId, req.params.type);
    res.statusCode = result.statusCode;
    res.send(result.response);
});

router.route('/add/:userId/:vendorId').post(async function (req, res, next) {
    const result = await addOrder(req.body, req.params.userId, req.params.vendorId);
    res.statusCode = result.statusCode;
    res.send(result.response);
});

router.route('/change-status/:orderId/:status').put(async function (req, res, next) {
    const result = await changeStatus(req.params.status, req.params.orderId);
    res.statusCode = result.statusCode;
    res.send(result.response);
});

router.route('/schedule/:orderId').post(async function (req, res, next) {
    const result = await deliverScheduleOrder(req.params.orderId);
    res.statusCode = result.statusCode;
    res.send(result.response);
});

module.exports = router;
