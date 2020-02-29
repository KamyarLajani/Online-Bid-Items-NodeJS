const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    _id: String,
    expires: String,
    session: String,
},
{ collection: 'sessions' });


let Sessions = mongoose.model('sessions', sessionSchema);

module.exports = Sessions;