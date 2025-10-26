const express = require('express');
const route = require('./routes');
const { handleError } = require('./helper/error');
const unknownEndpoint = require('./middleware/unknownEndpoint');

const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const { specs, swaggerUi } = require('./swagger');

const appInstance = express();

appInstance.set('trust proxy', 1);
appInstance.use(cors({ credentials: true, origin: true }));
appInstance.use(express.json());
appInstance.use(morgan('dev'));
appInstance.use(cookieParser());
appInstance.use(helmet());
appInstance.use(compression());
appInstance.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

appInstance.use('/', route);

appInstance.use(unknownEndpoint);
appInstance.use(handleError);

module.exports = appInstance;
