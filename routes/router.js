/*
 * Complete route file, must be instantiated by passing an app object.
 * EG: require('./routes/router.js')(app);
 */
var RootController = require('../controllers/rootcontroller')
  , UserController = require('../controllers/usercontroller');

module.exports = function(app) {
  app.get('*', function(req, res, next) {
    if(req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] === 'http') {
      res.redirect('https://' + req.headers.host + req.url);
    } else {
      next();
    }
  });
  
  //Root Paths
  app.get('/', RootController.home);
  
  //User Paths
  app.post('/signup', UserController.createUser);
  app.get('/checkuser', UserController.checkUser);
}