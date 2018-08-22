'use strict';

const mongoose    = require('mongoose');
const express     = require('express');
const User        = require('../models/user');
const router      = express.Router();

router.get('/login', (req, res, next) => {
  //find all users for loggin in
  User.find({}, (err, users) => {
    if (err) {
      return next(err);
    } else {
      res.render('login', {title: 'Login | RoberDola Wedding 2019', users: users});
    }
  });
});


router.post('/login', (req, res, next) => {
  //amke sure both fields are present
  if ( req.body.secrectCode && req.body.user ) {
    //authenticate the user
    User.authenticate(req.body.user, req.body.secrectCode, (err, user) => {
      if (err || !user) {
        //cannot be wrong user since there are only the set 6
        let err = new Error('Wrong password.');
        err.status = 401;
        return next(err);
      } else {
        //set session
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

//logout current user
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


////////////ONLY FOR TESTING/GRADING PURPOSES///////////
//This will be removed for production since only a few poeple should have access to the guest list
//No one will be able to create a user to access the guest list in final product (after grading)
// router.get('/createuser', (req, res) => {
//   res.render('createuser', {title: 'Create User | RoberDola Wedding 2019'});
// });
//
// router.post('/createuser', (req, res, next) => {
//   //make sure elements exist
//   if (req.body.name && req.body.password) {
//     //create a new user
//     User.create({name: req.body.name, password: req.body.password}, (err, user) => {
//       if(err) {
//         return next(err);
//       } else {
//         //create session and redirect
//         req.session.userId = user._id;
//         return res.redirect(302, 'guests');
//       }
//     });
//   }
// });

module.exports = router;
