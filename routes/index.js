var express = require('express');
var Handlebars = require('handlebars'); 
var router = express.Router();
var Location = require('../models/location');
var Item = require('../models/item');
var Order = require('../models/order');
module.exports = router;

/*
Item.updateItemQtyAll('ID',function (err,result) {

});

*/


router.get('/user_profile',function(req, res){
    res.render('user_profile',{user:req.session.user});
});

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	Item.find(function(err, results){
		if (err) return res.sendStatus(500);
		res.render('index',{i: 1,user: req.session.user,itemList: results});   	  
	});
});

router.get('/admin', function(req, res){
    res.render('admin',{user: req.session.user});
});

router.get('/contact', function(req, res){
    res.render('contact',{user: req.session.user});
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
                        status='Delevereid';
                    else
                        state='Cancled';
                    var order_date=new Date(String(results[i].order_date_time));
                    var ordr_dt = String(order_date.getDate())+'/'+String(order_date.getMonth())+'/'+String(order_date.getFullYear());
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
                res.render('adminDashboard', { locationList : Locationresults,itemList : Itemresults,object_item_hash:object_item_hash });
            });
        });
    });
});

router.get('/payment',function(req, res){
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

});

router.get('/user_order_history',function(req, res){
    var query = {user_id: req.session.user._id};
    //Retreive All the orders based on the the User
    Order.find(query,function(err, results,callback){
        if (err) return res.sendStatus(500);
        var object_item_hash = [];
        var total=0;
        for(var i=0;i<results.length;i++){
            if(results[i].status==0)
                status='Ordered';
            else if(results[i].status==1)
                status='Delevereid';
            else
                state='Cancled';
            var order_date=new Date(String(results[i].order_date_time));
            var ordr_dt = String(order_date.getDate())+'/'+String(order_date.getMonth())+'/'+String(order_date.getFullYear());
            object_item_hash.push({
                order_itemName:results[i].item_name,
                receipt_number:results[i].receipt_number,
                order_itemPrice:results[i].price,
                order_itemQty:results[i].qty,
                sub_Total:results[i].sub_Total,
                order_date: ordr_dt,
                status:status,
                total:results[i].total
            });
        }
        res.render('user_order_history',{user:req.session.user,object_item_hash:object_item_hash});
    });
});

router.post('/newItem', function(req, res){
	var path = require('path');
	var appDir = path.dirname(require.main.filename);
	var itemImage = req.files.item_img;
	// Use the mv() method to place the file somewhere on your server
	itemImage.mv(appDir+'\\public\\images\\'+itemImage.name, function(err) {
    if (err)
      return res.status(500).send(err);
    });
	var nameValue = req.body.itemNameTxtBox;
	var descriptionValue = req.body.descTxtBox;
	var initial_qtyValue = req.body.inititalQtyTxtBox; 
	var priceValue = req.body.priceTxtBox;
	var item_image_pathValue = '/images/'+itemImage.name;
	var newItem = new Item({
	    	name : nameValue,
			description : descriptionValue,
			initial_qty : initial_qtyValue,
			price : priceValue,
			item_image_path : item_image_pathValue,
            avaible_qty : initial_qtyValue
		});
	Item.createItem(newItem, function(err, Item){
	if(err) throw err;
	});
	Item.find(function(err, results){
		if (err) return res.sendStatus(500);
        req.flash('You have Scussfully Added New Item');
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

    Item.find(function(err, results){
        if (err) return res.sendStatus(500);
        res.render('index',{i: 1,itemList: results,user:req.session.user,message : 'You have Scussfully Placed Order'});
    });
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
