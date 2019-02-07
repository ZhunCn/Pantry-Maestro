const express = require('express');
const {Workspace} = require('models');
const c = require('const');

module.exports = function(router) {
  /*
   * Get the invites for a workspace
   */
  router.get('/api/workspaces/:workspace_id/invites', (req, res) => {
    // Authorize

    res.status(c.status.NOT_IMPLEMENTED).json({'error': 'Functionality not added'});
  });

  /*
   * Create an invite for a workspace
   */
  router.post('/api/workspaces/:workspace_id/invites', (req, res) => {
    // Authorize

    res.status(c.status.NOT_IMPLEMENTED).json({'error': 'Functionality not added'});
  });

  /*
   * Modify or resent an invite
   */
  router.put('/api/workspaces/:workspace_id/invites/:invite_id', (req, res) => {
    // Authorize

    res.status(c.status.NOT_IMPLEMENTED).json({'error': 'Functionality not added'});
  });

  /*
   * Nullify an invite for a workspce
   */
  router.delete('/api/workspaces/:workspace_id/invites/:invite_id', (req, res) => {
    // Authorize

    res.status(c.status.NOT_IMPLEMENTED).json({'error': 'Functionality not added'});
  });
}
