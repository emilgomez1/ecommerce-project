const express = require('express');
const Product = require('../models/Product')

const router = express.Router();

router.post('/add', async (req, res) => {
    const {name, description, price, category, imageUrl, inStock} = req.body;
    try {
        const product = new Product ({name, description, price, category, imageUrl, inStock});
        await product.save();
        res.status(201).json({message: 'Product was successfully added', product})
    } catch (error) {
        console.error(error);
        res.status(400).json({error: 'Error adding product'});
    }
});

//Get all products
router.get('/', async (req, res) =>{
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(400).json({error: 'Error fetching products'});
    }
});

//Search and filter for product

router.get('/search', async (req, res) => {
    const {name, category, minPrice, maxPrice} = req.query; // extracts these parameters if inputed
    const filter = {}

    if (name) filter.name = {$regex: name, $options: 'i'};
    if (category) filter.category = category
    if (minPrice) filter.price = {$gte: Number(minPrice)}; // Filter prices greater than the minPrice given
    if (maxPrice) filter.price = {...filter.price, $lte: Number(maxPrice)};

    try {
        const products = await Product.find(filter); // search for a product in the db based on the params given
        if (products.length === 0){ // If there is no product that matches, return a bad request 
            return res.status(400).json({message: 'Product not found'});
        }
        res.json(products);
    } catch (error) {
        res.status(400).json({error: 'Error searching products'});
    }
});

module.exports = router;