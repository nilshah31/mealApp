var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var fileUpload = require('express-fileupload');
var nodemailer = require('nodemailer');

//put all the credetionals in the envreiunement variablea and don't store on the github
var mongoURI="mongodb://localhost/mealapp"; //check this line
var MONGOLAB_URI = "mongodb://nilshah32:NVD420nvd@ds123614.mlab.com:23614/mealapp"; //check this line

global.base_dir = __dirname;
global.abs_path = function(path) {
    return base_dir + path;
}
global.include = function(file) {
    return require(abs_path('/' + file));
}

//are we really using prodcution variable like this?
if (process.env.NODE_ENV == "production"){
    mongoose.connect(MONGOLAB_URI);
}
else{
    mongoose.connect(mongoURI);
}

var db = mongoose.connection;

//get all controller
var index_controller = include('controller/index');
var users_controller = include('controller/users');
var admin_controller = include('controller/admin');
var user_order_history_controller = include('controller/user_order_history');
var payment_controller = include('controller/payment');
var user_edit_profile_controller = include('controller/user_edit_profile');
var forget_password_controller = include('controller/forget_password');
var contact_controller = include('controller/contact');

// Init App (with nodejs+express+handlebars)
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout',partialsDir: __dirname + '/views/partials/'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//fileupload
app.use(fileUpload());

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', index_controller);
app.use('/users', users_controller);
app.use('/',admin_controller);
app.use('/',admin_controller);
app.use('/',user_order_history_controller);
app.use('/',payment_controller);
app.use('/',user_edit_profile_controller);
app.use('/',forget_password_controller);
app.use('/',contact_controller);

// Set Port
app.set('port', (process.env.PORT || 8081));

var server = app.listen(app.get('port'), function(){
    console.log('Server started on port '+app.get('port'));
});
