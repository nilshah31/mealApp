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
    },
    ordered_date:{
        type:String,
        default:""
    },
    session_time:{
        type: Number
    }
});

//Item Modal Handler
var ItemOrdered = module.exports = mongoose.model('ItemOrdered', ItemOrderedSchema);

//Store new Item
module.exports.createItemOrdered = function(newItemOrdered, callback){
    today = new Date();
    dd = today.getDate();
    mm = (today.getMonth())+1;
    yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    }
    if(mm<10){
        mm='0'+mm;
    }
    today_dt = yyyy +'-'+mm+'-'+dd;
    newItemOrdered.ordered_date = today_dt;
    newItemOrdered.save(callback);
}

module.exports.updateItemQtyAfterCancle = function(name,orderDate,newQty,callback){

    ItemOrdered.update({item_name:name,ordered_date:orderDate}, {$set:{total_ordered_placed:newQty}},function(err, result) {
        if(err) throw err;
        console.log(result);
    },callback);
}

module.exports.resetItemPlaced = function(callback){
    ItemOrdered.find({},function(err,results){
        for(i=0;i<results.length;i++){
            ItemOrdered.update({_id:results[i].id}, {$set:{total_ordered_placed:0}}, callback);
        }
    });
}
