var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var app = require('../app');

// LocationSchema
var OrderSchema = mongoose.Schema({
	user_id: {
		type: String
	},
	item_name: {
		type: String
	},
	qty: {
		type: String	
	},
	price: {
		type: String	
	},
	sub_total: {
		type: String
	},
	total:{
		type: Number
	},
    delivery_date_time: {
		type: Date
	},
	order_date_time: {
        type: Date
	},
	status:{
		type: String,
		default:0
	}
});

//Order Modal Handler
var Order = module.exports = mongoose.model('Order', OrderSchema);

//Create New Order
module.exports.createOrder = function(newOrder, callback){
	        newOrder.save(callback);
	}

