const router = require("express").Router();

const users = require("./users");
const auth = require("./auth");
const sample = require("./sample")

router.use("/auth", auth);
router.use("/users", users);
router.use("/sample", sample);


module.exports = router;