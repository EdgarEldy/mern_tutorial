var express = require('express');
var router = express.Router();

const db = require('../models');
const Category = db.Category;

// Get all categories api
router.get('/categories', async (req, res, next) => {
    const categories = await Category.findAll();
    return res.json(categories);
});

// Add a category end point
router.post('/categories', async (req, res, next) => {

    const category = {
        category_name: req.body.category_name,
    };

    Category.create(category).then((data) => {
        res.send(category.category_name + ' has been created successfully !');
    })
        .catch((err) => {
            res.send('Error');
        });
});

// Get category data by id
router.get('/categories/:id', (req, res, next) => {
    const id = req.params.id;
    Category.findByPk(id)
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            res.send('Category not found');
        });
});

// Update a category
router.put("/categories/edit/:id", function (req, res, next) {

    const id = req.params.id;

    Category.update(req.body, {
        where: {id: id}
    }).then((data) => {
        if (data === 1) {

            res.send(data);
        } else {
            res.send("Category has been updated successfully ")
        }
    }).catch((err) => {
        res.send("Error")
    });

});

module.exports = router;