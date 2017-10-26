//Delete all the unwanted handler's
var Handlebars = require('handlebars');

Handlebars.registerHelper('incrementCounterVariable', function(options) {
      item_counter = item_counter + 1;
});

Handlebars.registerHelper('ifCustomize', function(options) {
  if(item_counter%6) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('resetCounterVariable', function(options) {
    item_counter = 1;
});

Handlebars.registerHelper('checkIfUserSession', function(userSession, options) {
    if(userSession){
        return true;
    } else{
        return false;
    }
});

Handlebars.registerHelper('checkAvableQty', function(qty,options) {
    if(qty>0)
        return options.fn(this);
    else
        return options.inverse(this);
});

Handlebars.registerHelper('checkOrderStatus', function(orderStatus,options) {
    if(String(orderStatus)=='Ordered')
        return options.fn(this);
    else
        return options.inverse(this);
});

Handlebars.registerHelper('getOrderedQnty', function(avaible_qty,initial_qty,options) {
    return parseInt(initial_qty)-parseInt(avaible_qty);
});

Handlebars.registerHelper('returnYesNo', function(value,options) {
    if(value)
        return 'Yes';
    else
        return 'No'
});

Handlebars.registerHelper('checkUserIsAdmin', function(user,options) {
    if(user=='ADMIN')
        return options.fn(this);
    else
        return options.inverse(this);
});


Handlebars.registerHelper('checkFoodCatVeg', function(foodCat,options) {
    if(foodCat=='Veg')
        return options.fn(this);
    else
        return options.inverse(this);
});

Handlebars.registerHelper('checkItemActive', function(itemStatus,options) {
    if(itemStatus)
        return options.fn(this);
    else
        return options.inverse(this);
});

Handlebars.registerHelper('startItemLayoutCounter', function(options) {
    item_counter = 0;
});

function generateRandomNumber(){
	var number = Math.floor((Math.random()*10000));
	 if(number.length < 4 || number.length > 4){
    	generateRandomNumber();
    }
	return number;
}
