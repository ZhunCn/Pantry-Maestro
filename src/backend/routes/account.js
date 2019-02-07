const express = require('express');

module.exports = function(router) {
  router.get('/api/account', (req, res) => {
    res.json({'error': 'Functionality not completed'});
  });

  router.post('/api/account', (req, res) => {
    res.json({'error': 'Functionality not completed'});
  });
}
