// Router, will handle all path switching and cacheing of views

define('Router', [
  'UserModel',
  'HeaderView',
  'HomeView',
  'SignupView'
], function(UserModel, HeaderView, HomeView, SignupView) {
  var AppRouter;
  
  AppRouter = Backbone.Router.extend({
    // path:function for path
    // #/ is stripped from the url in the browser before these paths are matched
    routes: {
      '': 'home',
      'home': 'home',
      'signup': 'signup'
    },
    // Called once upon instantiation.  Setup the page locations we hook as well as the navigation bar
    initialize: function() {
      // Create global event dispatcher to communicate between views
      Backbone.dispatcher = _.extend({}, Backbone.Events);
      
      // Create global user object
      this.globalUser = new UserModel();
      
      //Cache the locations in the page where we may need to insert DOM elements
      this.elems = {
        'header': $('header'),
        'page-content': $('#page-content'),
      }
      
      this.elems['header'].html(new HeaderView().render().el);
    },
    // Root path.
    home: function() {
      this.elems['page-content'].html(new HomeView().render().el);
    },
    // Signup page
    signup: function() {
      this.elems['page-content'].html(new SignupView().render().el);
    }
  });
  
  return AppRouter;
});