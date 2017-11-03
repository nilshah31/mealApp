require('../controller/cron_jobs');
require('../controller/all_handlebars_helpers');
var express = require('express');
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
var item_counter;
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');

function generateRandomNumber(){
	var number = Math.floor((Math.random()*10000));
	 if(number.length < 4 || number.length > 4){
    	generateRandomNumber();
    }
	return number;
}

//Mix Function's
function stringGen(len)
{
    var text = " ";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}


function ensureAuthenticated(req, res, next){
    if(req.session.user){
        return next();
    } else {
        req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

//  Get Homepage
router.get('/', function(req, res){
  if(req.session.user){
    if(req.session.user.firstname) {
      var query = {phone: req.session.user.phone};
      User.findOne(query, function(err,user_result){
				req.session.user = null;
				req.session.user = user_result;
        Location.findOne({company:user_result.location},function(err,location_results){
          if(location_results){
            ItemLocation.find({location_id:location_results._id},function(err,itemLocationResult){
              var item_location_ids = [];
              itemLocationResult.forEach(function (item_id){
                item_location_ids.push(new mongoose.Types.ObjectId(item_id.item_id));
              });
              Item.find( { _id : { $in : item_location_ids }},function(err, item_results){
                res.render('index', {i: 1, user: req.session.user, itemList: item_results,isLocationAvaible:true});
              });
            });
          }
          else{
            Item.find(function(err, item_results){
              res.render('index',{i: 1,user: req.session.user,itemList: item_results,isLocationAvaible:false});
            });
          }
        });
      });
    }
    else{
      Item.find(function(err, item_results){
        req.session.user = null;
        res.render('index',{i: 1,user: null,itemList: item_results,isLocationAvaible:false});
      });
    }
  }
  else {
    Item.find(function(err, item_results){
      req.session.user = null;
      res.render('index',{i: 1,user: null,itemList: item_results,isLocationAvaible:false});
    });
  }
});

router.get('/user_profile',function(req, res){
    if(req.session.user)
        res.render('user_profile',{user:req.session.user});
    else
        res.redirect('/');
});

router.get('/user_password_update', function(req, res){
    if(req.session.user) {
        res.render('user_password_update', {user: req.session.user});
    }
    else
        res.redirect('/');
});

router.get('/deals', function(req, res){
    res.render('deals',{user: req.session.user});
});

router.get('/howWeWork', function(req, res){
    res.render('howWeWork',{user: req.session.user});
});

router.post('/', function(req, res){
    req.session.order_itemID =  req.body.itemID;
    req.session.order_itemName =  req.body.itemName;
    req.session.order_itemQty =  req.body.itemQty;
    req.session.order_itemPrice =  req.body.itemPrice;
    req.session.order_rcpt_number = (generateRandomNumber());
    res.redirect('payment');
});

router.post('/user_password_update', function(req, res) {
    User.comparePassword(req.body.cur_pass, req.session.user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
            User.updateuserPassword(req.session.user._id,req.body.new_pass,function (err,result) {
                if(err){
                    res.render('user_password_update',{msg_err:"Something went wrong Please try agains"});
                }
                else{
                    res.render('user_password_update',{msg_success:"Updated Successfully"});
                }
            });
        } else {
            res.render('user_password_update',{msg_err:"Enter Correct Password!"});
        }
    });
});
