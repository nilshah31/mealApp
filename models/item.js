var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var app = require('../app');

// LocationSchema
var ItemSchema = mongoose.Schema({
	name: {
		type: String
	},
	description: {
		type: String
	},
	initial_qty: {
		type: String	
	},
	price: {
		type: String	
	},
	item_image_path: {
		type: String
	} 
});

var Item = module.exports = mongoose.model('Item', ItemSchema);

module.exports.createItem = function(newItem, callback){
	        newItem.save(callback);
	}

