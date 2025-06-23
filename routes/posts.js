const express = require('express')
const router = express.Router()
const PostController = require('../controllers/PostController')
const { authentication, isAdmin } = require('../middlewares/authentication')

router.post('/', authentication, PostController.createPost)
router.put('/id/:id', authentication, PostController.updatePost)
router.delete('/id/:id', authentication, PostController.deletePost)
router.get('/getAll', PostController.allPosts)
router.get('/name/:title', PostController.getPostsByName)
router.get('/id/:id', PostController.getPostById)
router.put('/likes/:_id', authentication, PostController.like)

module.exports = router