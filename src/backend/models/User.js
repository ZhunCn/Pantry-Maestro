const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Workspace = require('./Workspace');

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
  salt: {
    type: String,
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

module.exports = mongoose.model('User', UserSchema);
