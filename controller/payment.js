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
        if(req.session.user.firstname){
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
            } else{
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
        else{
            res.redirect('/');
        }
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
    itemNameArray = String(order_itemName).split(',');
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
            today = new Date();
            dd = today.getDate();
            mm = today.getMonth();
            yyyy = today.getFullYear();
            if(dd<10){
                dd='0'+dd;
            }
            if(mm<10){
                mm='0'+mm;
            }
            hours = today.getHours();
            session_time = 0;
            if(hours>13)
                session_time = 1;
            today_dt = yyyy +'-'+mm+'-'+dd;
            console.log(today_dt);
            console.log("\n\n\n\n");
            ItemOrdered.find({item_name:item_result.name,location: location_name,ordered_date:today_dt,session_time:session_time},function(err,item_ordered_result){
                if(item_ordered_result.length>0){
                    ItemOrdered.update({item_name:item_ordered_result[0].item_name,location: item_ordered_result[0].location,ordered_date:item_ordered_result[0].ordered_date,session_time:item_ordered_result[0].session_time}, {$set:{total_ordered_placed: new_item_qty}}, function(err, res) {
                        if (err) throw err;
                        console.log("Updating Item");
                        console.log(res);
                    });
                }
                else{
                    console.log("Creating")
                    console.log(today);
                    console.log("\n\n\n\n");
                    today_date = today.toString();
                    var newItemOrder = new ItemOrdered({
                        item_name  : item_result.name,
                        location: location_name,
                        order_date:today,
                        session_time:session_time,
                        total_ordered_placed: new_item_qty,
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
    User.updateUserAmountLimit(req.session.user._id,(parseInt(req.session.user.avaible_limit)-parseInt(total)),function(err,result){
      if(err) res.send(err);
    });
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sanjeevinifoods@gmail.com',
        pass: 'Sanjeevini@0809'
      }
    });

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd<10) {
      dd = '0'+dd
    }
    if(mm<10) {
      mm = '0'+mm
    }
    today = mm + '/' + dd + '/' + yyyy;


    var htmlMailFormate = "<h3>SouthMeals Pyament Receipt</h3><hr /><br />"+
                          "<div class='row'>"+
                            "<div class='well col-xs-10 col-sm-10 col-md-6 col-xs-offset-1 col-sm-offset-1 col-md-offset-3'>"+
                              "<div class='row'>"+
                                "<div class='col-xs-6 col-sm-6 col-md-6'>"+
                                  "<address>"+
                                    "<strong>"+req.session.user.lastname+","+req.session.user.firstname+"</strong>"+
                                    "<br>"+req.session.user.location+"<br>"+req.session.user.city+"<br>"+
                                    "<abbr title='Phone'>P:</abbr>"+req.session.user.phone+
                                  "</address>"+
                                "</div>"+
                                "<div class='col-xs-6 col-sm-6 col-md-6 text-right'>"+
                                  "<p><em>Date:"+today+"</em></p>"+
                                  "<p><em>Order #:"+req.session.order_rcpt_number+"</em></p>"+
                                "</div>"+
                              "</div>"+
                              "<div class='row'>"+
                                "<div class='text-center'>"+
                                  "<h1>Receipt</h1>"+
                                "</div>"+
                                "<table class='table table-hover'>"+
                                  "<thead>"+
                                    "<tr>"+
                                      "<th>Item</th>"+
                                      "<th>#</th>"+
                                      "<th class='text-center'>Price</th>"+
                                      "<th class='text-center'>Total</th>"+
                                    "</tr>"+
                                  "</thead>"+
                                  "<tbody>";
                                  for(var i=0;i<itemPriceArray.length;i++){
                                    htmlMailFormate+="<tr>"+
                                      "<td class='col-md-9'><em>"+itemNameArray[i]+"</em></td>"+
                                      "<td class='col-md-1' style='text-align: center'>"+itemQtyArray[i]+"</td>"+
                                      "<td class='col-md-1 text-center'>"+itemPriceArray[i]+"</td>"+
                                      "<td class='col-md-1 text-center'>"+itemQtyArray[i]*itemPriceArray[i]+"</td>"
                                    "</tr>";
                                  }
                                    htmlMailFormate+="<tr>"+
                                      "<td>   </td>"+
                                      "<td>   </td>"+
                                      "<td class='text-right'>"+
                                        "<p><strong>Subtotal: </strong></p>"+
                                        "<p><strong>Tax: </strong></p>"+
                                      "</td>"+
                                      "<td class='text-center'>"+
                                        "<p><strong>"+total+"</strong></p>"+
                                        "<p><strong>0</strong></p>"+
                                      "</td>"+
                                    "</tr>"+
                                    "<tr>"+
                                      "<td>   </td>"+
                                      "<td>   </td>"+
                                      "<td class='text-right'><h4><strong>Total: </strong></h4></td>"+
                                      "<td class='text-center text-danger'>"+
                                        "<h4><strong>"+total+"</strong></h4>"+
                                      "</td>"+
                                    "</tr>"+
                                  "</tbody>"+
                                "</table>";
    var mailOptions = {
      from: 'nilshah.31@gmail.com',
      to: req.session.user.email,
      subject: 'Payment Receipt -' + req.session.order_rcpt_number + '-Team SouthMeal',
      html: htmlMailFormate
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    req.flash('success_msg','You have Succesfully Placed Order, Please note Down Order number for future Reference : '+req.session.order_rcpt_number);
    res.redirect('/');
});
