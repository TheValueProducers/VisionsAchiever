const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    notification: {type: Boolean, required: true},
    token: {type: String, required: false},
    isVerified: {type: Boolean, required: true}
    
});




const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;