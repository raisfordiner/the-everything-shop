const router = require("express").Router();

const user = require("./user");
const auth = require("./auth");
const sample = require("./sample")

router.use("/auth", auth);
router.use("/user", user);
router.use("/sample", sample);

module.exports = router;