const { Product } = require('../models/product');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res, next) => {

    const productList = await Product.find();

    if (!productList) {
        res.status(500).json({ success: false })
    }

    res.send(productList)
});

router.post(`/`, (req, res) => {
    const product = new Product({
        name: req.body.name,
        shortDescription: req.body.shortDescription,
        longDescription: req.body.longDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        brand: req.body.brand,
        brand: req.body.brand,
    })

    product.save().then((createdProduct => {
        res.status(201).json(createdProduct)
    })).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })
});

module.exports = router;