// The entry point of the application

define('App', [
  'Router'
], function(Router) {
  function initialize() {
    // Start the path Router
    var app = new Router();
    
    // Enable url # enabled history
    Backbone.history.start();
  }
  
  return {
    initialize: initialize
  };
});