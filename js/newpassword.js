'use strict';

const mongoose    = require('mongoose');
const express     = require('express');
const User        = require('../models/user');
const router      = express.Router();

router.post('/newpassword', (req, res, next) => {
  if (!req.session.userId) {
    let err = new Error('You must be logged in to add to the guest list.');
    err.status = 401;
    return next(err);
  } else {
    if ( req.body.newPassword === req.body.newPasswordCheck ) {
      User.findOneAndUpdate({_id: req.session.userId}, {password: req.body.newPassword})
          .exec((err, user) => {
            if (err) {
              return next(err);
            } else {
              console.log('user found and password updated');
              res.redirect(302, 'guests');
            }
      });
    } else {
      let err = new Error('Passwords do not match.');
      return next(err);
    }
  }
});

module.exports = router;
