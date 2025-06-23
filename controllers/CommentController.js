const Comment = require('../models/Comments');
const Post = require('../models/Post');

const CommentController = {
    async createComment(req, res) {
        try {
            const { postId } = req.params;
            const { text } = req.body;

            const postExists = await Post.findById(postId);
            if (!postExists) {
                return res.status(404).json({ message: 'Post not found' });
            }

            if (!text) {
                return res.status(400).json({ message: 'Comment text is required' });
            }

            const newComment = new Comment({
                text,
                post: postId,
                user: req.user._id,
            });

            const savedComment = await newComment.save();

            res.status(201).json(savedComment);
        } catch (error) {
            console.error('Error creating comment:', error);
            res.status(500).json({ message: 'Server error while creating comment', error });
        }
    }
};

module.exports = CommentController;