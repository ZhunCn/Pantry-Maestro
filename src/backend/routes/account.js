const express = require('express');
const {authorize} = require('utils');
const {User} = require('models');
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
}
