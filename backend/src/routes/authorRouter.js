const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("All authors")
});

router.use(verifyToken);
router.route("/").get(verifyAdmin, getAllUsers).post(verifyAdmin, createUser);
router.route("/profile").get(getUserProfile);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
