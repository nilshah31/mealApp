var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var msg91=require('msg91-sms');

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
	},
	phone: {
		type: String,
		required: true,
		unique: true,
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
  },
	avaible_limit: {
		type: Number,
		default: 200
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

module.exports.getUserByemailId = function(emailId, callback){
	var query = {email: emailId};
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
	User.update({_id:id}, {$set:{token:number,token_exp:new Date()}},
			function(err, result) {
    		if(err) callback(err,result);
    		callback(null,result);
    	});
}

module.exports.updateUserAmountLimit = function(id,user_current_avble_limit,order_value, callback){
	User.update({_id:id}, {$set:{avaible_limit:(user_current_avble_limit-order_value)}}, function(err, result) {
    	if(err) throw err;
    	callback(null,result);
    });
}

module.exports.updateAvaibleLimitAll = function(callback){
	User.find({},function(err,results){
		for(i=0;i<results.length;i++){
			User.update({_id:results[i].id}, {$set:{avaible_limit:200}}, callback);
		}
	});
}

module.exports.updateuserPassword = function(id,newPassword, callback){
	newPassword = String(newPassword);
	bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newPassword, salt, function(err, hash) {
					  User.update({_id:id}, {$set:{password:hash}}, function(err, result) {
                if(err) throw err;
                callback(null,result);
            });
        });
    });
}

module.exports.updateuserProfile = function(id,firstname,lastname,email,city,location, callback) {
    User.update({_id:id}, {$set:
				{
					firstname:firstname,
					lastname:lastname,
					email:email,
					city:city,
					location:location}
				},
				function(err, result) {
        	if (err) throw err;
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
	const toNumber = phone;
	message = "Use "+token+" as one time password(OTP) to verify your mobile Number, Team SouthMeal";
	//Authentication Key
	var authkey='172686AFa99wwG459a99ac6';
	//for single number
	var number=toNumber;
	//Sender ID
	var senderid='MSGIND';
	//Route
	var route='';
	//Country dial code
	var dialcode='91';
	//send to single number
	msg91.sendOne(authkey,number,message,senderid,route,dialcode,function(response){
		//Returns Message ID, If Sent Successfully or the appropriate Error Message
		console.log(response);
	});
}
