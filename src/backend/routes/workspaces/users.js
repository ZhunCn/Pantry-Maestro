const express = require('express');
const {Workspace, User} = require('models');
const {complete, isJSON} = require('utils');
const c = require('const');

module.exports = function(router) {
  /*
   * Get the users for a workspace
   */
  router.get('/api/workspaces/:workspace_id/users', (req, res) => {
    // Authorize

    Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).select('-_id -inventory -name -deleted').populate({
      path: 'users.account',
      select: '-__v -workspaces -email -salt -hash'
    }).exec((err, workspace) => {
      if (err || !workspace) {
        res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error querying for workspace: ' + err});
        return;
      }

      res.status(c.status.OK).json(workspace);
    });
  });

  /*
   * Add a user to a workspace
   */
  router.post('/api/workspaces/:workspace_id/users/:user_id', (req, res) => {
    // Authorize

    let fields = [
      'roles'
    ];

    // Check if request contains necessary fields
    if (fields && !complete(req.query, fields)) {
      res.status(c.status.BAD_REQUEST).json({'error': 'Missing fields'});
      return;
    }
    else if (!isJSON(req.query.roles)) {
      res.status(c.status.BAD_REQUEST).json({'error': 'Invalid JSON for field `roles`'});
      return;
    }

    Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).exec((err, workspace) => {
      if (err) {
        res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error adding user to workspace: ' + err});
        return;
      }
      else if (!workspace) {
        res.status(c.status.BAD_REQUEST).json({'error': 'No workspace exists with the specified id'});
        return;
      }

      workspace.users.push({'account': req.params.user_id, 'roles': JSON.parse(req.query.roles)});

      workspace.save((err) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error adding user to workspace: ' + err});
          return;
        }

        User.findById(req.params.user_id).exec((err, user) => {
          if (err) {
            res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error adding user to workspace: ' + err});
            return;
          }

          user.workspaces.push(req.params.workspace_id);
          user.save((err) => {
            if (err) {
              res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error adding user to workspace: ' + err});
              return;
            }

            res.status(c.status.OK).json({'message': 'Added user to workspace'});
          });
        });
      });
    });
  });

  /*
   * Get a specific user
   */
  router.get('/api/workspaces/:workspace_id/users/:user_id', (req, res) => {
    // Authorize

    Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).exec((err, workspace) => {
      if (err) {
        res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'There was an error querying for user: ' + err});
        return;
      }

      User.findById(req.params.user_id).exec((err, user) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'There was an error querying for user: ' + err});
          return;
        }

        let found = false;
        let formatted = {};

        formatted['username'] = user.username;

        workspace.users.forEach(workspace_user => {
          if (!found && workspace_user.account == req.params.user_id) {
            // Explicitly control what is being sent
            formatted['roles'] = workspace_user.roles

            res.status(c.status.OK).json(formatted);
            found = true;
            return;
          }
        });

        if (found) {
          return;
        }

        res.status(c.status.BAD_REQUEST).json({'error': 'That id isn\'t associated with this workspace'});
        return;
      });
    });
  });

  /*
   * Update a user profile or change the user's role
   */
  router.put('/api/workspaces/:workspace_id/users/:user_id', (req, res) => {
    // Authorize

    if (!req.query) {
      res.status(c.status.OK).json({'message': 'No fields to update'});
      return;
    }
    else if (!isJSON(req.query.roles)) {
      res.status(c.status.BAD_REQUEST).json({'message': 'Invalid JSON for field `roles`'});
      return;
    }

    res.status(c.status.NOT_IMPLEMENTED).json({'error': 'Functionality not added'});
  });

  /*
   * Remove a user from a workspace
   */
  router.delete('/api/workspaces/:workspace_id/users/:user_id', (req, res) => {
    // Authorize

    Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).exec((err, workspace) => {
      if (err) {
        res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'There was an error removing the user from the workspace: ' + err});
        return;
      }

      User.findById(req.params.user_id).exec((err, user) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'There was an error removing the user from the workspace: ' + err});
          return;
        }
        else if (!user) {
          res.status(c.status.BAD_REQUEST).json({'error': 'Specified user is not a member of that workspace'});
          return;
        }
        else if (user.workspaces.indexOf(req.params.workspace_id) == -1) {
          res.status(c.status.BAD_REQUEST).json({'error': 'Specified user is not a member of that workspace'});
          return;
        }

        user.workspaces.splice(user.workspaces.indexOf(req.params.user_id), 1);

        for (let i = 0; i < workspace.users.length; i++) {
          if (workspace.users[i].account == req.params.user_id) {
            // TODO: Add extra checking to stop owner or last user from deleting  themself

            workspace.users.splice(i, 1);

            workspace.save(err => {
              if (err) {
                // TODO: Add user back into workspace if there's an error?

                res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'There was an error removing the user from the workspace: ' + err});
                return;
              }

              user.save(err => {
                if (err) {
                  res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'There was an error removing the user from the workspace: ' + err});
                  return;
                }

                res.status(c.status.OK).json({'message': 'Successfully deleted user from workspace'});
              });
            });
          }
        }
      });
    });
  });
}
