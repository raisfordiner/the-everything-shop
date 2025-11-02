import express from "express";
const router = express.Router();

// Health check endpoint
router.get("/sample", (req: any, res: any) => {
  res.status(200).json({ message: "Sample endpoint is working", status: "ok" });
});

import authRouter from "./auth/auth.route";
router.use("/auth", authRouter);

export default router;
