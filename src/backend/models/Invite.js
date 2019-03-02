const mongoose = require('mongoose');
const randToken = require('rand-token');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const Schema = mongoose.Schema;
const tokenLength = 64;
const defaultSubject = "Invitation to join Pantry Maestro"
const {sendEmail} = require('utils');

var InviteSchema = new Schema({
  workspace: {
    type: Schema.Types.ObjectId,
    ref: 'Workspace'
  },
  workspace_name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  token: {
    type: String,
    unique: true
  },
  expires: {
    type: Date
  }
}, {
  collection: 'invites'
});

InviteSchema.pre('save', function(next) {
  const invite = this;

  if (invite.token === undefined) {
    invite.token = randToken.generate(tokenLength);
    let html = fs.readFileSync(path.join(__dirname, '../assets/templates/defaultInvite.html'), 'utf8');
    html = html.replace('{{workspace_name}}', invite.workspace_name);
    html = html.replace('{{token}}', invite.token);

    sendEmail(invite.email, defaultSubject, html);
  }
  next();
});

InviteSchema.methods.sendEmail = function sendEmail(to, subject, body, cb) {
  sendEmail(to, subject, body, (err, info) => {
    if (err) {
      cb(err);
      return;
    }

    cb(null, info);
  });
}

module.exports = mongoose.model('Invite', InviteSchema);