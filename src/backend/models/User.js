const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const Workspace = require('./Workspace');
const saltRounds = 10;

var UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  hash: {
    type: String
  },
  workspaces: [{
    type: Schema.Types.ObjectId,
    ref: 'Workspace'
  }]
}, {collection: 'users'});

UserSchema.virtual('password').set(function(password) {
  console.log('Setting password: ' + password);
  this._password = password;
});

UserSchema.pre('save', function(next) {
  const user = this;

  console.log(this);

  if (user._password === undefined) {
    next();
  }

  bcrypt.hash(user._password, saltRounds, function(err, hash) {
    if (err) {
      next();
    }

    user.hash = hash;
    console.log('Hash: ' + hash);

    console.log(user);

    next();
  });
});

UserSchema.methods.verifyPassword = function verifyPassword(candidate, cb) {
  bcrypt.compare(candidate, this.hash, (err, match) => {
    if (err) {
      return cb(err);
    }

    cb(null, match);
  });
}

module.exports = mongoose.model('User', UserSchema);
