const express = require('express');
const {authorize, complete} = require('utils');
const {User, Workspace} = require('models');
const c = require('const');

module.exports = function(router) {
  router.get('/api/account', (req, res) => {
    authorize(req).then(decoded => {
      User.findById(decoded.user_id).select('-__v -hash').exec((err, user) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'There was an error retrieving account information'});
          return;
        }
        else if (!user) {
          res.status(c.status.BAD_REQUEST).json({'error': 'Provided token is invalid'});
          return;
        }

        res.json(user);
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting your account information: ' + err});
    });
  });

  router.put('/api/account', (req, res) => {
    if (!req.body) {
      res.status(c.status.OK).json({'message': 'No fields to update'});
      return;
    }

    // In the future, add functionality to change item's name
    let fields = [
      'email',
      'username'
    ];
    let toUpdate = {};

    fields.forEach(field => {
      if (req.body.hasOwnProperty(field)) {
        toUpdate[field] = req.body[field];
      }
    });

    authorize(req).then(decoded => {
      // Find the user by the user_id
      User.findById(decoded.user_id).select('').exec((err, user) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'There was an error retrieving account information'});
          return;
        }
        else if (!user) {
          res.status(c.status.BAD_REQUEST).json({'error': 'Provided token is invalid'});
          return;
        }

        // Update the fields
        for (key in toUpdate) {
          user[key] = toUpdate[key];
        }

        // Save the user with these fields
        if (!req.body.old_password || !req.body.new_password) {
          user.save(err => {
            if (err) {
              res.json({'error': 'There was an error updating the account information: ' + err});
              return;
            }

            res.status(c.status.OK).json({'message': 'Successfully updated your account information'});
            return;
          });

          return;
        }

        // Update the password
        user.verifyPassword(req.body.old_password, (err, match) => {
          if (err) {
            res.status(c.status.INTERNAL_SERVER_ERROR).json({'err': 'There was an error updating the account: ' + err});
            return;
          }
          else if (!match) {
            res.status(c.status.INTERNAL_SERVER_ERROR).json({'err': 'Error updating fields: Incorrect password'});
            return;
          }

          user._password = req.body.new_password;
          user.hash = undefined;

          user.save(err => {
            if (err) {
              res.status(c.status.INTERNAL_SERVER_ERROR).json({'err': 'There was an error updating the account: ' + err});
              return;
            }

            res.status(c.status.OK).json({'message': 'Successfully updated your account information'});
          });
        });
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting your account information: ' + err});
    });
  });

  router.post('/api/account/leave', (req, res) => {
    let fields = [
      'workspace_id'
    ];

    // Check if request contains necessary fields
    if (fields && !complete(req.body, fields)) {
      res.status(c.status.BAD_REQUEST).json({'error': 'Missing fields'});
      return;
    }

    authorize(req).then(decoded => {
      Workspace.findOne({'_id': req.body.workspace_id, 'deleted': false}).exec((err, workspace) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'There was an error leaving this workspace: ' + err});
          return;
        }
        else if (!workspace) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'No workspace exists with this given id'});
          return;
        }
        else if (workspace.users.length === 1) {
          res.json({'error': 'You can\'t leave the workspace if you\'re the last member in it'});
          return;
        }

        workspace.hasUser(decoded.user_id, (has, user) => {
          if (!has) {
            res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'User is not a part of that workspace'});
            return;
          }

          workspace.removeUser(decoded.user_id, (removed) => {
            if (!removed) {
              res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'There was an error removing user from the workspace'});
              return;
            }

            user.removeWorkspace(req.body.workspace_id, (removed) => {
              if (!removed) {
                res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'There was an error removing user from the workspace'});
                return;
              }

              res.status(c.status.OK).json({'message': 'Removed the user from the workspace'});
              return;
            });
          });
        });
      });
    }).catch(err => {
      res.json({'error': 'There was an error leaving this workspace: ' + err});
    });
  });
}
