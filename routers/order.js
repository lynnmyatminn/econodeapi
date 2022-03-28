const { Order } = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();

router.get(`/`, async (req, res, next) => {

    const orderList = await Order.find()
        .populate('user', 'name')
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category'
            }
        })
        .sort('dateCreated');

    if (!orderList) {
        res.status(500).json({ success: false })
    }

    res.send(orderList)
});

router.get(`/:id`, async (req, res, next) => {

    const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category'
            }
        })
        .sort('dateCreated');

    if (!order) {
        res.status(500).json({ success: false })
    }

    res.send(order)
});

router.post(`/`, async (req, res) => {


    const orderItemsIds = Promise.all(req.body.orderItems.map(async item => {
        let newOrderItem = new OrderItem({
            quantity: item.quantity,
            product: item.product
        });

        //await returns promise that's why need to be wrapped with Promise.all method on request body
        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }));
    console.log(orderItemsIds);//returns Promise { <pending> } (need to be resolved into id array)
    const orderItemsIdsResolved = await orderItemsIds;
    console.log(orderItemsIdsResolved);//returns [new ObjectId("6241d5df84a5cbd7b22659b7"),new ObjectId("6241d5df84a5cbd7b22659b8")]

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user,
    })

    order = await order.save();

    if (!order) {
        return res.status(400).send({
            message: "the order cannot be created"
        })
    }

    res.send(order);

    // order.save().then((createdOrder => {
    //     res.status(201).json(createdOrder)
    // })).catch((err) => {
    //     res.status(500).json({
    //         error: err,
    //         success: false
    //     })
    // })
});

module.exports = router;