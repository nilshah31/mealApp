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

router.get('/payment',function(req, res){
    if(req.session.user) {
        order_itemID = req.session.order_itemID;
        order_itemName = req.session.order_itemName;
        order_itemPrice = req.session.order_itemPrice;
        order_itemQty = req.session.order_itemQty;
        total=0;
        object_item_hash = [];
        if(order_itemQty.length==1) {
            sub_Total = parseInt(order_itemQty) * parseInt(order_itemPrice);
            object_item_hash.push({
                order_itemID: order_itemID,
                order_itemName: order_itemName,
                order_itemPrice: order_itemPrice,
                order_itemQty: order_itemQty,
                sub_Total: sub_Total
            });
            total += sub_Total;
            req.session.sub_Total = sub_Total;
        }
        else{
            for (i = 0; i < order_itemQty.length; i++) {
                sub_Total = parseInt(order_itemQty[i]) * parseInt(order_itemPrice[i]);
                object_item_hash.push({
                    order_itemID: order_itemID[i],
                    order_itemName: order_itemName[i],
                    order_itemPrice: order_itemPrice[i],
                    order_itemQty: order_itemQty[i],
                    sub_Total: sub_Total
                });
                total += sub_Total;
            }
            req.session.sub_Total = sub_Total;
        }
        res.render('payment',
            {
                user: req.session.user,
                object_item_hash: object_item_hash,
                bill_total: total,
                order_rcpt_number: req.session.order_rcpt_number
            });
    }
    else
        res.redirect('/');
});


router.post('/payment', function(req, res){
	  //Creating Order
    order_itemID = req.session.order_itemID;
    order_itemName = req.session.order_itemName;
    order_itemPrice = req.session.order_itemPrice;
    order_itemQty = req.session.order_itemQty;
    del_location = req.session.user.location+','+req.session.user.city;
    order_location = req.body.user_location;
    total=0;
    itemIDArray = String(req.session.order_itemID).split(',');
    itemPriceArray = String(req.session.order_itemPrice).split(',');
    itemQtyArray = String(req.session.order_itemQty).split(',');

    for(var i=0;i<itemPriceArray.length;i++){
 		   total+=parseInt(itemPriceArray[i])*parseInt(itemQtyArray[i]);
        Item.updateItemQty(itemIDArray[i],itemQtyArray[i],function(err, updated_qty_result){
            if(err) throw err;
            console.log(itemIDArray[i]);
        });
        var query = {_id: itemIDArray[i]};
        Item.findOne(query,function(err,item_result){
          location_name = req.session.user.location+','+req.session.user.city;
          new_item_qty = (parseInt(item_result.initial_qty)-parseInt(item_result.avaible_qty))+parseInt(order_itemQty)

          ItemOrdered.find({item_name:item_result.name,location: location_name},function(err,item_ordered_result){
            if(item_ordered_result.length>0){
              ItemOrdered.updateOne({item_name:item_result.name,location: location_name}, {$set:{total_ordered_placed: new_item_qty}}, function(err, res) {
                  if (err) throw err;
                  console.log(res);
              });
            }
            else{
              var newItemOrder = new ItemOrdered({
              item_name  : item_result.name,
              location: location_name,
              total_ordered_placed: new_item_qty
              });
              ItemOrdered.createItemOrdered(newItemOrder,function(err,newItemOrderResult){
                if(err) console.log(err);
              });
            }
          });
        });
	  }

    var newOrder = new Order({
        user_id  : req.session.user._id,
        receipt_number: req.session.order_rcpt_number,
        item_name : order_itemName,
        qty : order_itemQty,
        price : order_itemPrice,
		    sub_total:total,
		    total:total,
        delivery_date_time:new Date(),
        delivery_address:del_location,
        order_location:order_location,
        order_date_time:new Date()
    });
    Order.createOrder(newOrder, function(err, OrderResult){
        if(err) res.send(err);
    });
    User.updateUserAmountLimit(req.session.user._id,parseInt(req.session.user.avaible_limit),parseInt(total),function(err,result){
      if(err) res.send(err);
    });
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nilshah.31@gmail.com',
        pass: 'NVD421nvd'
      }
    });

    var mailOptions = {
      from: 'nilshah.31@gmail.com',
      to: req.session.user.email,
      subject: 'Payment Receipt -' + req.session.order_rcpt_number + '-Team SouthMeal',
      html: '<h1>Payment Receipt</h1><br />'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    req.flash('success_msg','You have Succesfully Placed Order, Please note Down Order number for future Refrence : '+req.session.order_rcpt_number);
    res.redirect('/');
});