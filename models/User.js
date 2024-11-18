const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Define the userScehma
const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique:true},
    password: {type: String, required: true},
});

//Hash the password before saving it to a new user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//Export the User model so that a collection can be made for other files to use
module.exports = mongoose.model('User', userSchema);

