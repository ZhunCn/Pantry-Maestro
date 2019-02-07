const express = require('express');
const {Workspace} = require('../../models');

module.exports = function(router) {
  /*
   * Get the users for a workspace
   */
  router.get('/api/workspaces/:workspace_id/users', (req, res) => {
    // Authorize

    Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).select('-_id -inventory -name -deleted').populate({
      path: 'users.account',
      select: '-_id -workspaces -salt -hash'
    }).exec((err, workspace) => {
      if (err || !workspace) {
        res.json({'error': 'Error querying for workspace: ' + err});
        return;
      }

      res.json(workspace);
    });
  });

  /*
   * Add a user to a workspace
   */
  router.post('/api/workspaces/:workspace_id/users', (req, res) => {
    // Authorize

    res.json({'error': 'Functionality not added'});
  });

  /*
   * Get a specific user
   */
  router.get('/api/workspaces/:workspace_id/users/:user_id', (req, res) => {
    // Authorize

    res.json({'error': 'Functionality not added'});
  });

  /*
   * Update a user profile
   */
  router.put('/api/workspaces/:workspace_id/users/:user_id', (req, res) => {
    // Authorize

    res.json({'error': 'Functionality not added'});
  });

  /*
   * Remove a user from a workspace
   */
  router.delete('/api/workspaces/:workspace_id/users/:user_id', (req, res) => {
    // Authorize

    res.json({'error': 'Functionality not added'});
  });
}
