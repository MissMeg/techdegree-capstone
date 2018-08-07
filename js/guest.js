'use strict';

const mongoose    = require('mongoose');
const express     = require('express');
const User        = require('../models/user');
const Group        = require('../models/group');
const Guest        = require('../models/guest');
const router      = express.Router();

router.get('/guests', (req, res, next) => {
  //make sure user is logged in
  if (!req.session.userId) {
    let err = new Error('You must be logged in to view the guests page.');
    err.status = 401;
    return next(err);
  } else {
    //find the user
    User.findById(req.session.userId)
        .exec((err, user) => {
          if (err) {
            return next(err);
          } else {
            //populate the groups for appearing on the page
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
  //make sure user is logged in
  if (!req.session.userId) {
    let err = new Error('You must be logged in to add to the guest list.');
    err.status = 401;
    return nest(err);
  } else {
    //create new guest
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
        if ( req.body.groupName !== 'Choose' && req.body.newGroup !== '') {
          let err = new Error('Please either choose a current group or create a new one. Both is not an option :)')
        } else {
          if (req.body.groupName !== "Choose") {
            //add to a current group
            Group.findOneAndUpdate(
              {groupName: req.body.groupName},
              {$push: {members: guest._id}})
                .exec((err, group) => {
                  if (err) {
                    return next(err);
                  } else {
                    Guest.findOneAndUpdate(
                      {_id: guest._id},
                      {group: group._id})
                          .exec((err, guest) => {
                            if (err) {
                              return next(err);
                            } else {
                              res.redirect(302, 'guests');
                            }
                    });
                  }
            });
          } else {
            Group.findOne({groupName: req.body.newGroup}, (err, group) => {
              if (err) {
                return next(err);
              }
              if (!group) {
                //add to a new group
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


module.exports = router;
