const express = require('express');
const bodyParser = require('body-parser');
const {Item} = require('models');
const {authorize} = require('utils');
const c = require('const');
const joi = require('joi');

const checkoutSchema = joi.object().keys({
});

module.exports = function(router) {
  router.post('/api/workspaces/:workspace_id/checkout', (req, res) => {
    authorize(req, {
      'workspace_id': req.params.workspace_id,
      'roles': [c.roles.OWNER, c.roles.ADMIN, c.roles.MEMBER]
    }).then(decoded => {
      // Joi


    }).catch(err => {
      res.json({'error': 'There was an error getting your account information: ' + err});
    });
  });
}
