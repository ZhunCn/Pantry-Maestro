const express = require('express');

module.exports = function(router) {
  /*
  router.post('/api/workspaces/:workspace_id/users', (req, res) => {
    // Authorize

    let fields = [
      'email',
      'username',
      'password',
      'roles'
    ];

    // Check if request contains necessary fields
    if (fields && !complete(req.query, fields)) {
      res.status(c.status.BAD_REQUEST).json({'error': 'Missing fields'});
      return;
    }

    let newUser = new User({
      'email': req.query.email,
      'username': req.query.username,
      'password': req.query.password
    });

    newUser.save((err, user) => {
      if (err || !user) {
        res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error adding user: ' + err});
        return;
      }

      user.workspaces.push(req.params.workspace_id);
      user.save((err) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error saving user: ' + err});
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

          workspace.users.push({'account': user['_id'], 'roles': req.query.roles});
          workspace.save((err) => {
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
  */
}
