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

router.get('/admin', function(req, res){
    res.render('admin',{user: 'ADMIN'});
});

router.get('/adminDashboard', function(req, res){
    if(req.session.userAdmin=='ADMIN'){
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
                            user_id:results[i].user_id,
                            order_itemName:results[i].item_name,
                            receipt_number:results[i].receipt_number,
                            order_itemPrice:results[i].price,
                            order_itemQty:results[i].qty,
                            sub_Total:results[i].sub_Total,
                            order_date: ordr_dt,
                            status:status,
                            total:results[i].total,
                            order_from_location:results[i].order_location,
                            delivery_address:results[i].delivery_address
                        });
                    }
                    User.find(function(err, Userresults) {
                        if (err) return res.sendStatus(500);
                        for(i=0;i<object_item_hash.length;i++){
                          for(j=0;j<Userresults.length;j++){
                            if(String(object_item_hash[i].user_id)==String(Userresults[j]._id)){
                              object_item_hash[i].user_firstName = Userresults[j].firstname;
                              object_item_hash[i].phone_number = Userresults[j].phone;
                            }
                          }
                        }
                        ItemOrdered.find({},function(err,item_ordered_result){
                          ItemLocation.find({},function(err,item_location_result){
                              res.render('adminDashboard', { user: req.session.userAdmin,
                                                       userList : Userresults,
                                                       locationList : Locationresults,
                                                       itemList : Itemresults,
                                                       object_item_hash:object_item_hash,
                                                       item_ordered_list:item_ordered_result,
                                                       item_location_result:item_location_result  });
                              });
                       });
                    });
                });
            });
        });
        }
    else{
        req.flash('error_msg','You dont have Permission to access Admin Page');
        res.redirect('/');
    }
});

/*Check if these functions require anymore
router.post('/update_item_status_active', function(req, res) {
    var myquery = { _id: req.body.item_status_id_active };
    Item.updateOne(myquery, {$set:{active:false}}, function(err, res) {
        if (err) throw err;
    });
    res.redirect('/adminDashboard');
});

router.post('/update_item_status_inactive', function(req, res) {
    var myquery = { _id: req.body.item_status_id_inactive };
    Item.updateOne(myquery, {$set:{active:true}}, function(err, res) {
        if (err) throw err;
    });
    res.redirect('/adminDashboard');
});
*/

router.post('/logoutAdmin', function(req, res) {
  delete req.session.userAdmin;
  req.logout();
  res.redirect('/admin');
});

//Admin Login Request
router.post('/admin',function(req,res){
    var uname = req.body.userName;
    var pw = req.body.password;
    if(uname=='admin' && pw=='admin'){
        req.session.userAdmin = 'ADMIN';
        res.redirect('/adminDashboard');
    }
    else{
        req.flash('error_msg','Username/Password not matched');
        res.redirect('/admin');
    }
});

router.post('/editItem', function(req, res) {
    var path = require('path');
    var appDir = path.dirname(require.main.filename);
    var itemImage = req.files.edit_item_img;
    var item_id = req.body.editItemId;
    //Move Images to Server
    itemImage.mv(process.cwd()+'//public//images//'+itemImage.name, function(err) {
        if (err)
            return res.status(500).send(err);
    });
    var nameValue = req.body.edititemNameTxtBox;
    var descriptionValue = req.body.editdescTxtBox;
    var initial_qtyValue = req.body.editinititalQtyTxtBox;
    var priceValue = req.body.editpriceTxtBox;
    var category = req.body.editcategory;
    var item_image_pathValue = '/images//'+itemImage.name;
    var newItem = new Item({
        name : nameValue,
        description : descriptionValue,
        initial_qty : initial_qtyValue,
        price : priceValue,
        item_image_path : item_image_pathValue,
        avaible_qty : initial_qtyValue,
        category : category
    });
    Item.updateItemDetails(item_id,newItem, function(err, Item){
        if(err) res.render('adminDashboard',{msg_err:"Something Went Wrong Please try again!"});
    });
    Item.find(function(err, results){
        if (err) return res.sendStatus(500);
        req.flash('success_msg','Item Updated Successfully');
        res.redirect('adminDashboard');
    });
});

router.post('/editLocation', function(req, res) {
    var location_id = req.body.locationItemId;
    var cityTxtBox = req.body.cityeditTxtBox;
    var locationTxtBox = req.body.locationeditTxtBox;
    var newLocation = new Location({
        city : cityTxtBox,
        company : locationTxtBox
    });

    Location.updateLocationDetails(location_id,newLocation, function(err, Item){
        if(err) res.render('adminDashboard',{msg_err:"Something Went Wrong Please try again!"});
    });
    Location.find(function(err, results){
        if (err) return res.sendStatus(500);
        req.flash('success_msg','Location Updated Successfully');
        res.redirect('adminDashboard');
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
	var category = req.body.category;
	var newItem = new Item({
	    	name : nameValue,
			description : descriptionValue,
			initial_qty : initial_qtyValue,
			price : priceValue,
			item_image_path : item_image_pathValue,
            avaible_qty : initial_qtyValue,
            category : category
		});
	Item.createItem(newItem, function(err, Item){
	if(err) res.render('adminDashboard',{msg_err:"Something Went Wrong Please try again!"});
	});
    Item.find(function(err, results){
        req.flash('success_msg','Item Added Successfully');
        res.redirect('adminDashboard');
	});
});

//convert this to ajax call
router.post('/delete_multiple_items', function(req, res) {
    var id_array = String(req.body.delete_all_items_ids).split(',');
    for(var i = 1; i < id_array.length; i++) {
        var myquery = { _id: id_array[i] };
        Item.remove(myquery, function(err, obj) {
            if (err) res.sendStatus(500);
        });
    }
    req.flash('success_msg','Deleted All the Item\'s');
    res.redirect('adminDashboard');
});

//convert this to ajax call
router.post('/delete_multiple_location', function(req, res) {
    var id_array = String(req.body.delete_all_location_ids).split(',');
    for(var i = 1; i < id_array.length; i++) {
        console.log(id_array[i]);
        var myquery = { _id: id_array[i] };
        Location.remove(myquery, function(err, obj) {
            if (err) res.sendStatus(500);
        });
    }
    req.flash('success_msg','Deleted All the Location\'s');
    res.redirect('adminDashboard');
});

//Handle all ajax callback
//can't we handle error using http status code?
router.post('/dbs/addLocationtoMenu',function (req, res){
  var item_id = req.body.item_id;
  var location_id = req.body.location_id;
  var myquery = { item_id : item_id, location_id: location_id };
  ItemLocation.find(myquery,function(err, results){
    if(err) res.send(err);
    if(results.length==0){
      var newItemLocation = new ItemLocation({
    		item_id : item_id,
    		location_id : location_id
    	});
    	ItemLocation.createItemLocation(newItemLocation, function(err, ItemLocation){
        if (err) res.send(err) ;
        res.sendStatus(200);
    	});
    }
  });
});

router.post('/dbs/removeLocationtoMenu',function (req, res){
  var item_id = req.body.item_id;
  var location_id = req.body.location_id;
  var myquery = { item_id : item_id, location_id: location_id };
  ItemLocation.find(myquery,function(err, results){
    if(err) res.send(err);
    if(results){
    	ItemLocation.remove(myquery, function(err, ItemLocation){
        if (err) res.send(err) ;
        res.sendStatus(200);
    	});
    }
  });
});

router.post('/dbs/removeItem/:id',function (req, res){
  var item_id = req.params.id;
  var myquery = { _id: item_id };
  Item.remove(myquery, function(err, obj) {
      if (err) res.send(err) ;
      res.sendStatus(200);
  });
});

router.post('/dbs/removeLocation/:id',function (req, res){
  var loc_id = req.params.id;
  var myquery = { _id: loc_id };
  Location.remove(myquery, function(err, obj) {
      if (err) res.send(err) ;
      res.sendStatus(200);
  });
});

router.post('/dbs/addLocation',function (req, res){
  var cityTxtBox = req.body.city;
	var locationTxtBox = req.body.company;
  var newLocation = new Location({
		city : cityTxtBox,
		company : locationTxtBox
	});
	Location.createLocation(newLocation, function(err, Location){
    if (err) res.send(err) ;
    res.send(Location._id);
	});
});
