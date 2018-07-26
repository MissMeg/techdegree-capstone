const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  child: {
    type: Boolean,
    required: true
  },
  confirmed: {
    type: Boolean,
    required: true
  },
  confirmedOn: {
    type: Date
  },
  notes: {
    type: String
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  submittedOn: {
    type: Date,
    default: Date.now
  }
});


const Guest = mongoose.model('Guest', GuestSchema, 'guest');
module.exports = Guest;
