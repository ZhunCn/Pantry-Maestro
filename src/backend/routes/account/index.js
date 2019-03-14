const express = require('express');

module.exports = function(router) {
  require('./account.js')(router);

  return router;
}
