var mongoose = require('mongoose');
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

module.exports.updateLocationDetails = function(id,location_detail,callback){
    var query = {_id: id};
    Location.findOne(query, function(err,results){
        Location.update({_id:id}, {$set:{city:location_detail.city,company:location_detail.company}},
            function(err, result) {
                if(err) throw err;
                callback(null,result);
            });
    });
}
