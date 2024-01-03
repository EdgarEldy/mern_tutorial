var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Categories
var categoriesRouter = require('./routes/categories');

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
module.exports = app;
