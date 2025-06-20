const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  comments: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId }],
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;