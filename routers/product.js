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

router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments((count) => count)
    if (!productCount) {
        res.status(500).json(
            {
                success: false
            }
        )
    }
    res.send(
        {
            productCount: productCount
        }
    );
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

router.delete(`/:id`, (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({ success: true, message: "the product has been deleted successfully." })
        } else {
            return res.status(404).json({ success: false, message: 'the product cannot be found' })
        }
    }).catch(err => {
        return res.status(500).json({
            success: false,
            error: err
        })
    })
});

module.exports = router;