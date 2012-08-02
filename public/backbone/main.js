requirejs.config({
  //Tell require where to look for files
  paths: {
    
    // Libraries
    'text': 'lib/text',
    'validator': 'lib/validate',
    
    //Application
    'App': 'app',
    
    //Router
    'Router': 'router',
    
    //Models
    'UserModel': 'models/usermodel',
    
    //Views
    'HeaderView': 'views/headerview',
    'HomeView': 'views/homeview',
    'SignupView': 'views/signupview'
  }
});

require(['App'], function(App, client) {
  App.initialize();
});