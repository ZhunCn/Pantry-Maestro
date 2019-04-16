const express = require('express');
const bodyParser = require('body-parser');
const {authorize} = require('utils');
const {Change} = require('models');
const c = require('const');
const joi = require('joi');

module.exports = function(router) {
  router.get('/api/workspaces/:workspace_id/inventory/changes', (req, res) => {
    authorize(req, {
      'workspace_id': req.params.workspace_id,
      'roles': [c.roles.OWNER, c.roles.ADMIN, c.roles.MEMBER]
    }).then(decoded => {

    }).catch(err => {
      res.json({'error': 'There was an error getting your account information: ' + err});
    });
  });
}
