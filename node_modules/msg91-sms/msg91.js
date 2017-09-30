var request=require('request');


//*********************************************************************single number messages********************************************************************//


//send message to only one number
module.exports.sendOne=function(authkey,number,message,senderid,route,dialcode,callback)
{

var url='http://api.msg91.com/api/sendhttp.php?authkey='+authkey+'&mobiles='+number+'&message='+message+'&sender='+senderid+'&route='+route+'&country='+dialcode;
var encodeurl=encodeURI(url);
request(encodeurl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	
  	//check for error
  	CheckSmsError(body,function(response){
	callback(response);
  	});
  }

});


};

//with unicode
module.exports.sendOnewithUnicode=function(authkey,number,message,senderid,route,dialcode,callback)
{

var url='http://api.msg91.com/api/sendhttp.php?authkey='+authkey+'&mobiles='+number+'&message='+message+'&sender='+senderid+'&route='+route+'&country='+dialcode+'&unicode=1';
var encodeurl=encodeURI(url);
request(encodeurl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  //check for error
  	CheckSmsError(body,function(response){
	callback(response);
  	});
  }

});


};

//flash message
module.exports.sendOnewithFlash=function(authkey,number,message,senderid,route,dialcode,callback)
{

var url='http://api.msg91.com/api/sendhttp.php?authkey='+authkey+'&mobiles='+number+'&message='+message+'&sender='+senderid+'&route='+route+'&country='+dialcode+'&flash=1';
var encodeurl=encodeURI(url);
request(encodeurl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	
//check for error
  	CheckSmsError(body,function(response){
	callback(response);
  	});
  }

});


};

//json response
module.exports.sendOneandGetJson=function(authkey,number,message,senderid,route,dialcode,callback)
{

var url='http://api.msg91.com/api/sendhttp.php?authkey='+authkey+'&mobiles='+number+'&message='+message+'&sender='+senderid+'&route='+route+'&country='+dialcode+'&response=json';
var encodeurl=encodeURI(url);
request(encodeurl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	//check for error
  	CheckSmsError(body,function(response){
	callback(response);
  	});
  }

});


};

//Schedule message
//date should be yyyy-MM-dd time should be HH:mm:ss (24H format)
module.exports.scheduleOne=function(authkey,number,message,senderid,route,dialcode,date,time,callback)
{

var url='http://api.msg91.com/api/sendhttp.php?authkey='+authkey+'&mobiles='+number+'&message='+message+'&sender='+senderid+'&route='+route+'&country='+dialcode+'&schtime='+date+' '+time;
var encodeurl=encodeURI(url);
request(encodeurl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  //check for error
  	CheckSmsError(body,function(response){
	callback(response);
  	});
  }

});


};

//Schedule message with unicode
//date should be yyyy-MM-dd time should be HH:mm:ss (24H format)
module.exports.scheduleOnewithUnicode=function(authkey,number,message,senderid,route,dialcode,date,time,callback)
{

var url='http://api.msg91.com/api/sendhttp.php?authkey='+authkey+'&mobiles='+number+'&message='+message+'&sender='+senderid+'&route='+route+'&country='+dialcode+'&schtime='+date+' '+time+'&unicode=1';
var encodeurl=encodeURI(url);
request(encodeurl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	//check for error
  	CheckSmsError(body,function(response){
	callback(response);
  	});
  }

});


};

//******************************************************************************multiple numbers******************************************************************//

//send message to multiple numbers
module.exports.sendMultiple=function(authkey,numbers,message,senderid,route,dialcode,callback)
{

numbers.forEach(function(number){

var url='http://api.msg91.com/api/sendhttp.php?authkey='+authkey+'&mobiles='+number+'&message='+message+'&sender='+senderid+'&route='+route+'&country='+dialcode;
var encodeurl=encodeURI(url);
request(encodeurl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  //check for error
  	CheckSmsError(body,function(response){
	callback(response);
  	});
  }
});

});


};


//with unicode
module.exports.sendMultiplewithUnicode=function(authkey,numbers,message,senderid,route,dialcode,callback)
{

numbers.forEach(function(number){
var url='http://api.msg91.com/api/sendhttp.php?authkey='+authkey+'&mobiles='+number+'&message='+message+'&sender='+senderid+'&route='+route+'&country='+dialcode+'&unicode=1';
var encodeurl=encodeURI(url);
request(encodeurl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  //check for error
  	CheckSmsError(body,function(response){
	callback(response);
  	});
  }

});
});

};


//flash message
module.exports.sendMultiplewithFlash=function(authkey,numbers,message,senderid,route,dialcode,callback)
{

numbers.forEach(function(number){
var url='http://api.msg91.com/api/sendhttp.php?authkey='+authkey+'&mobiles='+number+'&message='+message+'&sender='+senderid+'&route='+route+'&country='+dialcode+'&flash=1';
var encodeurl=encodeURI(url);
request(encodeurl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  //check for error
  	CheckSmsError(body,function(response){
	callback(response);
  	});
  }

});
});

};

//json response
module.exports.sendMultipleandGetJson=function(authkey,numbers,messages,senderid,route,dialcode,callback)
{

numbers.forEach(function(number){
var url='http://api.msg91.com/api/sendhttp.php?authkey='+authkey+'&mobiles='+number+'&message='+message+'&sender='+senderid+'&route='+route+'&country='+dialcode+'&response=json';
var encodeurl=encodeURI(url);
request(encodeurl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  //check for error
  	CheckSmsError(body,function(response){
	callback(response);
  	});
  }

});
});

};

//Schedule message
//date should be yyyy-MM-dd time should be HH:mm:ss (24H format)
module.exports.scheduleMultiple=function(authkey,numbers,message,senderid,route,dialcode,date,time,callback)
{


numbers.forEach(function(number){
var url='http://api.msg91.com/api/sendhttp.php?authkey='+authkey+'&mobiles='+number+'&message='+message+'&sender='+senderid+'&route='+route+'&country='+dialcode+'&schtime='+date+' '+time;
var encodeurl=encodeURI(url);
request(encodeurl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  //check for error
  	CheckSmsError(body,function(response){
	callback(response);
  	});
  }

});
});

};

//Schedule message with unicode
//date should be yyyy-MM-dd time should be HH:mm:ss (24H format)
module.exports.scheduleMultiplewithUnicode=function(authkey,numbers,message,senderid,route,dialcode,date,time,callback)
{


numbers.forEach(function(number){
var url='http://api.msg91.com/api/sendhttp.php?authkey='+authkey+'&mobiles='+number+'&message='+message+'&sender='+senderid+'&route='+route+'&country='+dialcode+'&schtime='+date+' '+time+'&unicode=1';
var encodeurl=encodeURI(url);
request(encodeurl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  //check for error
  	CheckSmsError(body,function(response){
	callback(response);
  	});
  }

});
});

};

//**********************************************************************************send to group********************************************************************//
module.exports.sendtoGroup=function(authkey,message,senderid,groupid,callback)
{

var url='http://api.msg91.com/api/sendhttp.php?authkey='+authkey+'&message='+message+'&sender='+senderid+'&group_id='+groupid;
var encodeurl=encodeURI(url);
request(encodeurl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	//check for error
  	CheckSmsError(body,function(response){
	callback(response);
  	});
  }

});
};


//*********************************************************************************Voice SMS***************************************************************************//

//-----------------------send using draft file

//single number
module.exports.sendOneVoiceSmsusingDraft=function(authkey,number,draft_file_name,senderno,route,campaign,duration,schtimestart,schtimeend,callback)
{

var url='http://api.msg91.com/send_voice_mail.php?authkey='+authkey+'&campaign='+campaign+'&sender='+senderno+'&mobiles='+number+'&duration='+duration+'&draft_file_name'+draft_file_name+'&route='+route+'&schtimestart='+schtimestart+'&schtimeend'+schtimeend;
var encodeurl=encodeURI(url);
request(encodeurl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	//check for error
  	CheckVoiceSmsError(body,function(response){
	callback(response);
  	});
  }

});

}

//multiple numbers
module.exports.sendMVoiceSmsusingDraft=function(authkey,numbers,draft_file_name,senderno,route,campaign,duration,schtimestart,schtimeend,callback)
{
numbers.forEach(function(number){
var url='http://api.msg91.com/send_voice_mail.php?authkey='+authkey+'&campaign='+campaign+'&sender='+senderno+'&mobiles='+number+'&duration='+duration+'&draft_file_name'+draft_file_name+'&route='+route+'&schtimestart='+schtimestart+'&schtimeend'+schtimeend;
var encodeurl=encodeURI(url);
request(encodeurl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	//check for error
  	CheckVoiceSmsError(body,function(response){
	callback(response);
  	});
  }

});
});
}


//----------------------send using url of file

//single number
module.exports.sendVoiceSmsusingUrl=function(authkey,number,url_file_name,senderno,route,campaign,duration,schtimestart,schtimeend,callback)
{

var url='http://api.msg91.com/send_voice_mail.php?authkey='+authkey+'&campaign='+campaign+'&sender='+senderno+'&mobiles='+number+'&duration='+duration+'&url_file_name'+url_file_name+'&route='+route+'&schtimestart='+schtimestart+'&schtimeend'+schtimeend;
var encodeurl=encodeURI(url);
request(encodeurl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	//check for error
  	CheckVoiceSmsError(body,function(response){
	callback(response);
  	});
  }

});

}

//multiple number
module.exports.sendMVoiceSmsusingUrl=function(authkey,numbers,url_file_name,senderno,route,campaign,duration,schtimestart,schtimeend,callback)
{
numbers.forEach(function(number){
var url='http://api.msg91.com/send_voice_mail.php?authkey='+authkey+'&campaign='+campaign+'&sender='+senderno+'&mobiles='+number+'&duration='+duration+'&url_file_name'+url_file_name+'&route='+route+'&schtimestart='+schtimestart+'&schtimeend'+schtimeend;
var encodeurl=encodeURI(url);
request(encodeurl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	//check for error
  	CheckVoiceSmsError(body,function(response){
	callback(response);
  	});
  }

});
});
}

//check balance
module.exports.checkBalance=function(authkey,route,callback)
{

var url='http://api.msg91.com/api/balance.php?authkey='+authkey+'&type='+route;
var encodeurl=encodeURI(url);
request(encodeurl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    
    //check for error
    CheckSmsError(body,function(response){
  callback(response);
    });
  }

});

};



//check for error response
function CheckSmsError(body,callback)
{

switch(body)
{
case 'code: 101':
callback('Missing Mobile No.');
break;
case 'code: 102':
callback('Missing Message');
break;
case 'code: 103':
callback('Missing Password');
break;
case 'code: 202':
callback('Invalid Mobile No.');
break;
case 'code: 203':
callback('Invalid Sender ID');
break;
case 'code: 207':
callback('Auth Key Invalid');
break;
case 'code: 208':
callback('IP is black listed');
break;
case 'code: 301':
callback('Not Have Sufficient Balance to Send Sms');
break;
case 'code: 302':
callback('Expired User Account');
break;
case 'code: 303':
callback('Banned User Account.');
break;
case 'code: 306':
callback('This route is currently unavailable');
break;
case 'code: 307':
callback('Schedule time is Incorrect');
break;
case 'code: 308':
callback('Campaign name cannot greater than 32 characters');
break;
case 'code: 309':
callback('Selected group(s) may not belongs to you');
break;
case 'code: 310':
callback('SMS is too long. System pause this request automatically.');
break;
case 'code: 311':
callback('Request discarded because same request was generated twice within 10 seconds.');
break;
default:
callback(body);
}

}



//check for error response
function CheckVoiceSmsError(body,callback)
{

switch(body)
{
case 'code: 104':
callback('Missing Username.');
break;
case 'code: 105':
callback('Missing Password');
break;
case 'code: 201':
callback('Invalid Username Or Password');
break;
case 'code: 601':
callback('Sender ID must be numeric');
break;
case 'code: 602':
callback('Your Current Route is disabled,Kindly Select another Route');
break;
case 'code: 603':
callback('This Sender ID is blacklisted, Please Use a different Sender ID.');
break;
case 'code: 604':
callback('Please Enter Atleast One Correct Number To Send SMS');
break;
case 'code: 606':
callback('Scheduled Date Cannot Be More than Three Weeks');
break;
case 'code: 607':
callback('Please Enter Campaign Name');
break;
case 'code: 608':
callback('Scheduled SMS Cannot Be Less Than Current Time');
break;
case 'code: 609':
callback('End Time Cannot Be Less Than Or Equal To Schedule Time');
break;
case 'code: 610':
callback('Duration can not be set to be zero');
break;
case 'code: 614':
callback('No voice file found Please enter voice file and proceed');
break;
case 'code: 615':
callback('Invalid file Type,Allow Extension are wav,wave,mp3,wma,ra,m4a,arm');
break;
case 'code: 001':
callback('Unable To Connect Database');
break;
case 'code: 002':
callback('Unable To Select Database');
break;
default:
callback(body);
}

}