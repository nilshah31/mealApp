var express = require('express');
var Handlebars = require('handlebars');
var router = express.Router();
//get All Modal's
var Location = require('../models/location');
var Item = require('../models/item');
var Order = require('../models/order');
var ItemLocation = require('../models/item_location');
var User = require('../models/user');
var ItemOrdered = require('../models/item_ordered');
var pdf = require('html-pdf');
var fs = require('fs');
module.exports = router;
var schedule = require('node-schedule');
var item_counter;
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');

router.get('/contact', function(req, res){
    if(req.session.user) {
        res.render('contact',{user: req.session.user});
    }
    else
        res.redirect('/');
});

router.post('/contact', function(req, res){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'nilshah.31@gmail.com',
        pass: 'NVD421nvd'
        }
    });

    var mailOptions = {
      from: 'sanjeevinifoods@gmail.com',
      to: String(req.body.email),
      subject: 'FeedBack-'+req.body.email+' - '+req.body.subject,
      html: '<p>Name : '+req.body.name+'<br />Mobile : '+req.body.mobile+'<br />Message : <br />'+req.body.message
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    if(req.session.user) {
        res.render('contact',{user: req.session.user});
    }
    else
        res.redirect('/');
});
