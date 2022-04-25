const express = require('express');
const router = express.Router();

// Initialize database
const db = require('../models');

// Initialize Category model
const Category = db.Category;

// Initialize Product model
const Product = db.Product;

//Get products with categories
router.get('/products', async function (req, res, next) {
    const products = await Product.findAll({
        include: [{
            model: Category,
            required: true
        }]
    });
    return res.send(products);
});