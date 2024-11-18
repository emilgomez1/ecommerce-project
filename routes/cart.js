const express = require('express');
const Cart = require('../models/Cart.js');
const { createSearchIndex } = require('../models/User');
const Product = require('../models/Product');
const router = express.Router();  // Create a new router everytime for every collection

router.post('/add', async (req, res) =>{
    //Retrieve the info of the user and the product theyre adding to their cart
    const {userId, productId, quantity} = req.body;
    console.log(quantity);
    try{
        let cart = await Cart.findOne({userId});
        // If the cart exists add the product 
        if (cart)  {
            //If the cart exists and the product is already in the cart, update the
            let itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);

            if (itemIndex > -1) {  // Product is in cart
                cart.products[itemIndex].quantity += quantity; 
            } else {
                cart.products.push({productId, quantity});
            }
    } else { // Cart does not exist create one
        cart = new Cart ({
            userId,
            products : [{productId, quantity}]
        })
    }

    await cart.save(); // Save any updates we made
    res.status(200).json({message: "Product added to cart", cart});
    } catch (error){
        res.status(400).json({error: 'Error adding product to cart'});
    }
});

//Get cart by user
router.get('/:userId', async (req, res) => {
    try {
        let cart = await Cart.findOne({userId: req.params.userId}).populate('products.productId');
        if (!cart) { // If the cart doesnt exist, meaning a user didnt add any products yet create an empty cart
            cart = new Cart({userId: req.params.userId, products: []});
            await cart.save();
        }
        res.json(cart);
    } catch (error) {
        res.status(400).json({error: 'Error fetching cart'});
    }
});

//Update quantity of item in cart
router.put('/update', async (req, res) => {
    const {userId, productId, quantity} = req.body;

    try {
        const cart = await Cart.findOne({userId});
        if (!cart) return res.status(404).json({error: 'Cart not found'});

        const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId); //Find the product that matches the given product id
        console.log('Item index', itemIndex);
        if (itemIndex > -1) { //If product exists : (method findIndex returns -1 if nothing is found or the index)
            cart.products[itemIndex].quantity = quantity;
            await cart.save();
            console.log('Updated cart', cart);
            res.json({message: 'Cart updated', cart})
        } else {
            res.status(404).json({error: 'product not found in cart'});
        }
    } catch (error) {
        console.error('Error updating cart:' , error);
        res.status(400).json({error: 'Error updating cart'});
    }
})



module.exports = router;
