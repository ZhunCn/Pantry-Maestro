const express = require('express');

module.exports = function() {
  let router = express.Router();

  router.get('/api', (req, res) => {
    res.json({message: 'Backend API'});
  });

  require('./error.js')(router);

  return router;
}
