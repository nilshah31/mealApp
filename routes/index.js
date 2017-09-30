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
var item_counter;
var nodemailer = require('nodemailer');

var con_job_update_qty_noon = schedule.scheduleJob('00 12 * * *', function(){
    Item.updateItemQtyAll(function (err,results) {
        console.log(results);
    });
});

var con_job_update_qty_noon = schedule.scheduleJob('00 21 * * *', function(){
    Item.updateItemQtyAll(function (err,results) {
        console.log(results);
    });
});

var con_job_update_order_status = schedule.scheduleJob('00 12 * * *', function(){
    Order.updateOrderStatusAlltoCompleted(function (err,results) {
        console.log(results);
    });
});

var con_job_update_order_status = schedule.scheduleJob('00 21 * * *', function(){
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
            if(req.session.user.firstname) {
                var temp=false;
                Location.find(function (err, location_results) {
                    if(location_results.length>0){
                        location_results.forEach(function (item) {
                            if(item['company']==req.session.user.location){
                              if(req.session.order_itemID){
                                order_itemID = req.session.order_itemID;
                                order_itemName = req.session.order_itemName;
                                order_itemPrice = req.session.order_itemPrice;
                                order_itemQty = req.session.order_itemQty;
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
                                res.render('index', {
                                  i: 1,
                                  user: req.session.user,
                                  itemList: results,
                                  isLocationAvaible:true,
                                  object_item_hash:object_item_hash
                                });
                                temp=true;
                              }
                            else{
                              res.render('index', {
                                i: 1,
                                user: req.session.user,
                                itemList: results,
                                isLocationAvaible:true
                              });
                              temp=true;
                              }
                            }
                        });
                        if(temp==false)
                            res.render('index', {i: 1, user: req.session.user, itemList: results,isLocationAvaible:false});
                    }
                    else{
                        res.render('index', {i: 1, user: req.session.user, itemList: results,isLocationAvaible:false});
                    }
                });
            }
            else{
                req.session.user = null;
                res.render('index',{i: 1,user: null,itemList: results,isLocationAvaible:false});}
        else{
            req.session.user = null;
            res.render('index',{i: 1,user: null,itemList: results,isLocationAvaible:false});
		    }
	});
});

router.get('/admin', function(req, res){
    res.render('admin',{user: 'ADMIN'});
});

router.get('/forget_password', function(req, res){
    res.render('forget_password');
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
    if(req.session.user=='ADMIN'){
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
                        var ordr_dt = String(order_date.getDate()+1)+'/'+String(order_date.getMonth()+1)+'/'+String(order_date.getFullYear());
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
                    User.find(function(err, Userresults) {
                        if (err) return res.sendStatus(500);
                        res.render('adminDashboard', { user: req.session.user,userList : Userresults,locationList : Locationresults,itemList : Itemresults,object_item_hash:object_item_hash });
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
                var ordr_dt = String(order_date.getDate()+1) + '/' + String(order_date.getMonth()+1) + '/' + String(order_date.getFullYear());
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

router.post('/contact', function(req, res){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'nilshah.31@gmail.com',
        pass: 'NVD421nvd'
        }
    });

    var mailOptions = {
      from: 'sanjeevinifoods@gmail.com',
      to: String(req.body.email),
      subject: 'FeedBack-'+req.body.email+' - '+req.body.subject,
      html: '<p>Name : '+req.body.name+'<br />Mobile : '+req.body.mobile+'<br />Message : <br />'+req.body.message
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    if(req.session.user) {
        res.render('contact',{user: req.session.user});
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

router.post('/logoutAdmin', function(req, res) {
  delete req.session.user;
  req.logout();
  res.redirect('/admin');
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

router.post('/location_form', function(req, res) {
    var loc_id = req.body.location_ID;
    var myquery = { _id: loc_id };
    Location.remove(myquery, function(err, obj) {
        if (err) throw err;
        req.flash('success_msg','Removed Successfully');
        res.redirect('adminDashboard');
    });
});

router.post('/item_list_form', function(req, res) {
    var item_id = req.body.item_ID;
    var myquery = { _id: item_id };
    Item.remove(myquery, function(err, obj) {
        if (err) throw err;
        req.flash('success_msg','Removed Successfully');
        res.redirect('adminDashboard');
    });
});

router.post('/admin',function(req,res){
    var uname = req.body.userName;
    var pw = req.body.password;
    if(uname=='admin' && pw=='admin'){
        req.session.user = 'ADMIN';
        res.redirect('/adminDashboard');
    }
    else{
        req.flash('error_msg','Username/Password not matched');
        res.redirect('/admin');
    }
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

        if(object_item_hash.length!=0) {
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
            res.redirect('/pdf/order_del_report.pdf');
        }
        else{
            req.flash('error_msg','Couldnt find any order which placed today');
            res.redirect('adminDashboard');
        }
    });

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
        req.flash('success_msg','Added New Location');
        res.redirect('adminDashboard');
	});
});

router.post('/', function(req, res){
    req.session.order_itemID =  req.body.itemID;
    req.session.order_itemName =  req.body.itemName;
    req.session.order_itemQty =  req.body.itemQty;
    req.session.order_itemPrice =  req.body.itemPrice;
    //req.session.order_rcpt_number = ("MEAL"+stringGen(5)).replace(/ /g,'');
    req.session.order_rcpt_number = ("MEAL"+generateRandomNumber());
    res.redirect('payment');
});

router.post('/delete_multiple_items', function(req, res) {
    var id_array = String(req.body.delete_all_items_ids).split(',');
    for(var i = 1; i < id_array.length; i++) {
        var myquery = { _id: id_array[i] };
        Item.remove(myquery, function(err, obj) {
            if (err) throw err;
        });
    }
    req.flash('success_msg','Deleted All the Item\'s');
    res.redirect('adminDashboard');
});

router.post('/delete_multiple_location', function(req, res) {
    var id_array = String(req.body.delete_all_location_ids).split(',');
    for(var i = 1; i < id_array.length; i++) {
        console.log(id_array[i]);
        var myquery = { _id: id_array[i] };
        Location.remove(myquery, function(err, obj) {
            if (err) throw err;
        });
    }
    req.flash('success_msg','Deleted All the Location\'s');
    res.redirect('adminDashboard');
});

router.post('/user_edit_profile', function(req, res){
    var user_id = req.session.user._id;
    var fname=req.body.fname;
    var lname=req.body.lname;
    var city=req.body.city;
    var location=req.body.location;
    var email=req.body.email;
    User.updateuserProfile (req.session.user._id,fname,lname,email,city,location,function (err,result) {
    });
    req.flash('success_msg','Successfully Updated Profile');
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

    req.flash('success_msg','You have Succesfully Placed Order, Please note Down Order number for future Refrence : '+req.session.order_rcpt_number);

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nilshah.31@gmail.com',
        pass: 'NVD421nvd'
      }
    });

    var mailOptions = {
      from: 'nilshah.31@gmail.com',
      to: 'nilshah.31@gmail.com',
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


    res.redirect('/');

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
      item_counter = item_counter + 1;
});

Handlebars.registerHelper('ifCustomize', function(options) {
  if(item_counter%6) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('resetCounterVariable', function(options) {
    item_counter = 1;
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

Handlebars.registerHelper('returnYesNo', function(value,options) {
    if(value)
        return 'Yes';
    else
        return 'No'
});

Handlebars.registerHelper('checkUserIsAdmin', function(user,options) {
    if(user=='ADMIN')
        return options.fn(this);
    else
        return options.inverse(this);
});


Handlebars.registerHelper('checkFoodCatVeg', function(foodCat,options) {
    if(foodCat=='Veg')
        return options.fn(this);
    else
        return options.inverse(this);
});

Handlebars.registerHelper('checkItemActive', function(itemStatus,options) {
    if(itemStatus)
        return options.fn(this);
    else
        return options.inverse(this);
});

Handlebars.registerHelper('startItemLayoutCounter', function(options) {
    item_counter = 0;
});

function generateRandomNumber(){
	var number = Math.floor((Math.random()*10000));
	 if(number.length < 4 || number.length > 4){
    	generateRandomNumber();
    }
	return number;
}
