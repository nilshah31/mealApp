var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: '93c98651',
  apiSecret: 'd7ad3d8e371abb15'
});

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
	 if(number < 999){
    	generateRandomNumber();
    }
	return number;
}

module.exports.sendMessage = function(lastname,phone,token, callback){
	const toNumber = '91'+phone;
  /*	nexmo.message.sendSms(
  		'917204572637', toNumber, message,
    	(err, responseData) => {
      	if (err) {
        	console.log(err);
      	} else {
        	console.dir(responseData);
      	}
    	}
 	); */
 	callback(null,"Success");
}
