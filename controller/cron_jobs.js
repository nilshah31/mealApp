//confirm all the timing before we push code to the production
var schedule = require('node-schedule');
var Location = require('../models/location');
var Item = require('../models/item');
var Order = require('../models/order');
var ItemLocation = require('../models/item_location');
var User = require('../models/user');
var ItemOrdered = require('../models/item_ordered');

var con_job_update_qty_noon = schedule.scheduleJob('00 12 * * *', function(){
    Item.updateItemQtyAll(function (err,results) {
        console.log("All Item Qnty succussfully updated"+String(results));
    });
});

var con_job_update_user_limit_noon = schedule.scheduleJob('00 12 * * *', function(){
    User.updateAvaibleLimitAll(function (err,results) {
        console.log("User Limit has been succussfully updated"+String(results));
    });
});

var con_job_update_qty_evn = schedule.scheduleJob('00 21 * * *', function(){
    Item.updateItemQtyAll(function (err,results) {
        console.log(results);
    });
});

var con_job_update_user_limit_evn = schedule.scheduleJob('00 21 * * *', function(){
    User.updateAvaibleLimitAll(function (err,results) {
        console.log("User Limit has been succussfully updated"+String(results));
    });
});

var con_job_update_order_status_noon = schedule.scheduleJob('00 12 * * *', function(){
    Order.updateOrderStatusAlltoCompleted(function (err,results) {
        console.log("All Order Status has been updated to deleiverd(noon job)"+String(results));
    });
});

var con_job_update_order_status_evn = schedule.scheduleJob('00 21 * * *', function(){
    Order.updateOrderStatusAlltoCompleted(function (err,results) {
        console.log("All Order Status has been updated to deleiverd(evening job)"+String(results));
    });
});

var con_job_reset_item_placed_noon = schedule.scheduleJob('00 12 * * *', function(){
    ItemOrdered.resetItemPlaced(function (err,results) {
        console.log("All Order Item Has Been Reseted"+String(results));
    });
});

var con_job_reset_item_placed_evn = schedule.scheduleJob('00 21 * * *', function(){
    ItemOrdered.resetItemPlaced(function (err,results) {
        console.log("All Order Item Has Been Reseted"+String(results));
    });
});
