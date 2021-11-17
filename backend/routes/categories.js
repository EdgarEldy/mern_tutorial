var express = require('express');
var router = express.Router();

const db = require('../models');
const Category = db.Category;

// Get all categories api
router.get('/categories', async (req, res, next) => {
const categories = await Category.findAll();
return res.json(categories);
});

module.exports = router;