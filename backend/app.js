var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Categories
var categoriesRouter = require('./routes/categories');

// Products
var productsRouter = require('./routes/products');

// Customers
var customersRouter = require('./routes/customers');

// Orders
var ordersRouter = require('./routes/orders');

var app = express();

// Enable cors middleware
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Categories apis
app.get('/categories', categoriesRouter);
app.post('/categories', categoriesRouter);
app.get('/categories/:id', categoriesRouter);
app.put('/categories/:id', categoriesRouter);
app.delete('/categories/:id', categoriesRouter);

// Products apis
app.get('/products', productsRouter);
app.post('/products', productsRouter);
app.get('/products/:id', productsRouter);
app.put('/products/:id', productsRouter);
app.delete('/products/:id', productsRouter);

// Customers apis
app.get('/customers', customersRouter);
app.post('/customers', customersRouter);
app.get('/customers/:id', customersRouter);
app.put('/customers/:id', customersRouter);
app.delete('/customers/:id', customersRouter);

// Orders apis
app.get('/orders', ordersRouter);
app.post('/orders', ordersRouter);
app.get('/orders/:id', ordersRouter);
app.put('/orders/:id', ordersRouter);
app.delete('/orders/:id', ordersRouter);

module.exports = app;
