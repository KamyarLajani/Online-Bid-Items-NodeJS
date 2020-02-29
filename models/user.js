const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullname: String,
    email: String,
    password: String,
    address: String,
    phone: String,
    
},
{ collection: 'users' });


let User = mongoose.model('users', userSchema);

module.exports = User;