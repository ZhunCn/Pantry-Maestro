const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  quantities: {
    type: Object,
    required: true
  }
}, {collection: 'items'});

ItemSchema.virtual('quantities.total').get(() => {
  return Object.values(this.expirations).reduce((a, b) => a + b);
});

ItemSchema.virtual('expirations').get(() => {
  return this.quantities.keys();
});

module.exports = mongoose.model('Item', ItemSchema);
