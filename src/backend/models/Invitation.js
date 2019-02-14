const mongoose = require('mongoose');
const randToken = require('rand-token');
const nodemailer = require('nodemailer');
const Schema = mongoose.Schema;
const tokenLength = 32;

var InvitationSchema = new Schema({
  workspace: {
    type: Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  token: {
    type: String
  }
}, {collection: 'invitations'});

InvitationSchema.pre('save', function(next) {
  const invitation = this;

  if (invitation.token === undefined) {
    invitation.token = randToken(tokenLength);
  }

  next();
});

module.exports = mongoose.model('Invitation', InvitationSchema);
