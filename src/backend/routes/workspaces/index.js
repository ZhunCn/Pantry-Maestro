const express = require('express');

module.exports = function(router) {
  require('./workspaces.js')(router);
  require('./inventory.js')(router);
  require('./analytics.js')(router);
  require('./users.js')(router);
  require('./invites.js')(router);

  return router;
}
