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
        res.send({
            message: customer.first_name + customer.last_name + ' has been created successfully !'
        });
    })
        .catch((err) => {
            res.status(500).send({
                message: "Error while creating a customer !"
            });
        });
});

// Get customer data by id
router.get('/customers/:id', (req, res, next) => {
    const id = req.params.id;
    Customer.findByPk(id)
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: "Can not find customer with id: " + id
                });
            } else res.send(data);
        })
        .catch((error) => {
            res.status(500).send({
                message: 'Error while fetching a customer !'
            });
        });
});

// Update a customer
router.put("/customers/:id", function (req, res, next) {

    const id = req.params.id;

    Customer.update(req.body, {
        where: {
            id: id
        }
    }).then((data) => {
        if (!data) {
            res.status(404).send({
                message: `Cannot update customer with id= ${id} !`
            });
        } else res.send({
            message: 'Customer has been updated successfully !'
        });
    }).catch((err) => {
        res.status(500).send({
            message: 'Error while updating customer !'
        });
    });

});

// Remove a customer
router.delete("/customers/:id", (req, res, next) => {

    const id = req.params.id;
    Customer.destroy({
        where: {
            id: id
        },
    })
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete customer with id = ${id}. Customer was not found!`
                });
            } else res.status(201).send({
                message: 'Customer has been removed successfully!'
            });
        })
        .catch((error) => {
            res.status(500).send({
                message: 'Error while removing a customer !'
            });
        });
});

module.exports = router;