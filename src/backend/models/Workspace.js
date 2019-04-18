const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const Schema = mongoose.Schema;
const c = require('const');

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
    if (workspace.users[i].account && workspace.users[i].account._id == user_id) {
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

WorkspaceSchema.methods.isOwner = function(user_id, cb) {
  const workspace = this;

  for (let i = 0; i < workspace.users.length; i++) {
    if (workspace.users[i].account && workspace.users[i].account._id == user_id) {
      cb(workspace.users[i].roles.includes(c.roles.OWNER));
      return;
    }
  }

  cb(false);
}

WorkspaceSchema.methods.getAdmins = function(cb) {
  const workspace = this;

  let users = [];
  for (let i = 0; i < workspace.users.length; i++) {
    if (workspace.users[i] && workspace.users[i].roles.includes(c.roles.ADMIN)) {
      users.push(workspace.users[i].account);
    }
  }

  cb(users);
}

WorkspaceSchema.methods.sendLeaveEmail = function(cb) {
  const workspace = this;

  let users = [];
  for (let i = 0; i < workspace.users.length; i++) {
    if (workspace.users[i] && workspace.users[i].roles.includes(c.roles.ADMIN)) {
      users.push(workspace.users[i].account);
    }
  }

  let promises = [];

  for (let i = 0; i < users.length; i++) {
    promises.push(new Promise((resolve, reject) => {
      User.findById(users[i]).exec((err, user) => {
        if (err) {
          reject(err);
        }

        resolve(user.email);
      });
    }));
  }

  Promise.all(promises).then(emails => {
    let html = fs.readFileSync(path.join(__dirname, '../assets/templates/leaveWorkspaceNotif.html'), 'utf8');

    while (html.indexOf('{{workspace_name}}') != -1) {
        html = html.replace('{{workspace_name}}', workspace.name);
    }

    let attachments = [{
      filename: 'PantryMaestroLogo.png',
      path: path.join(__dirname, '../assets/templates/PantryMaestroLogo.png'),
      cid: 'logo'
    }];

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
      }
    });

    const subject = "A user has left your workspace";
    for (i = 0; i < emails.length; i++) {
      transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: emails[i],
        subject: subject,
        html: html,
        attachments: attachments
      });
    }

    cb(null);
  });
}

module.exports = mongoose.model('Workspace', WorkspaceSchema);
