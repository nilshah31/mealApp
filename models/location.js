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

var Location = module.exports = mongoose.model('Location', LocationSchema);

module.exports.createLocation = function(newLocation, callback){
	        newLocation.save(callback);
	}

module.exports.getCompanyByName = function(com_name, callback){
	var query = {company: com_name};
	Location.find(callback);
}
