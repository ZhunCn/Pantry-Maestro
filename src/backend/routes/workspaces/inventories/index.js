const express = require('express');

module.exports = function(router) {
  require('./inventory')(router);
  require('./notes')(router);

  return router;
}
