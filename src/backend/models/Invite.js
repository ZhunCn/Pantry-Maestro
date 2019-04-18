const mongoose = require('mongoose');
const randToken = require('rand-token');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const Schema = mongoose.Schema;
const tokenLength = 64;
const defaultSubject = "Invitation to join Pantry Maestro";

const User = require('./User');

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
    type: Date,
    required: true,
    default: () => Date.now() + 7 * 24 * 3600 * 1000
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  collection: 'invites'
});

InviteSchema.pre('save', function(next) {
  const invite = this;

  if (invite.token === undefined) {
    invite.token = randToken.generate(tokenLength);
    let html = fs.readFileSync(path.join(__dirname, '../assets/templates/defaultInvite.html'), 'utf8');

    while (html.indexOf('{{workspace_name}}') != -1) {
        html = html.replace('{{workspace_name}}', invite.workspace_name);
    }
    while (html.indexOf('{{token}}') != -1) {
        html = html.replace('{{token}}', invite.token);
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

    transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: invite.email,
      subject: defaultSubject,
      html: html,
      attachments: attachments
    }, (err, info) => {
      next(err);
    });

    return;
  }
  next();
});

InviteSchema.methods.sendAccepted = function(next) {
  const invite = this;

  User.findById(invite.sender).exec((err, user) => {
    if (err || !user) {
      next();
    }

    let html = fs.readFileSync(path.join(__dirname, '../assets/templates/inviteAccept.html'), 'utf8');

    while (html.indexOf('{{workspace_name}}') != -1) {
        html = html.replace('{{workspace_name}}', invite.workspace_name);
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

    const subject = "Your invitation was accepted!";
    transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: user.email,
      subject: subject,
      html: html,
      attachments: attachments
    }, (err, info) => {
      next(err);
    });

    return;
  });
};

InviteSchema.methods.sendDeclined = function(next) {
  const invite = this;

  User.findById(invite.sender).exec((err, user) => {
    if (err || !user) {
      next();
    }

    let html = fs.readFileSync(path.join(__dirname, '../assets/templates/inviteDecline.html'), 'utf8');

    while (html.indexOf('{{workspace_name}}') != -1) {
        html = html.replace('{{workspace_name}}', invite.workspace_name);
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

    const subject = "Your invitation was declined";
    transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: user.email,
      subject: subject,
      html: html,
      attachments: attachments
    }, (err, info) => {
      next(err);
    });

    return;
  });
};

module.exports = mongoose.model('Invite', InviteSchema);
