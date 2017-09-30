var msg91=require('./msg91.js');

//Authentication Key 
var authkey='';

//for multiple numbers
var numbers=[];
numbers.push('');

//for single number
var number='';

var message='';

//Sender ID
var senderid='';

//Route
var route='';

//Country dial code
var dialcode='';

//date and time if sheduled message
//date should be yyyy-MM-dd and time should be HH:mm:ss (24H format)
var date='2015-11-22';
var time='20:19:20';

//Name of the Draft file
var draft_file_name='';

//Name of the folder
var campaign='';

//URL path of the file
var url_file_name='';

//group id of group
var groupid='';

//sender mobile no
var senderno='';

//when you want to schedule voice sms
//date should be yyyy-MM-dd and time should be HH:mm:ss (24H format)
var schtimestart='2015-11-13 09:00:00';
var schtimeend='2015-12-13 23:42:20';


//******************************************Send sms**********************************************//

//send to single number

msg91.sendOne(authkey,number,message,senderid,route,dialcode,function(response){

//Returns Message ID, If Sent Successfully or the appropriate Error Message
console.log(response);
});

//send to multiple numbers

msg91.sendMultiple(authkey,numbers,message,senderid,route,dialcode,function(response){

//Returns Message ID, If Sent Successfully or the appropriate Error Message
console.log(response);

});

//******************************************Send sms with unicode**********************************************//

//send to single number

msg91.sendOnewithUnicode(authkey,number,message,senderid,route,dialcode,function(response){

//Returns Message ID, If Sent Successfully or the appropriate Error Message
console.log(response);

});

//send to multiple numbers

msg91.sendMultiplewithUnicode(authkey,numbers,message,senderid,route,dialcode,function(response){

//Returns Message ID, If Sent Successfully or the appropriate Error Message
console.log(response);

});


//******************************************Send flash message**********************************************//

//send to single number

msg91.sendOnewithFlash(authkey,number,message,senderid,route,dialcode,function(response){

//Returns Message ID, If Sent Successfully or the appropriate Error Message
console.log(response);

});

//send to multiple numbers

msg91.sendMultiplewithFlash(authkey,numbers,message,senderid,route,dialcode,function(response){

//Returns Message ID, If Sent Successfully or the appropriate Error Message
console.log(response);

});

//******************************************Send sms and get json response**********************************************//

//send to single number

msg91.sendOneandGetJson(authkey,number,message,senderid,route,dialcode,function(response){

//Returns Message ID, If Sent Successfully or the appropriate Error Message
console.log(response);

});

//send to multiple numbers

msg91.sendMultipleandGetJson(authkey,numbers,messages,senderid,route,dialcode,function(response){

//Returns Message ID, If Sent Successfully or the appropriate Error Message
console.log(response);

});

//******************************************Schedule sms**********************************************//

//Schedule message
//date should be yyyy-MM-dd time should be HH:mm:ss (24H format)

//send to single number

msg91.scheduleOne(authkey,number,message,senderid,route,dialcode,date,time,function(response){


//Returns Message ID, If Sent Successfully or the appropriate Error Message
console.log(response);

});

//send to multiple numbers

msg91.scheduleMultiple(authkey,numbers,message,senderid,route,dialcode,date,time,function(response){

//Returns Message ID, If Sent Successfully or the appropriate Error Message
console.log(response);

});

//******************************************Schedule sms with unicode**********************************************//

//Schedule message
//date should be yyyy-MM-dd time should be HH:mm:ss (24H format)

//send to single number

msg91.scheduleOnewithUnicode(authkey,number,message,senderid,route,dialcode,date,time,function(response){


//Returns Message ID, If Sent Successfully or the appropriate Error Message
console.log(response);

});

//send to multiple numbers

msg91.scheduleMultiplewithUnicode(authkey,numbers,message,senderid,route,dialcode,date,time,function(response){

//Returns Message ID, If Sent Successfully or the appropriate Error Message
console.log(response);

});

//*******************************************Voice sms***************************************************//

//---------send using draft file

//send to single number

msg91.sendOneVoiceSmsusingDraft(authkey,number,draft_file_name,senderno,route,campaign,duration,schtimestart,schtimeend,function(response){

//Returns Message ID, If Sent Successfully or the appropriate Error Message
console.log(response);

});

//send to multiple numebrs

msg91.sendMVoiceSmsusingDraft(authkey,numbers,draft_file_name,senderno,route,campaign,duration,schtimestart,schtimeend,function(response){

//Returns Message ID, If Sent Successfully or the appropriate Error Message
console.log(response);

});

//-------------send using url of file

//send to single number

msg91.sendVoiceSmsusingUrl(authkey,number,url_file_name,senderno,route,campaign,duration,schtimestart,schtimeend,function(response){

//Returns Message ID, If Sent Successfully or the appropriate Error Message
console.log(response);

});

//send to multiple numebrs

msg91.sendMVoiceSmsusingUrl(authkey,numbers,url_file_name,senderno,route,campaign,duration,schtimestart,schtimeend,function(response){

//Returns Message ID, If Sent Successfully or the appropriate Error Message
console.log(response);

});

//*************************************************************Send to Group******************************************************//

msg91.sendtoGroup(authkey,message,senderid,groupid,function(response){

//Returns Message ID, If Sent Successfully or the appropriate Error Message
console.log(response);

});

//******************************************************check balance****************************************************//

msg91.checkBalance(authkey,route,function(response){

//get balance or the appropriate Error Message
console.log(response);

});