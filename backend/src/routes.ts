const router = require("express").Router();

// require the concrete auth route file (folder import 'auth' won't resolve)
const authModule = require("./auth/routes/auth.route");
// support both `export default` and `module.exports`
const authRouter = authModule.default || authModule;

// Health check endpoint
router.get("/sample", (req: any, res: any) => {
  res.status(200).json({ message: "Sample endpoint is working", status: "ok" });
});

router.use("/auth", authRouter);

module.exports = router;