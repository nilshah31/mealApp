var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Handlebars = require('handlebars');
var Location = require('../models/location');
var Item = require('../models/item');
var Order = require('../models/order');
var User = require('../models/user');
var Location = require('../models/location');

// Register
router.get('/register', function(req, res){
    Location.find(function(err, results){
        var unique_city_list = [];
        results.forEach(function(item) {
            if(unique_city_list.indexOf(item['city']) < 0) {
                unique_city_list.push(item['city']);
            }
        });
        if (err) return res.sendStatus(500);
        res.render('register', { cityList : unique_city_list, locationList : results });
    });
});

// Login
router.get('/login', function(req, res){
    if(req.session.user){
        res.redirect("/");
    }
    else {
        res.render('login');
    }
});

// Login
router.get('/loginVerify', function(req, res){
    var query = {phone: req.query.phone};
    User.findOne(query, function(err,results){
        User.updateuserTokan(results._id,function(err, results) {
            if (err) throw err;
            User.findOne(query, function(err,results){
                User.sendMessage(results.lastname, req.query.phone, results.token, function (err, result) {
                });
                if (results.verified == false) {
                    user = results;
                    res.render('loginVerify', {Current_User_Id: user._id});
                }
                else {
                    res.redirect('/');
                }
            });
        });
    });
});

// Register User
router.post('/register', function(req, res){
    firstname = req.body.fn;
    lastname = req.body.ln;
    email = req.body.email;
    phone = req.body.phone;
    location = req.body.location;
    city = req.body.city;
    password = req.body.password;
    cnfpassword = req.body.cnfpassword;

    // Validation
    req.checkBody('fn', 'FirstName is required').notEmpty();
    req.checkBody('ln', 'LastName is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('phone', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('cnfpassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors){
        res.render('register',{
            errors:errors
        });
    } else {
        var newUser = new User({
            firstname: firstname,
            lastname: lastname,
            password: password,
            email: email,
            phone: phone,
            city: city,
            location: location,
            password: password
        });
        User.createUser(newUser, function(err, user){
            if(err){
                throw err;
            }
        });
        res.redirect("/users/loginVerify?phone=" + req.body.phone);
    }
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserBymobNumber(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',function(req, res) {
    User.getUserBymobNumber(req.body.username, function(err, user){
        if(err) throw err;
        if(user){
            User.comparePassword(req.body.password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    User.updateuserTokan(user.id,function(err, result) {
                        if(err) throw err;
                        User.getUserBymobNumber(req.body.username, function(err, user){
                            if(user.verified==true) {
                                req.session.user = user;
                                req.flash('success_msg','Welcome To SouthMeal');
                                res.redirect('/');
                            }
                            else{
                                res.redirect("/users/loginVerify?phone=" + req.body.username);
                            }
                        });
                    });
                } else {
                    req.flash('error_msg','Username/Password not match');
                    res.redirect('/');
                }
            });
        }
        else{
            req.flash('error_msg','Username/Password not match');
            res.redirect('/');
        }
    });
});

router.post('/loginVerify',function(req, res) {
    token = req.body.token;
    id = req.body.userId;
    User.getUserByIdCustom(id, function(err, user) {
        UsrGeneratedtoken = user.token;
        if(UsrGeneratedtoken.match( token )){
            User.verifiedSucess(user.id,function(err,result){
                var now_date = new Date();
                if(isTokenExpires(user.token_exp)){
                    req.session.user = user;
                    res.redirect('/');
                }
            });
        }
    });
});

router.get('/logout', function(req, res){
    delete req.session.user;
    delete req.session.order_itemID;
    delete req.session.order_itemName;
    delete req.session.order_itemQty;
    delete req.session.order_itemPrice;
    delete req.session.order_rcpt_number;
    delete req.session.order_rcpt_number;
    delete req.session.sub_Total;
    req.logout();
    res.redirect('/');
});

module.exports = router;
//passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true})

function isTokenExpires(date_check)
{
    todaysDate = new Date();
    userDate = date_check.getDate();
    return((todaysDate.getDate()<=date_check.getDate()) && (todaysDate.getTime()>=date_check.getTime()));
}
