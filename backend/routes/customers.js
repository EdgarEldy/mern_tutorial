const express = require('express');
const router = express.Router();

// Initialize database
const db = require('../models');

// Initialize Customer model
const Customer = db.Customer;


module.exports = router;