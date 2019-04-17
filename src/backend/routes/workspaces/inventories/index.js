const express = require('express');

module.exports = function(router) {
  require('./changes')(router);
  require('./inventory')(router);
  require('./notes')(router);

  return router;
}
