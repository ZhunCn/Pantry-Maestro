const express = require('express');

module.exports = function() {
  let router = express.Router();

  router.get('/api', (req, res) => {
    res.json({message: 'Pantry Maestro API'});
  });

  require('./auth')(router);
  require('./account')(router);
  require('./workspaces')(router);
  require('./error')(router);

  return router;
}
