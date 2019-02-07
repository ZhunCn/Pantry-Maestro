const express = require('express');

const {Workspace} = require('../../models');

module.exports = function(router) {
  /*
   * Get the analytics for a workspace
   */
  router.get('/api/workspaces/:workspace_id/analytics', (req, res) => {
    // Authorize

    res.json({'error': 'Functionality not added'});
  });
}
