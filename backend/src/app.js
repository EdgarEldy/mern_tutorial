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

// Module routers are mounted here as they are implemented, e.g.:
// const categoriesRouter = require('./modules/categories/categories.routes');
// app.use('/api/categories', categoriesRouter);

app.use(errorMiddleware);

module.exports = app;
