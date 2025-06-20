const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  UserId: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d',
  },
});

module.exports = mongoose.model('Token', tokenSchema);