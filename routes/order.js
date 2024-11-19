const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart.js');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser.js');

//Checkout and Create Order
router.post('/checkout', authenticateUser, async (req, res) => {
    const {userId} = req.body;
    try {
        //Retrieve the users cart
        const cart = await Cart.findOne({userId}).populate('products.productId');
        if (!cart || cart.products.length === 0){
            return res.status(400).json({error : 'Cart is empty'});
        }
        
        //Calculate the total amount
        const totalAmount = cart.products.reduce((total, item) => {
            console.log('Item listed', item)
            console.log('Item Product id ', item.productId)
            console.log(item.productId.price)
            return total *= item.productId.price * item.quantity;
    }, 0);

        //Create a new order
        const order = new Order ({
            userId, 
            proudcts : cart.products.map(item => ({
                productId : item.productId._id, 
                quantity : item.quantity
            })),
            totalAmount
        })

        await order.save();

        //Clear the cart after the order is saved
        cart.products = [];
        await cart.save();
        
        res.status(201).json({message : 'Order placed', order});
    } catch (error) {
        console.error('Error duiring checkout', error);
        res.status(400).json({error : 'Error during checkout'});
    }
});

// Get all orders by user ID
router.get('/:userId',authenticateUser , async (req, res) => {
    try {
        const orders = await Order.find({userId: req.params.userId});
        res.json(orders);
    } catch (error) {
        res.status(400).json({error: 'Error fetching orders'});
    }
});

module.exports = router;

