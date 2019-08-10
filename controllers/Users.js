var express = require("express");
var router = express.Router();
const {getUsers, addUser} = require("../services/UsersService")

router.route("/get").get(async function (req, res, next) {
        const result = await getUsers();
        res.statusCode = result.statusCode;
        res.send(result.response);
    }
)

router.route("/")
    .post(async function (req, res, next) {
        const result = await addUser(req.body);
        res.statusCode = result.statusCode;
        res.send(result.response);
    })

module.exports = router;