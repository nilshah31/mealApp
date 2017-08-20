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

//Item Modal Handler
var Item = module.exports = mongoose.model('Item', ItemSchema);

//Store new Item
module.exports.createItem = function(newItem, callback){
	        newItem.save(callback);
	}

//get item row by Item ID
module.exports.getItemByIdCustom = function(id, callback){
    var query = {_id: id};
    Item.findOne(query, callback);
}
