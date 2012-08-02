define('HeaderView', [
  'text!templates/header.html'
], function(tmpl) {
  var HeaderView;
  
  HeaderView = Backbone.View.extend({
    // Called once when instantiated
    initialize: function(options) {
      // Compile the underscore template
      this.template = _.template(tmpl);
      this.model = null;
      
      // Get the currently logged in user
      Backbone.dispatcher.trigger('requestUser', this, 'model');
      
      // Listen for a change on the user model and render the header when it is updated
      Backbone.dispatcher.on('userChanged:username', this.render, this);
    },
    
    render: function() {
      // Render the view with the model
      $(this.el).html(this.template(this.model.toJSON()));
      
      // Return this for chaining
      return this;
    }
  });
  
  return HeaderView;
});