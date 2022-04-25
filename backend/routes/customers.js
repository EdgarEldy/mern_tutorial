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

// Add a customer
router.post('/customers', async (req, res, next) => {

    const customer = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        tel: req.body.tel,
        email: req.body.email,
        address: req.body.address
    };

    Customer.create(customer).then((data) => {
        res.send(customer.first_name + ' has been created successfully !');
    })
        .catch((err) => {
            res.send('Error');
        });
});

// Get customer data by id
router.get('/customers/:id', (req, res, next) => {
    const id = req.params.id;
    Customer.findByPk(id)
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            res.send('Error !');
        });
});

// Update a customer
router.put("/customers/edit/:id", function (req, res, next) {

    const id = req.params.id;

    Customer.update(req.body, {
        where: {id: id}
    }).then((data) => {
        if (data === 1) {

            res.send(data);
        } else {
            res.send("Customer has been updated successfully ")
        }
    }).catch((err) => {
        res.send("Error")
    });

});

module.exports = router;