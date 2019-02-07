const express = require('express');
const {Workspace} = require('models');
const c = require('const');

module.exports = function(router) {
  /*
   * Get the analytics for a workspace
   */
  router.get('/api/workspaces/:workspace_id/analytics', (req, res) => {
    // Authorize

    res.status(c.status.NOT_IMPLEMENTED).json({'error': 'Functionality not added'});
  });
}
