const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

//authenticate users
UserSchema.statics.authenticate = (name, password, callback) => {
  User.findOne({ name: name})
      .exec((err, user) => {
        if (err) {
          return callback(err);
        } else if (!user) {
          let err = new Error('User not found in database.');
          err.status = 401;
          return callback(err);
        } else {
          bcrypt.compare( password, user.password, (err, result) => {
            if ( result === true ) {
              return callback(null, user);
            } else {
              return callback();
            }
          });
        }
      });
};

//hash password before saving to db
//REMINDER:
//*******MUST NOT USE ARROW FUNCTION HERE OR THE HASH WILL NOT WORK*******//
UserSchema.pre('save', function (next) {
  let user = this;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
