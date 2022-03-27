require('dotenv/config');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//get all users
router.get(`/`, async (req, res, next) => {
    const userList = await User.find().select('-passwordHash');//exclude password field on select
    // const userList = await User.find().select('id name email phone isAdmin');//include only specific fields on select
    if (!userList) {
        res.status(500).json({ success: false })
    }
    res.send(userList)
});

//get only one user by id
router.get(`/:id`, async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');//exclude password field on select;
    // const user = await User.findById(req.params.id).select('id name email phone isAdmin');//include only specific fields on select
    if (!user) {
        res.status(500).json({
            message: "The user with the given ID was not found."
        })
    }
    res.status(200).send(user);
})

router.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments((count) => count)
    if (!userCount) {
        res.status(500).json(
            {
                success: false
            }
        )
    }
    res.send(
        {
            userCount: userCount
        }
    );
});

//create new user
router.post(`/`, async (req, res) => {

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),//password hashing
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });

    user = await user.save();

    if (!user) return res.status(404).send('the user cannot be created');

    res.send(user);
});

//Login
router.post(`/login`, async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    });
    const secretKey = process.env.SECRET_KEY;
    if (!user) {
        res.status(400).send('The user not found');
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secretKey,
            {
                expiresIn: '1d'
            }
        );
        res.status(200).send(
            {
                msg: "user Authenticated.",
                user: user.name,
                email: user.email,
                token: token
            }
        )
    } else {
        res.status(400).send('password is wrong')
    }
});

router.post(`/register`, async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),//password hashing
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });

    user = await user.save();

    if (!user) return res.status(404).send('the user cannot be created');

    res.send(user);
});

router.delete(`/:id`, (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: "the user has been deleted successfully." })
        } else {
            return res.status(404).json({ success: false, message: 'the user cannot be found' })
        }
    }).catch(err => {
        return res.status(500).json({
            success: false,
            error: err
        })
    })
});

module.exports = router;