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
} = require('../services/PostService'); // تأكد من المسار والاسم

const authService = require('../services/authService');



router.use(authService.protect); // Protect all routes

router
  .route('/')
  .get(authService.protect, authService.allowedTo('admin'), getAllPosts)
  .post(createPostValidator, createPost); // Add validation for creating a post

router
  .route('/:id')
  .get(getPostValidator, getPost) // Add validation for getting a post
  .put(updatePostValidator, updatePost) // Add validation for updating a post
  .delete(authService.protect, authService.allowedTo('admin', 'user'), deletePostValidator, deletePost); // Add validation for deleting a post

// Route to get all posts by a specific user
router.route('/user/:userId').get(getPostsByUser);

module.exports = router;
