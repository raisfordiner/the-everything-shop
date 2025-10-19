const app = require("./app");
const { logger } = require("./util/logger");

require('dotenv').config()
const PORT = process.env.PORT || 800;

app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }

    logger.info(`Listening on port  ${PORT}`)
})
