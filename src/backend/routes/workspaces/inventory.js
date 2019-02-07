const express = require('express');
const {complete, sanitize, isJSON} = require('../../utils');
const {Inventory, Item, Workspace} = require('../../models');

module.exports = function(router) {
  /*
   * Sends information about the inventory of a workspace
   */
  router.get('/api/workspaces/:workspace_id/inventory', (req, res) => {
    Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).select('-_id -name -users -deleted').populate({
      path: 'inventory',
      select: '-_id  -__v',
      populate: {
        path: 'items',
        select: ' -__v'
      }
    }).exec((err, inventory) => {
      if (err || !inventory) {
        res.json({'error': 'Error querying for inventory: ' + err});
        return;
      }

      res.json(inventory);
    });
  });

  /*
   * Add item to inventory
   */
  router.post('/api/workspaces/:workspace_id/inventory', (req, res) => {
    let fields = [
      'name',
      'quantities'
    ];

    // Check if request contains necessary fields
    if (fields && !complete(req.query, fields)) {
      res.status(400).json({'error': 'Missing fields'});
      return;
    }
    else if (!isJSON(req.query.quantities)) {
      res.status(400).json({'error': 'Invalid JSON syntax'});
      return;
    }

    sanitize(req.query, fields);

    // Check if item exists
    Item.findOne({name: req.query.name}).exec((err, item) => {
      if (err) {
        res.status(500).json({'error': 'Error querying for item: ' + err});
        return;
      }

      // If it already exists, send back an error
      if (item) {
        res.status(400).json({'error': 'Item with this name already exists'});
        return;
      }
      else {
        // Create new item
        let item = new Item({
          'name': req.query.name,
          'quantities': JSON.parse(req.query.quantities)
        });

        item.save((err, item) => {
          if (err) {
            res.status(500).json({'error': 'Error saving item to database: ' + err});
            return;
          }

          // Find workspace by workspace_id in endpoint
          Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).exec((err, workspace) => {
            if (err) {
              res.status(500).json({'error': 'Error adding item to inventory: ' + err});
              return;
            }

            // Find inventory by inventory_id
            Inventory.findOneAndUpdate({'_id': workspace.inventory}).exec((err, inventory) => {
              if (err) {
                res.status(500).json({'error': 'Error adding item to inventory: ' + err});
                return;
              }

              // Add item to inventory and save
              inventory['items'].push(item._id);
              inventory.save((err) => {
                if (err) {
                  res.status(500).json({'error': 'Error saving item to inventory: ' + err});
                  return;
                }

                res.json({'message': 'Successfully added item to inventory'});
              });
            });
          });
        });
      }
    });
  });

  /*
   * Sends information on a specific item
   */
  router.get('/api/workspaces/:workspace_id/inventory/:item_id', (req, res) => {
    Item.findById(req.params.item_id).exec((err, item) => {
      if (err || !item) {
        res.status(500).json({'error': 'Error querying for item: ' + err});
        return;
      }

      res.json(item);
    });
  });

  router.put('/api/workspaces/:workspace_id/inventory/:item_id', (req, res) => {
    res.json({'error': 'Functionality not added'});
  });
}
