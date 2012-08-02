// Our global user object for the application

define('UserModel', [], function() {
  var UserModel;

  UserModel = Backbone.Model.extend({
    // Called once when instantiated
    initialize: function(options) {
      // Listen for events targeted at the user model from the dispatcher
      Backbone.dispatcher.on('changeUser', this.changeUser, this);
      Backbone.dispatcher.on('requestUser', this.setUser, this);
      
      // If the username is changed, bubble it to the global dispatcher
      this.on('change:username', this.bubbleChange);
    },
    // Set default model values
    defaults: {
      username: null
    }, 
    // Change the user data that was passed
    changeUser: function(data) {
      this.set(data);
    },
    // Bubble change events to the global dispatcher
    bubbleChange: function() {
      Backbone.dispatcher.trigger('userChanged:username', this);
    },
    // Give 'this' object to the requestor
    setUser: function(that, name) {
      that[name] = this;
    }
  });
  
  return UserModel;
});