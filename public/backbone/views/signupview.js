/*
 * Signup View
 * Renders signup form, sanitizes inputs, and registers the user on the server
 */

define('SignupView', [
  'validator',
  'text!templates/signup.html'
], function(Validator, tmpl) {
  var SignupView;
  
  SignupView = Backbone.View.extend({
    // Set classes on this div
    className: 'row span8 offset2',
    
    //Registers events when inserted into the DOM
    events: {
      'click #submitsignup': 'handleSignup'
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
    handleSignup: function() {
      var validator = new FormValidator('signup-form', [
        {
          name: 'username',   
          rules: 'required|min_length[3]|max_length[30]|alpha_numeric'
        },
        {
          name: 'password1',
          display: 'password',
          rules: 'required|min_length[6]'
        }, 
        {
          name: 'password2',
          display: 'password confirmation',
          rules: 'required|min_length[6]|matches[password1]'
        }, 
        {
          name: 'email',
          rules: 'required|valid_email'
        }], 
        function(errors, event) {
          _.each(validator.fields, function(item) {
            $('#' + item.id + '-error').text('');
            $('#' + item.id + '-group').removeClass('error');
          });
          if (errors.length > 0) {
            _.each(errors, function(item) {
              $('#' + item.id + '-group').addClass('error');
              $('#' + item.id + '-error').text(item.message);
            });
          } else {
            $('#submitsignup').addClass('disabled').attr('disabled', 'disabled').text('Submitting...');
            $.ajax({
              url: 'checkuser',
              type: 'GET',
              data: {username: $('#username').val()},
              success: function(data) {
                if(data.available) {
                  $('#submitmodal').modal('show');
                  var submitData = {
                    username: $('#username').val(),
                    email: $('#email').val(),
                    password: $('#password1').val(),
                    _csrf: $.cookie("_csrf")
                  };
                  $.ajax({
                    url: 'signup',
                    type: 'POST',
                    data: submitData,
                    success: function(data) {
                      if(data.username === submitData.username) {
                        Backbone.dispatcher.trigger('changeUser', {username: data.username});
                        $('#submitmodalheader').html('<h3>Account Created!</h3>');
                        $('#submitmodalbody').html('<p>Your account has been successfully created.</p>');
                        $('#submitmodalfooter').html('<button class="btn btn-success" data-dismiss="modal">Close</button>');
                        $('#signupform').html('<p>You have been signed up.  <a href="#/courses/popular">Browse our courses</a>.</p>')
                      } else {
                        $('#submitmodal').modal('hide');
                        $('#errormodalheader').html('<h3>An error has occurred</h3>');
                        $('#errormodalbody').html('<p>' + data.error +'</p>');
                        $('#errormodal').modal('show');
                        $('#submitsignup').removeClass('disabled').attr('disabled', null).text('Start Learning!');
                      }
                    },
                    error: function(data) {
                      $('#submitmodal').modal('hide');
                      $('#errormodalheader').html('<h3>An error has occurred</h3>');
                      $('#errormodalbody').html('<p>We were unable to create your account.  Please try again.</p>');
                      $('#errormodal').modal('show');
                      $('#submitsignup').removeClass('disabled').attr('disabled', null).text('Start Learning!');
                    }
                  });
                } else {
                  $('#username-group').addClass('error');
                  $('#username-error').text('That username is taken, please choose another.');
                  $('#submitsignup').removeClass('disabled').attr('disabled', null).text('Start Learning!');
                }
              },
              error: function(error) {
                $('#errormodalheader').html('<h3>An error has occurred</h3>');
                $('#errormodalbody').html('<p>We were unable to verify if the requested username exists.  Please try again.</p>');
                $('#errormodal').modal('show');
              }
            });
          }
          
          if(event && event.preventDefault) {
            event.preventDefault();
          } else if(event) {
            event.returnValue = false;
          }
        }
      );
    }
  });
  
  return SignupView;
});