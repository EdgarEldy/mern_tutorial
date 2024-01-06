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
    return res.json(products);
});

// Add a product
router.post('/products', (req, res, next) => {

    // Get products data
    const product = {
        category_id: req.body.category_id,
        product_name: req.body.product_name,
        unit_price: req.body.unit_price
    }

    Product.create(product)
        .then((data) => {
            res.send({
                message: product.product_name + ' has been created successfully !'
            });
        })
        .catch((error) => {
            res.status(500).send({
                message: "Error while creating a product !"
            });
        });
});

// Get products details by id
router.get('/products/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findByPk(id)
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: "Can not found product with id: " + id
                });
            } else res.send(data);
        })
        .catch((error) => {
            res.status(500).send({
                message: 'Error while fetching a product !'
            });
        });
});

// Update a product by id
router.put("/products/:id", function (req, res, next) {

    const id = req.params.id;

    Product.update(req.body, {
        where: {
            id: id
        }
    }).then((data) => {
        if (!data) {
            res.status(404).send({
                message: `Cannot update product with id= ${id} !`
            });
        } else res.send({
            message: 'Product has been updated successfully !'
        });
    }).catch((err) => {
        res.status(500).send({
            message: 'Error while updating product !'
        });
    });

});

// Remove a product
router.delete("/products/:id", (req, res, next) => {

    const id = req.params.id;
    Product.destroy({
        where: {id: id},
    })
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete product with id = ${id}. Product was not found!`
                });
            } else res.status(201).send({
                message: 'Product has been removed successfully!'
            });
        })
        .catch((error) => {
            res.status(500).send({
                message: 'Error while removing a product !'
            });
        });
});

module.exports = router;