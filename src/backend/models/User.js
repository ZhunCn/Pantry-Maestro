const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const saltRounds = 10;

var UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
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
}, {
  collection: 'users'
});

UserSchema.virtual('password').set(function(password) {
  this._password = password;
});

UserSchema.pre('save', function(next) {
  const user = this;

  if (user) {
    user.workspaces.filter(workspace => {
      return workspace != null;
    });
  }

  if (user && user.hash && user.hash !== undefined) {
    next();
    return;
  }
  else {
    bcrypt.hash(user._password, saltRounds, function(err, hash) {
      if (err) {
        next(err);
        return;
      }

      user.hash = hash;

      next();
      return;
    });
  }
});

UserSchema.methods.verifyPassword = function verifyPassword(candidate, cb) {
  bcrypt.compare(candidate, this.hash, function(err, match) {
    if (err) {
      return cb(err);
    }

    cb(null, match);
  });
}

UserSchema.methods.getRoles = function getRoles(workspace_id, cb) {
  const user = this;

  Workspace.findOne({'_id': workspace_id, 'deleted': false}).exec((err, workspace) => {
    if (err) {
      return cb(err);
    }
    else if (!workspace) {
      return cb('A workspace with that id does not exist');
    }

    for (let i = 0; i < workspace.users; i++) {
      if (workspace.users[i].account == user['_id']) {
        return cb(null, workspace.users[i].roles);
      }
    }

    cb('User is not a part of that workspace');
  });
}

UserSchema.methods.removeWorkspace = function(workspace_id, cb) {
  var user = this;

  let workspaces = [];
  let removed = false;

  user.workspaces.forEach(workspace => {
    if (workspace && workspace.toString() !== workspace_id) {
      workspaces.push(workspace);
    }
    else {
      removed = true;
    }
  });

  if (!removed) {
    cb(false);
    return;
  }

  user.workspaces = workspaces;
  user.save((err) => {
    if (err) {
      cb(false);
      return;
    }

    cb(true);
  });
}

module.exports = mongoose.model('User', UserSchema);
const Workspace = require('./Workspace');
