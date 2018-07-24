'use strict';

const mongoose    = require('mongoose');
const express     = require('express');
const User        = require('../models/user');
const router      = express.Router();

router.get('/guests', (req, res, next) => {
  if (!req.session.userId) {
    let err = new Error('You must be logged in to view the guests page.');
    err.status = 401;
    return next(err);
  } else {
    User.findById(req.session.userId)
        .exec((err, user) => {
          if (err) {
            return next(err);
          } else {
            return res.render('guests', {title: 'Guests | RoberDola Wedding 2019', name: user.name});
          }
        });
  }
});

module.exports = router;
