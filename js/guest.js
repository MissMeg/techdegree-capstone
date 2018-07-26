'use strict';

const mongoose    = require('mongoose');
const express     = require('express');
const User        = require('../models/user');
const Group        = require('../models/group');
const Guest        = require('../models/guest');
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
            Group.find()
                .populate('members')
                .exec((err, groups) => {
                  if (err) {
                    return next (err);
                  } else {
                    return res.render('guests', {title: 'Guests | RoberDola Wedding 2019', name: user.name, groups});
                  }
            });
          }
    });
  }
});

router.post('/newguest', (req, res, next) => {
  if (!req.session.userId) {
    let err = new Error('You must be logged in to add to the guest list.');
    err.status = 401;
    return nest(err);
  } else {
    let fname = req.body.firstName;
    let lname = req.body.lastName;
    let notes = req.body.notes;
    let user = req.session.userId;
    let isChild, isConfirm, confirmDate, guestData;
    if (req.body.childY === 'on') {
      isChild = true;
    } else if (req.body.childN === 'on'){
      isChild = false;
    }
    if (req.body.confirmY === 'on') {
      isConfirm = true;
    } else if (req.body.confirmN === 'on'){
      isConfirm = false;
    }
    if (isConfirm) {
      guestData = {
        firstName: fname,
        lastName: lname,
        child: isChild,
        confirmed: isConfirm,
        confirmedOn: Date.now(),
        notes: notes,
        submittedBy: user
      };
    } else {
      guestData = {
        firstName: fname,
        lastName: lname,
        child: isChild,
        confirmed: isConfirm,
        notes: notes,
        submittedBy: user
      };
    }
    Guest.create(guestData, (err, guest) => {
      if (err) {
        return next(err);
      } else {
        console.log('guest created');
        if ( req.body.groupName !== 'Choose' && req.body.newGroup !== '') {
          let err = new Error('Please either choose a current group or create a new one. Both is not an option :)')
        } else {
          if (req.body.groupName !== "Choose") {
            console.log('is part of current group');
            Group.findOneAndUpdate(
              {groupName: req.body.groupName},
              {$push: {members: guest._id}})
                .exec((err, group) => {
                  if (err) {
                    return next(err);
                  } else {
                    console.log('group found and member added');
                    Guest.findOneAndUpdate(
                      {_id: guest._id},
                      {group: group._id})
                          .exec((err, guest) => {
                            if (err) {
                              return next(err);
                            } else {
                              console.log('guest found and updated');
                              res.redirect(302, 'guests');
                            }
                    });
                  }
            });
          } else {
            console.log('guest is part of a new group');
            Group.findOne({groupName: req.body.newGroup}, (err, group) => {
              if (err) {
                return next(err);
              }
              if (!group) {
                console.log('no previous group name listed');
                Group.create({groupName: req.body.newGroup}, (err, group) => {
                  if (err) {
                    return next (err);
                  } else {
                    Guest.findOneAndUpdate(
                      {_id: guest._id},
                      {group: group._id})
                          .exec((err, guest) => {
                            if (err) {
                              return next(err);
                            } else {
                              console.log('guest found and updated');
                              Group.findOneAndUpdate(
                                {_id: group._id},
                                {$push: {members: guest._id}})
                                  .exec((err, group) => {
                                    if (err) {
                                      return next(err);
                                    } else {
                                      res.redirect(302, 'guests');
                                    }
                                  });
                            }
                      });
                  }
                });
              } else {
                let err = new Error('This group/family already exists. Please choose this group/family when creating a new guest.');
                return next (err);
              }
            });
          }
        }
      }
    });
  }
});

//return res.render('guests', {title: 'Guests | RoberDola Wedding 2019', name: user.name});
//res.redirect(302, 'guests');
module.exports = router;
