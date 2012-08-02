
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/router')
  , http = require('http')
  , lessMiddleware = require('less-middleware')
  , mongoose = require('mongoose')
  , RedisStore = require('connect-redis')(express)
  , validator = require('express-validator');

var app = express();

app.configure('production', function () {
  var redisUrl = require("url").parse(process.env.REDISTOGO_URL);
  var redisAuth = redisUrl.auth.split(':');  
  app.set('redisHost', redisUrl.hostname);
  app.set('redisPort', redisUrl.port);
  app.set('redisDb', redisAuth[0]);
  app.set('redisPass', redisAuth[1]);
});

var connectionString = process.env.MONGOHQ_URL || 'mongodb://localhost/MassEducateDevExample'; //Get Heroku connection, or dev host...
mongoose.connect(connectionString); //Call only once in the application

app.configure(function(){
  app.set('views', __dirname + '/views'); //Define our views directory for express
  app.set('view engine', 'jade'); //Set our view engine to jade
  app.use(express.favicon()); //Serve a favicon
  app.use(express.logger('dev'));
  app.use(lessMiddleware({  //Less compiler 
    src: __dirname + '/less', //Source directory of less files
    dest: __dirname + '/public', //Destination directory for compiled css files
    debug: process.env.NODE_ENV === 'production' ? false : true, //Will generate 2 log lines per css file requested, ternary will be false in production
    compress: true
  }));
  app.use(express.static(__dirname + '/public')); //Serve static requests out of the /public directory
  app.use(express.bodyParser());
  app.use(validator);
  app.use(express.cookieParser('ME-dev-example'));//User cookies
  
  // Setting up Redis stores for session tracking.  Need to determine production or development
  if(process.env.NODE_ENV === 'production') {
    app.use(express.session({
      secret: 'ME-dev-example',
      store: new RedisStore({
        host: app.set('redisHost'),
        port: app.set('redisPort'),
        db: app.set('redisDb'),
        pass: app.set('redisPass')
      }),
      cookie: {
        maxAge: 1209600000
      }
    })); // Heroku sessions
  } else {
    app.use(express.session({ 
      secret: 'ME-dev-example', 
      store: new RedisStore, 
      cookie: {
        maxAge: 600000
      }
    }));// Local Sessions
  }
  
  // Generate CSRF tokens
  app.use(express.csrf());
  
  // Push it down with httpOnly off so that locally hosted pages can access it with javascript
  app.use(function(req, res, next) {
    res.cookie('_csrf', req.session._csrf, { maxAge: 900000, httpOnly: false});
    next();
  });
  app.use(express.methodOverride());
  app.use(app.router);
  
  app.locals.use(function(req, res) {
    app.locals.session = req.session;
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

routes(app); //Pass the app object to our routes file to register all of our routes

var port = process.env.PORT || 3000;//Get Heroku required port, or dev host...
http.createServer(app).listen(port);//Start it all up!

console.log('Express server listening on port ' + port);//Log that our server has started to the console
