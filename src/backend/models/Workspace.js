const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./User');

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

module.exports = mongoose.model('Workspace', WorkspaceSchema);
