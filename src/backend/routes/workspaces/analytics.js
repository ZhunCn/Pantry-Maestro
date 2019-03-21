const express = require('express');
const {Inventory, Workspace} = require('models');
const {authorize} = require('utils');
const c = require('const');

module.exports = function(router) {
  /*
   * Get the top three quantities
   */
  router.get('/api/workspaces/:workspace_id/analytics/quantities/top', (req, res) => {
    // Authorize
    authorize(req).then(decoded => {
      Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).select('-_id -__v -name -users -invites -deleted').populate({
        path: 'inventory',
        select: '-_id  -__v',
        populate: {
          path: 'items',
          select: ' -__v -inventory',
          options: {
            limit: 3,
            sort: {
              total: -1
            }
          }
        }
      }).exec((err, analytics) => {
        if (err) {
          res.json({'error': 'The specified id is invalid'});
          return;
        }

        res.json({'analytics': analytics});
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting the analytics: ' + err});
    });
  });

  /*
   * Get the bottom three quantities
   */
  router.get('/api/workspaces/:workspace_id/analytics/quantities/bottom', (req, res) => {
    // Authorize
    authorize(req).then(decoded => {
      Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).select('-_id -__v -name -users -invites -deleted').populate({
        path: 'inventory',
        select: '-_id  -__v',
        populate: {
          path: 'items',
          select: ' -__v -inventory',
          options: {
            limit: 3,
            sort: {
              total: 1
            }
          }
        }
      }).exec((err, analytics) => {
        if (err) {
          res.json({'error': 'The specified id is invalid'});
          return;
        }

        res.json({'analytics': analytics});
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting the analytics: ' + err});
    });
  });
}
