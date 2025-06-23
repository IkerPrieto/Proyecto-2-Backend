const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const PostSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  comments: {
    type: ObjectId,
    trim: true,
    ref: 'Comments'
  },
  image: {
    type: String,
  },
  likes: [{ type: ObjectId }],
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;