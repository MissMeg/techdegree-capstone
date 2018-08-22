'use strict';

const mongoose    = require('mongoose');
const express     = require('express');
const User        = require('../models/user');
const Group        = require('../models/group');
const Guest        = require('../models/guest');
const router      = express.Router();

//deleting a guest
router.post('/deleteguest', (req, res, next) => {
  //make sure the person is logged in
  if (!req.session.userId) {
    let err = new Error('You must be logged in to add to the guest list.');
    err.status = 401;
    return nest(err);
  } else {
    //find the guest
    Guest.findById(req.body.id)
      .exec((err, guest) => {
        if (err) {
          return next(err);
        }
        //remove them from their group
        Group.findById(guest.group)
            .exec((err, group) => {
              if (err) {
                return next(err);
              }
          Group.update({_id: group._id}, {$pull: { members: guest._id}}, (err) => {
            if (err) {
              return next(err);
            }
            //delete group if no members
            Group.findById(group._id)
            .exec((err, group) => {
              if (err) {
                return next(err);
              } else {
                //if there are no members, then delete the group
                if (group.members.length === 0) {
                  Group.deleteOne({_id: group._id}, (err) => {
                    if (err) {
                      return next(err);
                    } else {
                      //delete the guest
                      Guest.deleteOne({_id: guest._id}, (err) => {
                        if (err) {
                          return next(err);
                        }
                        res.redirect(302, 'guests');
                      });
                    }
                  });
                } else {
                  //delete the guest
                  Guest.deleteOne({_id: guest._id}, (err) => {
                    if (err) {
                      return next(err);
                    }
                    res.redirect(302, 'guests');
                  });
                }
              }
            });
          });
        });
    });
  }
});


//edit guest
router.post('/editguest', (req, res, next) => {
  //make sure they are logged in
  if(!req.session.userId) {
    let err = new Error('You must be logged in to add to the guest list.');
    err.status = 401;
    return nest(err);
  } else {
    //if both of these fields are 'blank' then no group updates are required
    if ( req.body.groupName === 'Choose' && req.body.newGroup === '' ){
      //find the guest
      Guest.findById(req.body.id)
          .exec((err, guest) => {
            if (err) {
              return next(err);
            }
            //set the variables for updating
            let fname = req.body.firstName;
            let lname = req.body.lastName;
            let notes = req.body.notes;
            let isChild, isConfirm, confirmDate, guestData;
            if (req.body.child === 'Yes') {
              isChild = true;
            } else if (req.body.child === 'No'){
              isChild = false;
            }
            if (req.body.confirm === 'Yes') {
              isConfirm = true;
            } else if (req.body.confirm === 'No'){
              isConfirm = false;
            }
            //add confirm date if they have confirmed
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
              //update guest
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
          //warn user they cannot choose a current group and create one for the guest
    } else if ( req.body.groupName !== 'Choose' && req.body.newGroup !== '' ) {
      let err = new Error('You can either choose a current group/family or create a new one, not both :)');
      return nest(err);
      //if one of the fields has a value for changing the guest
    } else if ( req.body.groupName !== 'Choose' || req.body.newGroup !== '' ) {
      //find the group - changes are being made so they need to be removed from current group
      Group.findById(req.body.groupid)
          .exec((err, group) => {
            if (err) {
              return next(err);
            }
            //pull the guest from the group
        Group.update({_id: group._id}, {$pull: { members: req.body.id}}, (err) => {
          if (err) {
            return next(err);
          } else {
            //find the group again to check for member #s
            Group.findById(req.body.groupid)
            .exec((err, group) => {
              if (err) {
                return next(err);
              } else {
                //if there are no members, then delete the group
                if (group.members.length === 0) {
                  Group.deleteOne({_id: group._id}, (err) => {
                    if (err) {
                      return next(err);
                    } else {
                      //adding guest to a current group
                      if (req.body.groupName !== 'Choose' && req.body.newGroup === '') {
                        //find group and add guest to it
                        Group.findOneAndUpdate({groupName: req.body.groupName}, {$push: {members: req.body.id}}, (err, group) => {
                          if (err) {
                            return next(err);
                          }
                          //update guest with all update values
                          Guest.findById(req.body.id)
                              .exec((err, guest) => {
                                if (err) {
                                  return next(err);
                                }
                                let fname = req.body.firstName;
                                let lname = req.body.lastName;
                                let notes = req.body.notes;
                                let isChild, isConfirm, confirmDate, guestData;
                                if (req.body.child === 'Yes') {
                                  isChild = true;
                                } else if (req.body.child === 'No'){
                                  isChild = false;
                                }
                                if (req.body.confirm === 'Yes') {
                                  isConfirm = true;
                                } else if (req.body.confirm === 'No'){
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
                            //adding guest to a new group
                      } else if (req.body.groupName === 'Choose' && req.body.newGroup !== '') {
                        //make sure the group doesn't currently exist
                        Group.findOne({groupName: req.body.newGroup}, (err, group) => {
                          if (err) {
                            return next(err);
                          }
                          if (!group) {
                            //create the new group
                            Group.create({groupName: req.body.newGroup}, (err, group) => {
                              if (err) {
                                return next (err);
                              } else {
                                //add the guest as a member
                                  Group.findOneAndUpdate(
                                    {_id: group._id},
                                    {$push: {members: req.body.id}})
                                      .exec((err, group) => {
                                        if (err) {
                                          return next(err);
                                        } else {
                                          //update guest
                                          Guest.findById(req.body.id)
                                              .exec((err, guest) => {
                                                if (err) {
                                                  return next(err);
                                                }
                                                let fname = req.body.firstName;
                                                let lname = req.body.lastName;
                                                let notes = req.body.notes;
                                                let isChild, isConfirm, confirmDate, guestData;
                                                if (req.body.child === 'Yes') {
                                                  isChild = true;
                                                } else if (req.body.child === 'No'){
                                                  isChild = false;
                                                }
                                                if (req.body.confirm === 'Yes') {
                                                  isConfirm = true;
                                                } else if (req.body.confirm === 'No'){
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
                  //previous group still has members and therefore does not need to be deleted
                  //add guest to a current group
                  if (req.body.groupName !== 'Choose' && req.body.newGroup === '') {
                    Group.findOneAndUpdate({groupName: req.body.groupName}, {$push: {members: req.body.id}}, (err, group) => {
                      if (err) {
                        return next(err);
                      }
                      //update guest
                      Guest.findById(req.body.id)
                          .exec((err, guest) => {
                            if (err) {
                              return next(err);
                            }
                            let fname = req.body.firstName;
                            let lname = req.body.lastName;
                            let notes = req.body.notes;
                            let isChild, isConfirm, confirmDate, guestData;
                            if (req.body.child === 'Yes') {
                              isChild = true;
                            } else if (req.body.child === 'No'){
                              isChild = false;
                            }
                            if (req.body.confirm === 'Yes') {
                              isConfirm = true;
                            } else if (req.body.confirm === 'No'){
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
                        //must create a new group fro the guest
                  } else if (req.body.groupName === 'Choose' && req.body.newGroup !== '') {
                    Group.findOne({groupName: req.body.newGroup}, (err, group) => {
                      if (err) {
                        return next(err);
                      }
                      if (!group) {
                        //no group exists already - can create new group
                        Group.create({groupName: req.body.newGroup}, (err, group) => {
                          if (err) {
                            return next (err);
                          } else {
                            //add member
                              Group.findOneAndUpdate(
                                {_id: group._id},
                                {$push: {members: req.body.id}})
                                  .exec((err, group) => {
                                    if (err) {
                                      return next(err);
                                    } else {
                                      //update guest
                                      Guest.findById(req.body.id)
                                          .exec((err, guest) => {
                                            if (err) {
                                              return next(err);
                                            }
                                            let fname = req.body.firstName;
                                            let lname = req.body.lastName;
                                            let notes = req.body.notes;
                                            let isChild, isConfirm, confirmDate, guestData;
                                            if (req.body.child === 'Yes') {
                                              isChild = true;
                                            } else if (req.body.child === 'No'){
                                              isChild = false;
                                            }
                                            if (req.body.confirm === 'Yes') {
                                              isConfirm = true;
                                            } else if (req.body.confirm === 'No'){
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
