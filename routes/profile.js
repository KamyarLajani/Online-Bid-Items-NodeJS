const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const path = require('path');
let checkAuthenticated = require('./functions.js').checkAuthenticated;
let Users = require(path.join(__dirname, '../models/index.js')).users;
let Items = require(path.join(__dirname, '../models/index.js')).items;
let Categories = require(path.join(__dirname, '../models/index.js')).categories;
let Bids = require(path.join(__dirname, '../models/index.js')).bids;


router.get('/profile', checkAuthenticated, (req, res)=>{
    (async ()=>{
        try {
            let loggedInUser = await req.user;
            let items = await Items.find({user_id: loggedInUser._id}).sort({_id: -1});
            res.render('profile', {items});
        }
        catch(err){
            console.log(err);
        }
    })();
});


router.get('/profile/additem', checkAuthenticated, (req, res)=>{
    (async ()=>{
        try {
            let categories = await Categories.find({});
            let additem = true;
            res.render('profile', {additem, categories});
        }
        catch(err){
            console.log(err);
        }
    })();
});

router.post('/profile/additem', checkAuthenticated, (req, res)=>{
    (async ()=>{
        try {
            let loggedInUser = await req.user;
            const mv = require('mv');
            const formidable = require('formidable');
            const form = formidable({ multiples: true });
            form.parse(req, (err, fields, files) => {
                let imagesToString ='', newImageNames;
                if(files.images[0]){
                    for(let i=0; i< files.images.length; i++){
                        imagesToString+= `${files.images[i].name},`;
                    }
                     newImageNames = imagesToString.substring(0, imagesToString.length-1);
                     for(let i=0; i< files.images.length; i++){
                        mv(files.images[i].path, path.join(__dirname, '../', '/*', '../public/uploads') + '/' + files.images[i].name, function (err) {
                            if(err) throw err;
                        });
                    }
                }
                else {
                    newImageNames = files.images.name;
                    mv(files.images.path, path.join(__dirname, '../', '/*', '../public/uploads') + '/' + files.images.name, function (err) {
                        if(err) throw err;
                    });
                }
                
                (async ()=>{
                    if(fields.start_bid_date == '1m'){
                        fields.start_bid_date = new Date().getTime() + 10000;
                    }
                    else if(fields.start_bid_date == '1h'){
                        fields.start_bid_date = new Date().getTime() + 3600000;
                    }
                    else if(fields.start_bid_date == '1d'){
                        fields.start_bid_date = new Date().getTime() + 86400000;
                    }
                    await Items.create({user_id: loggedInUser._id, name: fields.name, detail: fields.detail, price: fields.price, images: newImageNames, category_id: fields.category, start_bid_date: fields.start_bid_date});
                    res.redirect('/profile');
                })();
              });
            
        }
        catch(err){
            console.log(err);
        }
    })();
});


router.get('/profile/showbid/:id', checkAuthenticated, (req, res)=>{
    (async ()=>{
        try {
            let param = req.params.id;
            let item = await Items.find({_id: param});
            
            
            if(item.length > 0){
                let bid = await Bids.find({item_id: item[0]._id});
                if(bid.length > 0){
                    let user = await Users.find({_id: bid[0].user_id});
                    if(user.length > 0){
                        let showBid = true;
                        res.render('profile', {user, item, bid, showBid});
                    }
                    else {
                        res.end('page not found');
                    }
                }
                else {
                    res.end('page not found');
                }
                
            }
            else {
                res.end('page not found');
            }
            
        }
        catch(err){
            console.log(err);
        }
    })();
});

module.exports = router;