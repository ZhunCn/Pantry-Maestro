const express = require('express');
const bodyParser = require('body-parser');
const {authorize, complete} = require('utils');
const {Workspace, Inventory, User} = require('models');
const c = require('const');

module.exports = function(router) {
  /*
   * Gets workspaces by their name
   */
  router.get('/api/workspaces/', (req, res) => {
    // Authorize

    let fields = [
      'name'
    ];

    if (req.query['name']) {
      req.body['name'] = req.query['name'];
    }

    // Check if request contains necessary fields
    if (fields && !complete(req.body, fields)) {
      res.status(c.status.BAD_REQUEST).json({'error': 'Missing fields'});
      return;
    }

    Workspace.findOne({'name': req.body.name, 'deleted': false}).select('-__v').exec((err, workspace) => {
      if (err) {
        res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error querying for workspace: ' + err});
        return;
      }
      else if (!workspace) {
        res.status(c.status.BAD_REQUEST).json({'error': 'No workspace exists with that id'});
        return;
      }

      res.status(c.status.OK).json({'_id': workspace._id});
    });
  });

  /*
   * Creates a new workspace
   */
  router.post('/api/workspaces/', (req, res) => {
    // Add authorization and add user to workspace
    authorize(req).then(decoded => {
      let fields = [
        'name'
      ];

      // Check if request contains necessary fields
      if (fields && !complete(req.body, fields)) {
        res.status(c.status.BAD_REQUEST).json({'error': 'Missing fields'});
        return;
      }

      Workspace.findOne({'name': req.body.name}).exec((err, workspace) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'There was an error adding the workspace'});
          return;
        }
        else if (workspace && !workspace.deleted) {
          res.status(c.status.BAD_REQUEST).json({'error': 'A workspace with that name already exists'});
          return;
        }

        let inventory = new Inventory({
          'items': []
        });

        inventory.save((err, inventory) => {
          if (err) {
            res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'There was an error adding the workspace'});
            return;
          }

          if (!workspace) {
            workspace = new Workspace({
              'name': req.body.name,
              'inventory': inventory['_id'],
              'users': [{
                account: decoded.user_id,
                roles: [c.roles.OWNER, c.roles.ADMIN]
              }]
            });
          }
          else {
            workspace.name = req.body.name;
            workspace.inventory = inventory._id;
            workspace.users = [{
              account: decoded.user_id,
              roles: [c.roles.OWNER, c.roles.ADMIN]
            }];
            workspace.deleted = false;
          }

          workspace.save((err, workspace) => {
            if (err) {
              res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'There was an error adding the workspace'});
              return;
            }

            User.findOne({'_id': decoded.user_id}).exec((err, user) => {
              if (err || !user) {
                res.json({'error': 'There was an error adding you to the workspace: ' + err});
                return;
              }

              user.workspaces.push(workspace._id);

              user.save(err => {
                if (err) {
                  res.json({'error': 'There was an error adding the workspace'});
                  return;
                }

                res.status(c.status.OK).json({
                  'message': 'Successfully created the workspace',
                  'workspace_id': workspace['_id']
                });
              });
            });
          });
        });
      });
    }).catch(err => {
      res.json({'error': 'There was an error creating the workspace: ' + err});
    });
  });

  /*
   * Sends relevant information about a workspace
   */
  router.get('/api/workspaces/:workspace_id', (req, res) => {
    // Authorize

    Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).select('-_id -__v -inventory -users -invites -deleted').exec((err, workspace) => {
      if (err) {
        res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error querying for workspace: ' + err});
        return;
      }
      else if (!workspace) {
        res.status(c.status.BAD_REQUEST).json({'error': 'A workspace with that id doesn\'t exist'});
        return;
      }

      res.json(workspace);
    });
  });

  /*
   * Handle the updating of old workspaces
   */
  router.put('/api/workspaces/:workspace_id', (req, res) => {
    authorize(req, {
      'workspace_id': req.params.workspace_id,
      'roles': [c.roles.OWNER, c.roles.ADMIN]
    }).then(decoded => {
      let fields = [
      ];

      // Check if request contains necessary fields
      if (fields && !complete(req.body, fields)) {
        res.status(c.status.BAD_REQUEST).json({'error': 'Missing fields'});
        return;
      }

      res.status(c.status.NOT_IMPLEMENTED).json({'error': 'Functionality not finished'});
    }).catch(err => {
      res.json({'error': 'Authorization error: ' + err});
      return;
    });
  });

  /*
   * Deletes a workspace
   */
  router.delete('/api/workspaces/:workspace_id', (req, res) => {
    // Authenticate and check role
    authorize(req, {
      workspace_id: req.params.workspace_id,
      roles: [c.roles.OWNER]
    }).then(decoded => {
      let fields = [
      ];

      // Check if request contains necessary fields
      if (fields && !complete(req.body, fields)) {
        res.status(c.status.BAD_REQUEST).json({'error': 'Missing fields'});
        return;
      }

      Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).exec((err, workspace) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error deleting workspace: ' + err});
          return;
        }
        else if (!workspace) {
          res.status(c.status.BAD_REQUEST).json({'error': 'A workspace with that id doesn\'t exist'});
          return;
        }

        workspace.set({deleted: true});
        workspace.save((err) => {
          if (err) {
            res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error deleting workspace: ' + err});
            return;
          }

          res.status(c.status.OK).json({'message': 'Successfully deleted database'});
        });
      });
    })
    .catch(err => {
      res.json({'error': 'There was an error deleting the workspace: ' + err});
    });
  });
}
