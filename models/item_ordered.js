var mongoose = require('mongoose');
var app = require('../app');

// ItemOrderedSchema
var ItemOrderedSchema = mongoose.Schema({
	item_name: {
		type: String
	},
  location: {
		type: String
	},
  total_ordered_placed:{
    type: Number,
    default: 0
  }
});

//Item Modal Handler
var ItemOrdered = module.exports = mongoose.model('ItemOrdered', ItemOrderedSchema);

//Store new Item
module.exports.createItemOrdered = function(newItemOrdered, callback){
	newItemOrdered.save(callback);
}
