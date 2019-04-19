const express = require('express');
const bodyParser = require('body-parser');
const {authorize, getEmptyPromise} = require('utils');
const {Change, Item} = require('models');
const c = require('const');
const joi = require('joi');
const max = 50;

module.exports = function(router) {
  router.get('/api/workspaces/:workspace_id/inventory/changes', (req, res) => {
    authorize(req, {
      'workspace_id': req.params.workspace_id,
      'roles': [c.roles.OWNER, c.roles.ADMIN]
    }).then(decoded => {
      Change
      .find({workspace: req.params.workspace_id})
      .sort({'_id': 'desc'})
      .limit(max)
      .select('-__v -workspace')
      .exec((err, changes) => {
        if (err) {
          res.json({'error': 'There was an error retrieving the changes: ' + err});
          return;
        }

        if (changes.length > 0) {
          let lastId = changes[changes.length - 1]._id;

          Change
          .deleteMany({workspace: req.params.workspace_id, _id: {$lt: lastId}})
          .exec((err, result) => {
            if (err) {
              res.json({'error': 'There was an error minimizing the changeset: ' + err});
              return;
            }

            res.json({'changes': changes});
          });
        }
        else {
          res.json({'changes': changes});
        }
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting your account information: ' + err});
    });
  });

  router.delete('/api/workspaces/:workspace_id/inventory/changes/:change_id', (req, res) => {
    authorize(req, {
      'workspace_id': req.params.workspace_id,
      'roles': [c.roles.OWNER, c.roles.ADMIN, c.roles.MEMBER]
    }).then(decoded => {
      Change.findById(req.params.change_id).exec((err, change) => {
        if (err) {
          res.json({'error': 'There was an error getting the change: ' + err});
          return;
        }
        else if (!change) {
          res.json({'error': 'No change exists with that id'});
          return;
        }

        Item.findById(change.item._id).exec((err, item) => {
          let promise = getEmptyPromise();
          if (err) {
            res.json({'error': 'There was an error unding the change'});
            return;
          }
          else if (!item) { // Item doesn't exist so we create it
            item = new Item({
              _id: change.item_id,
              name: change.name
            });
            promise = item.save();
          }

          promise.then(() => { // Either create the item or do nothing
            if (change.item.created) {
              promise = item.remove();
            }
            else if (change.item.renamed) {
              item.name = change.item.oldName;
              promise = item.save();
            }
            else if (change.item.modified) {
              for (expiration in change.item.quantities) {
                if (!item.quantities[expiration]) {
                  item.quantities[expiration] = 0;
                }

                item.quantities[expiration] -= change.item.changed[expiration];

                if (item.quantities[expiration] < 0) {
                  res.json({'error': 'Change cannot be undone because it results in negative quantity. Please try undoing an earlier change first'});
                  return;
                }
                else if (item.quantities[expiration] == 0) {
                  delete item.quantities[expiration];
                }
              }

              item.markModified('quantities');
              promise = item.save();
            }
            else {
              res.json({'error': 'There was an error undoing change: Malformed change'});
              return;
            }

            // Update quantities, change name, or delete
            promise.then(item => {
              // Delete change
              change.remove(err => {
                if (err) {
                  res.json({'error': 'There was an error finalizing changes: Couldn\'t delete change'});
                  return;
                }

                res.json({'message': 'Successfully reverted change'});
              });
            }).catch(err => {
              res.json({'error': 'There was an error finalizing the change: ' + err});
              return;
            });
          });
        });
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting your account information: ' + err});
    });
  });
}
