var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var UserSchema = new Schema({
  _id: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true}
});

UserSchema.virtual('username').get(function() {
  return this._id;
}).set(function(username) {
  this._id = username;
});

module.exports = mongoose.model('User', UserSchema);