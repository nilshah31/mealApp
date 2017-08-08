var express = require('express');
var router = express.Router();
var Location = require('../models/location');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index',{user: req.session.user});
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
	Location.find(function(err, results){
	   if (err) return res.sendStatus(500);
	   res.render('adminDashboard', { locationList : results });   	  
	});
});

module.exports = router;

router.post('/adminDashboard', function(req, res){
	if(req.body.cityTxtBox){
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
	}
});