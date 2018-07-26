const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest'
  }]
});


const Group = mongoose.model('Group', GroupSchema, 'group');
module.exports = Group;
