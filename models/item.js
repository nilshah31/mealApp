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
	},
	avaible_qty:{
		type:String
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

module.exports.updateItemQty = function(id,orderedQty,callback){
    var query = {_id: id};
    Item.findOne(query, function(err,results){
        Item.update({_id:id}, {$set:{avaible_qty:String(parseInt(results.avaible_qty)-parseInt(orderedQty))}}, function(err, result) {
            if(err) throw err;
            callback(null,result);
		});
    });
}

module.exports.updateItemQtyAll = function(id,callback){
    Item.find({},function(err,results){
        for(i=0;i<results.length;i++){
    		Item.update({_id:results[i].id}, {$set:{avaible_qty:results[i].initial_qty}}, callback);
        }
    });
}
