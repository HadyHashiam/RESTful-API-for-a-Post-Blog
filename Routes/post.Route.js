const router = require("express").Router();

const {
  createPostValidator,
  updatePostValidator,
  deletePostValidator,
  getPostValidator,
} = require('../utils/validators/postValidator');
const {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  getPostsByUser
} = require('../Controllers/Post.Controller'); 

const authService = require('../Controllers/auth.Controller');



router.use(authService.protect); 

router
  .route('/')
  .get(authService.protect, authService.allowedTo('admin'), getAllPosts)
  .post(createPostValidator, createPost); 

router
  .route('/:id')
  .get(getPostValidator, getPost) 
  .put(updatePostValidator, updatePost) 
  .delete(authService.protect, authService.allowedTo('admin', 'user'), deletePostValidator, deletePost); 

// Route to get all posts by a specific user
router.route('/user/:userId').get(getPostsByUser);

module.exports = router;
