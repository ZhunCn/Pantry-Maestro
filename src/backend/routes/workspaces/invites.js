const express = require('express');
const bodyParser = require('body-parser');
const {Workspace, Invite} = require('models');
const {complete} = require('utils');
const c = require('const');

module.exports = function(router) {
  /*
   * Get the invites for a workspace
   */
  router.get('/api/workspaces/:workspace_id/invites', (req, res) => {
    // Authorize

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

      res.status(c.status.OK).json(workspace.invites);
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

    Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).select('-__v').populate('invites').exec((err, workspace) => {
      if (err) {
        res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error querying for workspace: ' + err});
        return;
      }
      else if (!workspace) {
        res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'No workspace exists with that id'});
        return;
      }

      let invite = new Invite({
        'workspace': req.params.workspace_id,
        'workspace_name': workspace.name,
        'email': req.body.email
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

          res.status(c.status.OK).json({'error': 'Successfully created invite', 'invite_id': invite['_id']});
        });
      });
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

    Workspace.findOne({'_id': req.params.workspace_id, 'deleted': false}).select('-__v').exec((err, workspace) => {
      if (err) {
        res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error querying for workspace: ' + err});
        return;
      }
      else if (!workspace) {
        res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'No workspace exists with that id'});
        return;
      }

      workspace.invites = workspace.invites.filter(invite => {
        return invite != req.params.invite_id;
      });

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
  });
}
