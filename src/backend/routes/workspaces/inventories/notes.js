const express = require('express');
const bodyParser = require('body-parser');
const {authorize, complete, sanitize} = require('utils');
const {Change, Inventory, Item, Workspace} = require('models');
const c = require('const');
const joi = require('joi');

const updateNoteSchema = joi.object().keys({
  content: joi.string().required()
});

module.exports = function(router) {
  router.get('/api/workspaces/:workspace_id/inventory/:item_id/note', (req, res) => {
    authorize(req, {
      'workspace_id': req.params.workspace_id,
      'roles': [c.roles.OWNER, c.roles.ADMIN, c.roles.MEMBER]
    }).then(decoded => {
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

    authorize(req, {
      'workspace_id': req.params.workspace_id,
      'roles': [c.roles.OWNER, c.roles.ADMIN, c.roles.MEMBER]
    }).then(decoded => {
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
