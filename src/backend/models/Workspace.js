const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./User');
const Invite = require('./Invite');

var WorkspaceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  users: [{
    _id: false,
    account: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    roles: {
      type: [String],
      required: true
    }
  }],
  invites: [{
    type: Schema.Types.ObjectId,
    ref: 'Invite'
  }],
  inventory: {
    type: Schema.Types.ObjectId,
    ref: 'Inventory'
  },
  deleted: {
    type: Boolean,
    default: false,
    required: true
  }
}, {
  collection: 'workspaces'
});

WorkspaceSchema.methods.hasUser = function(user_id, cb) {
  const workspace = this;

  for (let i = 0; i < workspace.users.length; i++) {
    if (workspace.users[i].account && workspace.users[i].account.toString() === user_id) {
      User.findOne({'_id': user_id}).exec((err, user) => {
        cb(true, user);
      });
      return;
    }
  }

  cb(false, null);
}

WorkspaceSchema.methods.removeUser = function(user_id, cb) {
  var workspace = this;

  let users = [];
  let removed = false;

  workspace.users.forEach(user => {
    if (user.account && user.account.toString() !== user_id) {
      users.push(user);
    }
    else if (user.account) {
      removed = true;
    }
  });

  if (!removed) {
    cb(false);
    return;
  }

  workspace.users = users;
  workspace.save((err) => {
    if (err) {
      cb(false);
      return;
    }

    cb(true);
  });
}

module.exports = mongoose.model('Workspace', WorkspaceSchema);
