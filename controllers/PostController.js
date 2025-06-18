const Post = require('../models/Post');

const PostController = {
    async createPost(req, res) {
        try {
            const { title, comment } = req.body;

            if (!title || !comment) {
                return res.status(400).json({ message: 'Title and comment are required' });
            }

            const newPost = new Post({
                title,
                comment,
                user: req.user._id,
            });

            const savedPost = await newPost.save();

            res.status(201).json(savedPost);
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ message: 'Server error while creating post' });
        }
    },

    async updatePost(req, res) {
        try {
            const { id } = req.params;
            const { title, comment } = req.body;

            const post = await Post.findById(id);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            if (post.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this post' });
            }

            // Actualizar campos si fueron enviados
            if (title !== undefined) post.title = title;
            if (comment !== undefined) post.comment = comment;

            const updatedPost = await post.save();
            res.status(200).json(updatedPost);
        } catch (error) {
            console.error('Error updating post:', error);
            res.status(500).json({ message: 'Server error while updating post' });
        }
    },

    async deletePost(req, res) {
        try {
            const { id } = req.params;

            const post = await Post.findById(id);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            if (post.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to delete this post' });
            }

            await post.remove();

            res.status(200).json({ message: 'Post deleted successfully' });
        } catch (error) {
            console.error('Error deleting post:', error);
            res.status(500).json({ message: 'Server error while deleting post' });
        }
    }
};

module.exports = PostController;