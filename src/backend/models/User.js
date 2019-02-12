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
  this._password = password;
});

UserSchema.pre('save', function(next) {
  const user = this;

  if (user._password === undefined) {
    next();
  }

  bcrypt.hash(user._password, saltRounds, function(err, hash) {
    if (err) {
      next();
    }

    user.hash = hash;
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

// UserSchema.methods.getRoles = function getRoles(workspace_id, cb) {
//   const user = this;
//
//   Workspace.findOne({'_id': workspace_id, 'deleted': false}).exec((err, workspace) => {
//     if (err) {
//       return cb(err);
//     }
//     else if (!workspace) {
//       return cb('A workspace with that id does not exist');
//     }
//
//     for (let i = 0; i < workspace.users; i++) {
//       if (workspaces.users[i].account == user['_id']) {
//         return cb(null, workspaces.users[i].roles);
//       }
//     }
//
//     cb('User is not a part of that workspace');
//   });
// }

module.exports = mongoose.model('User', UserSchema);
