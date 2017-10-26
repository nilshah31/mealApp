//confirm all the timing before we push code to the production
var schedule = require('node-schedule');
var Location = require('../models/location');
var Item = require('../models/item');
var Order = require('../models/order');
var ItemLocation = require('../models/item_location');
var User = require('../models/user');

var con_job_update_qty_noon = schedule.scheduleJob('00 12 * * *', function(){
    Item.updateItemQtyAll(function (err,results) {
        console.log("All Item Qnty succussfully updated"+String(results));
    });
});

var con_job_update_qty_noon = schedule.scheduleJob('00 12 * * *', function(){
    User.updateAvaibleLimitAll(function (err,results) {
        console.log("All Item Qnty succussfully updated"+String(results));
    });
});

var con_job_update_qty_noon = schedule.scheduleJob('00 21 * * *', function(){
    Item.updateItemQtyAll(function (err,results) {
        console.log(results);
    });
});

var con_job_update_order_status = schedule.scheduleJob('00 12 * * *', function(){
    Order.updateOrderStatusAlltoCompleted(function (err,results) {
        console.log("All Order Status has been updated to deleiverd(noon job)"+String(results));
    });
});

var con_job_update_order_status = schedule.scheduleJob('00 21 * * *', function(){
    Order.updateOrderStatusAlltoCompleted(function (err,results) {
        console.log("All Order Status has been updated to deleiverd(evening job)"+String(results));
    });
});
