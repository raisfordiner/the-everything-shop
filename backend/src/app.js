const express = require('express')
const routes = require('./routes')
const { handleError } = require("./helpers/error");
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

const app = express();

app.set("trust proxy", 1);
app.use(cors({ credentials: true, origin: true }));
app.use(express.json())
app.use(morgan("dev"));
app.use(cookieParser())
app.use(helmet());
app.use(compression());


app.use('/', routes);

app.use(unknownEndpoint);
app.use(handleError);

module.exports = app;
