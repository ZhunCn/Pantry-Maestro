const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ChangeSchema = new Schema({
  workspace: {
    type: Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  item: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    oldName: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    quantities: {
      type: Object
    },
    changed: {
      type: Object
    },
    created: {
      type: Boolean,
      required: true,
      default: false
    },
    modified: {
      type: Boolean,
      required: true,
      default: false
    },
    renamed: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  modifier: {
    username: {
      type: String
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  collection: 'changes'
});

module.exports = mongoose.model('Change', ChangeSchema);
