// TypeScript entrypoint (keeps CommonJS-style requires for compatibility)
import dotenv from "dotenv";
import app from "./app";
import { logger } from "./util/logger";

dotenv.config();

const PORT = process.env.PORT || 800;

app.listen(PORT, (error: any) => {
  if (error) {
    throw error;
  }

  logger.info(`Listening on port  ${PORT}`);
});
