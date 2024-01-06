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
            res.send({
                message: 'A new order has been created successfully !'
            });
        })
        .catch((error) => {
            res.status(500).send({
                message: 'Error while creating a category !'
            });
        });
});

// Get order data by id
router.get('/orders/:id', (req, res, next) => {
    const id = req.params.id;
    Order.findByPk(id)
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: "Can not found order with id: " + id
                });
            } else res.send(data);
        })
        .catch((error) => {
            res.status(500).send({
                message: 'Error while fetching an order !'
            });
        });
});

// Update an order
router.put("/orders/:id", function (req, res, next) {

    const id = req.params.id;

    Order.update(req.body, {
        where: {
            id: id
        }
    }).then((data) => {
        if (!data) {
            res.status(404).send({
                message: `Cannot update order with id= ${id} !`
            });
        } else res.send({
            message: 'Order has been updated successfully !'
        });
    }).catch((err) => {
        res.status(500).send({
            message: 'Error while updating order !'
        });
    });

});

// Remove an order
router.delete("/orders/:id", (req, res, next) => {

    const id = req.params.id;
    Order.destroy({
        where: {
            id: id
        },
    })
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete order with id = ${id}. Order was not found!`
                });
            } else res.status(201).send({
                message: 'Order has been removed successfully!'
            });
        })
        .catch((error) => {
            res.status(500).send({
                message: 'Error while removing an order !'
            });
        });
});

module.exports = router;