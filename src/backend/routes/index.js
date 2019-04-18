const express = require('express');

const {Workspace} = require('models');

module.exports = function() {
  let router = express.Router();

  router.get('/api', (req, res) => {
    res.json({message: 'Pantry Maestro API'});
  });

  router.get('/api/workspaces/:workspace_id/testing', (req, res) => {
    Workspace.findOne({_id: req.params.workspace_id, deleted: false}).exec((err, workspace) => {
      if (err) {
        res.json({'error': 'There was some kind of error'});
        return;
      }

      workspace.sendLeaveEmail(err => {
        console.log(err);
      });
    });
  });

  require('./auth')(router);
  require('./account')(router);
  require('./workspaces')(router);
  require('./error')(router);

  return router;
}
