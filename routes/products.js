const router = require('express').Router();
const Product = require('../models/Product');

router.get('/products', async (req, res) => {
    const products = await Product.find({})
    try {
        res.send(products)
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

module.exports = router