const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    shippingAddress1: {
        type: String,
        required: true
    },
    shippingAddress2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    totalPrice: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    }
});

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
orderSchema.set('toJSON', {
    virtuals: true
});

exports.Order = mongoose.model('Order', orderSchema);

/**
 {
     "orderItems": [
         {
             "quantity": 4,
             "product": "623d3d1ad2c075efcf833b63"
         },
          {
             "quantity": 8,
             "product": "623d3d3bd2c075efcf833b65"
         },
     ],
     "shippingAddress1": "bangkok",
     "shippingAddress2": "thailand",
     "city":"bangkok",
     "zip":"10310",
     "country":"thailand",
     "phone": "123456789",
     "user":"623f21cdd00a64c5302bf8c1"
 }
 */