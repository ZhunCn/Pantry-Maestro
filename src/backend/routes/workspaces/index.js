const express = require('express');

module.exports = function(router) {
  require('./workspaces.js')(router);
  require('./inventories.js')(router);
  require('./analytics.js')(router);
  require('./users.js')(router);
  require('./invites.js')(router);
  require('./analytics.js')(router);
  require('./transfer.js')(router);
  return router;
}
