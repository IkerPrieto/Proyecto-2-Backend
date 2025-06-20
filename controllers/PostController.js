const Post = require('../models/Post');

const PostController = {
    async createPost(req, res) {
        try {
            const { image, title, comment } = req.body;

            if (!title || !comment) {
                return res.status(400).json({ message: 'Title and comment are required' });
            }

            const newPost = new Post({
                image,
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
            const { image, title, comment } = req.body;

            const post = await Post.findById(id);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            if (post.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this post' });
            }

            // Actualizar campos si fueron enviados
            if (image !== undefined) post.image = image;
            if (title !== undefined) post.title = title;
            if (comment !== undefined) post.comments = comment;

            const updatedPost = await post.save();
            res.status(200).json(updatedPost);
        } catch (error) {
            console.error('Error updating post:', error);
            res.status(500).json({ message: 'Server error while updating post', error });
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
            res.status(500).json({ message: 'Server error while deleting post', error });
        }
    },

    async allPosts(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const posts = await Post.find()
                .limit(limit)
                .skip((page - 1) * limit)
                .populate('user')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'user'
                    }
                });

            res.status(200).json({
                message: 'All posts with users and comments retrieved successfully',
                posts
            });
        } catch (error) {
            console.error('Error getting all posts', error);
            res.status(500).json({ message: 'Server error while getting all posts', error });
        }
    },

    async getPostsByName(req, res) {
        try {
            const { name } = req.query;
            const { page = 1, limit = 10 } = req.query;

            if (!name) {
                return res.status(400).json({ message: 'Post name is required' });
            }

            const posts = await Post.find({ title: { $regex: name, $options: 'i' } })
                .limit(limit)
                .skip((page - 1) * limit)
                .populate('user')
                .populate({
                    path: 'comments',
                    populate: { path: 'user', select: 'name email' }
                });

            res.status(200).json({
                message: 'Posts matching the name retrieved successfully',
                posts
            });
        } catch (error) {
            console.error('Error searching posts by name', error);
            res.status(500).json({ message: 'Server error while searching posts by name' });
        }
    },

    async getPostById(req, res) {
        try {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ message: 'Post id is required' });
            }

            const post = await Post.findById(id)
                .populate('user')
                .populate({
                    path: 'comments',
                    populate: { path: 'user', select: 'name email' }
                });

            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            res.status(200).json({ message: 'Post retrieved successfully', posts });
        } catch (error) {
            console.error('Error searching post by id', error);
            res.status(500).json({ message: 'Server error while searching post by id' });
        }
    },

    async like(req, res) {
    try {
        const post = await Post.findById(req.params._id);

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const userId = req.user._id.toString();
        const hasLiked = post.likes.some(id => id.toString() === userId);

        let updatedPost;

        if (hasLiked) {
            // Quitar el like si ya existe
            updatedPost = await Post.findByIdAndUpdate(
                req.params._id,
                { $pull: { likes: req.user._id } },
                { new: true }
            );
        } else {
            // Agregar el like si no existe
            updatedPost = await Post.findByIdAndUpdate(
                req.params._id,
                { $push: { likes: req.user._id } },
                { new: true }
            );
        }

        res.send(updatedPost);
    } catch (error) {
        console.error('Error with like', error);
        res.status(500).send({ message: 'There was a problem with your request' });
    }
}
};

module.exports = PostController;