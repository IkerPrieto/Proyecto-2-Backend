const express = require('express')
const router = express.Router()
const PostController = require('../controllers/PostController')
const { authentication } = require('../middlewares/authentication')

router.post('/', authentication, PostController.createPost)
router.put('/id/:id', authentication, PostController.updatePost)
router.delete('/id/:id', authentication, PostController.deletePost)
router.get('/getAll', PostController.allPosts)
router.get('/name/:name', PostController.getPostsByName)
router.get('/id/:id', PostController.getPostById)

module.exports = router