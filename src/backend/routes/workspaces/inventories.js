const express = require('express');
const bodyParser = require('body-parser');
const {authorize, complete, sanitize} = require('utils');
const {Inventory, Item, Workspace} = require('models');
const c = require('const');
const joi = require('joi');

const updateNoteSchema = joi.object().keys({
  content: joi.string().required()
});

module.exports = function(router) {
  /*
   * Sends information about the inventory of a workspace
   */
  router.get('/api/workspaces/:workspace_id/inventory', (req, res) => {
    authorize(req).then(decoded => {
      Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).select('-_id -__v -name -users -deleted').populate({
        path: 'inventory',
        select: '-_id  -__v',
        populate: {
          path: 'items',
          select: ' -__v -inventory -expired',
          match: {name: new RegExp(req.body.name)}
        }
      }).exec((err, inventory) => {
        if (err || !inventory) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error querying for inventory: ' + err});
          return;
        }

        res.status(c.status.OK).json(inventory);
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting your account information: ' + err});
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
    if (!complete(req.body, fields)) {
      res.status(c.status.BAD_REQUEST).json({'error': 'Missing fields'});
      return;
    }

    sanitize(req.body, fields);

    authorize(req).then(decoded => {
      // Check if item exists
      Item.findOne({inventory: req.params.workspace_id, name: req.body.name}).exec((err, item) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error querying for item: ' + err});
          return;
        }

        // If it already exists, send back an error
        if (item) {
          res.status(c.status.BAD_REQUEST).json({'error': 'Item with this name already exists', 'item_id': item._id});
          return;
        }
        else {
          // Create new item
          let item = new Item({
            'name': req.body.name,
            'quantities': req.body.quantities,
            'inventory': req.params.workspace_id
          });

          item.save((err, item) => {
            if (err) {
              res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error saving item to database: ' + err});
              return;
            }

            // Find workspace by workspace_id in endpoint
            Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).exec((err, workspace) => {
              if (err) {
                res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error adding item to inventory: ' + err});
                return;
              }

              // Find inventory by inventory_id
              Inventory.findOne({'_id': workspace.inventory}).exec((err, inventory) => {
                if (err) {
                  res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error adding item to inventory: ' + err});
                  return;
                }

                // Add item to inventory and save
                inventory['items'].push(item._id);
                inventory.save((err) => {
                  if (err) {
                    res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error saving item to inventory: ' + err});
                    return;
                  }

                  res.status(c.status.OK).json({'message': 'Successfully added item to inventory'});
                });
              });
            });
          });
        }
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting your account information: ' + err});
    });
  });

  /*
   * Sends information on a specific item
   */
  router.get('/api/workspaces/:workspace_id/inventory/:item_id', (req, res) => {
    authorize(req).then(decoded => {
      Item.findById(req.params.item_id).select('-_id -__v -expired').exec((err, item) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error querying for item: ' + err});
          return;
        }
        else if (!item) {
          res.status(c.status.BAD_REQUEST).json({'error': 'No item exists with that id'});
          return;
        }

        res.status(c.status.OK).json(item);
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting your account information: ' + err});
    });
  });

  /*
   * Updating quantities for some specified item
   */
  router.put('/api/workspaces/:workspace_id/inventory/:item_id', (req, res) => {
    if (!req.body) {
      res.status(c.status.OK).json({'message': 'No fields to update'});
      return;
    }

    let fields = [
      'quantities',
      'name'
    ];
    let toUpdate = {};

    fields.forEach(field => {
      if (req.body.hasOwnProperty(field)) {
        toUpdate[field] = req.body[field];
      }
    });

    authorize(req).then(decoded => {
      Item.findById(req.params.item_id).exec((err, item) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error updating item(s): ' + err});
          return;
        }
        else if (!item) {
          res.status(c.status.BAD_REQUEST).json({'error': 'No item with this id exists'});
          return;
        }

        // Update quantities
        if (toUpdate['quantities']) {
          Object.keys(toUpdate['quantities']).forEach(quantity => {
            if (item.quantities.hasOwnProperty(quantity)) {
              item.quantities[quantity] += toUpdate['quantities'][quantity];
            }
            else {
              item.quantities[quantity] = toUpdate['quantities'][quantity];
            }

            if (item.quantities[quantity] <= 0) {
              delete item.quantities[quantity];
            }
          });
          item.markModified('quantities');
        }

        if (toUpdate['name']) {
          item.name = toUpdate['name'];
        }

        item.save((err, item) => {
          if (err) {
            res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error saving item(s) to database: ' + err});
            return;
          }

          res.status(c.status.OK).json({'message': 'Successfully updated item'});
        });
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting your account information: ' + err});
    });
  });

  /*
   * Delete quantities for an item given an expiration date
   */
  router.delete('/api/workspaces/:workspace_id/inventory/:item_id', (req, res) => {
    if (!req.body) {
      res.status(c.status.OK).json({'message': 'No fields to update'});
      return;
    }

    // In the future, add functionality to change item's name
    let fields = [
      'expiration'
    ];

    // Check if request contains necessary fields
    if (!complete(req.body, fields)) {
      res.status(c.status.BAD_REQUEST).json({'error': 'Missing fields'});
      return;
    }

    authorize(req).then(decoded => {
      Item.findById(req.params.item_id).exec((err, item) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error updating item(s): ' + err});
          return;
        }
        else if (!item) {
          res.status(c.status.BAD_REQUEST).json({'error': 'No item with this id exists'});
          return;
        }

        if (!item.quantities[req.body.expiration]) {
          res.status(c.status.OK).json({'error': 'Invalid expiration date'});
          return;
        }

console.log(item.quantities);
        delete item.quantities[req.body.expiration];
        item.markModified('quantities');
console.log(item.quantities);
        item.save((err, item) => {
          if (err) {
            res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error saving item(s) to database: ' + err});
            return;
          }

          res.status(c.status.OK).json({'message': 'Successfully updated item'});
        });
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting your account information: ' + err});
    });
  });

  router.get('/api/workspaces/:workspace_id/inventory/:item_id/note', (req, res) => {
    authorize(req).then(decoded => {
      Item.findOne({'_id': req.params.item_id}).exec((err, item) => {
        if (err) {
          res.json({'error': 'There was an error getting the note for this item: ' + err});
          return;
        }
        else if (!item) {
          res.json({'error': 'No item with this id exists'});
          return;
        }

        res.json({'note': item.note});
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting your account information: ' + err});
    });
  });

  router.put('/api/workspaces/:workspace_id/inventory/:item_id/note', (req, res) => {
    if (joi.validate(req.body, updateNoteSchema).error !== null) {
      res.status(c.status.OK).json({'error': 'Invalid fields'});
      return;
    }

    authorize(req).then(decoded => {
      Item.findOne({'_id': req.params.item_id}).exec((err, item) => {
        if (err) {
          res.json({'error': 'There was an error updating the note for this item: ' + err});
          return;
        }
        else if (!item) {
          res.json({'error': 'No item with this id exists'});
          return;
        }

        item.note = req.body.content;

        item.save((err) => {
          if (err) {
            res.json({'error': 'There was an error updating the note for this item: ' + err});
            return;
          }

          res.json({'message': 'Successfully updated item'});
        });
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting your account information: ' + err});
    });
  });
}
