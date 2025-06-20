const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  post: {
    type: ObjectId,
    ref: 'Post',
    required: true,
  },
  user: {
    type: ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('comments', CommentSchema);