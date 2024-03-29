const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var InventorySchema = new Schema({
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  }]
}, {
  collection: 'inventories'
});

module.exports = mongoose.model('Inventory', InventorySchema);
