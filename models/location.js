var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var app = require('../app');

// LocationSchema
var LocationSchema = mongoose.Schema({
	city: {
		type: String
	},
	company: {
		type: String
	}
});

//Location Modal Handler
var Location = module.exports = mongoose.model('Location', LocationSchema);

//Store New Location
module.exports.createLocation = function(newLocation, callback){
	        newLocation.save(callback);
	}

//find Company Name by City
module.exports.getCompanyByName = function(com_name, callback){
	var query = {company: com_name};
	Location.find(callback);
}
