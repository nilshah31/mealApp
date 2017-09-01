var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var sinchAuth = require('sinch-auth');
var sinchSms = require('sinch-messaging');


// User Schema
var UserSchema = mongoose.Schema({
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},	
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
	},
	phone: {
		type: String,
		required: true,
	},
	city: {
        type: String,
	},
	location: {
		type: String
	},
	verified: {
        type: Boolean,
        default: false,
    },
    token: {
        type: String,
        default: '',
    },
    token_exp: {
        type: Date,
        default: '',
    }
});

//User Modal Handler
var User = module.exports = mongoose.model('User', UserSchema);
//Create User and encode password
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}


module.exports.getUserBymobNumber = function(mobileNumber, callback){
	var query = {phone: mobileNumber};
	User.findOne(query, callback);
}

module.exports.getUserByIdCustom = function(id, callback){
	var query = {_id: id};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports.updateuserTokan = function(id, callback){
	var number = generateRandomNumber();
	User.update({_id:id}, {$set:{token:number,token_exp:new Date()}}, function(err, result) {
    	if(err) throw err;
    	callback(null,result);
    });
}





module.exports.verifiedSucess = function(id, callback){
	User.update({_id:id}, {$set:{verified:true}}, function(err, result) {
    	if(err) throw err;
    	callback(null,result);
    });
}

function generateRandomNumber(){
	var number = Math.floor((Math.random()*10000));
	 if(number.length < 4 || number.length > 4){
    	generateRandomNumber();
    }
	return number;
}

module.exports.sendMessage = function(lastname,phone,token, callback){
	const toNumber = '91'+phone;
	message = "Use "+token+" as one time password(OTP) to verify your mobile Number, Team MealAPP";
    var auth = sinchAuth("680458d3-6111-46c1-bcf9-7e009dc8da10", "v2xihZABnUS8dP92RuMvEA==");
    sinchSms.sendMessage(toNumber, message);
 	callback(null,"Success");
}
