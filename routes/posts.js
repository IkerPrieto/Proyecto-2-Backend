const express = require('express')
const router = express.Router()
const PostController = require('../controllers/PostController')
const { authentication, isAdmin } = require('../middlewares/authentication')

router.post('/', authentication, isAdmin, PostController.createPost)
router.put('/id/:id', authentication, isAdmin, PostController.updatePost)
router.delete('/id/:id', authentication, isAdmin, PostController.deletePost)
router.get('/getAll', PostController.allPosts)
router.get('/name/:name', PostController.getPostsByName)
router.get('/id/:id', PostController.getPostById)
router.put('/likes/:_id', authentication, PostController.like)

module.exports = router