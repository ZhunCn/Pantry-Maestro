const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const {User} = require('models');
const {complete, isJSON} = require('utils');
const c = require('const');

module.exports = function(router) {
  router.post('/api/auth/register', (req, res) => {
    let fields = [
      'email',
      'username',
      'password'
    ];

    // Check if request contains necessary fields
    if (fields && !complete(req.body, fields)) {
      res.status(c.status.BAD_REQUEST).json({'error': 'Missing fields'});
      return;
    }

    // TODO: Validate fields

    let newUser = new User({
      'email': req.body.email,
      'username': req.body.username,
      'password': req.body.password
    });

    newUser.save((err, user) => {
      if (err || !user) {
        res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error adding user: ' + err});
        return;
      }

      user.workspaces.push(req.params.workspace_id);
      user.save((err, user) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error saving user: ' + err});
          return;
        }

        res.status(c.status.OK).json({
          'message': 'Added user to workspace',
          'user_id': user['_id']
        });
      });
    });
  });

  router.post('/api/auth/login', (req, res) => {
    let fields = [
      'username',
      'password'
    ];

    // Check if request contains necessary fields
    if (fields && !complete(req.body, fields)) {
      res.status(c.status.BAD_REQUEST).json({'error': 'Missing fields'});
      return;
    }

    User.findOne({'username': req.body.username}).exec((err, user) => {
      if (err) {
        res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error authenticating: ' + err});
        return;
      }
      else if (!user) {
        res.status(c.status.BAD_REQUEST).json({'error': 'Invalid credentials'});
        return;
      }

      user.verifyPassword(req.body.password, (err, result) => {
        if (err) {
          res.status(c.status.INTERNAL_SERVER_ERROR).json({'error': 'Error authenticating: ' + err});
          return;
        }

        // Incorrect password
        if (!result) {
          res.status(c.status.OK).json({'error': 'Invalid credentials'});
          return;
        }

        // Create JWT
        let token = jwt.sign({
          'user_id': user['_id']
        }, process.env.JWT_SECRET, {
          'expiresIn': '12h'
        });

        res.json({
          'message': 'Successfully authenticated',
          'token': token
        });
      });
    });
  });

  router.post('/api/auth/test', (req, res) => {
    if (!req.headers.authorization) {
      res.status(c.status.UNAUTHORIZED).json({'error': 'Missing necessary authorization'});
      return;
    }

    let token = req.headers.authorization;

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    if (!token) {
      res.status(c.status.BAD_REQUEST).json({'error': 'Invalid token'});
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(c.status.BAD_REQUEST).json({'error': 'Invalid token'});
        return;
      }

      res.status(c.status.OK).json({
        'message': 'Successfully decoded token',
        'decoded': decoded
      });
    });
  });
}
