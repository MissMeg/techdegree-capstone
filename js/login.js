'use strict';

const mongoose    = require('mongoose');
const express     = require('express');
const User        = require('../models/user');
const router      = express.Router();

router.get('/login', (req, res) => {
  res.render('login', {title: 'Login | RoberDola Wedding 2019'});
});

router.post('/login', (req, res, next) => {
  //users already created with hashed passwords
    //since the page is not open to everyone
  if ( req.body.secrectCode && req.body.user ) {
    User.authenticate(req.body.user, req.body.secrectCode, (err, user) => {
      if (err || !user) {
        //cannot be wrong user since there are only the set 6
        let err = new Error('Wrong password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect(302, 'guests');
      }
    });
  } else if ( !req.body.user ){
    let err = new Error('Must select a user.');
    err.status = 401;
    return next(err);
  }
});

router.get('/logout', (req, res, next) => {
  if( req.session || req.session.userId) {
    //delete session
    req.session.destroy( (err) => {
      if (err) {
        return next (err);
      } else {
        return res.redirect(302, '/');
      }
    });
  }
});

module.exports = router;
