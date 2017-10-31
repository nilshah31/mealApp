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

router.post('/user_order_history', function(req, res) {
    var myquery = { receipt_number: req.body.rcptnumber };
    Order.find(myquery,function(err,result){
      result = result;
      for(i=0;i<result.length;i++){
        var qurry_find_order = { name: result[i].item_name };
        Item.find(qurry_find_order,function(err,res){
          Item.updateItemQtyAfterCancle(res[0]._id,parseInt(res[0].avaible_qty)+parseInt(result[i-1].qty));
        });
      }
      User.addUserAmountLimit(req.session.user._id,parseInt(req.session.user.avaible_limit),parseInt(result[0].total),function(err,result){
        if(err) res.send(err);
      });
    });
    Order.updateOne(myquery, {$set:{status:'2'}}, function(err, res) {
        if (err) throw err;
    });
    res.redirect('/user_order_history');
});

router.get('/user_order_history',function(req, res){
    if(req.session.user) {
        var query = {user_id: req.session.user._id};
        //Retreive All the orders based on the the User
        Order.find(query, function (err, results, callback) {
            if (err) return res.sendStatus(500);
            var object_item_hash = [];
            var total = 0;
            for (var i = 0; i < results.length; i++) {
                if (results[i].status == 0)
                    status = 'Ordered';
                else if (results[i].status == 1)
                    status = 'Completed';
                else
                    status = 'Canceled';
                var order_date = new Date(String(results[i].order_date_time));
                var ordr_dt = String(order_date.getDate()) + '/' + String(order_date.getMonth()+1) + '/' + String(order_date.getFullYear());
                object_item_hash.push({
                    order_itemName: results[i].item_name,
                    receipt_number: results[i].receipt_number,
                    order_itemPrice: results[i].price,
                    order_itemQty: results[i].qty,
                    sub_Total: results[i].sub_Total,
                    order_date: ordr_dt,
                    status: status,
                    total: results[i].total
                });
            }
            res.render('user_order_history', {user: req.session.user, object_item_hash: object_item_hash});
        });
    }
    else
        res.redirect('/');
});
