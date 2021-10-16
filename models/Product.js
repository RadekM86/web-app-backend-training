const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 255,
    },
    type: {
        type: String,
        required: true,
        min: 2,
        max: 255,
    },
    img: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
})
const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;