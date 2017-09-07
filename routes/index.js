var express = require('express');
var Handlebars = require('handlebars'); 
var router = express.Router();
var Location = require('../models/location');
var Item = require('../models/item');
var Order = require('../models/order');
var pdf = require('html-pdf');
var fs = require('fs');
var sinchAuth = require('sinch-auth');
var User = require('../models/user');
module.exports = router;
var schedule = require('node-schedule');

var con_job_update_qty_noon = schedule.scheduleJob('00 12 * * *', function(){
    Item.updateItemQtyAll('neel',function (err,results) {
        console.log(results);
    });
});

var con_job_update_qty_noon = schedule.scheduleJob('00 21 * * *', function(){
    Item.updateItemQtyAll('neel',function (err,results) {
        console.log(results);
    });
});

var con_job_update_order_status = schedule.scheduleJob('00 13 * * *', function(){
    Order.updateOrderStatusAlltoCompleted(function (err,results) {
        console.log(results);
    });
});

var con_job_update_order_status = schedule.scheduleJob('00 20 * * *', function(){
    Order.updateOrderStatusAlltoCompleted(function (err,results) {
        console.log(results);
    });
});

router.get('/user_profile',function(req, res){
    if(req.session.user)
        res.render('user_profile',{user:req.session.user});
    else
        res.redirect('/');
});

// Get Homepage
router.get('/', function(req, res){
    Item.find(function(err, results){
        if (err) return res.sendStatus(500);
        if(req.session.user)
            if(req.session.user.firstname)
                res.render('index',{i: 1,user: req.session.user,itemList: results});
		    else{
                req.session.user = null;
                res.render('index',{i: 1,user: null,itemList: results});}
        else{
            req.session.user = null;
            res.render('index',{i: 1,user: null,itemList: results});
		    }
	});
});

router.get('/admin', function(req, res){
    res.render('admin',{user: req.session.user});
});

router.get('/user_password_update', function(req, res){
    if(req.session.user) {
        res.render('user_password_update', {user: req.session.user});
    }
    else
        res.redirect('/');
});

router.get('/user_edit_profile', function(req, res){
    if(req.session.user) {
        User.getUserBymobNumber(req.session.user.phone, function (err, user) {
            req.session.user = user;
        });
        console.log(req.session.user);
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


router.get('/contact', function(req, res){
    if(req.session.user) {
        res.render('contact',{user: req.session.user});
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

router.get('/adminDashboard', function(req, res){
    Location.find(function(err, Locationresults){
        if (err) return res.sendStatus(500);
        Item.find(function(err, Itemresults){
            if (err) return res.sendStatus(500);
            Order.find(function(err, results,callback){
                if (err) return res.sendStatus(500);
                var object_item_hash = [];
                var total=0;
                for(var i=0;i<results.length;i++){
                    if(results[i].status==0)
                        status='Ordered';
                    else if(results[i].status==1)
                        status='Completed';
                    else
                        status='Cancled';
                    var order_date=new Date(String(results[i].order_date_time));
                    var ordr_dt = String(order_date.getDate())+'/'+String(order_date.getMonth()+1)+'/'+String(order_date.getFullYear());
                    object_item_hash.push({
                        order_itemName:results[i].item_name,
                        order_itemPrice:results[i].price,
                        order_itemQty:results[i].qty,
                        sub_Total:results[i].sub_Total,
                        order_date: ordr_dt,
                        status:status,
                        total:results[i].total
                    });
                }
                User.find(function(err, Userresults) {
                    if (err) return res.sendStatus(500);
                    res.render('adminDashboard', { userList : Userresults,locationList : Locationresults,itemList : Itemresults,object_item_hash:object_item_hash });
                });
            });
        });
    });
});

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
                    status = 'Cancled';
                var order_date = new Date(String(results[i].order_date_time));
                var ordr_dt = String(order_date.getDate()) + '/' + String(order_date.getMonth()) + '/' + String(order_date.getFullYear());
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

router.post('/user_order_history', function(req, res) {
    var myquery = { receipt_number: req.body.rcptnumber };
    Order.updateOne(myquery, {$set:{status:'2'}}, function(err, res) {
        if (err) throw err;
    });
    res.redirect('/user_order_history');
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

router.post('/location_form', function(req, res) {
    var loc_id = req.body.location_ID;
    console.log(loc_id);
    var myquery = { _id: loc_id };
    Location.remove(myquery, function(err, obj) {
        if (err) throw err;
        console.log(obj.result.n + " document(s) deleted");
        res.redirect('adminDashboard');
    });
});

router.post('/item_list_form', function(req, res) {
    var item_id = req.body.item_ID;
    var myquery = { _id: item_id };
    Item.remove(myquery, function(err, obj) {
        if (err) throw err;
        console.log(obj.result.n + " document(s) deleted");
        res.redirect('adminDashboard');
    });
});

router.get('/print_del_report', function(req, res) {
    var options = { format: 'Letter' };

    Order.find(function(err, results,callback){
        if (err) return res.sendStatus(500);
        var object_item_hash = [];
        var total=0;
        for(var i=0;i<results.length;i++){
            if(results[i].status==0)
                status='Ordered';
            else if(results[i].status==1)
                status='Completed';
            else
                status='Cancled';
            var order_date=new Date(String(results[i].order_date_time));
            var ordr_dt = String(order_date.getDate())+'/'+String(order_date.getMonth()+1)+'/'+String(order_date.getFullYear());
            console.log(ordr_dt);

            var todaysDate=new Date();

            if( (order_date.getDate() == (todaysDate.getDate())) && (order_date.getMonth()+1 == (todaysDate.getMonth()+1)) && (order_date.getFullYear() == (todaysDate.getFullYear())))
            {
                object_item_hash.push({
                    user_id:results[i].user_id,
                    order_itemName:results[i].item_name,
                    order_itemPrice:results[i].price,
                    order_itemQty:results[i].qty,
                    receipt_number:results[i].receipt_number,
                    sub_Total:results[i].sub_Total,
                    order_date: ordr_dt,
                    status:status,
                    total:results[i].total
                });
            }
        }

        if(object_item_hash) {
            var htmlString = "";

            htmlString += "<h1>Deleivery Report for " + object_item_hash[0].order_date + "</h1><br />";

            htmlString += "<div class=\"table-responsive\">\n" +
                "    <table id=\"myTable\">\n" +
                "        <tr class=\"header\">\n" +
                "            <th>Order Date <span class=\"glyphicon glyphicon-sort\"></span></th>\n" +
                "            <th>Receipt Number <span class=\"glyphicon glyphicon-sort\"></span></th>\n" +
                "            <th>Item</th>\n" +
                "            <th># <span class=\"glyphicon glyphicon-sort\"></span></th>\n" +
                "            <th>Price <span class=\"glyphicon glyphicon-sort\"></span></th>\n" +
                "            <th>Bill Amount <span class=\"glyphicon glyphicon-sort\"></span></th>\n" +
                "            <th>Status <span class=\"glyphicon glyphicon-sort\"></span></th>\n" +
                "        </tr>\n";
            for (var i = 0; i < object_item_hash.length; i++) {

                htmlString +=
                    "            <tr>\n" +
                    "                <td>" + object_item_hash[i].order_date + "</td>\n" +
                    "                <td>" + object_item_hash[i].receipt_number + "</td>\n" +
                    "                <td>" + object_item_hash[i].order_itemName + "</td>\n" +
                    "                <td>" + object_item_hash[i].order_itemQty + "</td>" +
                    "                <td>" + object_item_hash[i].order_itemPrice + "</td>" +
                    "                <td>" + object_item_hash[i].total + "</td>\n" +
                    "                <td>" + object_item_hash[i].status + "</td>\n" +
                    "                </td>\n" +
                    "            </tr>\n";
            }
            htmlString +=
                "    </table>\n" +
                "</div>\n" +
                "<br />";
            pdf.create(htmlString, options).toFile(process.cwd() + '//public//pdf//order_del_report.pdf', function (err, result) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
            })

            res.redirect(process.cwd() + '//public//pdf//order_del_report.pdf');
        }
        else{
            res.redirect('adminDashboard');
        }
    });

});

router.post('/newItem', function(req, res){
	var path = require('path');
	var appDir = path.dirname(require.main.filename);
	var itemImage = req.files.item_img;
    //Move Images to Server
	itemImage.mv(process.cwd()+'//public//images//'+itemImage.name, function(err) {

    if (err)
      return res.status(500).send(err);
    });
	var nameValue = req.body.itemNameTxtBox;
	var descriptionValue = req.body.descTxtBox;
	var initial_qtyValue = req.body.inititalQtyTxtBox; 
	var priceValue = req.body.priceTxtBox;
	var item_image_pathValue = '/images//'+itemImage.name;
	var newItem = new Item({
	    	name : nameValue,
			description : descriptionValue,
			initial_qty : initial_qtyValue,
			price : priceValue,
			item_image_path : item_image_pathValue,
            avaible_qty : initial_qtyValue
		});
	Item.createItem(newItem, function(err, Item){
	if(err) res.render('adminDashboard',{msg_err:"Something Went Wrong Please try again!"});
	});
	Item.find(function(err, results){
		if (err) return res.sendStatus(500);
        res.redirect('adminDashboard');
	});
});

router.post('/newLocation', function(req, res){
	var cityTxtBox = req.body.cityTxtBox;
	var locationTxtBox = req.body.locationTxtBox;
	var newLocation = new Location({
		city : cityTxtBox,
		company : locationTxtBox  
	});
	Location.createLocation(newLocation, function(err, Location){
		if(err) throw err;
	});
	Location.find(function(err, results){
		if (err) return res.sendStatus(500);
        req.flash('You have Scussfully Added New Location');
        res.redirect('adminDashboard');
	});
});

router.post('/', function(req, res){
    req.session.order_itemID =  req.body.itemID;
    req.session.order_itemName =  req.body.itemName;
    req.session.order_itemQty =  req.body.itemQty;
    req.session.order_itemPrice =  req.body.itemPrice;
    req.session.order_rcpt_number = ("MEAL"+stringGen(5)).replace(/ /g,'');
    res.redirect('payment');
});

router.post('/user_edit_profile', function(req, res){
    console.log("Coming Here")
    var user_id = req.session.user._id;
    var fname=req.body.fname;
    var lname=req.body.lname;
    var city=req.body.city;
    var location=req.body.location;
    var email=req.body.email;
    User.updateuserProfile (req.session.user._id,fname,lname,email,city,location,function (err,result) {
    });
    res.redirect('/user_edit_profile');
});

function stringGen(len)
{
    var text = " ";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}

router.post('/payment', function(req, res){

	//Creating Order
    order_itemID = req.session.order_itemID;
    order_itemName = req.session.order_itemName;
    order_itemPrice = req.session.order_itemPrice;
    order_itemQty = req.session.order_itemQty;

    total=0;

    itemIDArray = String(req.session.order_itemID).split(',');
    itemPriceArray = String(req.session.order_itemPrice).split(',');
    itemQtyArray = String(req.session.order_itemQty).split(',');

    for(var i=0;i<itemPriceArray.length;i++){
 		total+=parseInt(itemPriceArray[i])*parseInt(itemQtyArray[i]);
        Item.updateItemQty(itemIDArray[i],itemQtyArray[i],function(err, result){
            if(err) throw err;
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
        order_date_time:new Date()
    });
    Order.createOrder(newOrder, function(err, OrderResult){
        if(err) throw err;
    });

    res.redirect('/');
    /*Item.find(function(err, results){
        if (err) return res.sendStatus(500);
        res.render('index',{i: 1,itemList: results,user:req.session.user,message : 'You have Scussfully Placed Order, Please note down your Order' +
        'Number : '+req.session.order_rcpt_number});
    });*/
});

function ensureAuthenticated(req, res, next){
    if(req.session.user){
        return next();
    } else {
        req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

Handlebars.registerHelper('incrementCounterVariable', function(options) {
    i = i + 1;
});

Handlebars.registerHelper('ifCustomize', function(conditional, options) {
    if(conditional%4) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('resetCounterVariable', function(options) {
    i = 1;
});

Handlebars.registerHelper('checkIfUserSession', function(userSession, options) {
    if(userSession){
        return true;
    } else{
        return false;
    }
});

Handlebars.registerHelper('checkAvableQty', function(qty,options) {
    if(qty>0)
        return options.fn(this);
    else
        return options.inverse(this);
});

Handlebars.registerHelper('checkOrderStatus', function(orderStatus,options) {
    if(String(orderStatus)=='Ordered')
        return options.fn(this);
    else
        return options.inverse(this);
});

Handlebars.registerHelper('getOrderedQnty', function(avaible_qty,initial_qty,options) {
    return parseInt(initial_qty)-parseInt(avaible_qty);
});