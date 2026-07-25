const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const v1 = express.Router();

// Module routers are mounted on the versioned router as they are implemented, e.g.:
// const categoriesRouter = require('./modules/categories/categories.routes');
// v1.use('/categories', categoriesRouter);

app.use('/api/v1', v1);

app.use(errorMiddleware);

module.exports = app;
