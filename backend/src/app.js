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

app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/categories', require('./modules/categories/category.routes'));
app.use('/api/products', require('./modules/products/product.routes'));
app.use('/api/customers', require('./modules/customers/customer.routes'));
app.use('/api/orders', require('./modules/orders/order.routes'));

app.use(errorMiddleware);

module.exports = app;
