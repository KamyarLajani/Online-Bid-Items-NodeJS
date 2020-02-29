const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    user_id: String,
    name: String,
    category_id: String,
    date: {type: Number, default: new Date().getTime()},
    start_bid_date: {type: Number, default: new Date().getTime()},
    images: String,
    detail: String,
    price: Number,
    bidded: {type: Boolean, default: false},
    sold: {type: Boolean, default: false}
    
},
{ collection: 'items' });


let Item = mongoose.model('items', ItemSchema);

module.exports = Item;