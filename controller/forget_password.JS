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
module.exports = router;
var mongoose = require('mongoose');

router.get('/forget_password', function(req, res){
    res.render('forget_password');
});

router.post('/forget_password', function(req, res) {
  User.getUserBymobNumber(req.body.cur_mob_no,function(err,isMatch){
    if(isMatch){
      User.getUserByemailId(req.body.cur_email_id,function(err,isMatch){
        if(isMatch){
            console.log("Found User : "+isMatch.firstname);
            var number = generateRandomNumber();
            console.log(number);
            User.sendMessage(isMatch.lastname,isMatch.phone,number,function (err,result){
            });
            User.updateuserPassword(isMatch._id,number,function (err,result) {
                if(err){
                    res.render('forget_password',{msg_err:"Something went wrong Please try agains"});
                }
                else{

                    res.render('forget_password',{msg_success:"Please use New Password to login"});
                }
            });
        }
        else{
          res.render('forget_password',{msg_err:"User does not exist with this Mobilenumber/Emailid"});
        }
      });
    } else {
        res.render('forget_password',{msg_err:"User does not exist with this Mobilenumber/Emailid"});
    }
  });
});
