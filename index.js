const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));
const pug = require('pug');
const path  = require('path');
app.set("view engine", "pug");
app.set('views', path.join(__dirname, '../views'));
const router = require('./routes/index.js');
app.use(router);


const port = process.env.PORT || 3000;

app.listen(port, err => {
    if(err) throw err;
    console.log(`server running on port: ${port}`);
});