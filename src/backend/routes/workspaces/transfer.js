const express = require('express');
const bodyParser = require('body-parser');
const {Workspace, User} = require('models');
const {authorize} = require('utils');
const c = require('const');
const joi = require('joi');

const transferSchema = joi.object().keys({
  user_id: joi.string().alphanum().required()
});

module.exports = function(router) {
  /*
   * Get the users for a workspace
   */
  router.post('/api/workspaces/:workspace_id/transfer', (req, res) => {
    // Authorize
    if (joi.validate(req.body, transferSchema).error !== null) {
      res.status(c.status.OK).json({'error': 'Invalid fields'});
      return;
    }

    authorize(req, {
      'workspace_id': req.params.workspace_id,
      'roles': [c.roles.OWNER]
    }).then(decoded => {
      Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false})
      .exec((err, workspace) => {
        if (err || !workspace) {
          res.json({'error': 'There was an error transfering your ownership'});
          return;
        }

        workspace.hasUser(decoded.user_id, (has, user) => {
          if (!has) {
            res.json({'error': 'You are not a member of this workspace'});
            return;
          }

          workspace.isOwner(decoded.user_id, (owner) => {
            if (!owner) {
              res.json({'error': 'You are not the owner of this workspace'});
              return;
            }

            workspace.hasUser(req.body.user_id, (has, user) => {
              if (!has) {
                res.json({'error': 'User is not a member of this workspace'});
                return;
              }

              for (let i = 0; i < workspace.users.length; i++) {
                if (workspace.users[i].account && workspace.users[i].account == decoded.user_id) {
                  workspace.users[i].roles.splice(workspace.users[i].roles.indexOf(c.roles.OWNER), 1);
                }
                else if (workspace.users[i].account && workspace.users[i].account == req.body.user_id) {
                  workspace.users[i].roles.push(c.roles.OWNER);
                }
              }

              workspace.save((err) => {
                if (err) {
                  res.json({'error': 'There was an error updating the roles: ' + err});
                  return;
                }

                res.json({'message': 'Successfully updated roles'});
              });
            });
          });
        });
      });
    }).catch(err => {
      res.json({'error': 'There was an error creating the workspace: ' + err});
    });
  });
}
