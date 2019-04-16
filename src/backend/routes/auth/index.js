const express = require('express');

module.exports = function(router) {
  require('./auth.js')(router);
  
  return router;
}
