const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  expired: {
    type: Number,
    default: 0
  },
  quantities: {
    type: Object,
    required: true
  },
  inventory: {
    type: Schema.Types.ObjectId,
    ref: 'Inventory'
  }
}, {
  collection: 'items'
});

ItemSchema.pre('save', function(next) {
  const item = this;

  var sum = 0;
  for (date in item.quantities) {
    sum += item.quantities[date];
  }

  item.total = sum;

  next();
});

ItemSchema.virtual('expirations').get(function() {
  const item = this;
  let keys = [];

  for (key in item.quantities) {
    keys.push(key);
  }

  return keys;
});

module.exports = mongoose.model('Item', ItemSchema);
