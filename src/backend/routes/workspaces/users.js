const express = require('express');
const {Workspace, User} = require('models');
const c = require('const');

module.exports = function(router) {
  /*
   * Get the users for a workspace
   */
  router.get('/api/workspaces/:workspace_id/users', (req, res) => {
    // Authorize

    Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).select('-_id -inventory -name -deleted').populate({
      path: 'users.account',
      select: '-workspaces -email -salt -hash'
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
  router.post('/api/workspaces/:workspace_id/users', (req, res) => {
    // Authorize

    let fields = [
      'email',
      'username',
      'password'
    ];

    // Check if request contains necessary fields
    if (fields && !complete(req.query, fields)) {
      res.status(c.status.BAD_REQUEST).json({'error': 'Missing fields'});
      return;
    }

    res.status(c.status.NOT_IMPLEMENTED).json({'error': 'Functionality not added'});
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

    res.status(c.status.NOT_IMPLEMENTED).json({'error': 'Functionality not added'});
  });

  /*
   * Remove a user from a workspace
   */
  router.delete('/api/workspaces/:workspace_id/users/:user_id', (req, res) => {
    // Authorize

    Workspace.findById(req.query.workspace_id).exec((err, workspace) => {
      if (err) {
        res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'There was an error removing the user from the workspace: ' + err});
        return;
      }

      for (let i = 0; i < workspace.users.length; i++) {
        if (workspace.users[i].account == req.query.user_id) {
          workspace.splice(i, 1);

          workspace.save(err => {
            if (err) {
              res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'There was an error removing the user from the workspace: ' + err});
              return;
            }

            res.status(c.status.OK).json({'message': 'Successfully removed user from the workspace'});
          });
        }
      }
    });

    res.status(c.status.NOT_IMPLEMENTED).json({'error': 'Functionality not added'});
  });
}
