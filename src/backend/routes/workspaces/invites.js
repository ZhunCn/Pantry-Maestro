const express = require('express');
const bodyParser = require('body-parser');
const {Workspace, Invite, User} = require('models');
const {authorize, complete} = require('utils');
const c = require('const');

module.exports = function(router) {
  /*
   * Get the invites for a workspace
   */
  router.get('/api/workspaces/:workspace_id/invites', (req, res) => {
    // Authorize
    authorize(req, {
      'workspace_id': req.params.workspace_id,
      'roles': [c.roles.OWNER, c.roles.ADMIN, c.roles.MEMBER]
    }).then(decoded => {
      Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false})
      .select('-__v')
      .populate({
        path: 'invites',
        select: '-__v'
      })
      .exec((err, workspace) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error querying for workspace: ' + err});
          return;
        }
        else if (!workspace) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'No workspace exists with that id'});
          return;
        }

        res.status(c.status.OK).json({'invites': workspace.invites});
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting the analytics: ' + err});
    });
  });

  /*
   * Create an invite for a workspace
   */
  router.post('/api/workspaces/:workspace_id/invites', (req, res) => {
    // Authorize

    let fields = [
      'email'
    ];

    // Check if request contains necessary fields
    if (fields && !complete(req.body, fields)) {
      res.status(c.status.BAD_REQUEST).json({'error': 'Missing fields'});
      return;
    }

    authorize(req, {
      'workspace_id': req.params.workspace_id,
      'roles': [c.roles.OWNER, c.roles.ADMIN, c.roles.MEMBER]
    }).then(decoded => {
      Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).select('-__v')
      .populate('invites')
      .populate({
        path: 'users.account',
        select: '-__v -workspaces -salt -hash'
      })
      .exec((err, workspace) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error querying for workspace: ' + err});
          return;
        }
        else if (!workspace) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'No workspace exists with that id'});
          return;
        }

        for (let i = 0; i < workspace.users.length; i++) {
          if (workspace.users[i].account.email == req.body.email) {
            res.json({'error': 'A user with this email is already in this workspace'});
            return;
          }
        }

        let invite = new Invite({
          'workspace': req.params.workspace_id,
          'workspace_name': workspace.name,
          'email': req.body.email,
          'sender': decoded.user_id
        });

        invite.save((err, invite) => {
          if (err) {
            res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error creating invitation: ' + err});
            return;
          }

          workspace.invites.push(invite['_id']);
          workspace.save((err, workspace) => {
            if (err) {
              res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error creating invitation: ' + err});
              return;
            }

            res.status(c.status.OK).json({'invite_id': invite['_id']});
          });
        });
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting the analytics: ' + err});
    });
  });

  /*
   * Modify or resent an invite
   */
  router.put('/api/workspaces/:workspace_id/invites/:invite_id', (req, res) => {
    // Authorize

    res.status(c.status.NOT_IMPLEMENTED).json({'error': 'Functionality not added'});
  });

  /*
   * Nullify an invite for a workspce
   */
  router.delete('/api/workspaces/:workspace_id/invites/:invite_id', (req, res) => {
    // Authorize

    authorize(req, {
      'workspace_id': req.params.workspace_id,
      'roles': [c.roles.OWNER, c.roles.ADMIN, c.roles.MEMBER]
    }).then(decoded => {
      Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).select('-__v').exec((err, workspace) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error querying for workspace: ' + err});
          return;
        }
        else if (!workspace) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'No workspace exists with that id'});
          return;
        }

        let invites = [];

        workspace.invites.forEach(invite => {
          if (invite != req.params.invite_id) {
            invites.push(invite);
          }
        });

        workspace.invites = invites;

        workspace.save(err => {
          if (err) {
            res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error deleting invite: ' + err});
            return;
          }

          Invite.findOneAndDelete({'_id': req.params.invite_id}).exec(err => {
            if (err) {
              res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error deleting invite: ' + err});
              return;
            }

            res.status(c.status.OK).json({'message': 'Successfully deleted invite'});
          });
        });
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting the analytics: ' + err});
    });
  });

  /*
   * Validate an invitation
   */
  router.post('/api/workspaces/:workspace_id/invites/validate', (req, res) => {
    // Authorize

    let fields = [
      'invite'
    ];

    // Check if request contains necessary fields
    if (fields && !complete(req.body, fields)) {
      res.status(c.status.BAD_REQUEST).json({'error': 'Missing fields'});
      return;
    }

    Invite.findOne({'token': req.body.invite}).exec((err, invite) => {
      if (err) {
        res.json({'error': 'There was an error validating: ' + invite});
        return;
      }
      else if (!invite) {
        res.json({'error': 'Token doesn\'t exist'});
        return;
      }

      res.json({'message': 'Token is valid'});
    });
  });

  /*
   * Invalidate an invitation
   */
  router.post('/api/workspaces/:workspace_id/invites/invalidate', (req, res) => {
    // Authorize

    let fields = [
      'invite'
    ];

    // Check if request contains necessary fields
    if (fields && !complete(req.body, fields)) {
      res.status(c.status.BAD_REQUEST).json({'error': 'Missing fields'});
      return;
    }

    Invite.findOneAndDelete({'token': req.body.invite}).exec((err, invite) => {
      if (err) {
        res.json({'error': 'There was an error validating: ' + invite});
        return;
      }
      else if (!invite) {
        res.json({'error': 'Token doesn\'t exist'});
        return;
      }

      Workspace.findOne({'_id': invite.workspace, 'deleted': false}).exec((err, workspace) => {
        if (err || !workspace) {
          res.json({'error': 'There was an error invalidating: ' + invite});
          return;
        }

        let invites = [];

        workspace.invites.forEach(invite => {
          if (invite != invite._id) {
            invites.push(invite);
          }
        });

        workspace.invites = invites;
        workspace.save(err => {
          if (err) {
            res.json({'error': 'There was an error invalidating: ' + err});
            return;
          }

          invite.sendDeclined(err => {
            if (err) {
              res.json({'error': 'There was an error invalidating: ' + err});
              return;
            }

            res.json({'message': 'Successfully invalidated the token'});  
          });
        });
      });
    });
  });

  /*
   * Confirm an invitation
   */
  router.post('/api/workspaces/invites/join', (req, res) => {
    // Authorize

    let fields = [
      'invite',
      'user_id'
    ];

    // Check if request contains necessary fields
    if (fields && !complete(req.body, fields)) {
      res.status(c.status.BAD_REQUEST).json({'error': 'Missing fields'});
      return;
    }

    Invite.findOne({'token': req.body.invite}).exec((err, invite) => {
      if (err || !invite) {
        res.json({'error': 'There was an error joining the workspace: ' + err});
        return;
      }

      Workspace.findOne({'_id': invite.workspace, 'deleted': false}).select('-__v').populate('invites').exec((err, workspace) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error querying for workspace: ' + err});
          return;
        }
        else if (!workspace) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'No workspace exists with that id'});
          return;
        }
        else if (workspace.users.includes(req.body.user_id)) {
          res.json({'error': 'You are already a part of this workspace'});
          return;
        }

        workspace.users.push({
          account: req.body.user_id,
          roles: c.roles.MEMBER
        });

        workspace.save((err) => {
          if (err) {
            res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error querying for workspace: ' + err});
            return;
          }

          User.findOne({'_id': req.body.user_id}).exec((err, user) => {
            if (err) {
              res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error accepting invitation ' + err});
              return;
            }


            user.workspaces.push(workspace._id);

            user.save(err => {
              if (err) {
                res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error accepting invitation: ' + err});
                return;
              }

              Invite.deleteOne({'token': req.body.invite}).exec(err => {
                if (err) {
                  res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error accepting invitation: ' + err});
                  return;
                }

                invite.sendAccepted(err => {
                  if (err) {
                    res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error accepting invitation: ' + err});
                    return;
                  }

                  res.json({'message': 'Successfully joined workspace', 'workspace': workspace._id});
                });
              });
            });
          });
        });
      });
    });
  });
}
