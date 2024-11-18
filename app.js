const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth.js');
require('dotenv').config();
const productRoutes = require('./routes/product.js');
const cartRoutes = require('./routes/cart.js');
const orderRoutes = require('./routes/order.js');


const app = express(); // Create app instance
const PORT = process.env.PORT || 5001;


app.get('/favicon.ico', (req, res) => res.status(204))

//Middle ware to parse JSON
app.use(express.json());

//Enable Cors
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], //allowed methods
    credenentials: true // allow cookes if needed
}))

//MongoDB Connection
mongoose.connect('mongodb+srv://emilg2453:Whms2024%40@cluster0.qwrp1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.log('Error connecting to MongoDB', error))

//Mount auth routes under '/api/auth'
app.use("/api/auth/", authRoutes)


//Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the E-commerce API');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

//Mount product routes under 
app.use('/api/products', productRoutes);


//Mount Cart routes 
app.use('/api/cart', cartRoutes);

//Mount Order routes
app.use('/api/orders', orderRoutes);



