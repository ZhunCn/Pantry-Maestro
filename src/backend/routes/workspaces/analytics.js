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
        analytics = analytics.inventory.items;

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
        analytics = analytics.inventory.items;

        res.json({'analytics': analytics});
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting the analytics: ' + err});
    });
  });

  router.get('/api/workspaces/:workspace_id/analytics/expiration/expired', (req, res) => {
    // Authorize
    authorize(req).then(decoded => {
      Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).select('-_id -__v -name -users -invites -deleted').populate({
        path: 'inventory',
        select: '-_id  -__v',
        populate: {
          path: 'items',
          select: ' -__v -inventory'
        }
      }).exec((err, analytics) => {
        if (err) {
          res.json({'error': 'The specified id is invalid'});
          return;
        }
        analytics = analytics.inventory.items;
        let now = Date.now();

        for (let i = 0; i < analytics.length; i++) {
          let expired = 0;

          for (let date in analytics[i].quantities) {
            if (now > new Date(date)) {
              expired += analytics[i].quantities[date];
            }
          }
          analytics[i].expired = expired;
        }

        res.json({'analytics': analytics});
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting the analytics: ' + err});
    });
  });
}
