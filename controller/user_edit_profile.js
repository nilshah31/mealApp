var express = require('express');
var Handlebars = require('handlebars');
var router = express.Router();
//get All Modal's
var Location = require('../models/location');
var Item = require('../models/item');
var Order = require('../models/order');
var ItemLocation = require('../models/item_location');
var User = require('../models/user');
var ItemOrdered = require('../models/item_ordered');
var pdf = require('html-pdf');
var fs = require('fs');
module.exports = router;
var schedule = require('node-schedule');
var item_counter;
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');

router.get('/user_edit_profile', function(req, res){
    if(req.session.user) {
        User.getUserBymobNumber(req.session.user.phone, function (err, user) {
            req.session.user = user;
        });
        Location.find(function (err, results) {
            var unique_city_list = [];
            results.forEach(function (item) {
                if (unique_city_list.indexOf(item['city']) < 0) {
                    unique_city_list.push(item['city']);
                }
            });
            if (err) return res.sendStatus(500);
            res.render('user_edit_profile', {
                user: req.session.user,
                cityList: unique_city_list,
                locationList: results
            });
        });
    }
    else
        res.redirect('/');
});

router.post('/user_edit_profile', function(req, res){
    var user_id = req.session.user._id;
    var fname=req.body.fname;
    var lname=req.body.lname;
    var city=req.body.city;
    var location=req.body.location;
    var email=req.body.email;
    User.updateuserProfile (req.session.user._id,fname,lname,email,city,location,function (err,result) {
    });
    req.flash('success_msg','Successfully Updated Profile');
    res.redirect('/user_edit_profile');
});
