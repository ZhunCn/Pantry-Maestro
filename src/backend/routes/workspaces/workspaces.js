const express = require('express');
const bodyParser = require('body-parser');
const {complete} = require('utils');
const {Workspace, Inventory} = require('models');
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

    // Check if request contains necessary fields
    if (fields && !complete(req.body, fields)) {
      res.status(c.status.BAD_REQUEST).json({'error': 'Missing fields'});
      return;
    }

    Workspace.findOne({'name': req.body.name, 'deleted': false}).exec((err, workspace) => {
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
      else if (workspace) {
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

        let workspace = new Workspace({
          'name': req.body.name,
          'inventory': inventory['_id'],
          'users': []
        });

        workspace.save(err => {
          if (err) {
            res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'There was an error adding the workspace'});
            return;
          }

          res.status(c.status.OK).json({'message': 'Successfully created the workspace'});
        });
      });
    });

    // res.status(c.status.NOT_IMPLEMENTED).json({'error': 'Functionality not finished'});
  });

  /*
   * Sends relevant information about a workspace
   */
  router.get('/api/workspaces/:workspace_id', (req, res) => {
    // Authorize

    Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).select('-_id -inventory -users -deleted').exec((err, workspace) => {
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
    let fields = [
    ];

    // Check if request contains necessary fields
    if (fields && !complete(req.body, fields)) {
      res.status(c.status.BAD_REQUEST).json({'error': 'Missing fields'});
      return;
    }

    res.status(c.status.NOT_IMPLEMENTED).json({'error': 'Functionality not finished'});
  });

  /*
   * Deletes a workspace
   */
  router.delete('/api/workspaces/:workspace_id', (req, res) => {
    // Authenticate and check role

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
  });
}
