'use strict';

const mongoose    = require('mongoose');
const express     = require('express');
const User        = require('../models/user');
const Group        = require('../models/group');
const Guest        = require('../models/guest');
const router      = express.Router();

router.post('/deleteguest', (req, res, next) => {
  if (!req.session.userId) {
    let err = new Error('You must be logged in to add to the guest list.');
    err.status = 401;
    return nest(err);
  } else {
    Guest.findById(req.body.id)
      .exec((err, guest) => {
        if (err) {
          return next(err);
        }
        Group.findById(guest.group)
            .exec((err, group) => {
              if (err) {
                return next(err);
              }
          Group.update({_id: group._id}, {$pull: { members: guest._id}}, (err) => {
            if (err) {
              return next(err);
            }
            Guest.deleteOne({_id: guest._id}, (err) => {
              if (err) {
                return next(err);
              }
              res.redirect(302, 'guests');
            });
          });
        });
    });
  }
});

router.post('/editguest', (req, res, next) => {
  if(!req.session.userId) {
    let err = new Error('You must be logged in to add to the guest list.');
    err.status = 401;
    return nest(err);
  } else {
    if ( req.body.groupName === 'Choose' && req.body.newGroup === '' ){
      console.log('no group updates required');
      Guest.findById(req.body.id)
          .exec((err, guest) => {
            if (err) {
              return next(err);
            }
            let fname = req.body.firstName;
            let lname = req.body.lastName;
            let notes = req.body.notes;
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
              Guest.update({_id: req.body.id}, {$set:
                {'firstName': fname,
                'lastName': lname,
                'child': isChild,
                'confirmed': isConfirm,
                'confirmedOn': Date.now(),
                'notes': notes}}, (err) => {
                  if (err) {
                    return next(err);
                  }
                res.redirect(302, 'guests');
              });
            } else {
              Guest.update({_id: req.body.id}, {$set:
                {'firstName': fname,
                'lastName': lname,
                'child': isChild,
                'confirmed': isConfirm,
                'notes': notes}}, (err) => {
                  if (err) {
                    return next(err);
                  }
                res.redirect(302, 'guests');
              });
            }
          });
    } else if ( req.body.groupName !== 'Choose' && req.body.newGroup !== '' ) {
      let err = new Error('You can either choose a current group/family or create a new one, not both :)');
      return nest(err);
    } else if ( req.body.groupName !== 'Choose' || req.body.newGroup !== '' ) {
      console.log('group updates needed');
      Group.findById(req.body.groupid)
          .exec((err, group) => {
            if (err) {
              return next(err);
            }
        Group.update({_id: group._id}, {$pull: { members: req.body.id}}, (err) => {
          if (err) {
            return next(err);
          } else {
            Group.findById(req.body.groupid)
            .exec((err, group) => {
              if (err) {
                return next(err);
              } else {
                if (group.members.length === 0) {
                  Group.deleteOne({_id: group._id}, (err) => {
                    if (err) {
                      return next(err);
                    } else {
                      if (req.body.groupName !== 'Choose' && req.body.newGroup === '') {
                        Group.findOneAndUpdate({groupName: req.body.groupName}, {$push: {members: req.body.id}}, (err, group) => {
                          if (err) {
                            return next(err);
                          }
                          Guest.findById(req.body.id)
                              .exec((err, guest) => {
                                if (err) {
                                  return next(err);
                                }
                                let fname = req.body.firstName;
                                let lname = req.body.lastName;
                                let notes = req.body.notes;
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
                                  Guest.update({_id: req.body.id}, {$set:
                                    {'firstName': fname,
                                    'lastName': lname,
                                    'child': isChild,
                                    'confirmed': isConfirm,
                                    'confirmedOn': Date.now(),
                                    'group': group._id,
                                    'notes': notes}}, (err) => {
                                      if (err) {
                                        return next(err);
                                      }
                                    res.redirect(302, 'guests');
                                  });
                                } else {
                                  Guest.update({_id: req.body.id}, {$set:
                                    {'firstName': fname,
                                    'lastName': lname,
                                    'child': isChild,
                                    'confirmed': isConfirm,
                                    'group': group._id,
                                    'notes': notes}}, (err) => {
                                      if (err) {
                                        return next(err);
                                      }
                                    res.redirect(302, 'guests');
                                  });
                                }
                              });
                            });
                      } else if (req.body.groupName === 'Choose' && req.body.newGroup !== '') {
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
                                  Group.findOneAndUpdate(
                                    {_id: group._id},
                                    {$push: {members: req.body.id}})
                                      .exec((err, group) => {
                                        if (err) {
                                          return next(err);
                                        } else {
                                          Guest.findById(req.body.id)
                                              .exec((err, guest) => {
                                                if (err) {
                                                  return next(err);
                                                }
                                                let fname = req.body.firstName;
                                                let lname = req.body.lastName;
                                                let notes = req.body.notes;
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
                                                  Guest.update({_id: req.body.id}, {$set:
                                                    {'firstName': fname,
                                                    'lastName': lname,
                                                    'child': isChild,
                                                    'confirmed': isConfirm,
                                                    'confirmedOn': Date.now(),
                                                    'group': group._id,
                                                    'notes': notes}}, (err) => {
                                                      if (err) {
                                                        return next(err);
                                                      }
                                                    res.redirect(302, 'guests');
                                                  });
                                                } else {
                                                  Guest.update({_id: req.body.id}, {$set:
                                                    {'firstName': fname,
                                                    'lastName': lname,
                                                    'child': isChild,
                                                    'confirmed': isConfirm,
                                                    'group': group._id,
                                                    'notes': notes}}, (err) => {
                                                      if (err) {
                                                        return next(err);
                                                      }
                                                    res.redirect(302, 'guests');
                                                  });
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
                  });
                } else {
                  if (req.body.groupName !== 'Choose' && req.body.newGroup === '') {
                    Group.findOneAndUpdate({groupName: req.body.groupName}, {$push: {members: req.body.id}}, (err, group) => {
                      if (err) {
                        return next(err);
                      }
                      Guest.findById(req.body.id)
                          .exec((err, guest) => {
                            if (err) {
                              return next(err);
                            }
                            let fname = req.body.firstName;
                            let lname = req.body.lastName;
                            let notes = req.body.notes;
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
                              Guest.update({_id: req.body.id}, {$set:
                                {'firstName': fname,
                                'lastName': lname,
                                'child': isChild,
                                'confirmed': isConfirm,
                                'confirmedOn': Date.now(),
                                'group': group._id,
                                'notes': notes}}, (err) => {
                                  if (err) {
                                    return next(err);
                                  }
                                res.redirect(302, 'guests');
                              });
                            } else {
                              Guest.update({_id: req.body.id}, {$set:
                                {'firstName': fname,
                                'lastName': lname,
                                'child': isChild,
                                'confirmed': isConfirm,
                                'group': group._id,
                                'notes': notes}}, (err) => {
                                  if (err) {
                                    return next(err);
                                  }
                                res.redirect(302, 'guests');
                              });
                            }
                          });
                        });
                  } else if (req.body.groupName === 'Choose' && req.body.newGroup !== '') {
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
                              Group.findOneAndUpdate(
                                {_id: group._id},
                                {$push: {members: req.body.id}})
                                  .exec((err, group) => {
                                    if (err) {
                                      return next(err);
                                    } else {
                                      Guest.findById(req.body.id)
                                          .exec((err, guest) => {
                                            if (err) {
                                              return next(err);
                                            }
                                            let fname = req.body.firstName;
                                            let lname = req.body.lastName;
                                            let notes = req.body.notes;
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
                                              Guest.update({_id: req.body.id}, {$set:
                                                {'firstName': fname,
                                                'lastName': lname,
                                                'child': isChild,
                                                'confirmed': isConfirm,
                                                'confirmedOn': Date.now(),
                                                'group': group._id,
                                                'notes': notes}}, (err) => {
                                                  if (err) {
                                                    return next(err);
                                                  }
                                                res.redirect(302, 'guests');
                                              });
                                            } else {
                                              Guest.update({_id: req.body.id}, {$set:
                                                {'firstName': fname,
                                                'lastName': lname,
                                                'child': isChild,
                                                'confirmed': isConfirm,
                                                'group': group._id,
                                                'notes': notes}}, (err) => {
                                                  if (err) {
                                                    return next(err);
                                                  }
                                                res.redirect(302, 'guests');
                                              });
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
      });
    }
  }
});



module.exports = router;
