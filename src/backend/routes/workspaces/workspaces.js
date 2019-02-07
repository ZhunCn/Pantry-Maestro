const express = require('express');

const {complete} = require('../../utils');
const {Workspace} = require('../../models');

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
    if (fields && !complete(req.query, fields)) {
      res.status(400).json({'error': 'Missing fields'});
      return;
    }

    Workspace.findOne({'name': req.query.name, 'deleted': false}).exec((err, workspace) => {
      if (err) {
        res.json({'error': 'Error querying for workspace: ' + err});
        return;
      }
      else if (!workspace) {
        res.json({'error': 'No workspace exists with that id'});
        return;
      }

      res.json({'_id': workspace._id});
    });
  });

  /*
   * Creates a new workspace
   */
  router.post('/api/workspaces/', (req, res) => {
    // Authorize

    let fields = [
      'name'
    ];

    // Check if request contains necessary fields
    if (fields && !complete(req.query, fields)) {
      res.status(400).json({'error': 'Missing fields'});
      return;
    }

    Workspace.findOne({'name': req.query.name}).exec((err, workspace) => {
      if (err || !workspace) {
        res.json({'error': 'Error querying for workspace: ' + err});
        return;
      }

      res.json({'_id': workspace._id});
    });
  });

  /*
   * Sends relevant information about a workspace
   */
  router.get('/api/workspaces/:workspace_id', (req, res) => {
    // Authorize

    Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).select('-_id -inventory -users -deleted').exec((err, workspace) => {
      if (err || !workspace) {
        res.json({'error': 'Error querying for workspace: ' + err});
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
    if (fields && !complete(req.query, fields)) {
      res.status(400).json({'error': 'Missing fields'});
      return;
    }

    res.json({'error': 'Functionality not finished'});
  });

  /*
   * Deletes a workspace
   */
  router.delete('/api/workspaces/:workspace_id', (req, res) => {
    // Authenticate and check role

    let fields = [
    ];

    // Check if request contains necessary fields
    if (fields && !complete(req.query, fields)) {
      res.status(400).json({'error': 'Missing fields'});
      return;
    }

    Workspace.findById(req.params.workspace_id).exec((err, workspace) => {
      if (err) {
        res.json({'error': 'Error deleting workspace: ' + err});
        return;
      }
      else if (!workspace) {
        res.json({'error': 'A workspace with that id doesn\'t exist'});
        return;
      }

      workspace.deleted = true;
      workspace.save((err) => {
        if (err) {
          res.json({'error': 'Error deleting workspace: ' + err});
          return;
        }

        res.json({'message': 'Successfully deleted database'});
      });
    });
  });
}
