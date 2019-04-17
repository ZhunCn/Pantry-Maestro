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
    name: {
      type: String
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
  }
}, {
  collection: 'changes'
});

module.exports = mongoose.model('Change', ChangeSchema);
