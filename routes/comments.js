const express = require('express')
const router = express.Router()
const CommentController = require('../controllers/CommentController')
const { authentication } = require('../middlewares/authentication')

router.post('/posts/:postId/comments', authentication, CommentController.createComment)

module.exports = router