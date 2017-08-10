var express = require('express');
var router = express.Router();
var Location = require('../models/location');
var Item = require('../models/item');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	Item.find(function(err, results){
		if (err) return res.sendStatus(500);
		res.render('index',{user: req.session.user,itemList: results});   	  
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

router.get('/admin', function(req, res){
	res.render('admin');
});

router.get('/adminDashboard', function(req, res){
	Location.find(function(err, Locationresults){
	   if (err) return res.sendStatus(500);
	   Item.find(function(err, Itemresults){
	   	if (err) return res.sendStatus(500);
	   		res.render('adminDashboard', { locationList : Locationresults,itemList : Itemresults });   	  
		});
	});
});

module.exports = router;


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
			item_image_path : item_image_pathValue
		});
	Item.createItem(newItem, function(err, Item){
	if(err) throw err;
		console.log(Item);
	});
	Item.find(function(err, results){
		if (err) return res.sendStatus(500);
		res.render('adminDashboard', { itemList : results,message : 'You have Scussfully Added New Item'});   	  
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
		console.log(Location);
	});
	Location.find(function(err, results){
		if (err) return res.sendStatus(500);
	   	  res.render('adminDashboard', { locationList : results,message : 'You have Scussfully Added New Location'});   	  
	});
	
});