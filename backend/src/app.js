const express = require('express')
const route = require('./route')
const { handleError } = require("./helper/error");
const unknownEndpoint = require("./middleware/unknownEndpoint");

const cors = require("cors");
// HTTP request logger middleware
const morgan = require("morgan");
// parsing cookie, duh
const cookieParser = require("cookie-parser");
// secure Express apps
const helmet = require("helmet");
// gzip
const compression = require('compression')
// API documentation
const { specs, swaggerUi } = require('./swagger');


const app = express();

app.set("trust proxy", 1);
app.use(cors({ credentials: true, origin: true }));
app.use(express.json())
app.use(morgan("dev"));
app.use(cookieParser())
app.use(helmet());
app.use(compression());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));


app.use('/', route);

app.use(unknownEndpoint);
app.use(handleError);

module.exports = app;
