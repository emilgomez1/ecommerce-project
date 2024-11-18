const User = require('../models/User');
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router(); 




//Register Route
router.post('/register', async (req, res) => {
    const {username, email, password} = req.body
   
    try {
        const user = new User({username, email, password}); //Create new user with the json sent back
        await user.save(); //Save the username and use pre-hook to hash the password before saving.
        res.status(201).json({message: "User created successfully"})
    } catch (error){
        console.error('Error:', error);
        res.status(400).json({error: "Error registering new user"})
    }
});

//Login route

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email}) // Find the user by email in the database 

        //If the user doesnt exist or the password doesnt match, return an error
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({error: "Invalid credentials"});
        }

        //If the credentials are valid, create a jwt token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1h"})

        //Respond with the token
        res.json({token});
    } catch(error){
        res.status(400).json({error: "Error logging in"});
    }
});

module.exports = router;


