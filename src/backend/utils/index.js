const {Invite, User, Workspace} = require('models');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

/*
 * Check whether the object contains all keys in array
 *
 * @arg     obj      Object being checking
 * @arg     keys     Array of Strings to be keys of obj
 * @return  Boolean
 */
function complete(obj, keys) {
  return keys.every(key => {
    return obj.hasOwnProperty(key);
  });
}

/*
 * Sanitize input from users
 *
 * @arg     input   String being sanitized
 * @arg     fields  Array of keys to be sanitized
 * @return  null
 */
function sanitize(obj, fields) {
  // TODO: Add functionality
  if (!obj || !fields) {
    return;
  }

  fields.forEach(field => {
    if (obj[field] && typeof(obj[field]) === String) {
      // obj[field] = obj[field].replace(//g, '');
    }
  });
}

/*
 * Check if a string is valid JSON
 *
 * @arg     input    String being sanitized
 * @return  Boolean
 */
function isJSON(input) {
  try {
    JSON.parse(input);
    return true;
  } catch (e) {
    return false;
  }

  return true;
}

/*
 * Check if a string is valid JSON
 *
 * @arg     input    String being sanitized
 * @return  Boolean
 */
function sendEmail(to, subject, body, attachments, cb) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD
    }
  });

  transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: to,
    subject: subject,
    html: body,
    attachments: attachments
  }, (err, info) => {
    cb(err, info);
  });
}

/*
 * See if a request has the correct authorization
 *
 * @arg     req       Request to be checked
 * @return  Callback
 */
function authorize(req, params = {}) {
  return new Promise((resolve, reject) => {
    if (!req || !params) {
      return reject('Missing req or params');
    }

    if (!req.headers.authorization) {
      return reject('Missing necessary authorization');
    }

    let token = req.headers.authorization;

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    if (!token) {
      return reject('Invalid token');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject('Invalid token');
      }

      if (!decoded.user_id) {
        return reject('Invalid token: Token is mutated');
      }

      if (params.hasOwnProperty('workspace_id') && params.hasOwnProperty('roles')) {
        Workspace.findOne({'_id': params.workspace_id, 'deleted': false}).exec((err, workspace) => {
          if (err) {
            return reject('Error retrieving workspace: ' + err);
          }
          else if (!workspace) {
            return reject('Invalid workspace_id');
          }

          for (let i = 0; i < workspace.users.length; i++) {
            // user_id in users array
            if (workspace.users[i].account == decoded.user_id) {
              // See if there's an intersection
              if (params.roles.filter(role => workspace.users[i].roles.indexOf(role) !== -1).length > 0) {
                return resolve(decoded);
              }
              else {
                return reject('Insufficient permissions');
              }
            }
          }
          return reject('You are not a member of this workspace');
        });
      }
      else {
        return resolve(decoded);
      }
    });
  });
}

module.exports = {complete, sanitize, isJSON, sendEmail, authorize};
