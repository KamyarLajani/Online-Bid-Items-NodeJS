const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const bidSchema = new Schema({
    user_id: String,
    item_id: String,
    date: {type: Number, default: new Date().getTime()},
    price: Number,
},
{ collection: 'bids' });


let Bids = mongoose.model('bids', bidSchema);

module.exports = Bids;