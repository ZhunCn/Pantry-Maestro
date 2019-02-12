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
    type: String,
    required: true
  },
  workspaces: [{
    type: Schema.Types.ObjectId,
    ref: 'Workspace'
  }]
}, {collection: 'users'});

UserSchema.virtual('password').set((password) => {
  this.password = password;
});

UserSchema.pre('save', (next) => {
  const user = this;

  if (user.password === undefined) {
    return next();
  }

  bcrypt.hash(user.password, saltRounds, (err, hash)  => {
    if (err) {
      console.log('Error adding user: ' + this.username + ' to database: ' + err);
      next();
    }

    user.hash = hash;
    user.password = undefined;
    next();
  });
});

UserSchema.methods.verifyPassword = (candidate, cb) => {
  bcrypt.compare(candidate, this.hash, (err, match) => {
    if (err) {
      return cb(err);
    }

    cb(null, match);
  });
}

module.exports = mongoose.model('User', UserSchema);
