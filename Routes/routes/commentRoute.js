const express = require('express');
const { protect, allowedTo } = require('../services/authService');
const { createCommentValidator, updateCommentValidator, deleteCommentValidator, getCommentValidator } = require('../utils/validators/commentValidator');

const { createComment, getAllComments, getComment, updateComment, deleteComment, } = require('../services/commentService');

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin routes
router.use(allowedTo('admin', 'user'));

// CRUD operations for comments
router
  .route('/')
  .post(createCommentValidator, createComment)
  .get(getAllComments);

router
  .route('/:id')
  .get(getCommentValidator, getComment)
  .put(updateCommentValidator, updateComment)
  .delete(deleteCommentValidator, deleteComment);

module.exports = router;
