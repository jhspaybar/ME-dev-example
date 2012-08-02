// NoCacheView
// Views can really be made to act more like controllers.
// The html template is the traditional 'view'

define('HomeView', [
  'text!templates/home.html'
], function(tmpl) {
  var HomeView;
  
  HomeView = Backbone.View.extend({
    //Gives our div a class
    className:'row',
    
    //Registers events when inserted into the DOM
    events: {
      'click #bob': 'setBob',
      'click #susan': 'setSusan'
    },
    
    // Initialization, called once when 'new' is called on our view
    initialize: function() {
      // Generate the template
      this.template = _.template(tmpl);
    },
    
    // Handles rendering of the view
    render: function() {
      // Pass our model to the template for rendering
      $(this.el).html(this.template());
      
      // return this to allow chaining
      return this;
    },
    setBob: function() {
      Backbone.dispatcher.trigger('changeUser', {username: 'Bob'});
    },
    setSusan: function() {
      Backbone.dispatcher.trigger('changeUser', {username: 'Susan'});
    }
  });
  
  return HomeView;
});