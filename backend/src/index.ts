// TypeScript entrypoint (keeps CommonJS-style requires for compatibility)
require('dotenv').config();
const app = require('./app');
const { logger } = require('./util/logger');

const PORT = process.env.PORT || 800;

app.listen(PORT, (error: any) => {
  if (error) {
    throw error;
  }

  logger.info(`Listening on port  ${PORT}`);
});
