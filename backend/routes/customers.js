const express = require('express');
const router = express.Router();

// Initialize database
const db = require('../models');

// Initialize Customer model
const Customer = db.Customer;

// Get all customers api
router.get('/customers', async (req, res, next) => {
    const customers = await Customer.findAll();
    return res.json(customers);
});

module.exports = router;