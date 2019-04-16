const express = require('express');

module.exports = function(router) {
  require('./workspaces')(router);
  require('./inventories')(router);
  require('./analytics')(router);
  require('./users')(router);
  require('./invites')(router);
  require('./analytics')(router);
  require('./transfer')(router);

  return router;
}
