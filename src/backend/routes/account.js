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
      User.findById(decoded.user_id).select('-__v -hash').exec((err, user) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'There was an error retrieving account information'});
          return;
        }
        else if (!user) {
          res.status(c.status.BAD_REQUEST).json({'error': 'Provided token is invalid'});
          return;
        }

        for (key in toUpdate) {
          user[key] = toUpdate[key];
        }

        user.save(err => {
          if (err) {
            res.json({'error': 'There was an error updating the account information: ' + err});
            return;
          }

          res.json({'message': 'Successfully updated your account information'});
        });
      });
    }).catch(err => {
      res.json({'error': 'There was an error getting your account information: ' + err});
    });
  });
}
