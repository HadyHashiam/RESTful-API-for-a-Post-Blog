const { body, param } = require('express-validator');

exports.createCommentValidator = [
  body('content').notEmpty().withMessage('Content is required'),
  body('postId').notEmpty().withMessage('Post ID is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
];

exports.updateCommentValidator = [
  param('id').isMongoId().withMessage('Invalid comment ID'),
  body('content').optional().notEmpty().withMessage('Content must not be empty'),
];

exports.deleteCommentValidator = [
  param('id').isMongoId().withMessage('Invalid comment ID'),
];

exports.getCommentValidator = [
  param('id').isMongoId().withMessage('Invalid comment ID'),
];
