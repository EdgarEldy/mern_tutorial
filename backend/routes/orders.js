const express = require('express');
const router = express.Router();

// Initialize database connection
const db = require('../models');

// Initialize Order model
const Order = db.Order;

// Initialize Customer model
const Customer = db.Customer;

// Initialize Product model
const Product = db.Product;

// Get orders related to customers and products
router.get('/orders', async (req, res, next) => {
    const orders = await Order.findAll({
        include: [
            {
                model: Customer,
                required: true
            },
            {
                model: Product,
                required: true
            }
        ]
    });

    return res.json(orders);
});

// Add a new order
router.post('/orders', (req, res, next) => {

    // Get orders data
    const order = {
        customer_id: req.body.customer_id,
        product_id: req.body.product_id,
        qty: req.body.qty,
        total: req.body.total,
    };

    Order.create(order)
        .then((data) => {
            res.send('A new order has been created successfully !');
        })
        .catch((error) => {
            res.send('Error');
        });
});

// Get order data by id
router.get('/orders/:id', (req, res, next) => {
    const id = req.params.id;
    Order.findByPk(id)
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            res.send('Order not found !');
        });
});

// Update an order
router.put("/orders/edit/:id", function (req, res, next) {

    const id = req.params.id;

    Order.update(req.body, {
        where: {id: id}
    }).then((data) => {
        if (data === 1) {

            res.send(data);
        } else {
            res.send("Order has been updated successfully ")
        }
    }).catch((err) => {
        res.send("Error")
    });

});

module.exports = router;