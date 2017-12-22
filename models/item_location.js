var mongoose = require('mongoose');
var app = require('../app');

// ItemLocationSchema
var ItemLocationSchema = mongoose.Schema({
    item_id: {
        type: String
    },
    location_id: {
        type: String
    }
});

//Item Modal Handler
var ItemLocation = module.exports = mongoose.model('ItemLocation', ItemLocationSchema);

//Store new Item
module.exports.createItemLocation = function(newItemLocation, callback){
    newItemLocation.save(callback);
}
