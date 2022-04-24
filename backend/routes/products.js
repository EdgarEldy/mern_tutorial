const express = require('express');
const router = express.Router();

// Initialize database
const db = require('../models');

// Initialize Category model
const Category = db.Category;

// Initialize Product model
const Product = db.Product;