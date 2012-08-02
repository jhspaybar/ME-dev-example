var User = require('../models/usermodel')
  , bcrypt = require('bcrypt')
  , validator = require('express-validator')
  , async = require('async');

/*
Check if the user name in the param('username')
field has been registered already.  Render a JSON
object with just true or false.
*/
exports.checkUser = function(req, res) {
  req.assert('username', 'Username must be between 3 and 30 characters').len(3,30);
  req.sanitize('username').xss();
  
  var formData = req.validationErrors();
  
  if(formData) {
    res.json({available:false});
  } else {
    var username = req.param('username');
    User.findOne({_id: username}, ['_id'], function(error, doc) {
      if(doc !== null && doc._id === username) {
        res.json({available: false});
      } else {
        res.json({available: true});
      }
    });
  }
}

exports.createUser = function(req, res) {
  
  //Once we successfully bcrypt a password, store the new user.
  var afterHash = function(error, hash) {
    var user = new User({
	    username: req.param('username'),
	    email: req.param('email'),
	    password: hash
	  });
	  user.save( function(error) {
	    if(error !== null) {
	      res.json({error: 'Failed to create user'});
	    } else {
	      req.session.regenerate( function(error) {
	        req.session.username = req.param('username');
  	      res.json({username: req.param('username')});
	      });
	    }
	  });
  }
  
  //Do validation testing on our inputs
  req.assert('username', 'Username must be between 4 and 50 characters').len(3,30).isAlphanumeric();
  req.assert('email', 'A valid email is required').isEmail();
  req.assert('password', 'Your password must be at least 6 characters long').len(6);
  
  //Sanitize username and email, they might be displayed in pages
  req.sanitize('username').xss();
  req.sanitize('email').xss();
  
  var formData = req.validationErrors();
  // Should only fail on validation here if the user is going outside our UI to send requests, no need to be nice.
  if(formData) {
    res.json({error: "Invalid Data"});
  } else {
    bcrypt.hash(req.param('password'), 12, afterHash);
  }
}